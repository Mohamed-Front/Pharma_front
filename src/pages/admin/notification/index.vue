<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Badge from 'primevue/badge'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import { useRouter } from "vue-router"
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'

const router = useRouter()
// --- Component Setup ---
const { t } = useI18n()
const toast = useToast()

// --- Reactive State ---
const loading = ref(true)
const error = ref(null)

// Initial state function for notification data categories
const initialNotificationState = () => ({
  data: [],
  total: 0,
  unread_count: 0,
  current_page: 1,
  last_page: 1
})

const pharmacyNotificationsData = ref(initialNotificationState())
const warehouseNotificationsData = ref(initialNotificationState())

// activeTabIndex starts at 0, which is Pharmacy Notes
const activeTabIndex = ref(0)
const currentNotifications = ref([])
const currentPage = ref(1)
const perPage = ref(10)

// Modal state
const showModal = ref(false)
const form = ref({
  type: '',
  ids: [],
  title_en: '',
  title_ar: '',
  body_en: '',
  body_ar: ''
})
const typeOptions = ref([
  { label: t('notifications.pharmacy') || 'Pharmacy', value: 'pharmacy' },
  { label: t('notifications.warehouse') || 'Warehouse', value: 'warehouse' }
])
const pharmacies = ref([])
const warehouses = ref([])

// Computed for dynamic options based on type
const selectedOptions = computed(() => {
  return form.value.type === 'pharmacy' ? pharmacies.value : form.value.type === 'warehouse' ? warehouses.value : []
})

// --- Utility Functions ---

const formatDate = (dateString) => {
  if (!dateString) return ''
  const now = new Date()
  const date = new Date(dateString)
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)

  if (diffInHours > 0) {
    return `${t('since') || 'since'} ${diffInHours} ${t('hours_ago') || 'hours ago'}`
  } else if (diffInMinutes > 0) {
    return `${t('since') || 'since'} ${diffInMinutes} ${t('minutes_ago') || 'minutes ago'}`
  } else {
    return t('just_now') || 'just now'
  }
}

const mapResponseToState = (resData) => {
  // Helper to safely extract and calculate notification data
  const extractData = (key) => {
    const data = resData[key] || {}
    const notifications = data.data || []
    return {
      data: notifications,
      total: data.total || 0,
      unread_count: notifications.filter(n => !n.read_at).length,
      current_page: data.current_page || 1,
      last_page: data.last_page || 1
    }
  }

  pharmacyNotificationsData.value = extractData('pharmacy_notifications')
  warehouseNotificationsData.value = extractData('warehouse_notifications')
}

const updateCurrentList = () => {
  let activeData
  switch (activeTabIndex.value) {
    case 0:
      activeData = pharmacyNotificationsData.value
      break
    case 1:
      activeData = warehouseNotificationsData.value
      break
    default:
      activeData = initialNotificationState()
  }
  currentNotifications.value = activeData.data
  currentPage.value = activeData.current_page
}

// --- API Calls & Handlers ---

const fetchData = async (page = 1) => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get(`/api/notification/get?page=${page}&per_page=${perPage.value}`)
    loading.value = false
    mapResponseToState(response.data.data)
    updateCurrentList()
  } catch (err) {
    loading.value = false
    error.value = err.message || t('notification.loadError') || 'Failed to load notifications.'
    toast.add({
      severity: 'error',
      summary: t('error') || 'Error',
      detail: error.value,
      life: 3000
    })
    console.error("Error fetching data:", err)
  }
}

const fetchPharmacies = async () => {
  if (pharmacies.value.length > 0) return
  try {
    const response = await axios.get('/api/pharmacy-request')
    pharmacies.value = response.data.data.map(p => ({ label: p.name || p.id, value: p.id }))
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: t('error') || 'Error',
      detail: t('notification.loadPharmaciesError') || 'Failed to load pharmacies.',
      life: 3000
    })
    console.error("Error fetching pharmacies:", err)
  }
}

const fetchWarehouses = async () => {
  if (warehouses.value.length > 0) return
  try {
    const response = await axios.get('/api/warehouse-request')
    warehouses.value = response.data.data.map(w => ({ label: w.name || w.id, value: w.id }))
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: t('error') || 'Error',
      detail: t('notification.loadWarehousesError') || 'Failed to load warehouses.',
      life: 3000
    })
    console.error("Error fetching warehouses:", err)
  }
}

