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
const invoice = ref(null)
const showInvoiceDialog = ref(false)
const showPaymentDialog = ref(false)
const paymentAmount = ref('')
const paymentLoading = ref(false)

// Status severity mapping for Tag component (PrimeVue)
const getStatusSeverity = (status) => {
  switch (status?.toLowerCase()) {
    case 'unpaid':
      return 'warning'
    case 'paid':
      return 'success'
    case 'cancelled':
      return 'danger'
    default:
      return 'info'
  }
}

// Fetch invoice details
const fetchInvoice = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/invoice/${route.params.id}`)
    invoice.value = response.data.data
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('invoice.loadError'),
      life: 3000
    })
    console.error('Error fetching invoice:', error)
  } finally {
    loading.value = false
  }
}

// Process payment
const processPayment = async () => {
  if (!paymentAmount.value || isNaN(paymentAmount.value) || paymentAmount.value <= 0) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('invoice.invalidAmount'),
      life: 3000
    })
    return
  }

  paymentLoading.value = true
  try {
    await axios.post(`/api/invoice/pay/${route.params.id}`, {
      amount: Number(paymentAmount.value)
    })
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('invoice.paymentSuccess'),
      life: 3000
    })
    showPaymentDialog.value = false
    paymentAmount.value = ''
    await fetchInvoice() // Refresh invoice data
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('invoice.paymentError'),
      life: 3000
    })
    console.error('Error processing payment:', error)
  } finally {
    paymentLoading.value = false
  }
}

// Print invoice
const printInvoice = () => {
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>${t('invoice.printTitle')} #${invoice.value?.number || ''}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          .invoice-header { text-align: center; margin-bottom: 20px; }
          .invoice-details { margin-bottom: 20px; }
          .invoice-details p { margin: 5px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f4f4f4; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <h1>${t('invoice.printTitle')} #${invoice.value?.number || ''}</h1>
          </div>
          <div class="invoice-details">
            <p><strong>${t('invoice.pharmacy')}:</strong> ${invoice.value?.pharmacy?.name || '-'}</p>
            <p><strong>${t('invoice.warehouse')}:</strong> ${invoice.value?.warehouse?.name || '-'}</p>
            <p><strong>${t('invoice.status')}:</strong> ${invoice.value?.status_description || '-'}</p>
            <p><strong>${t('invoice.originalPrice')}:</strong> ${invoice.value?.original_price || '-'}</p>
            <p><strong>${t('invoice.delivery')}:</strong> ${invoice.value?.delivery || '-'}</p>
            <p><strong>${t('invoice.totalDiscounts')}:</strong> ${invoice.value?.total_discounts || '-'}</p>
            <p><strong>${t('invoice.totalPrice')}:</strong> ${invoice.value?.total_price || '-'}</p>
            <p><strong>${t('invoice.totalPaid')}:</strong> ${invoice.value?.total_paid || '-'}</p>
            <p><strong>${t('invoice.createdAt')}:</strong> ${invoice.value?.created_at || '-'}</p>
          </div>
          <table class="items-table">
            <thead>
              <tr>
                <th>${t('invoice.itemName')}</th>
                <th>${t('invoice.quantity')}</th>
                <th>${t('invoice.price')}</th>
                <th>${t('invoice.total')}</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.value?.items?.map(item => `
                <tr>
                  <td>${item.product?.commercial_name || '-'}</td>
                  <td>${item.quantity || '-'}</td>
                  <td>${item.original_price || '-'}</td>
                  <td>${item.total_price || '-'}</td>
                </tr>
              `).join('') }
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.print()
}

onMounted(() => {
  fetchInvoice()
})
</script>

<template>
  <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
    <div class="container mx-auto">
      <div class="bg-white shadow-2xl rounded-2xl p-6 lg:p-10">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b-2 border-gray-200">
          <h1 class="text-3xl font-extrabold text-gray-800">
            {{ t('invoice.detailsTitle') }} <span class="text-indigo-600">#{{ invoice?.number || '...' }}</span>
          </h1>
          <div class="flex flex-col md:flex-row ">
            <Button
              :label="t('invoice.print')"
              icon="pi pi-print"
              class="px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
              :disabled="loading || !invoice"
              @click="printInvoice"
            />
            <Button
              :label="t('invoice.viewDetails')"
              icon="pi pi-file"
              class="px-6 py-2 mx-1  rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              :disabled="loading || !invoice"
              @click="showInvoiceDialog = true"
            />
            <Button
              :label="t('invoice.pay')"
              icon="pi pi-money-bill"
              class="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
              :disabled="loading || !invoice || invoice.status_description?.toLowerCase() !== 'unpaid'"
              @click="showPaymentDialog = true"
            />
          </div>
        </div>

        <Toast />

        <div v-if="loading" class="flex items-center justify-center h-64">
          <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="4" class="text-indigo-600" />
        </div>

        <div v-else-if="invoice" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl shadow-inner">
            <div class="space-y-4">
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('invoice.invoiceNumber') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ invoice.number }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('invoice.pharmacy') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ invoice.pharmacy?.name || '-' }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('invoice.warehouse') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ invoice.warehouse?.name || '-' }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('invoice.status') }}</label>
                <Tag :value="invoice.status_description" :severity="getStatusSeverity(invoice.status_description)" class="px-3 py-1 text-sm font-semibold rounded-full" />
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('invoice.originalPrice') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ invoice.original_price }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('invoice.delivery') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ invoice.delivery }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('invoice.totalDiscounts') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ invoice.total_discounts }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('invoice.totalPrice') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ invoice.total_price }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('invoice.totalPaid') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ invoice.total_paid }}</p>
              </div>
              <div class="field">
                <label class="font-semibold text-gray-600">{{ t('invoice.createdAt') }}</label>
                <p class="text-gray-900 text-lg font-medium">{{ invoice.created_at }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 class="text-2xl font-bold text-gray-800 mb-4">{{ t('invoice.items') }}</h3>
            <DataTable
              :value="invoice.items"
              :loading="loading"
              data-key="item_id"
              responsive-layout="scroll"
              class="rounded-lg overflow-hidden border border-gray-200"
            >
              <Column field="product.commercial_name" :header="t('invoice.itemName')" header-style="width:30%;" />
              <Column field="quantity" :header="t('invoice.quantity')" header-style="width:20%;" />
              <Column field="original_price" :header="t('invoice.price')" header-style="width:20%;" />
              <Column field="total_price" :header="t('invoice.total')" header-style="width:20%;" />
              <template #empty>
                <div class="py-10 text-center text-gray-500">
                  <i class="pi pi-exclamation-circle text-4xl mb-2" />
                  <p class="text-lg">{{ t('invoice.noItems') }}</p>
                </div>
              </template>
            </DataTable>
          </div>
        </div>

        <div v-else class="py-20 text-center text-gray-500">
          <i class="pi pi-exclamation-circle text-6xl mb-4" />
          <p class="text-2xl font-semibold">{{ t('invoice.notFound') }}</p>
        </div>

        <!-- Invoice Dialog -->
        <Dialog
          v-model:visible="showInvoiceDialog"
          :header="t('invoice.detailsTitle')"
          :modal="true"
          :style="{ width: '50vw' }"
          class="rounded-lg"
          :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
        >
          <div v-if="invoice" class="space-y-6 p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('invoice.invoiceNumber') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ invoice.number }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('invoice.pharmacy') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ invoice.pharmacy?.name || '-' }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('invoice.warehouse') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ invoice.warehouse?.name || '-' }}</p>
                </div>
              </div>
              <div class="space-y-4">
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('invoice.status') }}</label>
                  <Tag
                    :value="invoice.status_description"
                    :severity="getStatusSeverity(invoice.status_description)"
                    class="px-3 py-1 text-sm font-semibold rounded-full"
                  />
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('invoice.originalPrice') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ invoice.original_price }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('invoice.delivery') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ invoice.delivery }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('invoice.totalDiscounts') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ invoice.total_discounts }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('invoice.totalPrice') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ invoice.total_price }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('invoice.totalPaid') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ invoice.total_paid }}</p>
                </div>
                <div class="field">
                  <label class="font-semibold text-gray-600">{{ t('invoice.createdAt') }}</label>
                  <p class="text-gray-900 text-lg font-medium">{{ invoice.created_at }}</p>
                </div>
              </div>
            </div>
          </div>
          <template #footer>
            <Button
              :label="t('invoice.close')"
              icon="pi pi-times"
              class="p-button-text p-button-secondary"
              @click="showInvoiceDialog = false"
            />
          </template>
        </Dialog>

        <!-- Payment Dialog -->
        <Dialog
          v-model:visible="showPaymentDialog"
          :header="t('invoice.makePayment')"
          :modal="true"
          :style="{ width: '40vw' }"
          class="rounded-lg"
          :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
        >
          <div class="space-y-6 p-4">
            <div class="field">
              <p class="font-semibold my-1 text-gray-600">{{ t('invoice.paymentAmount') }}</p>
              <InputNumber
                v-model="paymentAmount"
                mode="currency"
                currency="USD"
                locale="en-US"
                :min="0"
                class="w-full"
                :disabled="paymentLoading"
              />
            </div>
          </div>
          <template #footer>
            <Button
              :label="t('invoice.cancel')"
              icon="pi pi-times"
              class="p-button-text p-button-secondary"
              :disabled="paymentLoading"
              @click="showPaymentDialog = false; paymentAmount = ''"
            />
            <Button
              :label="t('invoice.pay')"
              icon="pi pi-check"
              class="p-button-success"
              :loading="paymentLoading"
              :disabled="!paymentAmount || paymentLoading"
              @click="processPayment"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
