<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const toast = useToast()
const { t } = useI18n()

/* ---------- الحالة ---------- */
const loading = ref(false)
const imageFile = ref(null)
const imagePreview = ref(null)
const isDragging = ref(false)

const commercialNameSuggestions = ref([])
const showSuggestions = ref(false)

/* ---------- الأخطاء (فقط الحقول الإجبارية) ---------- */
const errors = ref({
  company_id: false,
  commercial_name: false,
  price: false,
  price_unit: false
})

/* ---------- بيانات النموذج ---------- */
const productData = ref({
  category_id: null,
  company_id: null,
  commercial_name: '',
  active_ingredient: [],
  product_image: null,
  usage: '',
  calibres: '',
  quantity: null,
  quantity_unit: null,  // <-- تمت الإضافة
  price: null,
  price_unit: null,
  expiration_from: null,
  expiration_to: null,
  storage_notes: '',
  pharmaceutical_form: ''
})

/* ---------- قوائم الـ dropdown (بحث على الخادم) ---------- */
const categories = ref([])
const companies = ref([])
const activeIngredients = ref([])

const categorySearch = ref('')
const companySearch = ref('')
const ingredientSearch = ref('')

/* ---------- طلبات API ---------- */
const fetchCategories = async () => {
  const res = await axios.get('/api/category', { params: { search: categorySearch.value } })
  categories.value = res.data.data
}
const fetchCompanies = async () => {
  const res = await axios.get('/api/company', { params: { search: companySearch.value } })
  companies.value = res.data.data
}
const fetchIngredients = async () => {
  const res = await axios.get('/api/scientific-structure', { params: { search: ingredientSearch.value } })
  activeIngredients.value = res.data.data
}

/* ---------- تأخير البحث (debounce) ---------- */
let catTimer, compTimer, ingTimer
const debounce = (fn, delay) => {
  return (...args) => {
    clearTimeout(fn.timer)
    fn.timer = setTimeout(() => fn(...args), delay)
  }
}
const debouncedCat = debounce(fetchCategories, 350)
const debouncedComp = debounce(fetchCompanies, 350)
const debouncedIng = debounce(fetchIngredients, 350)

const onCategoryFilter = (e) => {
  categorySearch.value = e.value
  debouncedCat()
}
const onCompanyFilter = (e) => {
  companySearch.value = e.value
  debouncedComp()
}
const onIngredientFilter = (e) => {
  ingredientSearch.value = e.value
  debouncedIng()
}

/* ---------- اقتراحات الاسم التجاري ---------- */
const searchCommercialNames = async (query) => {
  if (!query || query.length < 2) {
    commercialNameSuggestions.value = []
    showSuggestions.value = false
    return
  }
  try {
    const res = await axios.get(`/api/product/by/name?name=${encodeURIComponent(query)}`)
    commercialNameSuggestions.value = res.data.data || []
    showSuggestions.value = commercialNameSuggestions.value.length > 0
  } catch {
    toast.add({ severity: 'error', summary: t('error'), detail: t('error_fetching_names'), life: 3000 })
    commercialNameSuggestions.value = []
    showSuggestions.value = false
  }
}
const selectCommercialName = (name) => {
  productData.value.commercial_name = name
  commercialNameSuggestions.value = []
  showSuggestions.value = false
}
const handleCommercialNameInput = (e) => {
  const q = e.target.value
  productData.value.commercial_name = q
  searchCommercialNames(q)
}

/* ---------- رفع الصورة ---------- */
const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}
const handleDragLeave = () => (isDragging.value = false)

const handleImageUpload = (file) => {
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (ev) => (imagePreview.value = ev.target.result)
  reader.readAsDataURL(file)
  isDragging.value = false
}
const onImageUpload = (e) => {
  const file = e.target.files?.[0] || e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) handleImageUpload(file)
}
const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
}

/* ---------- التحقق من الصحة (فقط الحقول الإجبارية) ---------- */
const validateForm = () => {
  errors.value.company_id = !productData.value.company_id
  errors.value.commercial_name = !productData.value.commercial_name
  errors.value.price = productData.value.price === null || productData.value.price === ''
  errors.value.price_unit = !productData.value.price_unit

  return !Object.values(errors.value).some(v => v)
}

