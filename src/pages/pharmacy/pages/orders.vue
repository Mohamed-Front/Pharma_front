<template>
  <div class="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
    <div class="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {{ t('orders.title') }}
        </h2>
        <div class="flex items-center gap-3">
          <button
            @click="fetchOrders"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ t('refresh') }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-16">
        <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="4" class="text-indigo-500" />
      </div>

      <div v-else-if="!loading && orders.length === 0" class="text-center py-16">
        <svg class="mx-auto w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18M3 3v18M3 3l18 18M3 21h18M3 21l18-18" />
        </svg>
        <p class="mt-4 text-lg text-gray-500 font-medium">{{ t('orders.empty') }}</p>
      </div>

      <div v-else class="space-y-4">
        <Accordion :activeIndex="activeAccordion" @tab-open="fetchOrderDetails($event.index, orders[$event.index].id)">
          <AccordionTab v-for="order in orders" :key="order.id">
            <template #header>
              <div class="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-lg">
                <span class="text-sm font-semibold text-gray-900 truncate">{{ order.number }}</span>
                <span class="text-sm text-gray-600 truncate hidden sm:inline">{{ formatDate(order.created_at) }}</span>
                <span class="text-sm text-gray-600 truncate">{{ order.warehouse.name }}</span>
                <span
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full text-white capitalize',
                    {
                      'bg-green-500': order.status_description === 'delivered',
                      'bg-red-500': order.status_description === 'cancelled',
                      'bg-blue-500': order.status_description === 'reverted',
                      'bg-yellow-500': order.status_description === 'pending'
                    }
                  ]"
                >
                  {{ t(`orders.status.${order.status_description}`) }}
                </span>
                <span class="text-sm font-bold text-gray-900 hidden lg:inline text-right">{{ order.total_price }}</span>
                <button
                  @click.stop="revertToCart(order.id)"
                  class="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                  :disabled="revertLoading[order.id]"
                >
                  <svg v-if="revertLoading[order.id]" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {{ t('sell') }}
                </button>
              </div>
            </template>
            <div v-if="orderDetails[order.id]?.loading" class="flex justify-center p-6">
              <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" class="text-indigo-500" />
            </div>
            <div v-else-if="orderDetails[order.id]?.error" class="p-6 text-center text-red-600 font-medium bg-red-50 rounded-lg">
              {{ t('orders.detailsError') }}
            </div>
            <div v-else-if="orderDetails[order.id]?.data" class="p-6 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="space-y-3">
                  <p><strong class="text-gray-900">{{ t('orders.id') }}:</strong> <span class="text-gray-600">{{ orderDetails[order.id].data.number }}</span></p>
                  <p><strong class="text-gray-900">{{ t('orders.date') }}:</strong> <span class="text-gray-600">{{ formatDate(orderDetails[order.id].data.created_at) }}</span></p>
                  <p><strong class="text-gray-900">{{ t('orders.pharmacy') }}:</strong> <span class="text-gray-600">{{ orderDetails[order.id].data.pharmacy.name }}</span></p>
                </div>
                <div class="space-y-3">
                  <p><strong class="text-gray-900">{{ t('orders.totalPrice') }}:</strong> <span class="font-bold text-indigo-600">{{ orderDetails[order.id].data.total_price }}</span></p>
                  <p><strong class="text-gray-900">{{ t('orders.totalDiscounts') }}:</strong> <span class="text-gray-600">{{ orderDetails[order.id].data.total_discounts }}</span></p>
                  <p><strong class="text-gray-900">{{ t('orders.delivery') }}:</strong> <span class="text-gray-600">{{ orderDetails[order.id].data.delivery }}</span></p>
                </div>
              </div>

              <hr class="my-8 border-gray-200" />

              <div class="mb-8">
                <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ t('orders.addComment') }} ({{ t('orders.orderLevel') }})</h3>
                <div class="flex flex-col gap-4">
                  <textarea
                    v-model="newComment[order.id]"
                    :placeholder="t('orders.commentPlaceholder')"
                    class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                    rows="4"
                  ></textarea>
                  <div class="flex justify-end gap-3">
                    <button
                      @click="clearComment(order.id)"
                      class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                      :disabled="!newComment[order.id] || commentLoading[order.id]"
                    >
                      {{ t('orders.clear') }}
                    </button>
                    <button
                      @click="submitComment(order.id)"
                      class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
                      :disabled="!newComment[order.id] || commentLoading[order.id]"
                    >
                      <svg v-if="commentLoading[order.id]" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {{ t('orders.submitComment') }}
                    </button>
                  </div>
                </div>
              </div>

              <hr class="my-8 border-gray-200" />

              <div class="mb-8">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t('orders.comments') }} ({{ t('orders.orderLevel') }})</h3>
                <div v-if="orderDetails[order.id].data.comments.length === 0" class="text-gray-500 text-center py-2 bg-gray-100 rounded-lg">
                  {{ t('orders.noComments') }}
                </div>
                <div v-else class="space-y-4">
                  <div
                    v-for="comment in orderDetails[order.id].data.comments"
                    :key="comment.id"
                    :class="[
                      'p-4 rounded-lg shadow-sm transition-all duration-200',
                      comment.is_you ? 'bg-indigo-50 hover:bg-indigo-100' : 'bg-gray-100 hover:bg-gray-200'
                    ]"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <p class="font-semibold text-sm" :class="comment.is_you ? 'text-indigo-700' : 'text-gray-700'">
                        {{ comment.is_you ? t('orders.you') : orderDetails[order.id].data.warehouse.name }}
                      </p>
                      <p class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</p>
                    </div>
                    <p class="text-gray-800">{{ comment.body }}</p>
                  </div>
                </div>
              </div>

              <hr class="my-8 border-gray-200" />

              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t('orders.items') }}</h3>
                <div v-if="orderDetails[order.id].data.items.length === 0" class="text-gray-500 text-center py-2 bg-gray-100 rounded-lg">
                  {{ t('orders.noItems') }}
                </div>
                <div v-else class="overflow-x-auto border border-gray-200 rounded-lg shadow-md">
                  <table class="w-full table-auto border-collapse ">
                    <thead>
                      <tr class="bg-gray-200 text-gray-700 text-left rtl:text-right text-sm">
                        <th class="p-4 font-semibold w-1/4">{{ t('orders.itemsProduct') }}</th>
                        <th class="p-4 font-semibold w-1/12">{{ t('orders.itemsQuantity') }}</th>
                        <th class="p-4 font-semibold w-1/12">{{ t('orders.itemsOriginalPrice') }}</th>
                        <th class="p-4 font-semibold w-1/12">{{ t('orders.itemsTotalDiscounts') }}</th>
                        <th class="p-4 font-semibold w-1/12">{{ t('orders.itemsTotalPrice') }}</th>
                        <th class="p-4 font-semibold w-1/4 text-center">{{ t('orders.itemCommentAction') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="item in orderDetails[order.id].data.items" :key="item.id">
                        <tr
                          @click="toggleItemComment(item.id)"
                          class="border-b border-gray-100 transition-colors duration-200 cursor-pointer"
                          :class="itemExpanded === item.id ? 'bg-indigo-100/50 hover:bg-indigo-100' : 'hover:bg-gray-50'"
                        >
                          <td class="p-4 text-gray-700 font-medium">{{ item.product.commercial_name }}</td>
                          <td class="p-4 text-gray-600 ">{{ item.quantity }}</td>
                          <td class="p-4 text-gray-600 ">{{ item.original_price }}</td>
                          <td class="p-4 text-gray-600 ">{{ item.total_discounts }}</td>
                          <td class="p-4 text-indigo-600 font-bold ">{{ item.total_price }}</td>
                          <td class="p-4 text-center">
                            <button class="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 mx-auto">
                              <svg class="w-4 h-4 transform transition-transform duration-200"
                                :class="{ 'rotate-180': itemExpanded === item.id }"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                              {{ itemExpanded === item.id ? t('orders.hideComments') : t('orders.viewComments') }}
                              <span class="ml-1 text-xs px-2 py-0.5 bg-indigo-200 text-indigo-800 rounded-full">{{ item.comments?.length || 0 }}</span>
                            </button>
                          </td>
                        </tr>
                        <tr v-if="itemExpanded === item.id">
                          <td :colspan="6" class="p-4 bg-white/90 border-t border-indigo-200">
                            <div class="p-4 space-y-6">
                              <div class="space-y-3">
                                <h4 class="font-semibold text-gray-800">{{ t('orders.existingItemComments') }}</h4>
                                <div v-if="!item.comments || item.comments.length === 0" class="text-gray-500 text-center py-3 bg-gray-50 rounded-lg">
                                  {{ t('orders.noItemComments') }}
                                </div>
                                <div v-else class="space-y-2 max-h-48 overflow-y-auto pr-2">
                                  <div v-for="comment in item.comments" :key="comment.id"
                                    :class="[
                                      'p-3 rounded-lg shadow-xs',
                                      comment.is_you ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-100 border border-gray-200'
                                    ]"
                                  >
                                    <div class="flex items-center justify-between text-xs mb-1">
                                      <span class="font-medium" :class="comment.is_you ? 'text-indigo-700' : 'text-gray-700'">
                                        {{ comment.is_you ? t('orders.you') : orderDetails[order.id].data.warehouse.name }}
                                      </span>
                                      <span class="text-gray-500">{{ formatDate(comment.created_at) }}</span>
                                    </div>
                                    <p class="text-sm text-gray-800">{{ comment.body }}</p>
                                  </div>
                                </div>
                              </div>

                              <div class="pt-4 border-t border-gray-200">
                                <h4 class="font-semibold text-gray-800 mb-2">{{ t('orders.addItemComment') }}</h4>
                                <div class="flex flex-col gap-3">
                                  <textarea
                                    v-model="itemNewComment[item.id]"
                                    :placeholder="t('orders.itemCommentPlaceholder')"
                                    class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                                    rows="3"
                                  ></textarea>
                                  <div class="flex justify-end">
                                    <button
                                      @click="submitItemComment(order.id, item.id)"
                                      class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
                                      :disabled="!itemNewComment[item.id] || itemCommentLoading[item.id]"
                                    >
                                      <svg v-if="itemCommentLoading[item.id]" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                      {{ t('orders.submitComment') }}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>

      <div v-if="orders.length > 0" class="mt-8">
        <Paginator
          :rows="rowsPerPage"
          :totalRecords="totalRecords"
          :first="(currentPage - 1) * rowsPerPage"
          @page="onPageChange"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown "
          :rowsPerPageOptions="[10, 20, 50]"
          class="bg-white p-4 rounded-lg shadow-sm"
        />
      </div>

      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import Paginator from 'primevue/paginator';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

// Localization and toast
const { t } = useI18n({ missingWarn: false, fallbackWarn: false });
const toast = useToast();

// Reactive state
const orders = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const totalRecords = ref(0);
const orderDetails = ref({});
const activeAccordion = ref(null);
const newComment = ref({});
const commentLoading = ref({});
const revertLoading = ref({});

// State for Item Comments
const itemExpanded = ref(null); // ID of the currently expanded item row for comments
const itemNewComment = ref({}); // Stores new comment text for each item ID
const itemCommentLoading = ref({}); // Loading state for item comment submission

// Helper function to find an item by ID
const getItemById = (orderData, itemId) => {
    return orderData.items.find(item => item.id === itemId);
};

// Toggle item comment section visibility
const toggleItemComment = (itemId) => {
    itemExpanded.value = itemExpanded.value === itemId ? null : itemId;
};


// Fetch orders list from API
const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/order?page=${currentPage.value}&limit=${rowsPerPage.value}`);
    if (response.data.success && response.data.data) {
      orders.value = response.data.data;
      // Use nullish coalescing to safely get pagination or fallback
      totalRecords.value = response.data.pagination?.total || orders.value.length;
      rowsPerPage.value = response.data.pagination?.per_page || rowsPerPage.value;
      currentPage.value = response.data.pagination?.current_page || currentPage.value;

      // Reset details and input fields on new fetch
      orderDetails.value = {};
      newComment.value = {};
      commentLoading.value = {};
      revertLoading.value = {};
      itemExpanded.value = null;
      itemNewComment.value = {}; // Reset item comment inputs
    } else {
      orders.value = [];
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('orders.empty'),
        life: 3000,
      });
    }
  } catch (error) {
    orders.value = [];
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('orders.fetchError'),
      life: 3000,
    });
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false;
  }
};

// Fetch individual order details
const fetchOrderDetails = async (index, orderId) => {
  if (orderDetails.value[orderId]?.data) return;
  orderDetails.value[orderId] = { loading: true, data: null, error: false };
  try {
    const response = await axios.get(`/api/order/${orderId}`);
    if (response.data.success && response.data.data) {
      // Ensure the comments array exists on each item, even if empty
      const orderData = response.data.data;
      orderData.items = orderData.items.map(item => ({
          ...item,
          comments: item.comments || []
      }));

      orderDetails.value[orderId] = { loading: false, data: orderData, error: false };

      // Initialize item comment fields
      orderData.items.forEach(item => {
          if (!itemNewComment.value[item.id]) {
              itemNewComment.value[item.id] = '';
          }
      });
    } else {
      throw new Error('Invalid response data');
    }
  } catch (error) {
    orderDetails.value[orderId] = { loading: false, data: null, error: true };
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('orders.detailsError'),
      life: 3000,
    });
    console.error(`Error fetching order ${orderId}:`, error);
  }
};

// Revert order to cart
const revertToCart = async (orderId) => {
  revertLoading.value[orderId] = true;
  try {
    const response = await axios.post(`/api/order/revert/${orderId}`);
    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('orders.revertSuccess'),
        life: 3000,
      });
      // Refresh orders after successful revert
      await fetchOrders();
    } else {
      throw new Error('Invalid response data');
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('orders.revertError'),
      life: 3000,
    });
    console.error(`Error reverting order ${orderId} to cart:`, error);
  } finally {
    revertLoading.value[orderId] = false;
  }
};

// Submit ORDER comment
const submitComment = async (orderId) => {
  if (!newComment.value[orderId]?.trim()) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('orders.commentEmpty'), // Corrected key to commentEmpty
      life: 3000,
    });
    return;
  }

  commentLoading.value[orderId] = true;
  try {
    const response = await axios.post(`/api/order/comment/${orderId}`, {
      body: newComment.value[orderId].trim(),
    });

    if (response.data.success && response.data.data) {
      // Update comments in orderDetails
      orderDetails.value[orderId].data.comments.push({
        id: response.data.data.id,
        body: response.data.data.body,
        created_at: response.data.data.created_at || new Date().toISOString(),
        is_you: true,
      });
      newComment.value[orderId] = '';
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('orders.commentSuccess'),
        life: 3000,
      });
    } else {
      throw new Error('Invalid response data');
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('orders.commentError'),
      life: 3000,
    });
    console.error(`Error submitting comment for order ${orderId}:`, error);
  } finally {
    commentLoading.value[orderId] = false;
  }
};

// Submit ITEM comment
const submitItemComment = async (orderId, itemId) => {
  if (!itemNewComment.value[itemId]?.trim()) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('orders.commentEmpty'), // Using the same empty message for consistency
      life: 3000,
    });
    return;
  }

  itemCommentLoading.value[itemId] = true;
  try {
    const response = await axios.post(`/api/order/item/comment/${itemId}`, {
      body: itemNewComment.value[itemId].trim(),
    });

    if (response.data.success && response.data.data) {
      const orderData = orderDetails.value[orderId].data;
      const item = getItemById(orderData, itemId);

      if (item) {
          // Push the new comment object
          item.comments.push({
              id: response.data.data.id,
              body: response.data.data.body,
              created_at: response.data.data.created_at || new Date().toISOString(),
              is_you: true,
          });
      }

      itemNewComment.value[itemId] = '';
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('orders.itemCommentSuccess'),
        life: 3000,
      });
    } else {
      throw new Error('Invalid response data');
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('orders.itemCommentError'),
      life: 3000,
    });
    console.error(`Error submitting item comment for item ${itemId}:`, error);
  } finally {
    itemCommentLoading.value[itemId] = false;
  }
};

// Clear order comment input
const clearComment = (orderId) => {
  newComment.value[orderId] = '';
};

// Handle pagination page change
const onPageChange = (event) => {
  currentPage.value = event.page + 1;
  rowsPerPage.value = event.rows;
  activeAccordion.value = null;
  itemExpanded.value = null;
  fetchOrders();
};

// Format date to DD MMM YYYY
const formatDate = (dateString) => {
  if (!dateString || isNaN(Date.parse(dateString))) {
    return t('orders.invalidDate');
  }
  const date = new Date(dateString);
  // Using toLocaleDateString with options for better internationalization
  return date.toLocaleDateString(t('locale') === 'ar' ? 'ar-EG' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Initialize data
fetchOrders();
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
  padding: 0;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out;
}

:deep(.p-accordion .p-accordion-content) {
  padding: 0;
  background: transparent;
  border: none;
}

:deep(.p-paginator) {
  .p-paginator-element {

    @apply mx-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200;
  }
  .p-paginator-current {
    /* Using Tailwind classes or a specific color */
    @apply text-gray-500 bg-gray-100;
  }
  .p-paginator-icon {
    @apply w-5 h-5;
  }
  .p-Dropdown {
    @apply rounded-lg border-gray-300;
  }
}

/* Custom styling for the scrollable comments list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db; /* gray-300 */
  border-radius: 3px;
}
</style>