const markAsRead = async (notification) => {
  if (notification.read_at) return
  try {
    await axios.post(`/api/notification/read/${notification.id}`)
    notification.read_at = new Date().toISOString()
    pharmacyNotificationsData.value.unread_count = pharmacyNotificationsData.value.data.filter(n => !n.read_at).length
    warehouseNotificationsData.value.unread_count = warehouseNotificationsData.value.data.filter(n => !n.read_at).length
    toast.add({
      severity: 'success',
      summary: t('success') || 'Success',
      detail: t('notification.markedRead') || 'Notification marked as read.',
      life: 1500
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error') || 'Error',
      detail: t('notification.markAsReadError') || 'Failed to mark notification as read.',
      life: 3000
    })
    console.error("Error marking notification as read:", error)
  }
}

const markAllAsRead = async () => {
  loading.value = true
  try {
    const type = activeTabIndex.value === 0 ? 'pharmacy' : 'warehouse'
    await axios.post(`/api/notification/read-all?type=${type}`)
    const targetData = type === 'pharmacy' ? pharmacyNotificationsData : warehouseNotificationsData
    targetData.value.data.forEach(n => n.read_at = n.read_at || new Date().toISOString())
    targetData.value.unread_count = 0
    toast.add({
      severity: 'success',
      summary: t('success') || 'Success',
      detail: t('notification.markedAllRead') || 'All notifications marked as read.',
      life: 3000
    })
    fetchData(currentPage.value)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error') || 'Error',
      detail: t('notification.markAllReadError') || 'Failed to mark all notifications as read.',
      life: 3000
    })
    console.error("Error marking all notifications as read:", error)
  }
}

const viewNotification = (notification) => {
  markAsRead(notification)
  if (notification.type === 'pharmacy') {
    router.push({
      name: 'pharmacy_request_show',
      params: { id: notification.metadata.pharmacy_request_id }
    })
  } else {
    router.push({
      name: 'warehouse_request_show',
      params: { id: notification.metadata.warehouse_request_id }
    })
  }
}

const sendNotification = async () => {
  if (!form.value.type || form.value.ids.length === 0 || !form.value.title_en || !form.value.body_en) {
    toast.add({
      severity: 'warn',
      summary: t('warning') || 'Warning',
      detail: t('notification.missing_fields') || 'Please fill all required fields (Type, Recipients, English Title, English Body).',
      life: 3000
    })
    return
  }
  try {
    await axios.post('/api/notification/send', form.value)
    toast.add({
      severity: 'success',
      summary: t('success') || 'Success',
      detail: t('notification.sent') || 'Notification sent successfully.',
      life: 3000
    })
    showModal.value = false
    form.value = {
      type: '',
      ids: [],
      title_en: '',
      title_ar: '',
      body_en: '',
      body_ar: ''
    }
    fetchData(currentPage.value)
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: t('error') || 'Error',
      detail: t('notification.sendError') || 'Failed to send notification.',
      life: 3000
    })
    console.error("Error sending notification:", err)
  }
}

const handleTabChange = (event) => {
  activeTabIndex.value = event.index
  fetchData(1)
}

const onPageChange = (event) => {
  const newPage = event.page + 1
  currentPage.value = newPage
  fetchData(newPage)
}

watch(activeTabIndex, updateCurrentList)