/* ---------- إرسال النموذج ---------- */
const submitForm = async () => {
  if (!validateForm()) return

  loading.value = true
  const fd = new FormData()
  fd.append('category_id', productData.value.category_id || '')
  fd.append('company_id', productData.value.company_id || '')
  fd.append('commercial_name', productData.value.commercial_name || '')
  productData.value.active_ingredient.forEach((i, idx) => fd.append(`scientific_structure[${idx}]`, i))
  fd.append('usage', productData.value.usage || '')
  fd.append('calibres', productData.value.calibres || '')
  fd.append('quantity', productData.value.quantity ? Math.floor(productData.value.quantity) : '')
  fd.append('quantity_unit', productData.value.quantity_unit || '') // <-- تمت الإضافة
  fd.append('price', productData.value.price ? Number(productData.value.price).toFixed(2) : '')
  fd.append('price_unit', productData.value.price_unit || '')
  fd.append('expiration_from', productData.value.expiration_from || '')
  fd.append('expiration_to', productData.value.expiration_to || '')
  fd.append('storage_notes', productData.value.storage_notes || '')
  fd.append('pharmaceutical_form', productData.value.pharmaceutical_form || '')
  if (imageFile.value) fd.append('product_image', imageFile.value)

  try {
    await axios.post('/api/product', fd)
    router.push({ name: 'products' })
    toast.add({ severity: 'success', summary: t('success'), detail: t('product_created'), life: 3000 })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: err.response?.data?.message || t('error_creating_product'),
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

/* ---------- تحميل البيانات عند التحميل ---------- */
onMounted(() => {
  fetchCategories()
  fetchCompanies()
  fetchIngredients()
});
</script>

<template>
  <div v-can="'create products'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      {{ $t('product.create_new_product') }}
    </h1>

    <Form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- ==== الفئة (Category) - غير إجباري ==== -->
        <div class="space-y-2">
          <label for="category" class="block text-sm font-medium text-gray-700">
            {{ $t('product.category') }}
          </label>
          <Dropdown
            id="category"
            v-model="productData.category_id"
            :options="categories"
            optionLabel="name_ar"
            optionValue="id"
            :placeholder="$t('product.select_category')"
            filter
            @filter="onCategoryFilter"
            class="w-full"
          />
        </div>

        <!-- ==== الشركة (Company) ==== -->
        <div class="space-y-2">
          <label for="company" class="block text-sm font-medium text-gray-700">
            {{ $t('product.company') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="company"
            v-model="productData.company_id"
            :options="companies"
            optionLabel="name"
            optionValue="id"
            :placeholder="$t('product.select_company')"
            filter
            @filter="onCompanyFilter"
            class="w-full"
            :class="{ 'p-invalid': errors.company_id }"
          />
        </div>

        <!-- ==== الاسم التجاري ==== -->
        <div class="space-y-2 relative">
          <label for="commercial_name" class="block text-sm font-medium text-gray-700">
            {{ $t('product.commercial_name') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="commercial_name"
            v-model="productData.commercial_name"
            :placeholder="$t('product.enter_commercial_name')"
            class="w-full"
            :class="{ 'p-invalid': errors.commercial_name }"
            @input="handleCommercialNameInput"
            @focus="showSuggestions = commercialNameSuggestions.length > 0"
            @blur="setTimeout(() => (showSuggestions = false), 200)"
          />
          <div
            v-if="showSuggestions"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <ul class="py-1">
              <li
                v-for="s in commercialNameSuggestions"
                :key="s.id"
                @click="selectCommercialName(s.commercial_name)"
                class="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer"
              >{{ s.commercial_name }}</li>
            </ul>
          </div>
        </div>

        <!-- ==== المواد العلمية (Active Ingredients) - غير إجباري ==== -->
        <div class="space-y-2 md:col-span-2">
          <label for="active_ingredient" class="block text-sm font-medium text-gray-700">
            {{ $t('product.active_ingredient') }}
          </label>
          <MultiSelect
            id="active_ingredient"
            v-model="productData.active_ingredient"
            :options="activeIngredients"
            optionLabel="name"
            optionValue="name"
            :placeholder="$t('product.select_active_ingredient')"
            filter
            @filter="onIngredientFilter"
            display="chip"
            class="w-full"
          />
        </div>

        <!-- ==== الاستخدام ==== -->
        <div class="space-y-2 md:col-span-2">
          <label for="usage" class="block text-sm font-medium text-gray-700">
            {{ $t('product.usage') }}
          </label>
          <Textarea
            id="usage"
            v-model="productData.usage"
            :placeholder="$t('product.enter_usage')"
            class="w-full"
          />
        </div>

        <!-- ==== المعايير (Calibres) ==== -->
        <div class="space-y-2">
          <label for="calibres" class="block text-sm font-medium text-gray-700">
            {{ $t('product.calibres') }}
          </label>
          <InputText
            id="calibres"
            v-model="productData.calibres"
            :placeholder="$t('product.enter_calibres')"
            class="w-full"
          />
        </div>

        <!-- ==== الكمية ==== -->
        <div class="space-y-2">
          <label for="quantity" class="block text-sm font-medium text-gray-700">
            {{ $t('product.quantity') }}
          </label>
          <InputNumber
            id="quantity"
            v-model="productData.quantity"
            :useGrouping="false"
            class="w-full"
          />
        </div>

        <!-- ==== وحدة الكمية (Quantity Unit) - جديد ==== -->
        <div class="space-y-2">
          <label for="quantity_unit" class="block text-sm font-medium text-gray-700">
            {{ $t('product.quantity_unit') }}
          </label>
          <Dropdown
            id="quantity_unit"
            v-model="productData.quantity_unit"
            :options="[
              { label: $t('tablets'), value: 'tablets' },
              { label: $t('capsules'), value: 'capsules' },
              { label: $t('units'), value: 'units' },
              { label: $t('boxes'), value: 'boxes' },
              { label: $t('bottles'), value: 'bottles' }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('product.select_quantity_unit')"
            class="w-full"
          />
        </div>

        <!-- ==== السعر ==== -->
        <div class="space-y-2">
          <label for="price" class="block text-sm font-medium text-gray-700">
            {{ $t('product.price') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="price"
            v-model="productData.price"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            class="w-full"
            :class="{ 'p-invalid': errors.price }"
          />
        </div>

        <!-- ==== وحدة السعر ==== -->
        <div class="space-y-2">
          <label for="price_unit" class="block text-sm font-medium text-gray-700">
            {{ $t('product.price_unit') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="price_unit"
            v-model="productData.price_unit"
            :options="[
              { label: 'ل.س', value: 'ل.س' },
              { label: '$', value: '$' },
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('product.select_price_unit')"
            class="w-full"
            :class="{ 'p-invalid': errors.price_unit }"
          />
        </div>
      <div class="space-y-2">
          <label for="expiration_from" class="block text-sm font-medium text-gray-700">
            {{ $t('product.expiration_from') }}
          </label>
          <InputText

            type="date"
            v-model="productData.expiration_from"
            mode="decimal"
            class="w-full"
          />

        </div>

        <!-- Expiration To -->
        <div class="space-y-2">
          <label for="expiration_to" class="block text-sm font-medium text-gray-700">
            {{ $t('product.expiration_to') }}
          </label>
            <InputText

            type="date"
            v-model="productData.expiration_to"
            mode="decimal"
            class="w-full"
          />

        </div>

        <!-- ==== ملاحظات التخزين ==== -->
        <div class="space-y-2 md:col-span-2">
          <label for="storage_notes" class="block text-sm font-medium text-gray-700">
            {{ $t('product.storage_notes') }}
          </label>
          <Textarea
            id="storage_notes"
            v-model="productData.storage_notes"
            :placeholder="$t('product.enter_storage_notes')"
            class="w-full"
          />
        </div>

        <!-- ==== الشكل الصيدلاني ==== -->
        <div class="space-y-2">
          <label for="pharmaceutical_form" class="block text-sm font-medium text-gray-700">
            {{ $t('product.pharmaceutical_form') }}
          </label>
          <InputText
            id="pharmaceutical_form"
            v-model="productData.pharmaceutical_form"
            :placeholder="$t('product.enter_pharmaceutical_form')"
            class="w-full"
          />
        </div>

        <!-- ==== رفع الصورة ==== -->
        <div class="md:col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            {{ $t('product.product_image') }}
          </label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="handleDragOver"
              @dragleave="handleDragLeave"
              @drop.prevent="onImageUpload"
              :class="{ 'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging }"
              class="cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition-colors duration-300"
            >
              <input type="file" @change="onImageUpload" accept="image/*" class="hidden" />

              <!-- معاينة الصورة -->
              <div v-if="imagePreview" class="p-4">
                <div class="relative group">
                  <img
                    :src="imagePreview"
                    alt="Preview"
                    class="w-full h-64 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center rounded-lg transition-all">
                    <div class="opacity-0 group-hover:opacity-100 flex space-x-3 transition-all transform translate-y-4 group-hover:translate-y-0">
                      <button type="button" @click.stop="removeImage"
                        class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                        <i class="pi pi-trash text-sm"></i>
                      </button>
                      <button type="button"
                        class="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100">
                        <i class="pi pi-pencil text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">
                  {{ $t('product.click_or_drag_to_change_photo') }}
                </p>
              </div>

              <!-- مكان الصورة الافتراضي -->
              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-image text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{ $t('product.click_to_upload') }}</span>
                  {{ $t('product.or_drag_and_drop') }}
                </p>
                <p class="text-xs text-gray-400">SVG, PNG, JPG أو GIF (حد أقصى 1 ميجا)</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- ==== زر الإرسال ==== -->
      <div class="pt-4 flex justify-center">
        <Button
          type="submit"
          :label="$t('product.create_product')"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          :disabled="loading"
        />
      </div>
    </Form>

    <Toast />
  </div>
</template>

<style scoped>
/* تحسينات بصرية */
:deep(.p-invalid) { @apply border-red-500; }
:deep(.p-calendar .p-inputtext) { @apply w-full; }
</style>
