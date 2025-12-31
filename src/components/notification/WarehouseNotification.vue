<template>
  <a
  v-if="authStore.warehouseauthenticated"
    href="/warehouse/warehouse-notification"
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import axios from 'axios';

// --- Stores ---
const authStore = useAuthStore();

// --- Reactive State ---
const totalUnread = ref(0);
const loading = ref(false);

// --- Fetch Unread Count ---
const fetchUnreadCount = async () => {
  if (!authStore.warehouseauthenticated) {
    totalUnread.value = 0;
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get('/api/notification/get?limit=100');
    const data = response.data.data;

    const adminUnread = (data.admin_notifications?.data || []).filter(n => !n.read_at).length;
    const pharmacyUnread = (data.pharmacy_notifications?.data || []).filter(n => !n.read_at).length;
    const warehouseUnread = (data.warehouse_notifications?.data || []).filter(n => !n.read_at).length;

    totalUnread.value = adminUnread + pharmacyUnread + warehouseUnread;
  } catch (err) {
    console.error('Failed to fetch unread notifications count:', err);
    // Optionally show toast notification for error (uncomment if toast library is available)
    // toast.error('Failed to load notifications');
  } finally {
    loading.value = false;
  }
};

// --- Auto-refresh every 30 seconds ---
let intervalId = null;
const startPolling = () => {
  intervalId = setInterval(fetchUnreadCount, 30_000); // Every 30 seconds
};
const stopPolling = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  if (authStore.warehouseauthenticated) {
    fetchUnreadCount();
    startPolling();
  }
});

// Stop polling when component is destroyed
onUnmounted(() => {
  stopPolling();
});

// Watch for authentication status changes
watch(
  () => authStore.warehouseauthenticated,
  (newVal) => {
    if (newVal) {
      fetchUnreadCount();
      startPolling();
    } else {
      totalUnread.value = 0;
      stopPolling();
    }
  }
);
</script>

<style scoped>
/* Subtle hover effect for bell icon */
a:hover .pi-bell {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Ensure badge is visually distinct */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
