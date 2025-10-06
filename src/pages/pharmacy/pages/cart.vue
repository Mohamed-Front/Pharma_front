<template>
  <div class="bg-gray-100 min-h-screen p-4 sm:p-8 font-[Inter]">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      <!-- Order Summary Card -->
      <div class="flex-shrink-0 w-full lg:w-96 bg-white rounded-3xl shadow-lg p-6 flex flex-col items-stretch">
        <div class="flex items-center border-b pb-4 mb-4">
          <h2 class="text-xl font-bold">{{ t('cart.orderDetails') }}</h2>
          <i class="pi pi-shopping-cart text-green-600 text-2xl mx-2"></i>
        </div>
        <div class="flex justify-between py-2 text-gray-600">
          <span>{{ subtotal }} {{ t('currency') }}</span>
          <span class="font-medium">{{ t('cart.subtotal') }}</span>
        </div>
        <div class="flex justify-between py-2 text-gray-600">
          <span class="text-red-500">-{{ discount }} {{ t('currency') }}</span>
          <span class="font-medium">{{ t('cart.discount') }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg border-t pt-4 mt-4">
          <span>{{ finalTotal }} {{ t('currency') }}</span>
          <span>{{ t('cart.total') }}</span>
        </div>
        <button
          class="bg-green-600 text-white rounded-full py-3 mt-8 font-bold text-lg shadow-lg hover:bg-green-700 transition duration-300"
          :disabled="loading || cartItems.length === 0"
          @click="proceedToCheckout"
        >
          {{ t('cart.checkout') }}
        </button>
        <div class="flex items-center justify-center mt-4 text-xs text-gray-500">
          <i class="pi pi-check-circle text-green-600 mr-1"></i>
          <span>{{ t('cart.securePayment') }}</span>
        </div>
      </div>

      <!-- Products List Card -->
      <div class="flex-grow w-full bg-white rounded-3xl shadow-lg p-6 flex flex-col">
        <div class="flex items-center border-b pb-4 mb-4">
          <h2 class="text-xl font-bold">{{ t('cart.requestedItems') }}</h2>
          <i class="pi pi-box text-green-600 text-2xl mx-2"></i>
        </div>

        <!-- Tabs for All and Warehouses -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            :class="[
              'px-4 py-2 rounded-lg shadow-sm border',
              selectedTab === 'all'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
            ]"
            @click="selectTab('all')"
          >
            {{ t('cart.all') }}
          </button>
          <button
            v-for="warehouse in warehouses"
            :key="warehouse.warehouse_id"
            :class="[
              'px-4 py-2 rounded-lg shadow-sm border',
              selectedTab === warehouse.warehouse_id
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
            ]"
            @click="selectTab(warehouse.warehouse_id)"
          >
            {{ warehouse.warehouse_name }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center mb-10">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
        </div>

        <!-- Empty Cart State -->
        <div v-else-if="!loading && cartItems.length === 0" class="text-center text-gray-600 py-8">
          <p>{{ t('cart.empty') }}</p>
        </div>

        <!-- Product Items by Warehouse -->
        <div v-else>
          <div
            v-for="warehouse in filteredWarehouses"
            :key="warehouse.warehouse_id"
            class="mb-6"
          >
            <h3 class="text-lg font-semibold text-gray-700 mb-4" v-if="selectedTab !== 'all'">
              {{ warehouse.name }}
            </h3>
            <div
              v-for="item in warehouse.items"
              :key="item.id"
              class="flex flex-col sm:flex-row items-center justify-between border-b pb-4 mb-4 last:border-b-0 last:mb-0"
            >
              <div class="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    v-if="item.product.media?.[0]?.url"
                    :src="item.product.media[0].url"
                    :alt="item.product.commercial_name"
                    class="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                    @error="handleImageError"
                  />
                  <i v-else :class="['pi', getProductIcon(item.product.scientific_structure[0]), 'text-green-600 text-2xl']"></i>
                </div>
                <div class="flex-grow mx-4">
                  <h3 class="font-bold text-lg">{{ item.product.commercial_name }}</h3>
                  <p class="text-sm text-gray-500">{{ item.description || t('cart.defaultDescription') }}</p>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span
                      v-for="tag in item.product.scientific_structure"
                      :key="tag"
                      class="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <p v-if="item.total_discounts > 0" class="text-sm text-red-500 mt-1">
                    {{ t('cart.discount') }}: -{{ item.total_discounts }} {{ t('currency') }}
                  </p>
                  <!-- Active Offers Display -->
                  <div v-if="item.product.has_active_offer && item.product.active_offers?.length" class="mt-2">
                    <div
                      v-for="offer in item.product.active_offers"
                      :key="offer.description"
                      class="bg-green-50 text-green-800 text-xs font-medium px-3 py-2 rounded-lg mt-1"
                    >
                      <p>{{ offer.description }}</p>
                      <p>Discount: {{ offer.discount_value }} {{ offer.discount_type === 2 ? t('currency') : '%' }}</p>
                      <p>Valid until: {{ formatDate(offer.end_date) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center w-full sm:w-auto justify-between sm:justify-start">
                <div class="flex items-center ml-4">
                  <span class="font-bold text-lg">{{ item.total_price }} {{ t('currency') }}</span>
                  <button
                    class="text-red-500 p-2 rounded-full mx-4 hover:bg-gray-300 transition duration-300"
                    :disabled="cartLoading[item.id]"
                    @click="removeItem(item.id)"
                  >
                    <i class="pi pi-trash text-lg"></i>
                  </button>
                </div>
                <div class="flex items-center bg-gray-200 rounded-full px-2 py-1">
                  <button
                    class="w-8 h-8 rounded-full text-green-600 font-bold hover:bg-gray-300 transition duration-300"
                    :disabled="cartLoading[item.id]"
                    @click="incrementQuantity(item.id)"
                  >
                    +
                  </button>
                  <span class="px-4 font-bold text-lg">{{ item.quantity }}</span>
                  <button
                    class="w-8 h-8 rounded-full text-green-600 font-bold hover:bg-gray-300 transition duration-300"
                    :disabled="cartLoading[item.id] || item.quantity <= 1"
                    @click="decrementQuantity(item.id)"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import { useRouter } from 'vue-router';

// Localization and toast
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

// Reactive state
const cartItems = ref([]);
const warehouses = ref([]);
const selectedTab = ref('all');
const loading = ref(false);
const cartLoading = ref({});

// Computed property for filtered warehouses
const filteredWarehouses = computed(() => {
  if (selectedTab.value === 'all') {
    return warehouses.value;
  }
  return warehouses.value.filter(w => w.warehouse_id === selectedTab.value);
});

// Computed properties for order summary
const subtotal = computed(() => {
  if (selectedTab.value === 'all') {
    return warehouses.value.reduce((sum, w) => sum + (w.original_price || 0), 0);
  }
  const warehouse = warehouses.value.find(w => w.warehouse_id === selectedTab.value);
  return warehouse ? warehouse.original_price || 0 : 0;
});

const discount = computed(() => {
  if (selectedTab.value === 'all') {
    return warehouses.value.reduce((sum, w) => sum + (w.total_discounts || 0), 0);
  }
  const warehouse = warehouses.value.find(w => w.warehouse_id === selectedTab.value);
  return warehouse ? warehouse.total_discounts || 0 : 0;
});

const finalTotal = computed(() => {
  if (selectedTab.value === 'all') {
    return warehouses.value.reduce((sum, w) => sum + (w.total_price || 0), 0);
  }
  const warehouse = warehouses.value.find(w => w.warehouse_id === selectedTab.value);
  return warehouse ? warehouse.total_price || 0 : 0;
});

// Map scientific_structure to PrimeVue icons
const getProductIcon = (form) => {
  const formMap = {
    Paracetamol: 'pi-tablet',
    Caffeine: 'pi-bolt'
  };
  return formMap[form] || 'pi-tablet';
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Handle image error
const handleImageError = (event) => {
  event.target.style.display = 'none';
  event.target.nextElementSibling.style.display = 'block';
};

// Fetch cart data from API
const fetchCart = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/cart/get');
    if (response.data.success && response.data.data) {
      warehouses.value = response.data.data.warehouses.map((warehouse, index) => ({
        ...warehouse,
        name: warehouse.warehouse_name || `Warehouse ${warehouse.warehouse_id || index + 1}`,
        items: warehouse.items.map(item => ({
          ...item,
          description: item.description || t('cart.defaultDescription'),
        })),
      }));
      cartItems.value = warehouses.value.flatMap(w => w.items);
    } else {
      warehouses.value = [];
      cartItems.value = [];
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('cart.empty'),
        life: 3000,
      });
    }
  } catch (error) {
    warehouses.value = [];
    cartItems.value = [];
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('cart.fetchError'),
      life: 3000,
    });
    console.error('Error fetching cart:', error);
  } finally {
    loading.value = false;
  }
};

