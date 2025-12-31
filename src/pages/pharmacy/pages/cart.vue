<template>
  <div class="bg-gray-100 min-h-screen p-4 sm:p-8 font-[Inter]">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
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

      <div class="flex-grow w-full bg-white rounded-3xl shadow-lg p-6 flex flex-col">
        <div class="flex flex-wrap gap-2 mb-6 border-b pb-4">
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

        <div v-if="loading" class="flex justify-center mb-10">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
        </div>

        <div v-else-if="!loading && cartItems.length === 0" class="text-center text-gray-600 py-8">
          <p>{{ t('cart.empty') }}</p>
        </div>

        <div v-else class="mb-8">
          <div class="flex items-center pb-4 mb-4">
            <h2 class="text-xl font-bold">{{ t('cart.requestedItems') }} ({{ nonGiftItemsCount }})</h2>
            <i class="pi pi-box text-green-600 text-2xl mx-2"></i>
          </div>

          <div v-if="nonGiftItemsCount === 0" class="text-center text-gray-500 p-4 border rounded-xl">
              {{ t('cart.noPurchasedItems') }}
          </div>

          <div
            v-for="warehouse in filteredWarehouses"
            :key="warehouse.warehouse_id"
            class="mb-6"
          >
            <h3 class="text-lg font-semibold text-gray-700 mb-4" v-if="selectedTab !== 'all' && getNonGiftItems(warehouse).length > 0">
              {{ warehouse.name }}
            </h3>
            <div
              v-for="item in getNonGiftItems(warehouse)"
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

                  <div v-if="item.product.has_active_offer && item.product.active_offers?.length" class="mt-3 space-y-2">
                    <div
                      v-for="offer in item.product.active_offers"
                      :key="offer.id"
                      class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 text-xs font-medium p-3 rounded-lg"
                      :class="{ 'ring-2 ring-green-500': qualifiesForGift(item.quantity, offer) }"
                    >
                      <p class="font-semibold">{{ offer.description }}</p>

                      <p class="mt-1">
                        <i class="pi pi-gift mr-1"></i>
                        <strong>{{ t('cart.gift') }}:</strong> {{ offer.gift_quantity }} × {{ offer.gift_product?.commercial_name || t('cart.unknownGift') }}
                      </p>

                      <p>
                        <strong>{{ t('cart.minLimit') }}:</strong> {{ offer.min_limit }}
                        <span class="mx-2">|</span>
                        <strong>{{ t('cart.maxLimit') }}:</strong> {{ offer.max_limit }}
                      </p>



                      <p class="text-xs text-gray-600 mt-1">
                        {{ t('cart.validUntil') }}: {{ formatDate(offer.end_date) }}
                      </p>
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

                  <input
                    type="number"
                    :value="item.quantity"
                    min="1"
                    class="px-2 w-16 text-center font-bold text-lg bg-transparent focus:outline-none quantity-input"
                    :disabled="cartLoading[item.id]"
                    @change="event => updateQuantity(item.id, event.target.value)"
                  />

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

        <hr class="my-8 border-t border-gray-200" v-if="giftItemsCount > 0" />

        <div v-if="giftItemsCount > 0">
          <div class="flex items-center pb-4 mb-4">
            <h2 class="text-xl font-bold text-purple-700">{{ t('cart.eligibleGiftsTitle') }} ({{ giftItemsCount }})</h2>
            <i class="pi pi-gift text-purple-600 text-2xl mx-2"></i>
          </div>

          <div
            v-for="warehouse in filteredWarehouses"
            :key="warehouse.warehouse_id"
            class="mb-6"
          >
              <h3 class="text-lg font-semibold text-gray-700 mb-4" v-if="selectedTab !== 'all' && getGiftItems(warehouse).length > 0">
              {{ warehouse.name }}
            </h3>
            <div
              v-for="item in getGiftItems(warehouse)"
              :key="item.id"
              class="flex flex-col sm:flex-row items-center justify-between border border-purple-200 bg-purple-50 rounded-xl p-4 mb-4"
            >
              <div class="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    v-if="item.product.media?.[0]?.url"
                    :src="item.product.media[0].url"
                    :alt="item.product.commercial_name"
                    class="w-full h-full object-cover rounded-xl opacity-70"
                    loading="lazy"
                    @error="handleImageError"
                  />
                </div>
                <div class="flex-grow mx-4">
                  <h3 class="font-bold text-lg text-purple-800">{{ item.product.commercial_name }}</h3>
                  <p class="text-sm text-purple-600">{{ t('cart.gift') }} - {{ t('cart.complimentary') }}</p>
                  <div class="flex flex-wrap gap-2 mt-2">
                      <span
                      v-for="tag in item.product.scientific_structure"
                      :key="tag"
                      class="bg-purple-200 text-purple-800 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center w-full sm:w-auto justify-between sm:justify-start text-purple-800">
                <span class="font-bold text-lg mr-4">{{ t('cart.free') }}</span>

                <button
                    class="p-2 rounded-full mx-4 text-gray-400 cursor-not-allowed"
                    disabled
                >
                    <i class="pi pi-trash text-lg"></i>
                </button>
                <div class="flex items-center bg-purple-200 rounded-full px-2 py-1 opacity-70 cursor-not-allowed">
                  <button class="w-8 h-8 rounded-full text-purple-600 font-bold" disabled>
                    +
                  </button>
                  <span class="px-4 font-bold text-lg">{{ item.quantity }}</span>
                  <button class="w-8 h-8 rounded-full text-purple-600 font-bold" disabled>
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
// (تم إدراج كود Script بالكامل من الرد السابق لضمان العمل)
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

