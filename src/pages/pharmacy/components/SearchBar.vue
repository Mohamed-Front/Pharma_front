<template>
  <div class="relative">
    <!-- Search Input -->
    <div class="flex items-center relative">
      <input
        type="text"
        :placeholder="t('navbar.search')"
        v-model="searchQuery"
        class="bg-gray-100 text-gray-800 rounded-lg py-2 px-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
        @input="handleSearch"
        aria-label="Search products and warehouses"
        autocomplete="off"
      />
      <button
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-green-600"
        :aria-label="t('navbar.searchButton')"
      >
        <i class="pi pi-search text-lg" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="absolute top-full mt-2 w-full flex justify-center">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-600"></i>
    </div>

    <!-- Search Results Dropdown -->
    <div
      v-if="(searchResults.products.length > 0 || searchResults.warehouses.length > 0) && searchQuery.length > 0"
      class="absolute lg:w-[350px] top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-[70vh] overflow-y-auto z-50"
      role="listbox"
      :aria-label="t('navbar.searchResults')"
    >
      <!-- Products -->
      <div
        v-for="product in searchResults.products"
        :key="`product-${product.id}`"
        class="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
        role="option"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3" @click="goToProduct(product.id)">
            <img
              v-if="product.media?.[0]?.url"
              :src="product.media[0].url"
              :alt="product.commercial_name"
              class="w-10 h-10 object-cover rounded-lg"
              @error="handleImageError"
            />
            <div>
              <h3 class="text-sm font-semibold text-gray-900">
                {{ product.commercial_name }}
              </h3>
              <p class="text-xs text-gray-600">
                <i class="pi pi-tags mr-1" aria-hidden="true"></i>
                {{ product.scientific_structure?.[0] || 'N/A' }}
              </p>
            </div>
          </div>
          <Button
            :icon="cartLoading[product.id] ? 'pi pi-spin pi-spinner mr-2' : 'pi pi-cart-plus mr-2'"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 text-sm rounded-lg transition-colors"
            :disabled="cartLoading[product.id]"
            @click="addToCart(product.id)"

          />
        </div>
      </div>
      <!-- Warehouses -->
      <div
        v-for="warehouse in searchResults.warehouses"
        :key="`warehouse-${warehouse.id}`"
        class="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
        @click="goToWarehouse(warehouse.id)"
        role="option"
      >
        <div class="flex items-center gap-3">
          <i class="pi pi-building text-green-600 text-lg" aria-hidden="true"></i>
          <div>
            <h3 class="text-sm font-semibold text-gray-900">
              {{ warehouse.name }}
            </h3>
            <p class="text-xs text-gray-600">
              <i class="pi pi-phone mr-1" aria-hidden="true"></i>
              {{ warehouse.phone || 'N/A' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div
      v-if="!loading && searchQuery.length > 0 && searchResults.products.length === 0 && searchResults.warehouses.length === 0"
      class="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg p-4 text-gray-600 text-sm"
    >
      {{ t('navbar.noResults') }}
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import { debounce } from 'lodash';
import Toast from 'primevue/toast';
import Button from 'primevue/button';

// Localization, router, and toast
const { t } = useI18n();
const router = useRouter();
const toast = useToast();

// Search state
const searchQuery = ref('');
const searchResults = ref({ products: [], warehouses: [] });
const loading = ref(false);
const cartLoading = reactive({});

// Static fallback data
const staticSearchResults = {
  products: [
    {
      id: 1,
      commercial_name: 'Sample Product',
      scientific_structure: ['Acetaminophen'],
      media: [{ url: '/path/to/sample-image.png' }],
    },
  ],
  warehouses: [
    {
      id: 1,
      name: 'Sample Warehouse',
      phone: '123-456-7890',
      media: [],
    },
  ],
};

// Fetch search results from API with debouncing
const fetchSearchResults = debounce(async (query) => {
  if (!query) {
    searchResults.value = { products: [], warehouses: [] };
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(`/api/pharmacy-home/search?search=${encodeURIComponent(query)}`);
    if (response.data.success && (response.data.data.products?.length > 0 || response.data.data.warehouses?.length > 0)) {
      searchResults.value = {
        products: response.data.data.products.map(product => ({
          ...product,
          tags: product.scientific_structure?.length > 0
            ? product.scientific_structure
            : [t('tags.acetaminophen'), t('tags.paracetamol')],
        })),
        warehouses: response.data.data.warehouses,
      };
    } else {
      searchResults.value = { products: [], warehouses: [] };
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('navbar.noResults'),
        life: 3000,
      });
    }
  } catch (error) {
    searchResults.value = staticSearchResults;
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('navbar.searchError'),
      life: 3000,
    });
    console.error('Error fetching search results:', error);
  } finally {
    loading.value = false;
  }
}, 300);

// Handle search input
const handleSearch = () => {
  fetchSearchResults(searchQuery.value);
};

// Add product to cart
const addToCart = async (productId) => {
  cartLoading[productId] = true;
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
      detail: error.response?.data?.message || t('error.addToCart'),
      life: 3000,
    });
    console.error('Error adding to cart:', error);
  } finally {
    cartLoading[productId] = false;
  }
};

// Navigate to product page
const goToProduct = (productId) => {
  router.push({ name: 'product-details', params: { id: productId } });
  searchQuery.value = '';
  searchResults.value = { products: [], warehouses: [] };
};

// Navigate to warehouse page
const goToWarehouse = (warehouseId) => {
  router.push({ name: 'pharmacy-warehouse-details', params: { id: warehouseId } });
  searchQuery.value = '';
  searchResults.value = { products: [], warehouses: [] };
};

// Map pharmaceutical_form to PrimeVue icons (fallback since not in API)
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
  event.target.src = '/path/to/fallback-image.png';
};
</script>

<style scoped lang="scss">
input {
  min-width: 200px;
}

@media (max-width: 768px) {
  input {
    min-width: 150px;
  }
}

.dropdown {
  max-height: 24rem; /* 384px */
  overflow-y: auto;
  z-index: 50;
}

img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
}

:deep(.p-button) {
  &.p-button-success {
    background-color: #059669;
    &:hover {
      background-color: #047857;
    }
  }
}
</style>
