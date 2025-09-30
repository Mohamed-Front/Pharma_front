<template>
  <div class="min-h-screen bg-[var(--bgColor)] p-4 md:p-6">
    <div class="mb-6">
      <h1 class="font-bold text-[var(--textColor2)] mb-2" style="font-size: clamp(1rem, 2vw + .5rem, 1.8rem);">{{ $t('pharmacy.pharmacy_overview') }}</h1>
      <p class="text-[var(--textColor2)]" style="font-size: clamp(.4rem, 2vw + .3rem, 1rem);">{{ $t('pharmacy.welcome_message') }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div class="bg-[var(--bgColor)] rounded-xl shadow p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-[var(--textColor2)]">{{ $t('pharmacy.total_patients') }}</p>
            <h3 class="text-2xl font-bold text-[var(--textColor)] mt-1">8,765</h3>
            <p class="text-sm mt-2">
              <span class="text-green-500 font-medium">+10%</span>
              <span class="text-[var(--textColor2)] ml-1">{{ $t('pharmacy.from_last_month') }}</span>
            </p>
          </div>
          <div class="bg-blue-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-[var(--bgColor)] rounded-xl shadow p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-[var(--textColor2)]">{{ $t('pharmacy.revenue') }}</p>
            <h3 class="text-2xl font-bold text-[var(--textColor)] mt-1">$62,450</h3>
            <p class="text-sm mt-2">
              <span class="text-green-500 font-medium">+7%</span>
              <span class="text-[var(--textColor2)] ml-1">{{ $t('pharmacy.from_last_month') }}</span>
            </p>
          </div>
          <div class="bg-green-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-[var(--bgColor)] rounded-xl shadow p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-[var(--textColor2)]">{{ $t('pharmacy.prescriptions') }}</p>
            <h3 class="text-2xl font-bold text-[var(--textColor)] mt-1">2,890</h3>
            <p class="text-sm mt-2">
              <span class="text-green-500 font-medium">+6%</span>
              <span class="text-[var(--textColor2)] ml-1">{{ $t('pharmacy.from_last_month') }}</span>
            </p>
          </div>
          <div class="bg-orange-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-[var(--bgColor)] rounded-xl shadow p-6">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-[var(--textColor2)]">{{ $t('pharmacy.fill_rate') }}</p>
            <h3 class="text-2xl font-bold text-[var(--textColor)] mt-1">92.4%</h3>
            <p class="text-sm mt-2">
              <span class="text-green-500 font-medium">+3%</span>
              <span class="text-[var(--textColor2)] ml-1">{{ $t('pharmacy.from_last_month') }}</span>
            </p>
          </div>
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Prescriptions Chart -->
      <div class="bg-[var(--bgColor)] rounded-xl shadow p-6 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-[var(--textColor)]">{{ $t('pharmacy.prescriptions_overview') }}</h2>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg">2023</button>
            <button class="px-3 py-1 text-sm text-[var(--textColor2)] hover:bg-gray-100 rounded-lg">2022</button>
          </div>
        </div>
        <div>
          <canvas ref="prescriptionsChart"></canvas>
        </div>
      </div>

      <!-- Revenue Source Chart -->
      <div class="bg-[var(--bgColor)] rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-[var(--textColor)] mb-4">{{ $t('pharmacy.revenue_sources') }}</h2>
        <div>
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Prescriptions -->
      <div class="bg-[var(--bgColor)] rounded-xl shadow overflow-hidden">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-[var(--textColor)] mb-4">{{ $t('pharmacy.recent_prescriptions') }}</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[var(--mainColor)]">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-[var(--textColor2)] uppercase tracking-wider">{{ $t('pharmacy.table.rx_id') }}</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-[var(--textColor2)] uppercase tracking-wider">{{ $t('pharmacy.table.patient') }}</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-[var(--textColor2)] uppercase tracking-wider">{{ $t('pharmacy.table.date') }}</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-[var(--textColor2)] uppercase tracking-wider">{{ $t('pharmacy.table.amount') }}</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-[var(--textColor2)] uppercase tracking-wider">{{ $t('pharmacy.table.status') }}</th>
              </tr>
            </thead>
            <tbody class="bg-[var(--bgColor)] divide-y divide-gray-200 custom-scrollbar overflow-auto h-[300px]">
              <tr v-for="prescription in prescriptions" :key="prescription.id" class="hover:bg-[var(--hoverColor)]">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--textColor)]">#{{ prescription.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-[var(--textColor2)]">{{ prescription.patient }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-[var(--textColor2)]">{{ prescription.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-[var(--textColor2)]">{{ formatCurrency(prescription.amount) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(prescription.status)}`">
                    {{ prescription.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-3 bg-[var(--bgColor)] text-right">
          <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">{{ $t('pharmacy.view_all') }}</button>
        </div>
      </div>

      <!-- Top Medications -->
      <div class="bg-[var(--bgColor)] rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-[var(--textColor)] mb-4">{{ $t('pharmacy.top_medications') }}</h2>
        <div>
          <canvas ref="medicationsChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// Register Chart.js components
Chart.register(...registerables);

// Refs for chart instances
const prescriptionsChart = ref<HTMLCanvasElement | null>(null);
const revenueChart = ref<HTMLCanvasElement | null>(null);
const medicationsChart = ref<HTMLCanvasElement | null>(null);

// Sample data for prescriptions
const prescriptions = ref([
  { id: 'RX1001', patient: 'James Smith', date: '2023-05-15', amount: 45.99, status: 'Filled' },
  { id: 'RX1002', patient: 'Maria Garcia', date: '2023-05-16', amount: 89.50, status: 'Processing' },
  { id: 'RX1003', patient: 'Robert Johnson', date: '2023-05-17', amount: 120.75, status: 'Filled' },
  { id: 'RX1004', patient: 'Sarah Williams', date: '2023-05-18', amount: 32.25, status: 'Cancelled' },
  { id: 'RX1005', patient: 'David Brown', date: '2023-05-19', amount: 67.80, status: 'Filled' },
  { id: 'RX1006', patient: 'Lisa Jones', date: '2023-05-20', amount: 95.00, status: 'Processing' },
  { id: 'RX1007', patient: 'Michael Miller', date: '2023-05-21', amount: 150.45, status: 'Filled' },
]);

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// Get status class for badges
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Filled':
      return 'bg-green-100 text-green-800';
    case 'Processing':
      return 'bg-blue-100 text-blue-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-[var(--textColor)]';
  }
};

// Initialize charts
onMounted(() => {
  // Prescriptions Chart
  if (prescriptionsChart.value) {
    new Chart(prescriptionsChart.value, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: '2023 Prescriptions',
            data: [1200, 1350, 1100, 1450, 1600, 1700, 1800],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
          {
            label: '2022 Prescriptions',
            data: [1000, 1150, 950, 1200, 1300, 1400, 1500],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  // Revenue Source Chart
  if (revenueChart.value) {
    new Chart(revenueChart.value, {
      type: 'doughnut',
      data: {
        labels: ['Insurance', 'Out-of-Pocket', 'Medicaid', 'Online'],
        datasets: [
          {
            data: [400, 200, 150, 50],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
        },
        cutout: '70%',
      },
    });
  }

  // Medications Chart
  if (medicationsChart.value) {
    new Chart(medicationsChart.value, {
      type: 'bar',
      data: {
        labels: ['Amoxicillin', 'Lisinopril', 'Metformin', 'Ibuprofen', 'Atorvastatin'],
        datasets: [
          {
            label: 'Units Dispensed',
            data: [1200, 900, 750, 600, 450],
            backgroundColor: '#3B82F6',
            borderRadius: 4,
          },
          {
            label: 'Revenue',
            data: [5000, 3500, 2800, 2000, 1500],
            backgroundColor: '#10B981',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }
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
  background-color: var(--hoverColor);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}
.custom-scrollbar {
  scrollbar-color: var(--hoverColor) transparent;
  scrollbar-width: thin;
}
canvas {
  height: 350px !important;
}
@media (max-width: 500px) {
  canvas {
    height: 300px !important;
  }
}
</style>
