<script setup>
import { ref, onMounted,watch } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import 'primeicons/primeicons.css';

// Initialize dependencies
const toast = useToast();
const router = useRouter();
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
  pharmaceutical_form: 'Unknown',
  category: { name_en: 'Unknown', name_ar: 'غير معروف' },
  company: { name: 'Unknown Company' },
  media: [{ url: '/assets/fallback-image.png' }],
  offers: [],
  warehouse_id: 0,
  in_cart: false,
};

// Fetch product data
const fetchProductData = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/pharmacy-home/product/${route.params.id}`);
    if (response.data && response.data.data) { // Ensure response.data.data exists
      product.value = {
        ...response.data.data,
        discount: response.data.data.offers.map(offer => ({ // Use response.data.data.offers
          id: offer.id,
          discount_type: offer.discount_type, // Keep original type for internal logic if needed
          discount_value: offer.discount_value, // Keep original value
          display: offer.discount_type === 1
            ? `${offer.discount_value}% OFF`
            : `$${offer.discount_value} OFF`,
          description: offer.status === 'expired' ? 'Expired Offer' : `Buy ${offer.min_limit}-${offer.max_limit} units`,
        })),
        tags: response.data.data.scientific_structure?.length > 0
          ? response.data.data.scientific_structure
          : [t('tags.unknown')],
      };
    } else {
      product.value = staticProduct;
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('error.noProduct'),
        life: 3000,
      });
    }
  } catch (error) {
    product.value = staticProduct;
    let message = t('error.fetchProduct');
    if (error.response?.status === 404) {
      message = t('error.productNotFound');
    } else if (error.code === 'ERR_NETWORK') {
      message = t('error.network');
    }
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: message,
      life: 3000,
    });
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
      // Check if product.value is still valid before updating
      if (product.value) {
        product.value.in_cart = true;
      }
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('cart.addSuccess'),
        life: 3000,
      });
    } else {
      // Throw error to be caught below
      throw new Error(response.data.message || t('error.addToCart'));
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('error.addToCart'),
      life: 3000,
    });
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
    '222': 'pi-pill',
    '44': 'pi-syringe',
  };
  return formMap[form] || 'pi-tablet';
};

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = '/assets/fallback-image.png'; // Replace with actual fallback image path
};
watch(() => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      console.log(`Route ID changed from ${oldId} to ${newId}. Refetching data.`);

      product.value = null;
      loading.value = true;

      // 2. Re-fetch the product data
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
  <div class="bg-white">
    <div class="py-12 px-4 max-w-7xl m-auto">
      <div class="flex flex-col items-center justify-center text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-800">
          {{ t('product.details') }}
        </h2>
      </div>

      <div v-if="loading" class="flex justify-center mb-10">
        <i class="pi pi-spin pi-spinner text-3xl text-gray-600"></i>
      </div>

      <div v-else-if="product" class="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-shrink-0">
            <img
              v-if="product.media?.[0]?.url"
              :src="product.media[0].url"
              :alt="product.commercial_name"
              class="w-48 h-48 object-cover rounded-lg"
              @error="handleImageError"
            />

          </div>

          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              {{ product.commercial_name }}
            </h3>
            <p class="text-sm text-gray-600 mb-2">
              <i :class="['pi', getProductIcon(product.pharmaceutical_form), 'mr-1']"></i>
              {{ product.pharmaceutical_form || t('unknown') }}
            </p>
            <p class="text-sm text-gray-600 mb-2">
              <i class="pi pi-tag mr-1"></i>
              {{ t('category') }}: {{ appLang === 'ar' ? product.category.name_ar : product.category.name_en }}
            </p>
            <p class="text-sm text-gray-600 mb-2">
              <i class="pi pi-building mr-1"></i>
              {{ t('company') }}: {{ product.company.name }}
            </p>
            <p v-if="product.expiration_to" class="text-sm text-gray-600 mb-2">
              <i class="pi pi-calendar mr-1"></i>
              {{ t('expires') }}: {{ new Date(product.expiration_to).toLocaleDateString() }}
            </p>

            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="offer in product.discount"
                  :key="offer.id"
                  class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full truncate"
                  :title="offer.description"
                >
                  {{ offer.display }}
                </span>
                <span
                  v-if="!product.discount || !product.discount.length"
                  class="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full"
                >
                  {{ t('noOffers') }}
                </span>
              </div>
              <span class="text-xl font-bold text-green-600">
                {{ product.price }}$
                <template v-if="product.price_unit !== 1 && product.quantity_unit">
                  per {{ product.quantity_unit }}
                </template>
              </span>
            </div>

            <Button
              :label="cartLoading ? t('cart.adding') : product.in_cart ? t('cart.addToCart') : t('cart.addToCart')"
              :icon="cartLoading ? 'pi pi-spin pi-spinner mr-2' : 'pi pi-cart-plus mr-2'"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 w-full rounded-lg transition-colors"
              @click="addToCart(product.id)"
              :aria-label="t('cart.addToCart') + ' ' + product.commercial_name"
            />
          </div>
        </div>


      </div>

      <div v-else class="text-center text-gray-600">
        {{ t('error.noProduct') }}
      </div>

      <

      <Toast />
    </div>
  </div>
</template>

<style scoped lang="scss">
.truncate {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.p-button) {
  &.p-button-success {
    background-color: #059669;
    &:hover {
      background-color: #047857;
    }
  }
}

img {
  width: 192px;
  height: 192px;
  object-fit: cover;
  border-radius: 8px;
}

@media screen and (max-width: 768px) {
  img {
    width: 120px;
    height: 120px;
  }
}
</style>
