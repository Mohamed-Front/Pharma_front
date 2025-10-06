<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const form = ref();
const loading = ref(false);
const warehouses = ref([]);
const categories = ref([]);
const companies = ref([]);
const scientificStructures = ref([]);
const imageFile = ref(null);
const imagePreview = ref(null);
const isDragging = ref(false);
const errors = ref({
  category_id: false,
  company_id: false,
  commercial_name: false,
  scientific_structure: false,
  usage: false,
  calibres: false,
  quantity: false,
  quantity_unit: false,
  price: false,
  price_unit: false,
  expiration_from: false,
  expiration_to: false,
  pharmaceutical_form: false,
  product_image: false
});

// Form Data
const productData = ref({
  category_id: null,
  company_id: null,
  commercial_name: '',
  scientific_structure: [],
  product_image: null,
  usage: '',
  calibres: '',
  quantity: null,
  quantity_unit: null,
  price: null,
  price_unit: null,
  expiration_from: null,
  expiration_to: null,
  storage_notes: '',
  pharmaceutical_form: ''
});

// Fetch dropdown options
const fetchDropdownOptions = async () => {
  try {
    const [categoriesRes, companiesRes, scientificStructuresRes] = await Promise.all([
      axios.get('/api/category'),
      axios.get('/api/company'),
      axios.get('/api/scientific-structure')
    ]);
    categories.value = categoriesRes.data.data;
    companies.value = companiesRes.data.data;
    scientificStructures.value = scientificStructuresRes.data.data;
  } catch (error) {
    console.error('Error fetching dropdown options:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error_fetching_data'), life: 3000 });
  }
};

// Fetch product data
const fetchProductData = async () => {
  try {
    const response = await axios.get(`/api/product/${route.params.id}`);
    const data = response.data.data;

    productData.value = {
      ...productData.value,
      category_id: data.category_id,
      company_id: data.company_id,
      commercial_name: data.commercial_name,
      scientific_structure: data.scientific_structure && data.scientific_structure.length > 0 ? data.scientific_structure : [],
      usage: data.usage,
      calibres: data.calibres,
      quantity: data.quantity,
      quantity_unit: data.quantity_unit,
      price: parseFloat(data.price),
      price_unit: data.price_unit,
      expiration_from: data.expiration_from ,
      expiration_to: data.expiration_to ,
      storage_notes: data.storage_notes,
      pharmaceutical_form: data.pharmaceutical_form
    };

    if (data.media && data.media.length > 0 && data.media[0].url) {
      imagePreview.value = data.media[0].url;
    }
  } catch (error) {
    console.error('Error fetching product data:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error_fetching_product'), life: 3000 });
  }
};

// Handle drag events
const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

// Handle image upload
const handleImageUpload = (file) => {
  imageFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
  isDragging.value = false;
};

const onImageUpload = (event) => {
  const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
  if (file && file.type.match('image.*')) {
    if (file.size > 1024 * 1024) { // 1MB limit
      toast.add({ severity: 'error', summary: t('error'), detail: t('image_too_large'), life: 3000 });
      return;
    }
    handleImageUpload(file);
  } else {
    toast.add({ severity: 'error', summary: t('error'), detail: t('invalid_image_type'), life: 3000 });
  }
};

// Remove image
const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
};

