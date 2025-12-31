<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import 'primeicons/primeicons.css';

// Initialize dependencies
const toast = useToast();
const route = useRoute();
const { t } = useI18n();

// Reactive state
const product = ref(null);
const loading = ref(true);
const cartLoading = ref(false);
const appLang = ref(localStorage.getItem('appLang') || 'en');

// Static fallback data
const staticProduct = {
  id: 0,
  commercial_name: 'Sample Product',
  scientific_structure: ['Unknown'],
  price: '0.00',
  price_unit: '$',
  pharmaceutical_form: 'Unknown',
  category: { name_en: 'Unknown', name_ar: 'غير معروف' },
  company: { name: 'Unknown Company' },
  media: [{ url: '' }],
  offers: [],
  warehouse_id: 0,
  in_cart: false,
};

// Fetch product data
const fetchProductData = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/pharmacy-home/product/${route.params.id}`);
    if (response.data && response.data.data) {
      const apiData = response.data.data;

      product.value = {
        ...apiData,
        // Map offers to a display-friendly discount array
        discount: apiData.offers.map(offer => {
          let display = '';
          let description = t('offers.applies');

          if (offer.discount_type === 1) {
            // Type 1: Percentage OFF
            display = `${offer.discount_value}% OFF`;
          } else if (offer.discount_type === 2) {
            // Type 2: Value OFF
            // Note: The sample JSON has price_unit as '1', assuming it represents currency
            display = `${offer.discount_value} ${apiData.price_unit || t('currency')} OFF`;
          } else if (offer.discount_type === 3) {
            // Type 3: Gift Product (The quantity field acts as the gift quantity)
            // Assuming we don't know the gift product name, we use a generic name
            const giftQty = offer.quantity || 1;
            const giftName = t('offers.giftItem'); // Use i18n key for 'Gift Item'
            display = `Buy ${giftQty} Get 1 FREE`; // Simplified display for Type 3
            description = `Get ${giftQty}x ${giftName} FREE`;
          }

          // Add Min/Max limits to the description
          let limitInfo = '';
          if (offer.min_limit !== null && offer.max_limit !== null) {
            limitInfo = t('offers.limits', { min: offer.min_limit, max: offer.max_limit });
          } else if (offer.min_limit !== null) {
            limitInfo = t('offers.minLimit', { min: offer.min_limit });
          } else if (offer.max_limit !== null) {
            limitInfo = t('offers.maxLimit', { max: offer.max_limit });
          }

          if (limitInfo) {
              description = limitInfo;
          }

          if (offer.status === 'expired') {
             description = t('offers.expired');
          }

          // Only show offers with a determined display value and status 'active'
          return display && offer.status === 'active' ? {
            id: offer.id,
            display: display,
            description: description,
          } : null;
        }).filter(offer => offer !== null), // Filter out nulls (expired/undetermined offers)

        tags: apiData.scientific_structure?.length > 0
          ? apiData.scientific_structure
          : [t('tags.unknown')],
      };

    } else {
      product.value = staticProduct;
      toast.add({ severity: 'warn', summary: t('warning'), detail: t('error.noProduct'), life: 3000 });
    }
  } catch (error) {
    product.value = staticProduct;
    let message = t('error.fetchProduct');
    if (error.response?.status === 404) {
      message = t('error.productNotFound');
    } else if (error.code === 'ERR_NETWORK') {
      message = t('error.network');
    }
    toast.add({ severity: 'error', summary: t('error'), detail: message, life: 3000 });
    console.error('Error fetching product:', error);
  } finally {
    loading.value = false;
  }
};

// Add product to cart
const addToCart = async (productId) => {
  cartLoading.value = true;
  try {
    const response = await axios.post('/api/cart/add/item', {
      product_id: productId,
      quantity: 1,
    });
    if (response.data.success) {
      if (product.value) {
        product.value.in_cart = true;
      }
      toast.add({ severity: 'success', summary: t('success'), detail: t('cart.addSuccess'), life: 3000 });
    } else {
      throw new Error(response.data.message || t('error.addToCart'));
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: error.response?.data?.message || t('error.addToCart'), life: 3000 });
    console.error('Error adding to cart:', error);
  } finally {
    cartLoading.value = false;
  }
};

// Map pharmaceutical_form to PrimeVue icons
const getProductIcon = (form) => {
  const formMap = {
    'كبسولة': 'pi-capsules',
    'حقن': 'pi-syringe',
    'قرص': 'pi-pill',
    'شراب': 'pi-bottle',
    // ... add other forms from your system if known
  };
  return formMap[form] || 'pi-tablet';
};

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = '';
};

// Watch for route ID changes to refetch data
watch(() => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      product.value = null;
      loading.value = true;
      fetchProductData();
    }
  },
  { immediate: false }
);

// Initialize data
onMounted(() => {
  fetchProductData();
});
</script>

<template>
  <div class="bg-white min-h-screen">
    <div class="py-12 px-4 max-w-7xl m-auto">
      <div class="flex flex-col items-center justify-center text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-800">
          {{ t('product.details') }}
        </h2>
      </div>

      <div v-if="loading" class="flex justify-center mb-10">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <div v-else-if="product && product.id !== 0" class="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto border border-gray-100">
        <div class="flex flex-col md:flex-row gap-8">

          <div class="flex-shrink-0 md:w-1/3 flex flex-col items-center">
            <img
              v-if="product.media?.[0]?.url"
              :src="product.media[0].url"
              :alt="product.commercial_name"
              class="product-image w-full max-w-xs md:max-w-none h-auto object-cover rounded-xl shadow-lg"
              @error="handleImageError"
            />

          </div>

          <div class="flex-1 md:w-2/3">
            <h3 class="text-3xl font-extrabold text-gray-900 mb-4">
              {{ product.commercial_name }}
            </h3>

            <div class="space-y-3 mb-6">
              <p class="text-base text-gray-700">
                <i :class="['pi', getProductIcon(product.pharmaceutical_form), 'mr-2 text-green-600']"></i>
                {{ product.pharmaceutical_form || t('unknown') }}
              </p>

              <p v-if="product.category" class="text-base text-gray-700">
                <i class="pi pi-tag mr-2 text-green-600"></i>
                <span class="font-medium">{{ t('product.category') }}:</span>
                {{ appLang === 'ar' ? product.category.name_ar || t('unknown') : product.category.name_en || t('unknown') }}
              </p>

              <p v-if="product.company" class="text-base text-gray-700">
                <i class="pi pi-building mr-2 text-green-600"></i>
                <span class="font-medium">{{ t('product.company') }}:</span> {{ product.company.name || t('unknown') }}
              </p>

              <p v-if="product.expiration_to" class="text-base text-gray-700">
                <i class="pi pi-calendar-times mr-2 text-red-600"></i>
                <span class="font-medium">{{ t('product.expires') }}:</span>
                {{ new Date(product.expiration_to).toLocaleDateString() }}
              </p>
            </div>



            <div class="mb-6 border-t pt-4">

              <div class="flex flex-wrap gap-3">
                <span
                  v-for="offer in product.discount"
                  :key="offer.id"
                  class="bg-green-50 text-green-700 text-sm font-semibold px-3 py-1 rounded-lg border border-green-200"
                  :title="offer.description"
                >
                  {{ offer.display }} <span class="text-xs font-normal text-gray-600">({{ offer.description }})</span>
                </span>

                <span
                  v-if="!product.discount || product.discount.length === 0"
                  class="bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1 rounded-lg"
                >

                </span>
              </div>
            </div>

            <div class="flex items-center justify-between mt-8 pt-4 border-t">
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">{{ t('product.price') }}</span>
                <span class="text-3xl font-extrabold text-green-600">
                  {{ parseFloat(product.price).toLocaleString() }}
                  {{ product.price_unit || t('currency') }}
                </span>
              </div>

              <Button
                :label="cartLoading ? t('cart.adding') : product.in_cart ? t('cart.inCart') : t('cart.addToCart')"
                :icon="cartLoading ? 'pi pi-spin pi-spinner' : 'pi pi-cart-plus'"
                :disabled="cartLoading || product.id === 0"
                class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
                @click="addToCart(product.id)"
                :aria-label="t('cart.addToCart') + ' ' + product.commercial_name"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-600 py-10">
        {{ t('error.noProduct') }}
      </div>

      <Toast />
    </div>
  </div>
</template>

<style scoped lang="scss">
// Ensure images are controlled in size
.product-image {
  width: 100%;
  height: 192px; /* Fixed height for better consistency on card */
  object-fit: contain; /* Use 'contain' to ensure the whole image is visible */
}

@media (min-width: 768px) {
  .product-image {
    height: 256px;
  }
}
</style>
