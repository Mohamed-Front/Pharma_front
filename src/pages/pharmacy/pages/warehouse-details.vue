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
import InputNumber from 'primevue/inputnumber'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()

const warehouse = ref(null)
const loading = ref(true)
const addingReview = ref(false)
const newReviewBody = ref('')
const newReviewRate = ref(0)
const appLang = ref(localStorage.getItem('appLang') || 'en')

// Quantity per product for cart
const quantities = ref({})

const cartLoading = ref({})

const warehouseLogo = computed(() => {
  return warehouse.value?.logo?.url || 'https://via.placeholder.com/64?text=Logo'
})

// Format price with commas
const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US')
}

// Get best active offer for a product
const getBestOffer = (offers) => {
  if (!offers || offers.length === 0) return null

  const now = new Date()
  const activeOffers = offers.filter(offer => {
    const start = new Date(offer.start_date)
    const end = new Date(offer.end_date)
    return offer.status === 'active' && now >= start && now <= end
  })

  if (activeOffers.length === 0) return null

  // Prioritize percentage discount first, then bonus
  const percentOffer = activeOffers.find(o => o.discount_type === 2)
  if (percentOffer) {
    return { type: 'discount', value: percentOffer.discount_value + '% OFF' }
  }

  const bonusOffer = activeOffers.find(o => o.discount_type === 3 && o.quantity)
  if (bonusOffer) {
    return { type: 'bonus', value: `Buy ${bonusOffer.min_limit}, Get ${bonusOffer.quantity} Free` }
  }

  return { type: 'offer', value: 'Special Offer' }
}

const fetchWarehouse = async (id) => {
  try {
    loading.value = true
    const response = await axios.get(`api/pharmacy-home/warehouse/${id}`)
    if (response.data.success) {
      warehouse.value = {
        ...response.data.data,
        total_products: response.data.data.paginated_products.total,
        connected_pharmacies: response.data.data.connected_pharmacies || 0,
        rate: response.data.data.total_rating || 0,
        reviews: response.data.data.reviews || []
      }
      // Initialize quantities
      response.data.data.paginated_products.data.forEach(product => {
        quantities.value[product.id] = 1
      })
    } else {
      throw new Error('Failed to fetch warehouse')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error.fetchWarehouse') || 'Failed to load warehouse',
      life: 3000
    })
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = async (productId) => {
  const qty = quantities.value[productId] || 1
  if (qty < 1) {
    toast.add({ severity: 'warn', summary: t('warning'), detail: 'Quantity must be at least 1', life: 3000 })
    return
  }

  cartLoading.value[productId] = true
  try {
    const response = await axios.post('/api/cart/add/item?update=1', {
      product_id: productId,
      quantity: qty,
    })

    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: `${qty} × Product added to cart successfully!`,
        life: 3000,
      })
      quantities.value[productId] = 1 // Reset to 1 after success
    } else {
      throw new Error(response.data.message || 'Failed to add to cart')
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Error adding to cart'
    toast.add({ severity: 'error', summary: t('error'), detail: msg, life: 3000 })
  } finally {
    setTimeout(() => {
      delete cartLoading.value[productId]
    }, 1000)
  }
}

const addReview = async () => {
  if (!newReviewBody.value.trim() || newReviewRate.value === 0) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('error.reviewFieldsRequired') || 'Please provide rating and review',
      life: 3000
    })
    return
  }

  try {
    addingReview.value = true
    const payload = {
      id: warehouse.value.id,
      type: 'warehouse', // Fixed: should be warehouse, not product
      body: newReviewBody.value,
      rate: newReviewRate.value
    }

    await axios.post('api/review', payload)

    const newReview = {
      id: Date.now(),
      user_name: 'You',
      rate: newReviewRate.value,
      body: newReviewBody.value,
      created_at: new Date().toISOString()
    }

    warehouse.value.reviews.unshift(newReview)

    // Update average rating locally (optional)
    const total = warehouse.value.reviews.reduce((sum, r) => sum + r.rate, 0)
    warehouse.value.rate = total / warehouse.value.reviews.length

    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('success.reviewAdded') || 'Thank you for your review!',
      life: 3000
    })

    newReviewBody.value = ''
    newReviewRate.value = 0
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || 'Failed to submit review',
      life: 3000
    })
  } finally {
    addingReview.value = false
  }
}

