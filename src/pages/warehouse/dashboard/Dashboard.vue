<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-6">
    <div class="mb-6 animate-fade-in">
      <h1 class="font-bold text-gray-800 mb-2" style="font-size: clamp(1rem, 2vw + .5rem, 1.8rem);">{{ $t('control.title') }}</h1>
      <p class="text-gray-600" style="font-size: clamp(.4rem, 2vw + .3rem, 1rem);">{{ $t('control.welcome_message') }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6" v-if="dashboardData">
      <div class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('control.companies') }}</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ dashboardData.company_count }}</h3>
            <p class="text-sm mt-2 text-gray-600">{{ $t('control.total_companies') }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg animate-pulse-slow">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('control.categories') }}</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ dashboardData.category_count }}</h3>
            <p class="text-sm mt-2 text-gray-600">{{ $t('control.total_categories') }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg animate-pulse-slow">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('control.orders') }}</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ dashboardData.order_count }}</h3>
            <p class="text-sm mt-2 text-gray-600">{{ $t('control.total_orders') }}</p>
          </div>
          <div class="bg-orange-100 p-3 rounded-lg animate-pulse-slow">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7l-2 2m0 0l-2-2m2 2V9" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ $t('control.invoices') }}</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ dashboardData.invoice_count }}</h3>
            <p class="text-sm mt-2 text-gray-600">{{ $t('control.total_invoices') }}</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg animate-pulse-slow">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <div v-if="error" class="text-red-500 text-center mb-6 animate-fade-in">
      {{ error }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" v-if="dashboardData">

      <div class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ $t('control.best_selling_products') }}</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-3 py-3  text-xs font-medium text-gray-600 uppercase tracking-wider">{{ $t('control.table.product_name') }}</th>
                <th class="px-3 py-3  text-xs font-medium text-gray-600 uppercase tracking-wider">{{ $t('control.table.sold_units') }}</th>
                <th class="px-3 py-3  text-xs font-medium text-gray-600 uppercase tracking-wider">{{ $t('control.table.price') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in dashboardData.best_seller_product" :key="product.id" class="hover:bg-gray-50 transition duration-200">
                <td class="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{{ product.commercial_name }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{{ product.total_sold }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatCurrency(parseFloat(product.price)) }}</td>
              </tr>
              <tr v-if="!dashboardData.best_seller_product || dashboardData.best_seller_product.length === 0">
                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">{{ $t('control.no_data_products') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ $t('control.best_performing_pharmacies') }}</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-3 py-3  text-xs font-medium text-gray-600 uppercase tracking-wider">{{ $t('control.table.pharmacy') }}</th>
                <th class="px-3 py-3  text-xs font-medium text-gray-600 uppercase tracking-wider">{{ $t('control.table.orders') }}</th>
                <th class="px-3 py-3  text-xs font-medium text-gray-600 uppercase tracking-wider">{{ $t('control.table.total_spent') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="pharmacyData in dashboardData.best_seller_pharmacy" :key="pharmacyData.pharmacy_id" class="hover:bg-gray-50 transition duration-200">
                <td class="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{{ pharmacyData.pharmacy.name }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{{ pharmacyData.total_orders }}</td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatCurrency(parseFloat(pharmacyData.total_spent)) }}</td>
              </tr>
              <tr v-if="!dashboardData.best_seller_pharmacy || dashboardData.best_seller_pharmacy.length === 0">
                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">{{ $t('control.no_data_pharmacies') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6" v-if="dashboardData">
      <div class="bg-white rounded-xl shadow-md p-6 lg:col-span-3 transition-all duration-300 hover:shadow-xl">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ $t('control.monthly_orders_count') }}</h2>
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

// --- Types for better data handling ---
interface BestSellerProduct {
  id: number;
  warehouse_id: number;
  category_id: number;
  company_id: number;
  commercial_name: string;
  price: string;
  price_unit: number;
  total_sold: string;
  total_rating: number | null;
}

interface BestSellerPharmacy {
  pharmacy_id: number;
  total_orders: number;
  total_spent: string;
  status_description: string | null;
  pharmacy: {
    id: number;
    name: string;
    phone: string;
    address: string;
    status: number;
    status_description: string;
  };
}

interface DashboardData {
  company_count: number;
  scientific_structure_count: number;
  category_count: number;
  order_count: number;
  invoice_count: number;
  last_orders_count: { [key: string]: number };
  best_seller_product: BestSellerProduct[];
  best_seller_pharmacy: BestSellerPharmacy[];
}

const dashboardData = ref<DashboardData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Sample recent orders (Kept for the table, as this data isn't in the provided API response)
const recentOrders = ref([

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

// Chart data for orders count
const ordersChartData = computed(() => ({
  labels: Object.keys(dashboardData.value?.last_orders_count || {}),
  datasets: [
    {
      label: t('control.orders_count'),
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


// Fetch dashboard data from API
const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('api/dashboard/warehouse/data');
    if (response.data.success) {
      dashboardData.value = response.data.data;
    } else {
      // Use 'control.error_fetching_data' key
      throw new Error(response.data.message || t('control.error_fetching_data'));
    }
  } catch (err) {
    // Use 'control.error_fetching_data' key
    error.value = (err as any).response?.data?.message || t('control.error_fetching_data');
    console.error('Error fetching dashboard data:', err);


  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

