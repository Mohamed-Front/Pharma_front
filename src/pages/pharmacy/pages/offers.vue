```vue
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';

// Localization and toast
const { t } = useI18n();
const toast = useToast();

// Reactive state
const products = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const searchQuery = ref('');
const cartLoading = ref({});
const appLang = ref(localStorage.getItem('appLang') || 'ar');

// Static fallback data
const staticProducts = [
  {
    id: 0,
    product_id: 0,
    name_en: 'Fallback Product',
    name_ar: 'منتج احتياطي',
    pharmaceutical_form: 'Unknown',
    scientific_structure: [],
    discount: [],
    price: 0,
    media: [{ url: '/images/fallback-product.jpg' }],
    warehouse: {
      name: 'Unknown Warehouse',
      address: 'Unknown Address',
    },
  },
];

// Fetch offers from API
const fetchOffers = async (page = 1) => {
  loading.value = true;
  try {
    const searchParam = searchQuery.value ? `search=${encodeURIComponent(searchQuery.value)}&` : '';
    const response = await axios.get(`/api/pharmacy-home/get/offers?${searchParam}page=${page}`);
    if (response.data.success && response.data.data?.length > 0) {
      products.value = response.data.data
        .filter(item => item.warehouse)
        .map(item => ({
          id: item.id,
          product_id: item.id, // Use item.id as product_id since the structure provides it directly
          name_en: item.commercial_name || 'Unknown Product',
          name_ar: item.commercial_name || 'منتج غير معروف',
          pharmaceutical_form: item.pharmaceutical_form || 'Unknown',
          scientific_structure: item.scientific_structure || [],
          discount: item.active_offers.length > 0
            ? item.active_offers.map(offer => ({
                id: offer.id,
                display: offer.discount_type === 1
                  ? `${offer.discount_value}% OFF`
                  : `$${offer.discount_value} OFF`,
                description: offer.description || 'No description',
              }))
            : [], // Map active_offers to a display-friendly format
          price: parseFloat(item.price) || 0,
          media: item.media || [{ url: '/images/fallback-product.jpg' }],
          warehouse: {
            name: item.warehouse?.name || 'Unknown Warehouse',
            address: item.warehouse?.address || 'Unknown Address',
          },
        }));
      totalPages.value = response.data.pagination.last_page || 1;
      currentPage.value = response.data.pagination.current_page || 1;
      if (products.value.length === 0) {
        throw new Error('No valid products found');
      }
    } else {
      products.value = staticProducts;
      totalPages.value = 1;
      currentPage.value = 1;
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('error.noOffers'),
        life: 3000,
      });
    }
  } catch (error) {
    products.value = staticProducts;
    totalPages.value = 1;
    currentPage.value = 1;
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error.fetchOffers'),
      life: 3000,
    });
    console.error('Error fetching offers:', error.response?.data || error.message);
  } finally {
    loading.value = false;
  }
};

// Add product to cart
const addToCart = async (productId) => {
  cartLoading.value[productId] = true;
  try {
    const response = await axios.post('/api/cart/add/item', {
      product_id: productId,
      quantity: 1,
    });
    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('cart.addSuccess'),
        life: 3000,
      });
    } else {
      throw new Error(response.data.message || t('error.addToCart'));
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.message || t('error.addToCart'),
      life: 3000,
    });
    console.error('Error adding to cart:', error.response?.data || error.message);
  } finally {
    cartLoading.value[productId] = false;
  }
};

// Filter products based on search query
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter(product =>
    (appLang.value === 'en'
      ? product.name_en.toLowerCase()
      : product.name_ar.toLowerCase()
    ).includes(searchQuery.value.toLowerCase()) ||
    product.scientific_structure.some(tag =>
      tag.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

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

// Handle page change
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchOffers(page);
  }
};

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/images/fallback-product.jpg';
};

// Watch for search query changes
import { watch } from 'vue';
watch(searchQuery, () => {
  currentPage.value = 1;
  fetchOffers(1);
});

// Initialize data
onMounted(() => {
  fetchOffers();
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="py-10 px-4 max-w-7xl mx-auto">
      <!-- Header -->
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
        {{ t('offers.title') }}
      </h1>

      <!-- Search Bar -->
      <div class="flex justify-center mb-8">
        <div class="relative w-full max-w-lg">
          <InputText
            v-model="searchQuery"
            :placeholder="t('search.placeholder')"
            class="w-full p-3 pr-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            aria-label="Search offers"
          />
          <i class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" aria-label="Search icon" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center mb-10">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && filteredProducts.length === 0" class="text-center text-gray-500 py-10">
        {{ t('error.noOffers') }}
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-xl shadow-md p-4 relative overflow-hidden flex flex-col"
        >
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {{ t('offers.only') }}
                </span>
              </div>
              <div>
                <h3 class="text-lg md:text-xl font-bold text-gray-900">
                  {{ appLang === 'en' ? product.name_en : product.name_ar }}
                </h3>
                <p class="text-sm text-gray-600">{{ product.pharmaceutical_form }}</p>
              </div>
            </div>
            <div>
              <img
                v-if="product.media?.[0]?.url"
                :src="product.media[0].url"
                :alt="appLang === 'en' ? product.name_en : product.name_ar"
                class="w-16 h-16 object-cover rounded-lg"
                @error="handleImageError"
              />
            </div>
          </div>
          <div class="flex items-center gap-2 my-3">
            <i class="pi pi-map-marker text-green-600 text-lg"></i>
            <span class="text-sm text-gray-700">{{ product.warehouse.name }}</span>
            <i class="pi pi-building text-green-600 text-lg"></i>
            <span class="text-sm text-gray-700">{{ product.warehouse.address }}</span>
          </div>
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in product.scientific_structure"
              :key="tag"
              class="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
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
              {{ product.price +'$' }}
            </span>
          </div>
          <Button
            :label="cartLoading[product.product_id] ? t('cart.adding') : t('cart.addToCart')"
            :icon="cartLoading[product.product_id] ? 'pi pi-spin pi-spinner ml-2' : 'pi pi-cart-plus ml-2'"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 w-full rounded-lg transition-colors flex items-center justify-center"
            :disabled="cartLoading[product.product_id]"
            @click="addToCart(product.product_id)"
            :aria-label="t('cart.addToCart') + ' ' + (appLang === 'en' ? product.name_en : product.name_ar)"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && totalPages > 1" class="flex justify-center items-center gap-2">
        <Button
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white text-gray-600 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
          aria-label="Previous page"
          @click="changePage(currentPage - 1)"
        >
          <i class="pi pi-chevron-right"></i>
        </Button>
        <Button
          v-for="page in Math.min(totalPages, 5)"
          :key="page"
          :label="page.toString()"
          :class="currentPage === page ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'"
          class="px-4 py-2 rounded-lg shadow-sm transition-colors"
          @click="changePage(page)"
          :aria-label="'Page ' + page"
        />
        <span v-if="totalPages > 5" class="px-4 py-2 text-gray-500">...</span>
        <Button
          v-if="totalPages > 5"
          :label="totalPages.toString()"
          :class="currentPage === totalPages ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'"
          class="px-4 py-2 rounded-lg shadow-sm transition-colors"
          @click="changePage(totalPages)"
          :aria-label="'Page ' + totalPages"
        />
        <Button
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-white text-gray-600 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
          aria-label="Next page"
          @click="changePage(currentPage + 1)"
        >
          <i class="pi pi-chevron-left"></i>
        </Button>
      </div>

      <Toast />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-inputtext) {
  width: 100%;
  max-width: 600px;
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
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
```
