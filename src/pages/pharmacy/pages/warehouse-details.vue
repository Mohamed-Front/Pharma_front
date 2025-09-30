<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Rating from 'primevue/rating'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const warehouse = ref(null)
const loading = ref(true)
const addingReview = ref(false)
const newReviewBody = ref('')
const newReviewRate = ref(0)
const appLang = ref(localStorage.getItem('appLang') || 'en')
const cartLoading = ref({})

// Computed property for warehouse logo
const warehouseLogo = computed(() => {
  return warehouse.value?.logo || 'https://via.placeholder.com/64?text=Logo'
})

// Function to fetch warehouse data
const fetchWarehouse = async (id) => {
  try {
    loading.value = true
    const response = await axios.get(`api/pharmacy-home/warehouse/${id}`)
    if (response.data.success) {
      warehouse.value = {
        ...response.data.data,
        total_products: response.data.data.paginated_products.total,
        connected_pharmacies: response.data.data.connected_pharmacies || 0,
        rate: response.data.data.total_rating || 0
      }
    } else {
      throw new Error('API request unsuccessful')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error.fetchWarehouse'),
      life: 3000
    })
    console.error('Error fetching warehouse:', error)
  } finally {
    loading.value = false
  }
}

// Add product to cart
const addToCart = async (productId) => {
  cartLoading.value[productId] = true
  try {
    const response = await axios.post('/api/cart/add/item', {
      product_id: productId,
      quantity: 1,
    })
    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('cart.addSuccess'),
        life: 3000,
      })
    } else {
      throw new Error(response.data.message || t('error.addToCart'))
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || t('error.addToCart')
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: errorMessage,
      life: 3000,
    })
    console.error('Error adding to cart:', error)
  } finally {
    setTimeout(() => {
      delete cartLoading.value[productId] // Clean up after 3 seconds
    }, 3000)
  }
}

// Add a new review
const addReview = async () => {
  if (!newReviewBody.value || !newReviewRate.value) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('error.reviewFieldsRequired'),
      life: 3000
    })
    return
  }
  try {
    addingReview.value = true
    const payload = {
      id: warehouse.value.id,
      type: 'product',
      body: newReviewBody.value,
      rate: newReviewRate.value
    }
    await axios.post('api/review', payload)

    // Add the new review to the local data
    const newReview = {
      id: (warehouse.value.reviews?.length || 0) + 1,
      user_name: 'Current User',
      rate: newReviewRate.value,
      body: newReviewBody.value
    }
    if (!warehouse.value.reviews) {
      warehouse.value.reviews = []
    }
    warehouse.value.reviews.push(newReview)

    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('success.reviewAdded'),
      life: 3000
    })
    newReviewBody.value = ''
    newReviewRate.value = 0
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error.addReview'),
      life: 3000
    })
    console.error('Error adding review:', error)
  } finally {
    addingReview.value = false
  }
}

