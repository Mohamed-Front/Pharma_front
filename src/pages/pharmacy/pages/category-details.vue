<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const category = ref(null)
const loading = ref(true)
const appLang = ref(localStorage.getItem('appLang') || 'en')

// Computed property for category name based on language
const categoryName = computed(() => {
  return appLang.value === 'en' ? category.value?.name_en : category.value?.name_ar
})

// Computed property for category description based on language
const categoryDescription = computed(() => {
  return appLang.value === 'en' ? category.value?.description_en : category.value?.description_ar
})

// Function to fetch category data
const fetchCategory = async (id) => {
  try {
    loading.value = true
    const response = await axios.get(`api/pharmacy-home/category/${id}`)
    if (response.data.success) {
      category.value = {
        ...response.data.data,
        total_products: response.data.data.paginated_products.total
      }
    } else {
      throw new Error('API request unsuccessful')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error.fetchCategory'),
      life: 3000
    })
    console.error('Error fetching category:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategory(route.params.id)
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="py-10 px-4 md:px-8 max-w-4xl m-auto">
      <div v-if="loading" class="flex justify-center mb-10">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" aria-label="Loading spinner" />
      </div>
      <div v-else-if="!category" class="text-center text-gray-500 mb-10">
        {{ t('error.noCategory') }}
      </div>
      <div v-else class="space-y-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl md:text-2xl font-extrabold text-gray-800 leading-tight mb-2">
            {{ categoryName }}
          </h3>
          <p class="text-gray-600">{{ categoryDescription || t('no_description') }}</p>
          <div class="mt-4 flex items-center gap-4">
            <i class="pi pi-box text-[#1B8A45] text-2xl"></i>
            <span class="text-lg font-bold text-gray-800">{{ category.total_products }}</span>
            <span class="text-sm text-gray-500">{{ t('number_of_products') }}</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h4 class="text-xl font-bold text-gray-800 mb-4">{{ t('products_in_category') }}</h4>
          <div class="overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th class="py-3 px-6">{{ t('product_name') }}</th>
                  <th class="py-3 px-6">{{ t('price') }}</th>
                  <th class="py-3 px-6">{{ t('company') }}</th>
                  <th class="py-3 px-6">{{ t('product_image') }}</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm font-light">
                <tr v-for="product in category.paginated_products.data" :key="product.id" class="border-b border-gray-200 hover:bg-gray-50">
                  <td class="py-3 px-6">{{ product.commercial_name }}</td>
                  <td class="py-3 px-6 whitespace-nowrap">${{ product.price }} {{ product.price_unit }}</td>
                  <td class="py-3 px-6">{{ product.company?.name || 'N/A' }}</td>
                  <td class="py-3 px-6">
                    <img :src="product.media[0]?.url || 'https://via.placeholder.com/64?text=Image'" alt="Product Image" class="w-12 h-12 object-contain rounded-lg" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  </div>
</template>
