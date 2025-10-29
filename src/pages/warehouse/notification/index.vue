<script setup>
import { ref, onMounted, watch } from 'vue'
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


const router = useRouter()
// --- Component Setup ---
const { t } = useI18n()
const toast = useToast()

// NOTE: Since the router is not available in this single-file context,
// we are simulating the router push functionality with a console log.
// In your real application, you would use: import { useRouter } from 'vue-router'


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

const adminNotificationsData = ref(initialNotificationState())
const pharmacyNotificationsData = ref(initialNotificationState())
const warehouseNotificationsData = ref(initialNotificationState())

const activeTabIndex = ref(0)
const currentNotifications = ref([])
const currentPage = ref(1)
const perPage = ref(10)

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
      // Calculate unread count based on the data received
      unread_count: notifications.filter(n => !n.read_at).length,
      current_page: data.current_page || 1,
      last_page: data.last_page || 1
    }
  }

  adminNotificationsData.value = extractData('admin_notifications')
  pharmacyNotificationsData.value = extractData('pharmacy_notifications')
  warehouseNotificationsData.value = extractData('warehouse_notifications')
}

const updateCurrentList = () => {
  let activeData
  switch (activeTabIndex.value) {
    case 0:
      activeData = adminNotificationsData.value
      break
    case 1:
      activeData = pharmacyNotificationsData.value
      break
    case 2:
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
      summary: t('error'),
      detail: error.value,
      life: 3000
    })
    console.error("Error fetching data:", err)
  }
}

const markAsRead = async (notification) => {
  if (notification.read_at) return
  try {
    // API path updated as per user request: /api/notification/read/{id}
    await axios.post(`/api/notification/read/${notification.id}`)

    // Optimistically update the state
    notification.read_at = new Date().toISOString()

    // Recalculate unread counts for all categories
    adminNotificationsData.value.unread_count = adminNotificationsData.value.data.filter(n => !n.read_at).length
    pharmacyNotificationsData.value.unread_count = pharmacyNotificationsData.value.data.filter(n => !n.read_at).length
    warehouseNotificationsData.value.unread_count = warehouseNotificationsData.value.data.filter(n => !n.read_at).length

    toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('notification.markedRead') || 'Notification marked as read.',
        life: 1500
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('notification.markAsReadError') || 'Failed to mark notification as read.',
      life: 3000
    })
    console.error("Error marking notification as read:", error)
  }
}

/**
 * Marks all notifications in the active tab as read.
 */
const markAllAsRead = async () => {
    loading.value = true
    try {
        // Determine notification type for the API call
        const type = activeTabIndex.value === 0 ? 'admin' : activeTabIndex.value === 1 ? 'pharmacy' : activeTabIndex.value === 2 ? 'warehouse' : null

        if (!type) return

        // API call using the requested path
        await axios.post(`/api/notification/read-all?type=${type}`)

        // Optimistically update state
        const targetData = type === 'admin' ? adminNotificationsData : type === 'pharmacy' ? pharmacyNotificationsData : warehouseNotificationsData;
        targetData.value.data.forEach(n => n.read_at = n.read_at || new Date().toISOString())
        targetData.value.unread_count = 0

        toast.add({
            severity: 'success',
            summary: t('success'),
            detail: t('notification.markedAllRead') || 'All notifications marked as read.',
            life: 3000
        })

        // Refetch current page to ensure consistency and get updated data
        fetchData(currentPage.value)

    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('error'),
            detail: t('notification.markAllReadError') || 'Failed to mark all notifications as read.',
            life: 3000
        })
        console.error("Error marking all notifications as read:", error)
    } finally {
        // loading.value = false; // Will be set to false by fetchData upon completion
    }
}

/**
 * Handles the click event on a notification item, marking as read and navigating/logging.
 */
const viewNotification = (notification) => {
  markAsRead(notification)

  const redirectId = notification.redirect_id || notification.metadata?.[notification.redirect_type.split('_')[0] + '_id']

  if (notification.type === 'pharmacy') {
    if (notification.redirect_type === 'order_comment') {
      const orderId = notification.metadata?.order_id
      const commentId = notification.metadata?.comment_id

      if (orderId && commentId) {

        // Router push for comment: navigate to orders detail with query for specific comment
        router.push({
          name: 'order_show',
          params:{id:orderId},
          query: {
            comment_id: commentId
          }
        })
      } else {
        console.warn("Pharmacy Comment Notification is missing required metadata.")
      }
    } else if (notification.redirect_type === 'order_created' && redirectId) {
      // Router push for new order: navigate to order detail view
      router.push({
        name: 'order_show',
        params: { id: redirectId }
      })
    } else {
        console.log(`Pharmacy notification type ${notification.redirect_type} not handled yet. Redirect ID: ${redirectId}`)
    }
  } else {
    // Default action for Admin/Warehouse
    console.log(`Default redirect for ${notification.type} notification type: ${notification.redirect_type}, ID: ${redirectId}`)
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

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex justify-center items-start p-4">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
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
              aria-controls="admin-notifications"
            >
              <i class="pi pi-user text-xl"></i>
              <span>{{ t('notifications.admin_messages') || 'Admin Messages' }}</span>
              <Badge
                :value="adminNotificationsData.unread_count"
                severity="danger"
                class="bg-red-500 text-white"
                v-if="adminNotificationsData.unread_count > 0"
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

      </TabView>

      <div class="p-6 bg-gray-50 min-h-[400px]" :id="activeTabIndex === 0 ? 'admin-notifications' : activeTabIndex === 1 ? 'pharmacy-notifications' : 'warehouse-notifications'" role="tabpanel">

        <!-- Mark All As Read Button (Admin Tab Only) -->
        <div
            v-if="activeTabIndex === 0 && adminNotificationsData.total > 0 && !loading && !error"
            class="flex justify-end mb-4"
        >
            <Button
                :label="t('mark_all_read') || 'Mark All As Read'"
                icon="pi pi-check-double"
                severity="success"
                outlined
                @click="markAllAsRead"
                :disabled="adminNotificationsData.unread_count === 0"
                class="text-sm"
            />
        </div>

        <!-- Error State -->
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

        <!-- Loading State -->
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

        <!-- Data List -->
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
                <i v-if="activeTabIndex === 0 && !notification.read_at"   :aria-label="t('mark_read') || 'Mark as Read'"
                  v-tooltip.top="t('mark_read') || 'Mark as Read'" class="pi pi-check"></i>


              <div class=" items-center  mx-4">
                <p class="text-gray-400 text-sm flex-shrink-0">{{ formatDate(notification.created_at) }}</p>

                <!-- Individual Mark as Read Button (Admin Tab Only, if unread) -->

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

          <!-- Paginator -->
          <Paginator
            :rows="perPage"
            :totalRecords="activeTabIndex === 0 ? adminNotificationsData.total : activeTabIndex === 1 ? pharmacyNotificationsData.total : warehouseNotificationsData.total"
            :first="(currentPage - 1) * perPage"
            @page="onPageChange"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          />
        </div>

        <!-- No Data State -->
        <div v-else class="flex flex-col items-center justify-center h-64 text-gray-500">
          <i class="pi pi-bell-slash text-5xl mb-4 opacity-50"></i>
          <p class="text-lg">{{ t('notification.noData') || 'No notifications in this section.' }}</p>
        </div>
      </div>
    </div>
  </div>
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
</style>
