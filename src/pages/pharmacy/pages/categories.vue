<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import Categories from '../components/Categories.vue';

// Localization and toast
const { t } = useI18n();
const toast = useToast();

// Reactive state
const categories = ref([]);
const products = ref([]);
const selectedCategory = ref('all'); // 'all' or category ID
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const searchQuery = ref('');
const cartLoading = ref({}); // Track loading state per product

// Static fallback data
const staticCategories = [];
const staticProducts = [];

// Computed property for selected category name
const selectedCategoryName = computed(() => {
  if (selectedCategory.value === 'all') return '';
  const category = categories.value.find(cat => cat.id === selectedCategory.value);
  const appLang = localStorage.getItem('appLang') || 'ar';
  return category ? (appLang === 'en' ? category.name_en : category.name_ar) : '';
});

// Fetch categories from API
const fetchCategories = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/pharmacy-home/get/categories');
    if (response.data.success && response.data.data?.length > 0) {
      categories.value = [{ id: 'all', name_ar: 'الكل', name_en: 'All' }, ...response.data.data];
    } else {
      categories.value = staticCategories;
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('error.noCategories'),
        life: 3000,
      });
    }
  } catch (error) {
    categories.value = staticCategories;
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error.fetchCategories'),
      life: 3000,
    });
    console.error('Error fetching categories:', error);
  } finally {
    loading.value = false;
  }
};

// Fetch products from API
const fetchProducts = async (page = 1) => {
  loading.value = true;
  try {
    const categoryParam = selectedCategory.value === 'all' ? '' : `category_id=${selectedCategory.value}&`;
    const searchParam = searchQuery.value ? `search=${encodeURIComponent(searchQuery.value)}&` : '';
    const response = await axios.get(`/api/pharmacy-home/get/products?${categoryParam}${searchParam}page=${page}`);
    if (response.data.success && response.data.data?.length > 0) {
      products.value = response.data.data.map(product => ({
        ...product,
        discount: product.active_offers.length > 0
          ? product.active_offers.map(offer => ({
              ...offer,
              display: offer.discount_type === 1
                ? `${offer.discount_value}% OFF`
                : `$${offer.discount_value} OFF`
            }))
          : [], // Map active_offers to a display-friendly format
      }));
      totalPages.value = response.data.pagination.last_page || 1;
      currentPage.value = response.data.pagination.current_page || 1;
    } else {
      products.value = staticProducts;
      totalPages.value = 1;
      currentPage.value = 1;
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('error.noProducts'),
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
      detail: t('error.fetchProducts'),
      life: 3000,
    });
    console.error('Error fetching products:', error);
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
    console.error('Error adding to cart:', error);
  } finally {
    cartLoading.value[productId] = false;
  }
};

// Filter products based on search query
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter(product =>
    product.commercial_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.scientific_structure.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// Map pharmaceutical_form to PrimeVue icons
const getProductIcon = (form) => {
  const formMap = {
    'كبسولة': 'pi-capsules',
    'حقن': 'pi-syringe',
    'قرص': 'pi-pill',
    'شراب': 'pi-bottle',
    '222': 'pi-pill', // Fallback for numeric values
    '44': 'pi-syringe', // Fallback for numeric values
  };
  return formMap[form] || 'pi-tablet'; // Default fallback
};

// Handle category selection
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  currentPage.value = 1;
  fetchProducts(1);
};

// Handle page change
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchProducts(page);
  }
};

// Watch for search query changes
import { watch } from 'vue';
watch(searchQuery, () => {
  currentPage.value = 1;
  fetchProducts(1);
});

// Initialize data
onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>

<template>
  <div class="bg-gray-50">
    <div class="py-10 px-4 max-w-7xl m-auto">
      <!-- Search Bar -->
      <div class="flex justify-center mb-8">
        <div class="relative w-full max-w-lg">
          <InputText
            v-model="searchQuery"
            :placeholder="t('search.placeholder')"
            class="w-full p-3 pr-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <i class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <!-- Categories Component -->
      <Categories
        :categories="categories"
        :selectedCategory="selectedCategory"
        :loading="loading"
        @selectCategory="selectCategory"
      />

      <!-- Product Grid -->
      <div v-if="loading" class="flex justify-center mb-10">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-xl shadow-md p-4 relative overflow-hidden flex flex-col"
        >
          <div class="flex justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">أدوية فقط</span>
              </div>
              <div>
                <h3 class="text-lg md:text-xl font-bold text-gray-900">{{ product.commercial_name }}</h3>
                <p class="text-sm text-gray-600">{{ product.pharmaceutical_form || 'N/A' }}</p>
              </div>
            </div>
            <div>
              <img
                v-if="product.media?.[0]?.url"
                :src="product.media[0].url"
                alt="Product Image"
                class="w-16 h-16 object-cover rounded-lg mr-3"
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
                {{ offer.display }}
              </span>
              <span
                v-if="!product.discount.length"
                class="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full"
              >
                {{ t('noOffers') }}
              </span>
            </div>
            <span class="text-lg md:text-xl font-bold text-green-600">
              ${{ product.price }} <span class="text-gray-500 text-sm font-normal"></span>
            </span>
          </div>
          <Button
            :label="cartLoading[product.id] ? t('cart.adding') : t('cart.addToCart')"
            :icon="cartLoading[product.id] ? 'pi pi-spin pi-spinner ml-2' : 'pi pi-cart-plus ml-2'"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 w-full rounded-lg transition-colors flex items-center justify-center"
            :disabled="cartLoading[product.id]"
            @click="addToCart(product.id)"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && totalPages > 1" class="flex justify-center items-center gap-2">
        <Button
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white text-gray-600 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
          @click="changePage(currentPage - 1)"
        >
          <i class="pi pi-chevron-right"></i>
        </Button>
        <Button
          v-for="page in Math.min(totalPages, 5)"
          :key="page"
          :label="page.toString()"
          :style="currentPage === page
            ? {
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#059669',
                color: '#ffffff',
                ':hover': { backgroundColor: '#047857' }
              }
            : {
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff !important',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                ':hover': { backgroundColor: '#f3f4f6' }
              }"
          @click="changePage(page)"
        />
        <span v-if="totalPages > 5" class="px-4 py-2 text-gray-500">...</span>
        <Button
          v-if="totalPages > 5"
          :label="totalPages.toString()"
          :style="currentPage === totalPages
            ? {
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#059669',
                color: '#ffffff',
                ':hover': { backgroundColor: '#047857' }
              }
            : {
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                ':hover': { backgroundColor: '#f3f4f6' }
              }"
          @click="changePage(totalPages)"
        />
        <Button
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-white text-gray-600 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
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

.product-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 12px;
}
</style>