// Remove item from cart
const removeItem = async (id) => {
  cartLoading.value[id] = true;
  try {
    const item = cartItems.value.find(item => item.id === id);
    if (!item) return;
    const response = await axios.post('/api/cart/remove/item', { item_id: item.id });
    if (response.data.success) {
      warehouses.value = warehouses.value.map(w => ({
        ...w,
        items: w.items.filter(item => item.id !== id),
        original_price: w.items.filter(item => item.id !== id).reduce((sum, item) => sum + (item.original_price || 0), 0),
        total_discounts: w.items.filter(item => item.id !== id).reduce((sum, item) => sum + (item.total_discounts || 0), 0),
        total_price: w.items.filter(item => item.id !== id).reduce((sum, item) => sum + (item.total_price || 0), 0),
      })).filter(w => w.items.length > 0);
      cartItems.value = cartItems.value.filter(item => item.id !== id);
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('cart.removeSuccess'),
        life: 3000,
      });
      fetchCart();
    } else {
      throw new Error(response.data.message || t('cart.removeError'));
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.message || t('cart.removeError'),
      life: 3000,
    });
    console.error('Error removing item:', error);
  } finally {
    cartLoading.value[id] = false;
  }
};

// Increment item quantity
const incrementQuantity = async (id) => {
  cartLoading.value[id] = true;
  const item = cartItems.value.find(item => item.id === id);
  if (!item) return;
  try {
    const response = await axios.post('/api/cart/add/item', {
      product_id: item.product_id,
      quantity: item.quantity + 1,
    });
    if (response.data.success) {
      item.quantity++;
      item.original_price = item.product.price * item.quantity;
      item.total_price = item.original_price - (item.total_discounts || 0);
      updateWarehouseTotals(item.product.warehouse_id);
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('cart.updateSuccess'),
        life: 3000,
      });
      fetchCart();
    } else {
      throw new Error(response.data.message || t('cart.updateError'));
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.message || t('cart.updateError'),
      life: 3000,
    });
    fetchCart();
    console.error('Error incrementing quantity:', error);
  } finally {
    cartLoading.value[id] = false;
  }
};

