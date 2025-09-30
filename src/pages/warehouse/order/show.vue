<script setup>
import { useToast } from 'primevue/usetoast'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

// PrimeVue and Vue setup
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const loading = ref(true)
const invoiceLoading = ref(false)
const order = ref(null)
const comment = ref('')
const submitting = ref(false)
const showInvoiceDialog = ref(false)
const itemComments = ref({}) // Store comments for each item
const itemSubmitting = ref({}) // Track submitting state for each item
const expandedRows = ref([]) // State for row expansion 💡 New variable for expanded items

// Status severity mapping for Tag component
const getStatusSeverity = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning'
    case 'completed':
    case 'paid':
      return 'success'
    case 'cancelled':
      return 'danger'
    case 'unpaid':
      return 'warning'
    default:
      return 'info'
  }
}

// Fetch order details, including item comments
const fetchOrder = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/order/${route.params.id}`)
    order.value = response.data.data
    // Initialize itemComments and itemSubmitting for each item
    order.value.items.forEach(item => {
      // Ensure existing data is preserved or re-initialized if order data is refreshed
      if (!itemComments.value[item.id]) {
        itemComments.value[item.id] = ''
      }
      if (!itemSubmitting.value[item.id]) {
        itemSubmitting.value[item.id] = false
      }
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('order.loadError'),
      life: 3000
    })
    console.error('Error fetching order:', error)
  } finally {
    loading.value = false
  }
}

// Add a comment for the order
const addComment = async () => {
  if (!comment.value.trim()) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('order.commentEmpty'),
      life: 3000
    })
    return
  }

  submitting.value = true
  try {
    await axios.post(`/api/order/comment/${route.params.id}`, { body: comment.value })
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('order.commentSuccess'),
      life: 3000
    })
    comment.value = ''
    await fetchOrder() // Refresh order to get updated comments
  } catch (error) {
    const message = error.response?.data?.message || t('order.commentError')
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: message,
      life: 3000
    })
    console.error('Error adding comment:', error)
  } finally {
    submitting.value = false
  }
}

// Add a comment for a specific item
const addItemComment = async (itemId) => {
  if (!itemComments.value[itemId]?.trim()) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('order.commentEmpty'),
      life: 3000
    })
    return
  }

  itemSubmitting.value[itemId] = true
  try {
    await axios.post(`/api/order/item/comment/${itemId}`, { body: itemComments.value[itemId] })
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('order.itemCommentSuccess'),
      life: 3000
    })
    itemComments.value[itemId] = ''
    await fetchOrder() // Refresh order to get updated item comments
  } catch (error) {
    const message = error.response?.data?.message || t('order.itemCommentError')
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: message,
      life: 3000
    })
    console.error('Error adding item comment:', error)
  } finally {
    itemSubmitting.value[itemId] = false
  }
}

// Create invoice
const createInvoice = async () => {
  invoiceLoading.value = true
  try {
    await axios.post('/api/invoice', {
      order_id: route.params.id
    })
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('order.invoiceCreated'),
      life: 3000
    })
    await fetchOrder() // Refresh order to get updated invoice data
  } catch (error) {
    const message = error.response?.data?.message || t('order.invoiceError')
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: message,
      life: 3000
    })
    console.error('Error creating invoice:', error)
  } finally {
    invoiceLoading.value = false
  }
}

// Show invoice dialog
const openInvoiceDialog = () => {
  showInvoiceDialog.value = true
}

onMounted(() => {
  fetchOrder()
})
</script>

<template>
  <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
    <div class="container mx-auto">
      <div class="bg-white shadow-2xl rounded-2xl p-6 lg:p-10">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b-2 border-gray-200">
          <h1 class="text-3xl font-extrabold text-gray-800">
            {{ t('order.detailsTitle') }} <span class="text-indigo-600">#{{ order?.number || '...' }}</span>
          </h1>
          <div class="flex flex-col md:flex-row space-y-4 md:space-y-0">
            <Button
              :label="t('order.back')"
              icon="pi pi-arrow-left"
              class="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              :disabled="loading || invoiceLoading"
              @click="router.push({ name: 'order_list' })"
            />
            <Button
              v-if="order?.invoice"
              :label="t('order.viewInvoice')"
              icon="pi pi-file"
              class="px-6 py-2 rounded-full mx-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              :disabled="loading || invoiceLoading"
              @click="openInvoiceDialog"
            />
            <Button
              v-else
              :label="t('order.createInvoice')"
              icon="pi pi-file"
              class="px-6 py-2 rounded-full mx-2 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
              :loading="invoiceLoading"
              :disabled="loading || invoiceLoading"
              @click="createInvoice"
            />
          </div>
        </div>

        <Toast />

        <div v-if="loading" class="flex items-center justify-center h-64">
          <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="4" class="text-indigo-600" />
        </div>

        <div v-else-if="order" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl shadow-inner">
            <div class="space-y-4">
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('order.orderNumber') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ order.number }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('order.pharmacy') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ order.pharmacy?.name || '-' }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('order.warehouse') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ order.warehouse?.name || '-' }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('order.notes') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ order.notes || '-' }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('order.status') }}</label>
                <Tag :value="order.status_description" :severity="getStatusSeverity(order.status_description)" class="px-3 py-1 text-sm font-semibold rounded-full" />
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('order.originalPrice') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ order.original_price }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('order.delivery') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ order.delivery }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('order.totalDiscounts') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ order.total_discounts }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('order.totalPrice') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ order.total_price }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('order.createdAt') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ order.created_at }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 class="text-2xl font-bold text-gray-800 mb-4">{{ t('order.items') }}</h3>
            <DataTable
              :value="order.items"
              :loading="loading"
              data-key="id"
              v-model:expandedRows="expandedRows"
              responsive-layout="scroll"
              class="rounded-lg overflow-hidden border border-gray-200"
            >
              <Column :expander="true" header-style="width: 3rem" /> <Column field="product.commercial_name" :header="t('order.itemName')" header-style="width:30%;" />
              <Column field="quantity" :header="t('order.quantity')" header-style="width:20%;" />
              <Column field="original_price" :header="t('order.price')" header-style="width:20%;" />
              <Column field="total_price" :header="t('order.total')" header-style="width:20%;" />

              <template #expansion="{ data }">
                <div class="p-4 bg-gray-100 border-t border-gray-200">
                  <h4 class="text-xl font-semibold text-gray-700 mb-4">{{ t('order.itemComments') }} for {{ data.product.commercial_name }}</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 class="font-medium text-gray-600 mb-2">{{ t('order.existingComments') }} ({{ data.comments?.length || 0 }})</h5>
                      <div v-if="data.comments?.length" class="bg-white rounded-lg shadow-md divide-y divide-gray-200 border border-gray-200 max-h-60 overflow-y-auto">
                        <div v-for="comment in data.comments" :key="comment.id" class="p-3">
                          <div class="flex items-center justify-between mb-1">
                            <p class="m-0 text-gray-800 text-sm font-medium leading-snug">{{ comment.body }}</p>
                            <Tag v-if="comment.is_you" :value="t('order.you')" severity="info" class="ml-2 bg-indigo-100 text-indigo-800 rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0" />
                          </div>
                          <small class="text-gray-500 text-xs block mt-1">{{ comment.created_at }}</small>
                        </div>
                      </div>
                      <div v-else class="text-center p-4 text-gray-500 text-sm bg-white rounded-lg shadow-inner border border-gray-200">
                        <i class="pi pi-comment text-lg mb-1" />
                        <p>{{ t('order.noItemComments') }}</p>
                      </div>
                    </div>

                    <div>
                      <h5 class="font-medium text-gray-600 mb-2">{{ t('order.addItemComment') }}</h5>
                      <div class="space-y-3 p-3 bg-white rounded-lg shadow-md border border-gray-200">
                        <Textarea
                          v-model="itemComments[data.id]"
                          :placeholder="t('order.itemCommentPlaceholder')"
                          :disabled="itemSubmitting[data.id]"
                          rows="3"
                          class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          autoResize
                        />
                        <Button
                          :label="t('order.submitComment')"
                          icon="pi pi-check"
                          class="px-4 py-1 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200"
                          :disabled="itemSubmitting[data.id] || !itemComments[data.id]?.trim()"
                          :loading="itemSubmitting[data.id]"
                          @click="addItemComment(data.id)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <template #empty>
                <div class="py-10 text-center text-gray-500">
                  <i class="pi pi-exclamation-circle text-4xl mb-2" />
                  <p class="text-lg">{{ t('order.noItems') }}</p>
                </div>
              </template>
            </DataTable>
          </div>

          <div class="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 class="text-2xl font-bold text-gray-800 mb-4">{{ t('order.comments') }}</h3>
            <div v-if="order.comments?.length" class="bg-white rounded-lg shadow-md divide-y divide-gray-200">
              <div v-for="comment in order.comments" :key="comment.id" class="p-4">
                <div class="flex items-center justify-between mb-1">
                  <p class="m-0 text-gray-800">{{ comment.body }}</p>
                  <Tag v-if="comment.is_you" :value="t('order.you')" severity="info" class="ml-2 bg-indigo-100 text-indigo-800 rounded-full px-2 py-0.5 text-xs font-medium" />
                </div>
                <small class="text-gray-500">{{ comment.created_at }}</small>
              </div>
            </div>
            <div v-else class="py-10 text-center text-gray-500">
              <i class="pi pi-comment text-4xl mb-2" />
              <p class="text-lg">{{ t('order.noComments') }}</p>
            </div>

            <div class="mt-6">
              <h4 class="text-xl font-bold text-gray-800 mb-3">{{ t('order.addComment') }}</h4>
              <div class="space-y-4">
                <Textarea
                  v-model="comment"
                  :placeholder="t('order.commentPlaceholder')"
                  :disabled="submitting"
                  rows="4"
                  class="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  autoResize
                />
                <Button
                  :label="t('order.submitComment')"
                  icon="pi pi-check"
                  class="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200"
                  :disabled="submitting || !comment.trim()"
                  :loading="submitting"
                  @click="addComment"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="py-20 text-center text-gray-500">
          <i class="pi pi-exclamation-circle text-6xl mb-4" />
          <p class="text-2xl font-semibold">{{ t('order.notFound') }}</p>
        </div>

        <Dialog
          v-model:visible="showInvoiceDialog"
          :header="t('order.invoiceDetails')"
          :modal="true"
          :style="{ width: '50vw' }"
          class="rounded-lg"
          :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
        >
          <div v-if="order?.invoice" class="space-y-6 p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('order.invoiceNumber') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ order.invoice.number }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('order.invoiceStatus') }}</label>
                  <Tag
                    :value="order.invoice.status_description"
                    :severity="getStatusSeverity(order.invoice.status_description)"
                    class="px-3 py-1 text-sm font-semibold rounded-full"
                  />
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('order.originalPrice') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ order.invoice.original_price }}</p>
                </div>
              </div>
              <div class="space-y-4">
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('order.delivery') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ order.invoice.delivery }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('order.totalDiscounts') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ order.invoice.total_discounts }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('order.totalPrice') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ order.invoice.total_price }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('order.totalPaid') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ order.invoice.total_paid }}</p>
                </div>
              </div>
            </div>
          </div>
          <template #footer>
            <Button
              :label="t('order.close')"
              icon="pi pi-times"
              class="p-button-text p-button-secondary"
              @click="showInvoiceDialog = false"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * Keep empty as Tailwind handles most styling.
 * Used for custom non-Tailwind styles if needed.
 */
</style>