// Validate form
const validateForm = () => {
  errors.value.category_id = !productData.value.category_id;
  errors.value.company_id = !productData.value.company_id;
  errors.value.commercial_name = !productData.value.commercial_name;
  errors.value.scientific_structure = !productData.value.scientific_structure || productData.value.scientific_structure.length === 0;
  errors.value.usage = !productData.value.usage;
  errors.value.calibres = !productData.value.calibres;
  errors.value.quantity = productData.value.quantity === null || productData.value.quantity === '';
  errors.value.quantity_unit = !productData.value.quantity_unit;
  errors.value.price = productData.value.price === null || productData.value.price === '';
  errors.value.price_unit = !productData.value.price_unit;
  errors.value.expiration_from = !productData.value.expiration_from;
  errors.value.expiration_to = !productData.value.expiration_to;
  errors.value.pharmaceutical_form = !productData.value.pharmaceutical_form;
  errors.value.product_image = !imageFile.value && !imagePreview.value;

  return !Object.values(errors.value).some(error => error);
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('validation_failed'), life: 3000 });
    return;
  }

  loading.value = true;

  const formData = new FormData();
  formData.append('category_id', productData.value.category_id || '');
  formData.append('company_id', productData.value.company_id || '');
  formData.append('commercial_name', productData.value.commercial_name || '');
  productData.value.scientific_structure.forEach((structure, index) => {
    formData.append(`scientific_structure[${index}]`, structure || '');
  });
  formData.append('usage', productData.value.usage || '');
  formData.append('calibres', productData.value.calibres || '');
  formData.append('quantity', productData.value.quantity ? Math.floor(productData.value.quantity) : '');
  formData.append('quantity_unit', productData.value.quantity_unit || '');
  formData.append('price', productData.value.price ? Number(productData.value.price).toFixed(2) : '');
  formData.append('price_unit', productData.value.price_unit || '');
  formData.append('expiration_from', productData.value.expiration_from );
  formData.append('expiration_to', productData.value.expiration_to );
  formData.append('storage_notes', productData.value.storage_notes || '');
  formData.append('pharmaceutical_form', productData.value.pharmaceutical_form || '');

  if (imageFile.value) {
    formData.append('product_image', imageFile.value);
  }

  try {
    await axios.post(`/api/product/${route.params.id}`, formData, {

    });
    router.push({ name: 'products' });
    toast.add({ severity: 'success', summary: t('success'), detail: t('product_updated'), life: 3000 });
  } catch (error) {
    console.error('Error:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: error.response?.data?.message || t('error_updating_product'), life: 3000 });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDropdownOptions();
  fetchProductData();
});
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ $t('product.update_product') }}</h1>

    <Form ref="form" :model="productData" @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Category -->
        <div class="space-y-2">
          <label for="category" class="block text-sm font-medium text-gray-700">
            {{ $t('product.category') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
          filter
            id="category"
            v-model="productData.category_id"
            :options="categories"
            optionLabel="name_ar"
            optionValue="id"
            :placeholder="$t('product.select_category')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.category_id }"
          />
          <small class="text-red-500 text-xs" v-if="errors.category_id">{{ $t('product.validation.category_required') }}</small>
        </div>

        <!-- Company -->
        <div class="space-y-2">
          <label for="company" class="block text-sm font-medium text-gray-700">
            {{ $t('product.company') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
          filter
            id="company"
            v-model="productData.company_id"
            :options="companies"
            optionLabel="name"
            optionValue="id"
            :placeholder="$t('product.select_company')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.company_id }"
          />
          <small class="text-red-500 text-xs" v-if="errors.company_id">{{ $t('product.validation.company_required') }}</small>
        </div>

        <!-- Commercial Name -->
        <div class="space-y-2">
          <label for="commercial_name" class="block text-sm font-medium text-gray-700">
            {{ $t('product.commercial_name') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="commercial_name"
            v-model="productData.commercial_name"
            :placeholder="$t('product.enter_commercial_name')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.commercial_name }"
          />
          <small class="text-red-500 text-xs" v-if="errors.commercial_name">{{ $t('product.validation.commercial_name_required') }}</small>
        </div>

        <!-- Scientific Structure (Multi-Select) -->
        <div class="space-y-2 md:col-span-2">
          <label for="scientific_structure" class="block text-sm font-medium text-gray-700">
            {{ $t('product.scientific_structure') }} <span class="text-red-500">*</span>
          </label>
          <MultiSelect
            id="scientific_structure"
            v-model="productData.scientific_structure"
            :options="scientificStructures"
            optionLabel="name"
            optionValue="name"
            :placeholder="$t('product.select_scientific_structure')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            display="chip"
            :class="{ 'p-invalid': errors.scientific_structure }"
          />
          <small class="text-red-500 text-xs" v-if="errors.scientific_structure">{{ $t('product.validation.scientific_structure_required') }}</small>
        </div>

        <!-- Usage -->
        <div class="space-y-2 md:col-span-2">
          <label for="usage" class="block text-sm font-medium text-gray-700">
            {{ $t('product.usage') }} <span class="text-red-500">*</span>
          </label>
          <Textarea
            id="usage"
            v-model="productData.usage"
            :placeholder="$t('product.enter_usage')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.usage }"
          />
          <small class="text-red-500 text-xs" v-if="errors.usage">{{ $t('product.validation.usage_required') }}</small>
        </div>

        <!-- Calibres -->
        <div class="space-y-2">
          <label for="calibres" class="block text-sm font-medium text-gray-700">
            {{ $t('product.calibres') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="calibres"
            v-model="productData.calibres"
            :placeholder="$t('product.enter_calibres')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.calibres }"
          />
          <small class="text-red-500 text-xs" v-if="errors.calibres">{{ $t('product.validation.calibres_required') }}</small>
        </div>

        <!-- Quantity -->
        <div class="space-y-2">
          <label for="quantity" class="block text-sm font-medium text-gray-700">
            {{ $t('product.quantity') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="quantity"
            v-model="productData.quantity"
            :useGrouping="false"
            :placeholder="$t('product.enter_quantity')"
            class="w-full"
            inputClass="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.quantity }"
          />
          <small class="text-red-500 text-xs" v-if="errors.quantity">{{ $t('product.validation.quantity_required') }}</small>
        </div>

        <!-- Quantity Unit -->
        <div class="space-y-2">
          <label for="quantity_unit" class="block text-sm font-medium text-gray-700">
            {{ $t('product.quantity_unit') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
          filter
            id="quantity_unit"
            v-model="productData.quantity_unit"
            :options="[
              { label: 'Tablets', value: 1 },
              { label: 'Capsules', value: 2 },
              { label: 'Units', value: 3 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('product.select_quantity_unit')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.quantity_unit }"
          />
          <small class="text-red-500 text-xs" v-if="errors.quantity_unit">{{ $t('product.validation.quantity_unit_required') }}</small>
        </div>

        <!-- Price -->
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
            :placeholder="$t('product.enter_price')"
            class="w-full"
            inputClass="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.price }"
          />
          <small class="text-red-500 text-xs" v-if="errors.price">{{ $t('product.validation.price_required') }}</small>
        </div>

        <!-- Price Unit -->
        <div class="space-y-2">
          <label for="price_unit" class="block text-sm font-medium text-gray-700">
            {{ $t('product.price_unit') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="price_unit"
            v-model="productData.price_unit"
            :options="[
              { label: 'USD', value: 1 },
              { label: 'EUR', value: 2 },
              { label: 'GBP', value: 3 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('product.select_price_unit')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.price_unit }"
          />
          <small class="text-red-500 text-xs" v-if="errors.price_unit">{{ $t('product.validation.price_unit_required') }}</small>
        </div>

        <!-- Expiration From -->
        <div class="space-y-2">
          <label for="expiration_from" class="block text-sm font-medium text-gray-700">
            {{ $t('product.expiration_from') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            type="date"
            id="expiration_from"
            v-model="productData.expiration_from"
            :placeholder="$t('product.enter_expiration_from')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.expiration_from }"
          />
          <small class="text-red-500 text-xs" v-if="errors.expiration_from">{{ $t('product.validation.expiration_from_required') }}</small>
        </div>

        <!-- Expiration To -->
        <div class="space-y-2">
          <label for="expiration_to" class="block text-sm font-medium text-gray-700">
            {{ $t('product.expiration_to') }} <span class="text-red-500">*</span>
          </label>
           <InputText
           type="date"
            id="expiration_to"
            v-model="productData.expiration_to"
            :placeholder="$t('product.enter_expiration_to')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.expiration_to }"
          />
          <small class="text-red-500 text-xs" v-if="errors.expiration_to">{{ $t('product.validation.expiration_to_required') }}</small>
        </div>



        <!-- Storage Notes -->
        <div class="space-y-2 md:col-span-2">
          <label for="storage_notes" class="block text-sm font-medium text-gray-700">
            {{ $t('product.storage_notes') }}
          </label>
          <Textarea
            id="storage_notes"
            v-model="productData.storage_notes"
            :placeholder="$t('product.enter_storage_notes')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <!-- Pharmaceutical Form -->
        <div class="space-y-2">
          <label for="pharmaceutical_form" class="block text-sm font-medium text-gray-700">
            {{ $t('product.pharmaceutical_form') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="pharmaceutical_form"
            v-model="productData.pharmaceutical_form"
            :placeholder="$t('product.enter_pharmaceutical_form')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.pharmaceutical_form }"
          />
          <small class="text-red-500 text-xs" v-if="errors.pharmaceutical_form">{{ $t('product.validation.pharmaceutical_form_required') }}</small>
        </div>

        <!-- Image Upload -->
        <div class="md:col-span-2 space-y-2">
          <label for="product_image" class="block text-sm font-medium text-gray-700">
            {{ $t('product.product_image') }} <span class="text-red-500">*</span>
          </label>
          <div class="flex justify-center">
            <label
              @dragover.prevent="handleDragOver"
              @dragleave="handleDragLeave"
              @drop.prevent="onImageUpload"
              :class="{ 'border-blue-500 bg-blue-50': isDragging, 'border-gray-300': !isDragging }"
              class="cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition-colors duration-300"
              aria-label="Upload product image"
              aria-describedby="image-upload-instructions"
            >
              <input type="file" id="product_image" @change="onImageUpload" accept="image/*" class="hidden" aria-hidden="true" />
              <div v-if="imagePreview" class="p-4">
                <div class="relative group">
                  <img
                    :src="imagePreview"
                    alt="Preview"
                    class="w-full h-64 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <div class="opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button
                        type="button"
                        @click.stop="removeImage"
                        class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <i class="pi pi-trash text-sm"></i>
                      </button>
                      <button
                        type="button"
                        class="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <i class="pi pi-pencil text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p id="image-upload-instructions" class="mt-2 text-center text-sm text-gray-500">{{ $t('product.click_or_drag_to_change_photo') }}</p>
              </div>
              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-image text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{ $t('product.click_to_upload') }}</span> {{ $t('product.or_drag_and_drop') }}
                </p>
                <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
              </div>
            </label>
          </div>
          <small class="text-red-500 text-xs" v-if="errors.product_image">{{ $t('product.validation.product_image_required') }}</small>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center">
        <Button
          type="submit"
          label="Update Product"
          icon="pi pi-check"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
          @click="submitForm"
        >
          <span v-if="!loading">{{ $t('product.update_product') }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </Form>
  </div>
  <Toast />
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
}
.transition-colors {
  transition-property: background-color, border-color, color;
}
.duration-300 {
  transition-duration: 300ms;
}

/* Custom scrollbar for dropdowns */
:deep(.p-dropdown-panel .p-dropdown-items-wrapper),
:deep(.p-multiselect-panel .p-multiselect-items-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f1f1;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar),
:deep(.p-multiselect-panel .p-multiselect-items-wrapper::-webkit-scrollbar) {
  width: 6px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-track),
:deep(.p-multiselect-panel .p-multiselect-items-wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-thumb),
:deep(.p-multiselect-panel .p-multiselect-items-wrapper::-webkit-scrollbar-thumb) {
  background-color: #3b82f6;
  border-radius: 3px;
}

/* Validation styles */
:deep(.p-inputtext.p-invalid),
:deep(.p-textarea.p-invalid),
:deep(.p-dropdown.p-invalid),
:deep(.p-multiselect.p-invalid),
:deep(.p-calendar.p-invalid .p-inputtext) {
  border-color: var(--red-500);
}
</style>
