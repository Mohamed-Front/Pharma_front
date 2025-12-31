<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()

const category = ref(null)
const loading = ref(true)
const appLang = ref(localStorage.getItem('appLang') || 'en')

// Quantity tracking for each product
const quantities = ref({})
const cartLoading = ref({})

// Computed: Category name in current language
const categoryName = computed(() => {
  if (!category.value) return ''
  return appLang.value === 'en' ? (category.value.name_en || category.value.name_ar) : (category.value.name_ar || category.value.name_en)
})

// Computed: Category description in current language
const categoryDescription = computed(() => {
  if (!category.value) return ''
  return appLang.value === 'en'
    ? (category.value.description_en || category.value.description_ar || '')
    : (category.value.description_ar || category.value.description_en || '')
})

// Format price nicely
const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US')
}

// Get best active offer (discount % or bonus quantity)
const getBestOffer = (offers) => {
  if (!offers || offers.length === 0) return null

  const now = new Date()
  const activeOffers = offers.filter(offer => {
    const start = new Date(offer.start_date)
    const end = new Date(offer.end_date)
    return offer.status === 'active' && now >= start && now <= end
  })

  if (activeOffers.length === 0) return null

  // Priority: percentage discount first
  const percentOffer = activeOffers.find(o => o.discount_type === 2)
  if (percentOffer) {
    return { type: 'discount', value: `${percentOffer.discount_value}% OFF` }
  }

  // Then bonus quantity
  const bonusOffer = activeOffers.find(o => o.discount_type === 3 && o.quantity)
  if (bonusOffer) {
    return { type: 'bonus', value: `Buy ${bonusOffer.min_limit}, Get ${bonusOffer.quantity} Free` }
  }

  return { type: 'offer', value: 'Special Offer' }
}

const fetchCategory = async (id) => {
  try {
    loading.value = true
    const response = await axios.get(`api/pharmacy-home/category/${id}`)

    if (response.data.success) {
      category.value = {
        ...response.data.data,
        total_products: response.data.data.paginated_products.total
      }

      // Initialize quantity for each product
      response.data.data.paginated_products.data.forEach(product => {
        quantities.value[product.id] = 1
      })
    } else {
      throw new Error('Failed to load category')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error') || 'Error',
      detail: t('error.fetchCategory') || 'Could not load category details',
      life: 4000
    })
    console.error('Error fetching category:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = async (productId) => {
  const qty = quantities.value[productId] || 1
  if (qty < 1) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Quantity must be at least 1', life: 3000 })
    return
  }

  cartLoading.value[productId] = true

  try {
    const response = await axios.post('/api/cart/add/item', {
      product_id: productId,
      quantity: qty
    })

    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: t('success') || 'Success',
        detail: `${qty} × ${t('cart.addSuccess') || 'Item(s) added to cart'}`,
        life: 3000
      })
      quantities.value[productId] = 1 // Reset after success
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Failed to add to cart'
    toast.add({ severity: 'error', summary: t('error'), detail: msg, life: 4000 })
  } finally {
    setTimeout(() => {
      delete cartLoading.value[productId]
    }, 1000)
  }
}

onMounted(() => {
  fetchCategory(route.params.id)
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="py-10 px-4 md:px-8 max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <ProgressSpinner style="width: 70px; height: 70px" strokeWidth="5" />
      </div>

      <!-- Not Found -->
      <div v-else-if="!category" class="text-center py-20">
        <i class="pi pi-exclamation-triangle text-6xl text-gray-400 mb-4"></i>
        <p class="text-xl text-gray-600">{{ t('error.noCategory') || 'Category not found' }}</p>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-8">
        <!-- Category Header -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-green-600 to-green-700 h-32"></div>
          <div class="px-8 pb-8 -mt-10 relative">
            <div class="bg-white rounded-2xl shadow-xl p-8">
              <h1 class="text-4xl font-extrabold text-gray-900 mb-3">
                {{ categoryName }}
              </h1>
              <p v-if="categoryDescription" class="text-lg text-gray-600 mb-6 leading-relaxed">
                {{ categoryDescription }}
              </p>

              <div class="flex items-center gap-4 bg-green-50 text-green-700 px-6 py-4 rounded-xl inline-flex">
                <i class="pi pi-box text-3xl"></i>
                <div>
                  <span class="text-3xl font-bold">{{ category.total_products }}</span>
                  <span class="ml-2 text-lg font-medium">{{ t('number_of_products') || 'Products' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Table -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="p-6 border-b border-gray-200 bg-gray-50">

          </div>

          <div class="overflow-x-auto">
            <table class="w-full">

              <tbody class="divide-y divide-gray-200">
                <tr v-for="product in category.paginated_products.data"
                    :key="product.id"
                    class="hover:bg-gray-50 transition duration-150">

                  <!-- Product Name + Image -->
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-4">
                      <img
                        :src="product.media[0]?.url || 'https://via.placeholder.com/64'"
                        alt="Product"
                        class="w-14 h-14 rounded-lg object-cover border shadow-sm"
                      />
                      <div>
                        <div class="font-semibold text-gray-900 text-base">
                          {{ product.commercial_name }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Company -->
                  <td class="px-6 py-5 text-gray-700">
                    {{ product.company?.name || '—' }}
                  </td>

                  <!-- Price -->
                  <td class="px-6 py-5">
                    <span class="text-lg font-bold text-gray-900">
                      ${{ formatPrice(product.price) }}
                    </span>
                  </td>

                  <!-- Active Offer Badge -->
                  <td class="px-6 py-5">
                    <span v-if="getBestOffer(product.active_offers)"
                          class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold"
                          :class="getBestOffer(product.active_offers).type === 'discount'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'">
                      {{ getBestOffer(product.active_offers).value }}
                    </span>
                    <span v-else class="text-gray-400 text-xs">—</span>
                  </td>

                  <!-- Quantity Input -->
                  <td class="px-6 py-5">
                    <InputNumber
                      v-model="quantities[product.id]"
                      :min="1"
                      :max="999"

                      inputClass="text-center font-medium"
                    />
                  </td>

                  <!-- Add to Cart Button -->
                  <td class="px-6 py-5">
                    <Button
                      :icon="cartLoading[product.id] ? 'pi pi-spin pi-spinner' : 'pi pi-shopping-cart'"
                      :loading="cartLoading[product.id]"
                      class="bg-green-600 hover:bg-green-700 text-white font-medium px-5"
                      @click="addToCart(product.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="category.paginated_products.data.length === 0" class="text-center py-16 text-gray-500">
              <i class="pi pi-inbox text-6xl mb-4 text-gray-300"></i>
              <p class="text-xl">{{ t('no_products_found') || 'No products found in this category' }}</p>
            </div>
          </div>
        </div>
      </div>

      <Toast />
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputnumber-button) {
  width: 2.2rem !important;
  height: 2rem !important;
}
:deep(.p-inputnumber-input) {
  font-weight: 600;
}
</style>
