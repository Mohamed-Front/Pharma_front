```vue
<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'primeicons/primeicons.css'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

// Localization, router, and toast
const { t } = useI18n()
const router = useRouter()
const toast = useToast()

// Reactive state
const bestSellers = ref([])
const loading = ref(true)
const cartLoading = ref({})
const appLang = ref(localStorage.getItem('appLang') || 'en')

// Static fallback data
const staticBestSellers = [
  {
    id: 1,
    commercial_name: 'Sample Product',
    pharmaceutical_form: 'قرص',
    price: 10,
    discount: [],
    warehouse: { name: 'Sample Warehouse', address: 'Sample Address' },
    scientific_structure: ['Acetaminophen', 'Paracetamol'],
    media: [{ url: '/path/to/sample-image.png' }],
  },
]

// Fetch best sellers from API
const fetchBestSellers = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/pharmacy-home/get/best-sellers/products')
    if (response.data.success && response.data.data?.length > 0) {
      bestSellers.value = response.data.data.map(product => ({
        ...product,
        discount: product.active_offers.length > 0
          ? product.active_offers.map(offer => ({
              id: offer.id,
              display: offer.discount_type === 1
                ? `${offer.discount_value}% OFF`
                : `$${offer.discount_value} OFF`,
              description: offer.description || 'No description',
            }))
          : [], // Map active_offers to a display-friendly format
        tags: product.scientific_structure?.length > 0
          ? product.scientific_structure
          : [t('tags.acetaminophen'), t('tags.paracetamol')],
      }))
    } else {
      bestSellers.value = staticBestSellers
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('error.noProducts'),
        life: 3000,
      })
    }
  } catch (error) {
    bestSellers.value = staticBestSellers
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('error.fetchProducts'),
      life: 3000,
    })
    console.error('Error fetching best sellers:', error)
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
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('error.addToCart'),
      life: 3000,
    })
    console.error('Error adding to cart:', error)
  } finally {
    cartLoading.value[productId] = false
  }
}

// Map pharmaceutical_form to PrimeVue icons
const getProductIcon = (form) => {
  const formMap = {
    'كبسولة': 'pi-capsules',
    'حقن': 'pi-syringe',
    'قرص': 'pi-pill',
    'شراب': 'pi-bottle',
    '222': 'pi-pill',
    '44': 'pi-syringe',
  }
  return formMap[form] || 'pi-tablet'
}

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = '/path/to/fallback-image.png' // Replace with actual fallback image path
}

// Initialize data
onMounted(() => {
  fetchBestSellers()
});
</script>

<template>
  <div class="bg-white">
    <div class="py-12 px-4 max-w-7xl m-auto">
      <!-- Header -->
      <div class="flex flex-col items-center justify-center text-center mb-10">
        <div class="flex items-center justify-center gap-2 mb-2">
          <i class="pi pi-arrow-left text-green-600 text-base"></i>
          <span class="text-sm md:text-base font-bold text-gray-700">
            {{ t('best_sellers.title') }}
          </span>
        </div>
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-800">
          {{ t('warehouse_expertise') }}
          <span class="text-green-600">{{ t('warehouses') }}</span>
          {{ t('and_distribution') }}
          <span class="text-green-600">{{ t('medications') }}</span>
        </h2>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center mb-10">
        <i class="pi pi-spin pi-spinner text-3xl text-gray-600"></i>
      </div>

      <!-- Swiper Carousel -->
      <swiper
        v-else
        :modules="[Autoplay]"
        :slides-per-view="3"
        :space-between="24"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :speed="5000"


        :touch-ratio="1.5"
        class="mb-8"
        :breakpoints="{
          320: { slidesPerView: 1, spaceBetween: 16 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }"
        :dir="appLang === 'ar' ? 'rtl' : 'ltr'"
      >
        <SwiperSlide
          v-for="product in bestSellers"
          :key="product.id"
          class="bg-white rounded-xl shadow-md p-4 h-full relative overflow-hidden flex flex-col"
        >
          <!-- Medicine Only Badge -->
          <div class="absolute  top-4 right-4">
            <span class="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {{ t('products.medicineOnly') }}
            </span>
          </div>
          <!-- Product Image -->
          <div class="absolute top-4 left-4">
            <img
              v-if="product.media?.[0]?.url"
              :src="product.media[0].url"
              :alt="product.commercial_name"
              class="w-12 h-12 object-cover rounded-lg"
              @error="handleImageError"
            />
          </div>
          <!-- Product Details -->
          <div class="w-full mt-10">
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-1">
              {{ product.commercial_name }}
            </h3>
            <p class="text-sm text-gray-600">
              <i :class="['pi', getProductIcon(product.pharmaceutical_form), 'mr-1']"></i>
              {{ product.pharmaceutical_form || 'N/A' }}
            </p>
          </div>
          <!-- Warehouse Info -->
          <div class="flex items-center gap-2 my-4">
            <i class="pi pi-map-marker text-green-600 text-lg"></i>
            <span class="text-sm text-gray-700">{{ product.warehouse.name }}</span>
            <i class="pi pi-building text-green-600 text-lg"></i>
            <span class="text-sm text-gray-700">{{ product.warehouse.address }}</span>
          </div>
          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
          <!-- Price and Discount -->
          <div class="flex items-center justify-between w-full mt-auto mb-4">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="offer in product.discount"
                :key="offer.id"
                class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full"
              >
                {{ offer.display }} ({{  offer.description.slice(0,25) }})
              </span>
              <span
                v-if="!product.discount.length"
                class="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full"
              >
                {{ t('noOffers') }}
              </span>
            </div>
            <span class="text-lg md:text-xl font-bold text-green-600">
              {{ parseInt(product.price)+product.price_unit  }}
            </span>
          </div>
          <!-- Add to Cart Button -->
          <Button
            :label="cartLoading[product.id] ? t('cart.adding') : t('cart.addToCart')"
            :icon="cartLoading[product.id] ? 'pi pi-spin pi-spinner mr-2' : 'pi pi-cart-plus mr-2'"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 w-full z-50 rounded-lg transition-colors flex items-center justify-center"
            :disabled="cartLoading[product.id]"
            @click="addToCart(product.id)"
            :aria-label="t('cart.addToCart') + ' ' + product.commercial_name"
          />
        </SwiperSlide>
      </swiper>

      <!-- View All Products Button -->
      <div class="flex justify-center mt-8">
        <Button
          :label="t('best_sellers.all_products')"
          class="px-8 py-3 font-bold text-green-600 border-2 border-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors"
          @click="router.push({ name: 'pharmacy-categories' })"
        />
      </div>

      <Toast />
    </div>
  </div>
</template>

<style scoped lang="scss">
.swiper {
  @apply w-full;
}

:deep(.p-button) {
  &.p-button-success {
    background-color: #059669;
    &:hover {
      background-color: #047857;
    }
  }
}

@media screen and (max-width: 768px) {
  .swiper-slide {
    @apply flex justify-center;
  }
}

img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
```
