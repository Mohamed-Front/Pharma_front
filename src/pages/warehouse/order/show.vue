<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
// Assuming PrimeVue components (Button, Tag, DataTable, Column, Textarea, Dialog, ProgressSpinner, Toast) are globally or locally registered.

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const loading = ref(true)
const invoiceLoading = ref(false)
const allCommentsSubmitting = ref(false)

const order = ref(null)
const comment = ref('') // General order comment
const itemComments = ref({}) // { itemId: 'text' }
const expandedRows = ref([])
const showInvoiceDialog = ref(false)

// Computed property to easily access the invoice data if it exists
const invoice = computed(() => order.value?.invoice || null)

// Check if any comment exists
const hasAnyComment = computed(() => {
  if (comment.value.trim()) return true
  return Object.values(itemComments.value).some(text => text?.trim())
})

const getStatusSeverity = (status) => {
  const s = status?.toLowerCase()
  // Adjusting for Arabic status descriptions based on your provided JSON:
  if (s && (s.includes('pending') || s.includes('مرتجع') || s.includes('معلق'))) return 'warning'
  if (s && (s.includes('completed') || s.includes('paid') || s.includes('مدفوع'))) return 'success'
  if (s && s.includes('ملغى')) return 'danger'
  if (s && s.includes('زيادة')) return 'info' // 'مدفوع زيادة'
  return 'info'
}

const fetchOrder = async () => {
  loading.value = true
  try {
    const res = await axios.get(`/api/order/${route.params.id}`)
    order.value = res.data.data

    // Initialize comment inputs for all items (paid + gifts)
    order.value.items.forEach(item => {
      if (!(item.id in itemComments.value)) {
        itemComments.value[item.id] = ''
      }
    })
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: t('error') || 'Error',
      detail: t('order.loadError') || 'Failed to load order',
      life: 4000
    })
  } finally {
    loading.value = false
  }
}

const createInvoice = async () => {
  invoiceLoading.value = true
  try {
    // API call to create the invoice
    const res = await axios.post('/api/invoice', { order_id: route.params.id })

    // CRITICAL: Update the order object with the new invoice data returned from the creation API.
    // We assume the new invoice data is directly in res.data.data.
    if (order.value && res.data.data) {
      // Ensure the key for the invoice in the order object is 'invoice' (as per your JSON structure)
      order.value.invoice = res.data.data;
    }

    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('order.invoiceCreated') || 'تم إنشاء الفاتورة بنجاح',
      life: 4000
    })

    // Open the dialog to view the newly created invoice
    openInvoiceDialog()

  } catch (err) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: err.response?.data?.message || t('order.invoiceError') || 'فشل إنشاء الفاتورة',
      life: 4000
    })
  } finally {
    invoiceLoading.value = false
  }
}

const openInvoiceDialog = () => {
  showInvoiceDialog.value = true
}

const sendAllComments = async () => {
  if (!hasAnyComment.value) {
    toast.add({
      severity: 'warn',
      summary: 'تحذير',
      detail: 'لا توجد تعليقات لإرسالها',
      life: 3000
    })
    return
  }
  allCommentsSubmitting.value = true
  const payload = { comments: [] }
  if (comment.value.trim()) {
    payload.comments.push({ body: comment.value.trim() })
  }
  Object.entries(itemComments.value).forEach(([itemId, text]) => {
    if (text?.trim()) {
      payload.comments.push({
        order_item_id: Number(itemId),
        body: text.trim()
      })
    }
  })
  try {
    await axios.post(`/api/order/comments/${route.params.id}`, payload)
    toast.add({
      severity: 'success',
      summary: 'تم بنجاح',
      detail: 'تم إرسال جميع التعليقات بنجاح',
      life: 5000
    })
    comment.value = ''
    itemComments.value = {}
    await fetchOrder()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'خطأ',
      detail: err.response?.data?.message || 'فشل إرسال التعليقات',
      life: 5000
    })
  } finally {
    allCommentsSubmitting.value = false
  }
}

onMounted(fetchOrder)
</script>