// --- Helper Functions for UI Logic (Keep as is) ---

const getNonGiftItems = (warehouse) => {
  return warehouse.items.filter(item => item.is_gift !== 1);
};

const getGiftItems = (warehouse) => {
  return warehouse.items.filter(item => item.is_gift === 1);
};

const nonGiftItemsCount = computed(() => {
  return filteredWarehouses.value.flatMap(w => getNonGiftItems(w)).length;
});

const giftItemsCount = computed(() => {
  return filteredWarehouses.value.flatMap(w => getGiftItems(w)).length;
});


const getSummaryItems = (warehousesList, tab) => {
  let items = [];
  if (tab === 'all') {
    items = warehousesList.flatMap(w => w.items);
  } else {
    const warehouse = warehousesList.find(w => w.warehouse_id === tab);
    items = warehouse ? warehouse.items : [];
  }
  return items.filter(item => item.is_gift !== 1);
};


const filteredWarehouses = computed(() => {
  if (selectedTab.value === 'all') {
    return warehouses.value;
  }
  return warehouses.value.filter(w => w.warehouse_id === selectedTab.value);
});

const subtotal = computed(() => {
  const items = getSummaryItems(warehouses.value, selectedTab.value);
  return items.reduce((sum, item) => sum + (item.original_price || 0), 0);
});

const discount = computed(() => {
  const items = getSummaryItems(warehouses.value, selectedTab.value);
  return items.reduce((sum, item) => sum + (item.total_discounts || 0), 0);
});

const finalTotal = computed(() => {
  const items = getSummaryItems(warehouses.value, selectedTab.value);
  return items.reduce((sum, item) => sum + (item.total_price || 0), 0);
});


const getProductIcon = (form) => {
  const formMap = {
    Paracetamol: 'pi-tablet',
    Caffeine: 'pi-bolt',
    'First Scientific Structure': 'pi-capsules'
  };
  return formMap[form] || 'pi-tablet';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const handleImageError = (event) => {
  event.target.style.display = 'none';
  if (event.target.nextElementSibling) {
    event.target.nextElementSibling.style.display = 'block';
  }
};

const getUnit = (unit) => {
  const units = { 1: t('cart.unit'), 2: t('cart.box'), 3: t('cart.pack'), 5: t('cart.unit') };
  return units[unit] || t('cart.unit');
};

const qualifiesForGift = (quantity, offer) => {
  return quantity >= offer.min_limit;
};

const calculateEligibleGifts = (quantity, offer) => {
  if (!qualifiesForGift(quantity, offer)) return 0;
  const sets = Math.floor(quantity / offer.min_limit);
  const maxSets = offer.max_limit ? Math.floor(offer.max_limit / offer.min_limit) : sets;
  const cappedSets = Math.min(sets, maxSets);

  return cappedSets * offer.gift_quantity;
};


// --- API Handlers ---

const fetchCart = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/cart/get');

    if (response.data.success && response.data.data) {
      warehouses.value = response.data.data.warehouses.map((warehouse) => ({
        ...warehouse,
        name: warehouse.warehouse_name || `Warehouse ${warehouse.warehouse_id}`,
        items: warehouse.items.map(item => ({
          ...item,
          description: item.description || t('cart.defaultDescription'),
        })).sort((a, b) => a.is_gift - b.is_gift),
      }));
      cartItems.value = warehouses.value.flatMap(w => w.items);
    } else {
      warehouses.value = [];
      cartItems.value = [];
      toast.add({ severity: 'warn', summary: t('warning'), detail: t('cart.empty'), life: 3000 });
    }
  } catch (error) {
    warehouses.value = [];
    cartItems.value = [];
    const errorMessage = error.response?.data?.message || t('cart.fetchError');
    toast.add({ severity: 'error', summary: t('error'), detail: errorMessage, life: 3000 });
    console.error('Error fetching cart:', error);
  } finally {
    loading.value = false;
  }
};