watch(() => form.value.type, (newType) => {
  form.value.ids = []
  if (newType === 'pharmacy') {
    fetchPharmacies()
  } else if (newType === 'warehouse') {
    fetchWarehouses()
  }
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex justify-center items-start p-4">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="p-4 flex justify-end">
        <Button
          :label="t('notification.send_notification') || 'Send Notification'"
          icon="pi pi-send"
          severity="primary"
          @click="showModal = true"
        />
      </div>
      <TabView
        :active-index="activeTabIndex"
        @tab-change="handleTabChange"
        class="bg-gradient-to-r from-[#43A167] to-[#8fd3a9]"
        role="tablist"
      >
        <TabPanel>
          <template #header>
            <div
              class="flex items-center gap-3 px-4 text-black font-semibold text-lg transition-colors rounded-t-lg"
              role="tab"
              :aria-selected="activeTabIndex === 0"
              aria-controls="pharmacy-notifications"
            >
              <i class="pi pi-building text-xl"></i>
              <span>{{ t('notifications.pharmacy_notes') || 'Pharmacy Notes' }}</span>
              <Badge
                :value="pharmacyNotificationsData.unread_count"
                severity="danger"
                class="bg-red-500 text-white"
                v-if="pharmacyNotificationsData.unread_count > 0"
              />
            </div>
          </template>
        </TabPanel>
        <TabPanel>
          <template #header>
            <div
              class="flex items-center gap-3 px-4 text-black font-semibold text-lg transition-colors rounded-t-lg"
              role="tab"
              :aria-selected="activeTabIndex === 1"
              aria-controls="warehouse-notifications"
            >
              <i class="pi pi-box text-xl"></i>
              <span>{{ t('notifications.warehouse_shipments') || 'Warehouse Shipments' }}</span>
              <Badge
                :value="warehouseNotificationsData.unread_count"
                severity="danger"
                class="bg-red-500 text-white"
                v-if="warehouseNotificationsData.unread_count > 0"
              />
            </div>
          </template>
        </TabPanel>
      </TabView>

      <div
        class="p-6 bg-gray-50 min-h-[400px]"
        :id="activeTabIndex === 0 ? 'pharmacy-notifications' : 'warehouse-notifications'"
        role="tabpanel"
      >
        <div
          v-if="!loading && !error && currentNotifications.length > 0"
          class="flex justify-end mb-4"
        >
          <Button
            :label="t('notification.mark_all_read') || 'Mark All As Read'"
            icon="pi pi-check-double"
            severity="success"
            outlined
            @click="markAllAsRead"
            :disabled="activeTabIndex === 0 ? pharmacyNotificationsData.unread_count === 0 : warehouseNotificationsData.unread_count === 0"
            class="text-sm"
          />
        </div>

        <div v-if="error" class="flex flex-col items-center justify-center h-64 text-gray-500">
          <i class="pi pi-exclamation-triangle text-5xl mb-4 opacity-50"></i>
          <p class="text-lg">{{ error }}</p>
          <Button
            :label="t('retry') || 'Retry'"
            icon="pi pi-refresh"
            class="mt-4"
            @click="fetchData(currentPage)"
          />
        </div>

        <div v-else-if="loading" class="space-y-4">
          <Card v-for="i in 5" :key="i" class="shadow-md rounded-lg">
            <template #content>
              <div class="flex justify-between items-start p-4">
                <Skeleton width="60%" height="1.5rem" class="rounded"></Skeleton>
                <Skeleton width="15%" height="1rem" class="rounded"></Skeleton>
              </div>
              <Skeleton width="90%" height="1rem" class="mt-2 mx-4 rounded"></Skeleton>
            </template>
          </Card>
        </div>

        <div v-else-if="currentNotifications.length > 0" class="space-y-4">
          <div
            v-for="(notification, index) in currentNotifications"
            :key="notification.id"
            class="notification-item p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            :class="{ 'bg-blue-50 border-l-4 border-[#43A167]': !notification.read_at }"
            @click="viewNotification(notification)"
            role="button"
            :aria-label="notification.title || t('no_title')"
          >
            <div class="flex justify-between items-center">
              <div class="flex-1 min-w-0">
                <div
                  class="font-semibold text-lg truncate"
                  :class="{ 'text-gray-900': !notification.read_at, 'text-gray-500': notification.read_at }"
                >
                  {{ notification.title || t('no_title') }}
                </div>
              </div>
              <div class="items-center mx-4">
                <p class="text-gray-400 text-sm flex-shrink-0">{{ formatDate(notification.created_at) }}</p>
              </div>
            </div>
            <div
              class="mt-2 text-sm leading-relaxed"
              :class="{ 'text-gray-700': !notification.read_at, 'text-gray-500': notification.read_at }"
            >
              {{ notification.body || t('no_body') }}
            </div>
            <div v-if="notification.metadata" class="mt-2 text-xs text-gray-500">
              <span v-for="(value, key) in notification.metadata" :key="key">
                {{ key }}: {{ value }}<br />
              </span>
            </div>
          </div>

          <Paginator
            :rows="perPage"
            :totalRecords="activeTabIndex === 0 ? pharmacyNotificationsData.total : warehouseNotificationsData.total"
            :first="(currentPage - 1) * perPage"
            @page="onPageChange"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          />
        </div>

        <div v-else class="flex flex-col items-center justify-center h-64 text-gray-500">
          <i class="pi pi-bell-slash text-5xl mb-4 opacity-50"></i>
          <p class="text-lg">{{ t('notification.noData') || 'No notifications in this section.' }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Send Notification Modal -->
  <Dialog
    v-model:visible="showModal"
    :header="t('notification.send_notification') || 'Send Notification'"
    :style="{ width: '50vw' }"
    :modal="true"
    class="rounded-lg"
  >
    <div class="p-fluid space-y-4">
      <div class="field">
        <label for="type" class="block text-sm font-medium text-gray-700">
          {{ t('notification.type') || 'Type' }}
        </label>
        <Dropdown
          id="type"
          v-model="form.type"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('notification.select_type') || 'Select Type'"
          class="w-full"
        />
      </div>
      <div class="field" v-if="form.type">
        <label for="ids" class="block text-sm font-medium text-gray-700">
          {{ t('notification.recipients') || 'Recipients' }}
        </label>
        <MultiSelect
          id="ids"
          v-model="form.ids"
          :options="selectedOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('notification.select_recipients') || 'Select Recipients'"
          display="chip"
          class="w-full"
        />
      </div>
      <div class="field">
        <label for="title_en" class="block text-sm font-medium text-gray-700">
          {{ t('notification.title_en') || 'Title (English)' }}
        </label>
        <InputText
          id="title_en"
          v-model="form.title_en"
          :placeholder="t('notification.enter_title_en') || 'Enter title in English'"
          class="w-full"
        />
      </div>
      <div class="field">
        <label for="title_ar" class="block text-sm font-medium text-gray-700">
          {{ t('notification.title_ar') || 'Title (Arabic)' }}
        </label>
        <InputText
          id="title_ar"
          v-model="form.title_ar"
          :placeholder="t('notification.enter_title_ar') || 'Enter title in Arabic'"
          class="w-full"
        />
      </div>
      <div class="field">
        <label for="body_en" class="block text-sm font-medium text-gray-700">
          {{ t('notification.body_en') || 'Body (English)' }}
        </label>
        <Textarea
          id="body_en"
          v-model="form.body_en"
          :placeholder="t('notification.enter_body_en') || 'Enter body in English'"
          rows="3"
          class="w-full"
        />
      </div>
      <div class="field">
        <label for="body_ar" class="block text-sm font-medium text-gray-700">
          {{ t('notification.body_ar') || 'Body (Arabic)' }}
        </label>
        <Textarea
          id="body_ar"
          v-model="form.body_ar"
          :placeholder="t('notification.enter_body_ar') || 'Enter body in Arabic'"
          rows="3"
          class="w-full"
        />
      </div>
    </div>
    <template #footer>
      <Button
        :label="t('notification.cancel') || 'Cancel'"
        icon="pi pi-times"
        text
        @click="showModal = false"
      />
      <Button
        :label="t('notification.send') || 'Send'"
        icon="pi pi-check"
        @click="sendNotification"
        :disabled="!form.type || form.ids.length === 0 || !form.title_en || !form.body_en"
      />
    </template>
  </Dialog>
</template>

<style scoped>
/* Custom styles for PrimeVue TabView */
:deep(.p-tabview .p-tabview-nav) {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
}

:deep(.p-tabview .p-tabview-panels) {
  background: transparent !important;
  border: none !important;
}

:deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link) {
  background: transparent !important;
  border: none !important;
  color: white !important;
  transition: background-color 0.3s ease !important;
}

:deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  background: white !important;
  color: #1f2937 !important;
  border-bottom: 3px solid #ffffff !important;
  border-radius: 0 !important;
}

:deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Ensure paginator is styled consistently */
:deep(.p-paginator) {
  margin-top: 1rem;
  justify-content: center;
}

/* Modal input styling */
:deep(.p-inputtext), :deep(.p-textarea), :deep(.p-dropdown), :deep(.p-multiselect) {
  width: 100%;
}
</style>