<template>
  <div class="p-6 md:p-10 bg-gray-50 min-h-screen" dir="rtl">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="text-green-800 p-8">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 class="text-3xl font-bold">
                {{ t('order.detailsTitle') }} <span class="text-yellow-300">#{{ order?.number }}</span>
              </h1>
              <p class="mt-2 text-lg opacity-90">{{ order?.pharmacy?.name }} ← {{ order?.warehouse?.name }}</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <Button :label="t('order.back')" icon="pi pi-arrow-right" @click="router.push({ name: 'order' })" />
              <Button
                v-if="order?.invoice"
                :label="t('order.viewInvoice') || 'عرض الفاتورة'"
                icon="pi pi-file-pdf"
                class="p-button-info"
                @click="openInvoiceDialog"
              />
              <Button
                v-else
                :label="t('order.createInvoice') || 'إنشاء فاتورة'"
                icon="pi pi-plus"
                class="p-button-success"
                :loading="invoiceLoading"
                @click="createInvoice"
              />
            </div>
          </div>
        </div>

        <Toast position="top-left" />

        <div v-if="loading" class="flex justify-center items-center h-96">
          <ProgressSpinner />
        </div>

        <div v-else-if="order" class="p-8 space-y-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
              <h3 class="font-bold text-xl mb-4 text-indigo-800">معلومات الطلب</h3>
              <div class="space-y-3 text-gray-800">
                <p><strong>رقم الطلب:</strong> {{ order.number }}</p>
                <p><strong>الصيدلية:</strong> {{ order.pharmacy?.name }}</p>
                <p><strong>المستودع:</strong> {{ order.warehouse?.name }}</p>
                <p><strong>الحالة:</strong>
                  <Tag :value="order.status_description" :severity="getStatusSeverity(order.status_description)" class="mr-2" />
                </p>
                <p><strong>التاريخ:</strong> {{ order.created_at }}</p>
              </div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
              <h3 class="font-bold text-xl mb-4 text-green-800">الأسعار</h3>
              <div class="space-y-3 text-gray-700">
                <p><strong>السعر الأصلي:</strong> {{ order.original_price }} {{ order.price_unit }}</p>
                <p><strong>التوصيل:</strong> {{ order.delivery }} {{ order.price_unit }}</p>
                <p><strong>الخصومات:</strong> {{ order.total_discounts }} {{ order.price_unit }}</p>
                <p class="text-2xl font-bold text-green-700"><strong>الإجمالي:</strong> {{ order.total_price }} {{ order.price_unit }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-2xl font-bold mb-6 text-gray-800">المنتجات في الطلب</h3>
            <DataTable
              :value="order.items.filter(item => !item.is_gift)"
              v-model:expandedRows="expandedRows"
              dataKey="id"
              responsiveLayout="scroll"
              class="p-datatable-sm"
              stripedRows
            >
              <Column :expander="true" headerStyle="width: 4rem" />
              <Column field="product.commercial_name" header="اسم المنتج" />
              <Column field="quantity" header="الكمية">
                <template #body="{ data }">
                  <span>{{ data.quantity }}</span>
                </template>
              </Column>
              <Column header="سعر الوحدة">
                <template #body="{ data }">
                  <span>{{ (data.original_price / data.quantity).toFixed(2) }} {{ order.price_unit }}</span>
                </template>
              </Column>
              <Column header="السعر قبل الخصم">
                <template #body="{ data }">
                  <span>{{ data.original_price }} {{ order.price_unit }}</span>
                </template>
              </Column>
              <Column header="السعر بعد الخصم">
                <template #body="{ data }">
                  <span>{{ data.total_price }} {{ order.price_unit }}</span>
                </template>
              </Column>

              <template #expansion="{ data }">
                <div class="bg-white border border-gray-200 rounded-lg p-6 m-4 shadow-lg">
                  <h4 class="font-bold text-lg mb-4 text-indigo-700">
                    تعليقات على: <span class="text-pink-600">{{ data.product.commercial_name }}</span>
                  </h4>
                  <div v-if="data.comments?.length" class="space-y-4 mb-6">
                    <div
                      v-for="c in data.comments"
                      :key="c.id"
                      class="flex justify-between items-start bg-gray-50 p-4 rounded-lg border"
                      :class="{ 'border-blue-300': c.is_you }"
                    >
                      <div class="flex-1">
                        <p class="font-medium text-gray-800">{{ c.body }}</p>
                        <small class="text-gray-500">{{ c.created_at }}</small>
                      </div>
                      <Tag v-if="c.is_you" value="أنت" severity="info" class="text-xs" />
                    </div>
                  </div>
                  <div v-else class="text-center text-gray-500 py-6">
                    <i class="pi pi-comments text-4xl mb-3 text-gray-300"></i>
                    <p>لا توجد تعليقات على هذا المنتج بعد</p>
                  </div>
                  <div class="mt-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">إضافة تعليق جديد</label>
                    <Textarea
                      v-model="itemComments[data.id]"
                      placeholder="اكتب تعليقك على هذا المنتج..."
                      rows="3"
                      class="w-full"
                      autoResize
                    />
                  </div>
                </div>
              </template>
            </DataTable>

            <div class="mt-8 text-right">
              <p class="text-2xl font-bold text-green-700">
                الإجمالي: {{ order.total_price }} {{ order.price_unit }}
              </p>
            </div>
          </div>

          <div v-if="order.items.some(item => item.is_gift)" class="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6">
            <h3 class="text-2xl font-bold mb-6 text-purple-800">الهدايا المجانية</h3>
            <DataTable
              :value="order.items.filter(item => item.is_gift)"
              class="p-datatable-sm"
              stripedRows
              responsiveLayout="scroll"
            >
              <Column field="product.commercial_name" header="اسم المنتج" />
              <Column header="الحالة">
                <template #body>
                  <Tag value="هدية" severity="success" icon="pi pi-gift" />
                </template>
              </Column>
              <Column field="quantity" header="الكمية">
                <template #body="{ data }">
                  <span class="font-bold text-green-600">{{ data.quantity }}</span>
                </template>
              </Column>
            </DataTable>
          </div>

          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-2xl font-bold mb-6 text-gray-800">تعليقات عامة على الطلب</h3>
            <div v-if="order.comments?.length" class="space-y-4 mb-8">
              <div
                v-for="c in order.comments"
                :key="c.id"
                class="bg-white p-5 rounded-lg shadow flex justify-between items-start border"
                :class="{ 'border-blue-300': c.is_you }"
              >
                <div>
                  <p class="font-medium text-gray-800">{{ c.body }}</p>
                  <small class="text-gray-500">{{ c.created_at }}</small>
                </div>
                <Tag v-if="c.is_you" value="أنت" severity="info" class="text-xs" />
              </div>
            </div>
            <div v-else class="text-center text-gray-500 py-10">
              <i class="pi pi-comments text-5xl mb-4 text-gray-300"></i>
              <p class="text-lg">لا توجد تعليقات عامة بعد</p>
            </div>
            <div class="mt-8">
              <h4 class="text-xl font-semibold mb-4">إضافة تعليق عام على الطلب</h4>
              <Textarea
                v-model="comment"
                placeholder="اكتب تعليقك العام هنا..."
                rows="4"
                class="w-full"
                autoResize
              />
            </div>
          </div>

          <div class="text-center py-10">
            <Button
              label="إرسال جميع التعليقات"
              icon="pi pi-send"
              iconPos="left"
              class="p-button-lg p-button-success text-xl px-12 py-5"
              :loading="allCommentsSubmitting"
              :disabled="!hasAnyComment || allCommentsSubmitting"
              @click="sendAllComments"
            />
          </div>
        </div>

        <div v-else class="text-center py-20">
          <i class="pi pi-exclamation-triangle text-6xl text-gray-400"></i>
          <p class="text-2xl mt-6 text-gray-600">الطلب غير موجود</p>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="showInvoiceDialog" header="تفاصيل الفاتورة" modal :style="{ width: '80vw' }">
      <div v-if="invoice && order" class="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
        <div class="space-y-3 p-4 bg-blue-50 rounded-lg">
          <h4 class="font-bold text-lg text-blue-800 mb-3 border-b pb-2">معلومات الفاتورة</h4>
          <p><strong>رقم الفاتورة:</strong> <Tag :value="invoice.number" severity="info" /></p>
          <p><strong>الطلب الأصلي:</strong> {{ order.number }}</p>
          <p><strong>تاريخ الإصدار:</strong> {{ invoice.created_at }}</p>
        </div>

        <div class="space-y-3 p-4 bg-yellow-50 rounded-lg">
          <h4 class="font-bold text-lg text-yellow-800 mb-3 border-b pb-2">حالة الدفع</h4>
          <p>
            <strong>الحالة:</strong>
            <Tag :value="invoice.status_description" :severity="getStatusSeverity(invoice.status_description)" class="mr-2" />
          </p>
          <p><strong>المبلغ المدفوع:</strong> <span class="text-lg font-semibold text-green-700">{{ invoice.total_paid }} {{ order.price_unit }}</span></p>
        </div>

        <div class="space-y-3 p-4 bg-green-50 rounded-lg">
          <h4 class="font-bold text-lg text-green-800 mb-3 border-b pb-2">ملخص الأسعار</h4>
          <p><strong>السعر الأصلي:</strong> {{ invoice.original_price }} {{ order.price_unit }}</p>
          <p><strong>الخصومات:</strong> <span class="text-red-600">{{ invoice.total_discounts }} {{ order.price_unit }}</span></p>
          <p><strong>التوصيل:</strong> {{ invoice.delivery }} {{ order.price_unit }}</p>
          <p class="text-2xl font-bold text-green-700 pt-2 border-t mt-4">
            الإجمالي النهائي: {{ invoice.total_price }} {{ order.price_unit }}
          </p>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <i class="pi pi-info-circle text-4xl text-yellow-500 mb-3"></i>
        <p class="text-lg text-gray-600">لا يمكن عرض بيانات الفاتورة. تأكد من إنشاء الفاتورة.</p>
      </div>

      <template #footer>
        <Button label="إغلاق" @click="showInvoiceDialog = false" class="p-button-text" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: right !important;
}
:deep(.p-datatable .p-datatable-thead > tr > th) {
  text-align: right !important;
}
</style>
