<template>
  <a
    href="/pharmacy-notifications"
    v-if="authStore.pharmacyauthenticated"
    class="relative p-2 text-gray-800 hover:text-green-600 focus:outline-none transition-colors duration-200"
    aria-label="Notifications"
  >
    <!-- Bell Icon -->
    <i class="pi pi-bell text-xl"></i>

    <!-- Unread Badge -->
    <span
      v-if="totalUnread > 0"
      class="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1.5
             text-xs font-bold text-white bg-red-500 rounded-full shadow-sm animate-pulse"
    >
      {{ totalUnread > 99 ? '99+' : totalUnread }}
    </span>
  </a>
</template>

<script setup>
import { ref, onMounted, onUnmounted,watch} from 'vue';
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

// --- Stores ---
const authStore = useAuthStore()

// --- Reactive State ---
const totalUnread = ref(0)
const loading = ref(false)

// --- Fetch Unread Count ---
const fetchUnreadCount = async () => {
  if (!authStore.pharmacyauthenticated) return

  loading.value = true
  try {
    const response = await axios.get('/api/notification/get?per_page=1')
    const data = response.data.data

    const adminUnread = (data.admin_notifications?.data || []).filter(n => !n.read_at).length
    const warehouseUnread = (data.warehouse_notifications?.data || []).filter(n => !n.read_at).length

    totalUnread.value = adminUnread + warehouseUnread
  } catch (err) {
    console.error('Failed to fetch unread notifications count:', err)
    // Optionally show toast
  } finally {
    loading.value = false
  }
}

// --- Auto-refresh every 30 seconds (optional) ---
let intervalId = null
const startPolling = () => {
  intervalId = setInterval(fetchUnreadCount, 30_000) // Every 30s
}
const stopPolling = () => {
  if (intervalId) clearInterval(intervalId)
}

// --- Lifecycle ---
onMounted(() => {
  if (authStore.pharmacyauthenticated) {
    fetchUnreadCount()
    startPolling()
  }
})

// Stop polling when component is destroyed
onUnmounted(() => {
  stopPolling()
})

// Re-fetch when auth status changes
watch(
  () => authStore.pharmacyauthenticated,
  (newVal) => {
    if (newVal) {
      fetchUnreadCount()
      startPolling()
    } else {
      totalUnread.value = 0
      stopPolling()
    }
  }
)
</script>

<style scoped>
/* Optional: Add a subtle ring on hover */
a:hover .pi-bell {
  transform: scale(1.1);
}
</style>