// Decrement item quantity
const decrementQuantity = async (id) => {
  const item = cartItems.value.find(item => item.id === id);
  if (!item || item.quantity <= 1) return;
  cartLoading.value[id] = true;
  try {
    const response = await axios.post('/api/cart/add/item', {
      product_id: item.product_id,
      quantity: item.quantity - 1,
    });
    if (response.data.success) {
      item.quantity--;
      item.original_price = item.product.price * item.quantity;
      item.total_price = item.original_price - (item.total_discounts || 0);
      updateWarehouseTotals(item.product.warehouse_id);
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('cart.updateSuccess'),
        life: 3000,
      });
      fetchCart();
    } else {
      throw new Error(response.data.message || t('cart.updateError'));
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.message || t('cart.updateError'),
      life: 3000,
    });
    console.error('Error decrementing quantity:', error);
  } finally {
    cartLoading.value[id] = false;
  }
};

// Update warehouse totals after quantity changes
const updateWarehouseTotals = (warehouseId) => {
  const warehouse = warehouses.value.find(w => w.warehouse_id === warehouseId);
  if (!warehouse) return;
  warehouse.original_price = warehouse.items.reduce((sum, item) => sum + (item.original_price || 0), 0);
  warehouse.total_discounts = warehouse.items.reduce((sum, item) => sum + (item.total_discounts || 0), 0);
  warehouse.total_price = warehouse.items.reduce((sum, item) => sum + (item.total_price || 0), 0);
};

// Proceed to checkout
const proceedToCheckout = async () => {
  if (cartItems.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('cart.empty'),
      life: 3000,
    });
    return;
  }

  try {
    // Prepare the select string with unique warehouse IDs
    const select = [...new Set(
      filteredWarehouses.value
        .flatMap(warehouse => warehouse.items)
        .map(item => item.product.warehouse_id)
    )].join(',');

    // Show processing toast
    toast.add({
      severity: 'info',
      summary: t('info'),
      detail: t('cart.checkoutProcessing'),
      life: 3000,
    });

    // Make API request to place order with select as query parameter
    const response = await axios.post(`/api/order?select=${encodeURIComponent(select)}`);

    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('cart.orderSuccess'),
        life: 3000,
      });
      fetchCart();
      selectedTab.value = 'all';
      // Clear cart after successful order
      warehouses.value = [];
      cartItems.value = [];
    } else {
      throw new Error(response.data.message || t('cart.checkoutError'));
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.message || t('cart.checkoutError'),
      life: 3000,
    });
    console.error('Error proceeding to checkout:', error);
  }
};

// Select tab (All or warehouse)
const selectTab = (tab) => {
  selectedTab.value = tab;
};

// Initialize data
onMounted(fetchCart);
</script>

<style scoped lang="scss">
.font-\[Inter\] {
  font-family: Inter, sans-serif;
}

@media screen and (max-width: 768px) {
  .flex-col.sm\:flex-row {
    flex-direction: column;
  }
}

img + i {
  display: none;
}
</style>