const removeItem = async (id) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item && item.is_gift === 1) return;

  cartLoading.value[id] = true;
  try {
    const response = await axios.post('/api/cart/remove/item', { item_id: id });
    if (response.data.success) {
      await fetchCart();
      toast.add({ severity: 'success', summary: t('success'), detail: t('cart.removeSuccess'), life: 3000 });
    } else {
      throw new Error(response.data.message || t('cart.removeError'));
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: error.message || t('cart.removeError'), life: 3000 });
  } finally {
    delete cartLoading.value[id];
  }
};

const updateQuantity = async (id, newQuantity) => {
  const item = cartItems.value.find(i => i.id === id);
  const quantity = parseInt(newQuantity);

  if (!item || item.is_gift === 1) return;

  if (isNaN(quantity) || quantity < 1) {
    toast.add({ severity: 'warn', summary: t('warning'), detail: t('cart.invalidQuantity'), life: 3000 });
    await fetchCart();
    return;
  }

  if (quantity === item.quantity) return;

  cartLoading.value[id] = true;
  try {
    const response = await axios.post('/api/cart/add/item?update=1', {
      product_id: item.product_id,
      quantity: quantity,
    });
    if (response.data.success) {
      await fetchCart();
      toast.add({ severity: 'success', summary: t('success'), detail: t('cart.updateSuccess'), life: 3000 });
    } else {
      throw new Error(response.data.message || t('cart.updateError'));
    }
  } catch (error) {
    await fetchCart();
    toast.add({ severity: 'error', summary: t('error'), detail: error.message || t('cart.updateError'), life: 3000 });
  } finally {
    delete cartLoading.value[id];
  }
};


const incrementQuantity = async (id) => {
  const item = cartItems.value.find(i => i.id === id);
  if (!item || item.is_gift === 1) return;
  await updateQuantity(id, item.quantity + 1);
};

const decrementQuantity = async (id) => {
  const item = cartItems.value.find(i => i.id === id);
  if (!item || item.quantity <= 1 || item.is_gift === 1) return;
  await updateQuantity(id, item.quantity - 1);
};


const proceedToCheckout = async () => {
  const activeWarehouses = filteredWarehouses.value.map(w => w.warehouse_id);

  if (activeWarehouses.length === 0) {
    toast.add({ severity: 'warn', summary: t('warning'), detail: t('cart.empty'), life: 3000 });
    return;
  }

  try {
    const select = activeWarehouses.join(',');

    toast.add({ severity: 'info', summary: t('info'), detail: t('cart.checkoutProcessing'), life: 3000 });

    const response = await axios.post(`/api/order?select=${encodeURIComponent(select)}`);
    if (response.data.success) {
      toast.add({ severity: 'success', summary: t('success'), detail: t('cart.orderSuccess'), life: 3000 });
      await fetchCart();
      selectedTab.value = 'all';
    } else {
      throw new Error(response.data.message || t('cart.checkoutError'));
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: error.message || t('cart.checkoutError'), life: 3000 });
  }
};

const selectTab = (tab) => {
  selectedTab.value = tab;
};

// Initialize
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

// ⭐️ إضافة CSS لإلغاء أسهم حقل الإدخال
.quantity-input {
  // لإخفاء الأسهم في متصفح كروم (Chrome), سفاري (Safari), وإيدج (Edge)
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  // لإخفاء الأسهم في متصفح فايرفوكس (Firefox)
  &[type='number'] {
    -moz-appearance: textfield;
  }
}
</style>
