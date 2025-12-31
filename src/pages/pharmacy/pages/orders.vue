<template>
  <div class="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-4 sm:p-6 md:p-8 font-sans" dir="rtl">
    <div class="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {{ t('orders.title') }}
        </h2>
        <button
          @click="fetchOrders"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('refresh') }}
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-16">
        <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="4" class="text-indigo-500" />
      </div>

      <div v-else-if="!loading && orders.length === 0" class="text-center py-16">
        <svg class="mx-auto w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 3h18M3 3v18M3 3l18 18M3 21h18M3 21l18-18" />
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
                    'px-3 py-1 text-xs font-semibold rounded-full  capitalize',
                    {
                      'bg-green-500': order.status_description === 'delivered' || order.status_description === 'مدفوع',
                      'bg-red-500': order.status_description === 'cancelled' || order.status_description === 'ملغى',
                      'bg-blue-500': order.status_description === 'reverted' || order.status_description === 'مرتجع',
                      'bg-yellow-500': order.status_description === 'pending' || order.status_description === 'معلق'
                    }
                  ]"
                >
                  {{ t(`${order.status_description}`) || order.status_description }}
                </span>
                <span class="text-sm font-bold text-gray-900 hidden lg:inline text-right">{{ order.total_price }} ج.م</span>
                <button
                  @click.stop="revertToCart(order.id)"
                  class="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                  :disabled="revertLoading[order.id]"
                >
                  <svg v-if="revertLoading[order.id]" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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
            <div v-else-if="orderDetails[order.id]?.data" class="p-6 bg-gray-50 rounded-lg space-y-8">
              <!-- Order Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-3">
                  <p><strong class="text-gray-900">{{ t('orders.id') }}:</strong> {{ orderDetails[order.id].data.number }}</p>
                  <p><strong class="text-gray-900">{{ t('orders.date') }}:</strong> {{ formatDate(orderDetails[order.id].data.created_at) }}</p>
                  <p><strong class="text-gray-900">{{ t('orders.pharmacy') }}:</strong> {{ orderDetails[order.id].data.pharmacy.name }}</p>
                  <p><strong class="text-gray-900">{{ t('orders.warehouse') }}:</strong> {{ orderDetails[order.id].data.warehouse.name }}</p>
                </div>
                <div class="space-y-3">
                  <p><strong class="text-gray-900">{{ t('orders.totalPrice') }}:</strong> <span class="font-bold text-indigo-600">{{ orderDetails[order.id].data.total_price }} ج.م</span></p>
                  <p><strong class="text-gray-900">{{ t('orders.totalDiscounts') }}:</strong> {{ orderDetails[order.id].data.total_discounts }} ج.م</p>
                  <p><strong class="text-gray-900">{{ t('orders.delivery') }}:</strong> {{ orderDetails[order.id].data.delivery }} ج.م</p>
                  <p>
                    <Tag :value="orderDetails[order.id].data.status_description" :severity="getStatusSeverity(orderDetails[order.id].data.status_description)" class="ml-2" />
                  </p>
                </div>
              </div>

              <hr class="border-gray-200" />

              <!-- General Order Comments Section -->
              <div class="bg-white rounded-xl p-6 shadow-sm border">


                <!-- Existing Order Comments -->
                <div v-if="orderDetails[order.id].data.comments?.length" class="space-y-4 mb-6">
                  <div
                    v-for="comment in orderDetails[order.id].data.comments"
                    :key="comment.id"
                    :class="[
                      'p-4 rounded-lg shadow-sm flex justify-between items-start',
                      comment.is_you ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
                    ]"
                  >
                    <div class="flex-1">
                      <p class="font-medium text-gray-800 mb-1">{{ comment.body }}</p>
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-500">
                          {{ comment.is_you ? t('orders.you') : t('orders.warehouseUser') }}
                        </span>
                        <span class="text-gray-400">{{ formatDate(comment.created_at) }}</span>
                      </div>
                    </div>
                    <div class="flex-shrink-0 ml-3">
                      <Tag v-if="comment.is_you" value="أنت" severity="info" class="text-xs" />
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-gray-500 py-8 bg-gray-100 rounded-lg">
                  <i class="pi pi-comments text-4xl mb-3 text-gray-300"></i>
                  <p>{{ t('orders.noOrderComments') }}</p>
                </div>

                <!-- Add New Order Comment -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <h4 class="text-lg font-semibold text-gray-700 mb-3">{{ t('orders.addOrderComment') }}</h4>
                  <Textarea
                    v-model="newComment[order.id]"
                    :placeholder="t('orders.orderCommentPlaceholder')"
                    rows="3"
                    class="w-full"
                    autoResize
                  />
                </div>
              </div>

              <hr class="border-gray-200" />

              <!-- Items Table with Comments -->
              <div class="bg-white rounded-xl p-6 shadow-sm border">
                <h3 class="text-xl font-semibold text-gray-900 mb-6">{{ t('orders.items') }}</h3>

                <!-- Items Summary -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-600">
                    {{ t('orders.totalItems') }}: {{ orderDetails[order.id].data.items?.length || 0 }}
                  </p>
                </div>

                <!-- Items Table -->
                <DataTable
                  :value="orderDetails[order.id].data.items"
                  responsiveLayout="scroll"
                  class="p-datatable-sm"
                  stripedRows
                >
                  <Column field="product.commercial_name" header="اسم المنتج" />
                  <Column field="quantity" header="الكمية">
                    <template #body="{ data }">
                      <span :class="{ 'text-green-600 font-bold': data.is_gift }">
                        {{ data.quantity }} {{ data.is_gift ? '(هدية)' : '' }}
                      </span>
                    </template>
                  </Column>
                  <Column field="original_price" header="سعر الوحدة" />
                  <Column field="total_discounts" header="الخصومات" />
                  <Column field="total_price" header="الإجمالي" />

                  <!-- Item Comments Column -->
                  <Column header="التعليقات" style="width: 300px">
                    <template #body="{ data }">
                      <!-- Existing Item Comments -->
                      <div v-if="data.comments?.length" class="space-y-2 mb-3">
                        <div
                          v-for="comment in data.comments"
                          :key="comment.id"
                          :class="[
                            'p-2 rounded text-xs shadow-sm',
                            comment.is_you ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
                          ]"
                        >
                          <p class="font-medium text-gray-800 mb-1">{{ comment.body }}</p>
                          <div class="flex items-center justify-between">
                            <span class="text-gray-500 text-xs">
                              {{ comment.is_you ? t('orders.you') : t('orders.pharmacyUser') }}
                            </span>
                            <span class="text-gray-400 text-xs">{{ formatDate(comment.created_at) }}</span>
                          </div>
                          <Tag v-if="comment.is_you" value="أنت" severity="info" size="small" class="text-xs mt-1" />
                        </div>
                      </div>
                      <div v-else class="text-xs text-gray-500 py-2">لا توجد تعليقات</div>

                      <!-- Add New Item Comment -->
                      <div class="mt-2">
                        <Textarea
                          v-model="itemNewComment[data.id]"
                          :placeholder="t('orders.itemCommentPlaceholder')"
                          rows="2"
                          class="w-full text-sm"
                          autoResize
                        />
                      </div>
                    </template>
                  </Column>
                </DataTable>
              </div>

              <!-- Send All Comments Button -->
              <div class="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <Button
                  :label="t('orders.sendAllComments')"
                  icon="pi pi-send"
                  iconPos="left"
                  class="p-button-lg p-button-success"
                  :loading="sendAllLoading[order.id]"
                  :disabled="sendAllLoading[order.id] || !hasAnyComment(order.id)"
                  @click="sendAllComments(order.id)"
                />
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
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          :rowsPerPageOptions="[10, 20, 50]"
          class="bg-white p-4 rounded-lg shadow-sm"
        />
      </div>

      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import Paginator from 'primevue/paginator';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';