onMounted(() => {
  fetchWarehouse(route.params.id)
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="py-10 px-4 md:px-8 max-w-7xl mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="4" />
      </div>

      <!-- No Data -->
      <div v-else-if="!warehouse" class="text-center py-20 text-gray-500 text-xl">
        {{ t('error.noWarehouse') || 'Warehouse not found' }}
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-8">
        <!-- Header Card -->
        <div class="relative bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold py-2 px-4 rounded-full shadow-md z-10">
            {{ t('verified_account') || 'Verified Account' }}
          </div>

          <div class="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="text-center md:">
              <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {{ warehouse.name }}
              </h1>
              <p class="text-lg text-gray-600 mt-2">
                {{ warehouse.city }}, {{ warehouse.country }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                {{ warehouse.address }}
              </p>
            </div>
            <img :src="warehouseLogo" alt="Logo" class="w-28 h-28 object-contain rounded-xl border-4 border-gray-200 shadow-md" />
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl shadow p-6 text-center">
            <i class="pi pi-box text-4xl text-green-600 mb-3"></i>
            <div class="text-3xl font-bold text-gray-800">{{ warehouse.total_products }}</div>
            <div class="text-gray-600">{{ t('number_of_products') || 'Products' }}</div>
          </div>
          <div class="bg-white rounded-xl shadow p-6 text-center">
            <i class="pi pi-briefcase text-4xl text-green-600 mb-3"></i>
            <div class="text-3xl font-bold text-gray-800">{{ warehouse.connected_pharmacies }}</div>
            <div class="text-gray-600">{{ t('connected_pharmacies') || 'Connected Pharmacies' }}</div>
          </div>
          <div class="bg-white rounded-xl shadow p-6 text-center">
            <i class="pi pi-star-fill text-4xl text-yellow-500 mb-3"></i>
            <div class="text-3xl font-bold text-gray-800">
              {{ warehouse.rate ? warehouse.rate.toFixed(1) : 'N/A' }}
            </div>
            <div class="text-gray-600">{{ t('ratings') || 'Average Rating' }}</div>
          </div>
        </div>

        <!-- Products Table -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="p-6 border-b">
            <h2 class="text-2xl font-bold text-gray-800">{{ t('most_requested_products') || 'Available Products' }}</h2>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">

              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in warehouse.paginated_products.data" :key="product.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ product.commercial_name }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <img :src="product.media[0]?.url || 'https://via.placeholder.com/64'" class="h-16 w-16 rounded-lg object-cover border" />
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ product.company.name }}</td>
                  <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${{ formatPrice(product.price) }}
                  </td>
                  <td class="px-6 py-4">
                    <span v-if="getBestOffer(product.active_offers)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      :class="getBestOffer(product.active_offers).type === 'discount' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                      {{ getBestOffer(product.active_offers).value }}
                    </span>
                    <span v-else class="text-gray-400 text-xs">No offer</span>
                  </td>
                  <td class="px-6 py-4">
                    <InputNumber
                      v-model="quantities[product.id]"
                      :min="1"

                      buttonLayout="horizontal"
                      :inputClass="'text-center'"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <Button
                      :icon="cartLoading[product.id] ? 'pi pi-spin pi-spinner' : 'pi pi-shopping-cart'"
                      :loading="cartLoading[product.id]"
                      class="bg-green-600 hover:bg-green-700 text-white"
                      @click="addToCart(product.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Add Review -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-6">{{ t('add_review') || 'Write a Review' }}</h3>
          <form @submit.prevent="addReview" class="space-y-6">
            <div class="flex items-center gap-4">
              <span class="font-medium text-gray-700">{{ t('rate') }}:</span>
              <Rating v-model="newReviewRate" :stars="5" :cancel="false" class="text-yellow-400" />
            </div>
            <Textarea
              v-model="newReviewBody"
              :placeholder="t('placeholder.write_review') || 'Share your experience...'"
              rows="5"
              class="w-full"
            />
            <Button
              type="submit"
              :label="t('submit_review') || 'Submit Review'"
              :loading="addingReview"
              class="w-full md:w-auto px-8 bg-green-600 hover:bg-green-700"
            />
          </form>
        </div>

        <!-- Reviews List -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h3 class="text- Kult2xl font-bold text-gray-800 mb-6">
            {{ t('customer_reviews') || 'Customer Reviews' }} ({{ warehouse.reviews.length }})
          </h3>
          <div v-if="warehouse.reviews.length > 0" class="space-y-6">
            <div v-for="review in warehouse.reviews" :key="review.id" class="border-b pb-6 last:border-0">
              <div class="flex items-center gap-3 mb-2">
                <i class="pi pi-user text-2xl text-gray-400"></i>
                <div>
                  <p class="font-semibold text-gray-800">{{ review.user_name || 'Anonymous' }}</p>
                  <p class="text-xs text-gray-500">{{ new Date(review.created_at || Date.now()).toLocaleDateString() }}</p>
                </div>
              </div>
              <Rating :modelValue="review.rate" readonly :stars="5" class="mb-2" />
              <p class="text-gray-700">{{ review.body }}</p>
            </div>
          </div>
          <div v-else class="text-center py-10 text-gray-500">
            {{ t('no_reviews_yet') || 'No reviews yet. Be the first to review!' }}
          </div>
        </div>
      </div>

      <Toast />
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputnumber-button) {
  width: 2rem !important;
}
</style>