onMounted(() => {
  fetchWarehouse(route.params.id)
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="py-10 px-4 md:px-8 max-w-4xl m-auto">
      <div v-if="loading" class="flex justify-center mb-10">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" aria-label="Loading spinner" />
      </div>
      <div v-else-if="!warehouse" class="text-center text-gray-500 mb-10">
        {{ t('error.noWarehouse') }}
      </div>
      <div v-else class="space-y-8">
        <div class="relative bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row items-start justify-between">
          <div class="absolute top-0 left-0 bg-[#1B8A45] text-white text-xs font-bold py-1 px-3 rounded-tl-lg rounded-br-lg -translate-y-full translate-x-3">
            Feb 2023 - Feb 2025
          </div>
          <div class="flex items-start w-full gap-4 md:flex-row flex-col">
            <div class="flex items-center gap-2 mb-4 md:mb-0 w-full md:w-auto">
              <i class="pi pi-check-circle text-[#1B8A45] text-xl" aria-label="Verified icon"></i>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-bold text-[#1B8A45]">{{ t('verified_account') }}</span>
                </div>
                <h3 class="text-xl md:text-2xl font-extrabold text-gray-800 leading-tight">
                  {{ warehouse.name }}
                </h3>
              </div>
            </div>
            <div class="flex flex-col items-center md:items-end w-full">
              <img :src="warehouseLogo" alt="Warehouse Logo" class="w-16 h-16 md:w-20 md:h-20 object-contain rounded-lg flex-shrink-0" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
            <i class="pi pi-box text-[#1B8A45] text-3xl mb-2"></i>
            <span class="text-3xl font-bold text-gray-800">{{ warehouse.total_products }}</span>
            <span class="text-sm text-gray-500">{{ t('number_of_products') }}</span>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
            <i class="pi pi-briefcase text-[#1B8A45] text-3xl mb-2"></i>
            <span class="text-3xl font-bold text-gray-800">{{ warehouse.connected_pharmacies }}</span>
            <span class="text-sm text-gray-500">{{ t('connected_pharmacies') }}</span>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
            <i class="pi pi-star-fill text-[#EAB308] text-3xl mb-2"></i>
            <span class="text-3xl font-bold text-gray-800">{{ warehouse.rate?.toFixed(1) || 'N/A' }}</span>
            <span class="text-sm text-gray-500">{{ t('ratings') }}</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h4 class="text-xl font-bold text-gray-800 mb-4">{{ t('most_requested_products') }}</h4>
          <div class="overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
                <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th class="py-3 px-6">{{ t('product_name') }}</th>
                  <th class="py-3 px-6">{{ t('product_image') }}</th>
                  <th class="py-3 px-6">{{ t('category') }}</th>
                  <th class="py-3 px-6">{{ t('company') }}</th>
                  <th class="py-3 px-6">{{ t('price') }}</th>
                  <th class="py-3 px-6">{{ t('action') }}</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm font-light">
                <tr v-for="product in warehouse.paginated_products.data" :key="product.id" class="border-b border-gray-200 hover:bg-gray-50">
                  <td class="py-3 px-6">{{ product.commercial_name }}</td>
                  <td class="py-3 px-6">
                    <img :src="product.media[0]?.url || 'https://via.placeholder.com/64?text=Image'" alt="Product Image" class="w-12 h-12 object-contain rounded-lg" />
                  </td>
                  <td class="py-3 px-6">{{ appLang === 'en' ? (product.category?.name_en || 'N/A') : (product.category?.name_ar || 'N/A') }}</td>
                  <td class="py-3 px-6">{{ appLang === 'en' ? (product.company?.name || 'N/A') : (product.company?.name || 'N/A') }}</td>
                  <td class="py-3 px-6 whitespace-nowrap">${{ product.price }} {{ product.price_unit }}</td>
                  <td class="py-3 px-6">
                    <Button

                      :icon="cartLoading[product.id] ? 'pi pi-spin pi-spinner mr-2' : 'pi pi-cart-plus mr-2'"
                      class="bg-[#1B8A45] hover:bg-[#156f3a] text-white font-bold py-2 px-4 rounded-md transition-colors"
                      :disabled="cartLoading[product.id]"
                      @click="addToCart(product.id)"
                      aria-label="Add to cart"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-gray-300">
          <h4 class="text-xl font-bold text-gray-800 mb-4">{{ t('add_review') }}</h4>
          <form @submit.prevent="addReview" class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="text-gray-600 font-medium">{{ t('rate') }}:</span>
              <Rating v-model="newReviewRate" :stars="5" :cancel="false" class="text-yellow-400" />
            </div>
            <div>
              <label for="review-body" class="block text-sm font-medium text-gray-700 mb-1">{{ t('your_review') }}</label>
              <Textarea
                id="review-body"
                v-model="newReviewBody"
                rows="4"
                class="w-full p-3 border rounded-md focus:ring-[#1B8A45] focus:border-[#1B8A45]"
                :placeholder="t('placeholder.write_review')"
              />
            </div>
            <Button
              type="submit"
              :label="t('submit_review')"
              :loading="addingReview"
              class="w-full bg-[#1B8A45] hover:bg-[#156f3a] text-white font-bold py-2 px-4 rounded-md transition-colors"
            />
          </form>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-gray-300">
          <h4 class="text-xl font-bold text-gray-800 mb-4">{{ t('customer_reviews') }} ({{ warehouse.reviews?.length || 0 }})</h4>
          <div v-if="warehouse.reviews && warehouse.reviews.length > 0" class="space-y-4">
            <div v-for="review in warehouse.reviews" :key="review.id" class="border-b last:border-b-0 pb-4">
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-user-circle text-gray-400 text-lg"></i>
                <span class="font-bold text-gray-800">{{ review.user_name || 'Anonymous User' }}</span>
              </div>
              <div class="flex items-center gap-1 mb-2">
                <Rating :model-value="review.rate" :stars="5" :cancel="false" readonly class="text-yellow-400" />
                <span class="text-xs text-gray-500">({{ review.rate }}/5)</span>
              </div>
              <p class="text-sm text-gray-700">{{ review.body }}</p>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            {{ t('no_reviews_yet') }}
          </div>
        </div>
      </div>
      <Toast />
    </div>
  </div>
</template>