const { t } = useI18n({ missingWarn: false, fallbackWarn: false });
const toast = useToast();

// State
const orders = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const totalRecords = ref(0);
const orderDetails = ref({});
const activeAccordion = ref(null);

// Comment inputs
const newComment = ref({});        // order-level comment
const itemNewComment = ref({});    // per item comment
const sendAllLoading = ref({});    // loading per order
const revertLoading = ref({});

// Status severity helper
const getStatusSeverity = (status) => {
  const s = status?.toLowerCase();
  if (s.includes('pending') || s.includes('معلق') || s.includes('مرتجع')) return 'warning';
  if (s.includes('completed') || s.includes('delivered') || s.includes('مدفوع')) return 'success';
  if (s.includes('cancelled') || s.includes('ملغى')) return 'danger';
  if (s.includes('reverted')) return 'info';
  return 'secondary';
};

// Fetch orders
const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/order?page=${currentPage.value}&limit=${rowsPerPage.value}`);
    if (response.data.success) {
      orders.value = response.data.data;
      totalRecords.value = response.data.pagination?.total || orders.value.length;
      rowsPerPage.value = response.data.pagination?.per_page || rowsPerPage.value;
      currentPage.value = response.data.pagination?.current_page || currentPage.value;

      // Reset details
      orderDetails.value = {};
      newComment.value = {};
      itemNewComment.value = {};
      sendAllLoading.value = {};
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('orders.fetchError'), life: 3000 });
  } finally {
    loading.value = false;
  }
};

// Fetch order details
const fetchOrderDetails = async (index, orderId) => {
  if (orderDetails.value[orderId]?.data) return;

  orderDetails.value[orderId] = { loading: true };
  try {
    const response = await axios.get(`/api/order/${orderId}`);
    if (response.data.success) {
      const data = response.data.data;

      // Ensure items have comments array
      data.items = data.items.map(item => ({
        ...item,
        comments: item.comments || []
      }));

      // Ensure order has comments array
      data.comments = data.comments || [];

      orderDetails.value[orderId] = { loading: false, data, error: false };

      // Initialize comment fields
      if (!newComment.value[orderId]) newComment.value[orderId] = '';
      data.items.forEach(item => {
        if (!itemNewComment.value[item.id]) itemNewComment.value[item.id] = '';
      });
    }
  } catch (error) {
    orderDetails.value[orderId] = { loading: false, error: true };
    toast.add({ severity: 'error', summary: t('error'), detail: t('orders.detailsError'), life: 3000 });
  }
};

// Check if any comment exists for this order
const hasAnyComment = (orderId) => {
  if (newComment.value[orderId]?.trim()) return true;
  const items = orderDetails.value[orderId]?.data?.items || [];
  return items.some(item => itemNewComment.value[item.id]?.trim());
};

// Send all comments in one request
const sendAllComments = async (orderId) => {
  if (!hasAnyComment(orderId)) {
    toast.add({
      severity: 'warn',
      summary: 'تحذير',
      detail: 'لا توجد تعليقات لإرسالها',
      life: 3000
    });
    return;
  }

  sendAllLoading.value[orderId] = true;
  const commentsPayload = [];

  // Add order-level comment
  if (newComment.value[orderId]?.trim()) {
    commentsPayload.push({ body: newComment.value[orderId].trim() });
  }

  // Add item-level comments
  const items = orderDetails.value[orderId].data.items;
  items.forEach(item => {
    if (itemNewComment.value[item.id]?.trim()) {
      commentsPayload.push({
        order_item_id: item.id,
        body: itemNewComment.value[item.id].trim()
      });
    }
  });

  try {
    const response = await axios.post(`/api/order/comments/${orderId}`, {
      comments: commentsPayload
    });

    if (response.data.success) {
      // Update comments locally
      const newComments = response.data.data?.comments || [];
      newComments.forEach(c => {
        if (c.order_item_id) {
          // Item comment
          const item = items.find(i => i.id === c.order_item_id);
          if (item) {
            item.comments.push({ ...c, is_you: true });
          }
        } else {
          // Order comment
          orderDetails.value[orderId].data.comments.push({ ...c, is_you: true });
        }
      });

      // Clear inputs
      newComment.value[orderId] = '';
      items.forEach(item => {
        itemNewComment.value[item.id] = '';
      });

      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('orders.commentsSentSuccess'),
        life: 3000
      });
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('orders.commentsSendError'),
      life: 3000
    });
    console.error('Send all comments error:', error);
  } finally {
    sendAllLoading.value[orderId] = false;
  }
};

// Revert to cart
const revertToCart = async (orderId) => {
  if (revertLoading.value[orderId]) return;

  revertLoading.value[orderId] = true;
  try {
    await axios.post(`/api/order/revert/${orderId}`);
    toast.add({ severity: 'success', summary: t('success'), detail: t('orders.revertSuccess'), life: 3000 });
    fetchOrders();
  } catch (error) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('orders.revertError'), life: 3000 });
  } finally {
    revertLoading.value[orderId] = false;
  }
};

// Pagination
const onPageChange = (event) => {
  currentPage.value = event.page + 1;
  rowsPerPage.value = event.rows;
  activeAccordion.value = null;
  fetchOrders();
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return t('orders.invalidDate');
  const date = new Date(dateString);
  return date.toLocaleDateString(t('locale') === 'ar' ? 'ar-EG' : 'en-US', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// Load on mount
fetchOrders();
</script>

<style scoped lang="scss">
:deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
  padding: 0;
}
:deep(.p-accordion .p-accordion-content) {
  padding: 0;
  background: transparent;
  border: none;
}
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: right !important;
}
:deep(.p-datatable .p-datatable-thead > tr > th) {
  text-align: right !important;
}
</style>
