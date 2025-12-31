```vue
<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-6">
    <div class="mb-6 animate-fade-in">
      <h1 class="font-bold text-gray-800 mb-2" style="font-size: clamp(1rem, 2vw + .5rem, 1.8rem);">{{ $t('dashboard.title') }}</h1>
      <p class="text-gray-600" style="font-size: clamp(.4rem, 2vw + .3rem, 1rem);">{{ $t('dashboard.welcome_message') }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6" v-if="dashboardData">
      <a href="/admin/companies" class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.companies') }}</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ dashboardData.company_count }}</h3>
            <p class="text-sm mt-2 text-gray-600">{{ $t('dashboard.total_companies') }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg animate-pulse-slow">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </a>

      <a href="/admin/users_management/pharmacy-request" class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.pharmacies') }}</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ dashboardData.pharmacy_count }}</h3>
            <p class="text-sm mt-2 text-gray-600">{{ $t('dashboard.total_pharmacies') }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg animate-pulse-slow">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </a>

      <a href="/admin/users_management/warehouse-request" class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.warehouses') }}</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ dashboardData.warehouse_count }}</h3>
            <p class="text-sm mt-2 text-gray-600">{{ $t('dashboard.total_warehouses') }}</p>
          </div>
          <div class="bg-orange-100 p-3 rounded-lg animate-pulse-slow">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
        </div>
      </a>

      <a href="/admin/categories" class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.categories') }}</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ dashboardData.category_count }}</h3>
            <p class="text-sm mt-2 text-gray-600">{{ $t('dashboard.total_categories') }}</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg animate-pulse-slow">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </a>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-red-500 text-center mb-6 animate-fade-in">
      {{ error }}
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6" v-if="dashboardData">
      <!-- Request Status Chart -->
      <div class="bg-white rounded-xl shadow-md p-6 lg:col-span-2 transition-all duration-300 hover:shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">{{ $t('dashboard.request_status') }}</h2>
          <div class="flex space-x-2">
            <Button class="p-button-sm p-button-text" :label="$t('dashboard.refresh')" icon="pi pi-refresh" @click="fetchDashboardData" />
          </div>
        </div>
        <Chart type="bar" :data="requestStatusChartData" :options="barOptions"  />
      </div>

      <!-- Orders Count Chart -->
      <div class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ $t('dashboard.orders_count') }}</h2>
        <Chart type="line" :data="ordersChartData" :options="chartOptions"  />
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Chart from 'primevue/chart';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const dashboardData = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Sample recent orders (since API doesn't provide detailed order data)
const recentOrders = ref([
  { id: 'ORD1001', customer: 'James Smith', date: '2025-10-01', amount: 45.99, status: 'Delivered' },
  { id: 'ORD1002', customer: 'Maria Garcia', date: '2025-10-02', amount: 89.50, status: 'Processing' },
  { id: 'ORD1003', customer: 'Robert Johnson', date: '2025-10-03', amount: 120.75, status: 'Delivered' },
  { id: 'ORD1004', customer: 'Sarah Williams', date: '2025-10-04', amount: 32.25, status: 'Cancelled' },
  { id: 'ORD1005', customer: 'David Brown', date: '2025-10-05', amount: 67.80, status: 'Delivered' },
]);

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// Get status class for badges
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Processing':
      return 'bg-blue-100 text-blue-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Chart data for request statuses
const requestStatusChartData = computed(() => ({
  labels: [
    ...(dashboardData.value?.pharmacyRequest_by_status_counts.map((item: any) => item.status_description) || []),
    ...(dashboardData.value?.warehouseRequest_by_status_counts.map((item: any) => item.status_description) || []),
  ],
  datasets: [
    {
      label: t('dashboard.pharmacy_requests'),
      data: dashboardData.value?.pharmacyRequest_by_status_counts.map((item: any) => item.pharmacy_request_count) || [],
      backgroundColor: '#3B82F6',
      borderRadius: 4,
    },
    {
      label: t('dashboard.warehouse_requests'),
      data: dashboardData.value?.warehouseRequest_by_status_counts.map((item: any) => item.warehouse_request_count) || [],
      backgroundColor: '#10B981',
      borderRadius: 4,
    },
  ],
}));

// Chart data for orders count
const ordersChartData = computed(() => ({
  labels: Object.keys(dashboardData.value?.last_orders_count || {}),
  datasets: [
    {
      label: t('dashboard.orders_count'),
      data: Object.values(dashboardData.value?.last_orders_count || {}),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    },
  ],
}));

// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: { size: 12 },
        color: '#374151',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { drawBorder: false, color: '#e5e7eb' },
      ticks: { color: '#374151' },
    },
    x: {
      grid: { display: false },
      ticks: { color: '#374151' },
    },
  },
  animation: {
    easing: 'easeInOutCubic',
    duration: 1500,
  },
});

const barOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: { size: 12 },
        color: '#374151',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { drawBorder: false, color: '#e5e7eb' },
      ticks: { color: '#374151' },
    },
    x: {
      grid: { display: false },
      ticks: { color: '#374151' },
    },
  },
  animation: {
    easing: 'easeOutBounce',
    duration: 1500,
  },
});

// Fetch dashboard data from API
const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('https://pharma-service-838894765790.us-central1.run.app/api/dashboard/admin/data');
    if (response.data.success) {
      dashboardData.value = response.data.data;
    } else {
      throw new Error(response.data.message || t('dashboard.error_fetching_data'));
    }
  } catch (err) {
    error.value = (err as any).response?.data?.message || t('dashboard.error_fetching_data');
    console.error('Error fetching dashboard data:', err);
    // Fallback to sample data
    dashboardData.value = {
      company_count: 2,
      scientific_structure_count: 1,
      category_count: 4,
      pharmacy_count: 2,
      warehouse_count: 3,
      pharmacyRequest_by_status_counts: [
        { status: 1, pharmacy_request_count: 1, status_description: 'active' },
      ],
      warehouseRequest_by_status_counts: [
        { status: 1, warehouse_request_count: 2, status_description: 'active' },
      ],
      last_orders_count: { 'Oct-2025': 5 },
    };
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
/* Custom scrollbar for table */
table {
  min-width: 100%;
}

thead {
  position: sticky;
  top: 0;
}

tbody {
  max-height: 300px;
  overflow-y: auto;
  display: block;
}

tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}

.custom-scrollbar {
  scrollbar-color: #d1d5db transparent;
  scrollbar-width: thin;
}

/* Fancy Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes pulseSlow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.animate-pulse-slow {
  animation: pulseSlow 2s infinite ease-in-out;
}

</style>
```
