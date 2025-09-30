<template>
  <div class="bg-gray-50 min-h-screen p-4 md:p-8">
    <div class="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
      <div class="flex flex-col-reverse md:flex-row items-center text-center gap-6">
        <img
          :src="profile.pharmacy_logo || `https://api.dicebear.com/9.x/initials/svg?seed=${profile.name}`"
          :alt="t('profile.alt')"
          class="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border-4 border-gray-200 shadow-md"
        >
        <div class="flex flex-col items-center gap-2">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">{{ profile.name }}</h1>
          <div class="flex items-center gap-2">
            <i class="pi pi-map-marker text-green-600"></i>
            <span class="text-sm text-gray-700">{{ profile.address }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-phone text-green-600"></i>
            <a :href="'tel:' + profile.phone" class="text-sm text-gray-700">{{ profile.phone }}</a>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-user text-green-600"></i>
            <span class="text-sm text-gray-700">{{ profile.owner_name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-id-card text-green-600"></i>
            <span class="text-sm text-gray-700">{{ profile.license_number }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-start gap-4">
        <div class="flex flex-col items-end gap-2">
          <div class="flex items-center gap-2 mb-2 bg-[#DCFCE7] px-2 rounded-md">
            <span class="text-sm font-semibold text-gray-700">{{ t(`profile.status.${profile.status_description}`) }}</span>
            <span :class="[
              'p-1 rounded-full',
              profile.status_description === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]">
              <i class="pi pi-check text-xs" v-if="profile.status_description === 'active'"></i>
              <i class="pi pi-times text-xs" v-else></i>
            </span>
          </div>
          <button @click="goToEditProfile" class="bg-[#0E3758] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
            {{ t('profile.edit') }}
            <i class="pi pi-file-edit"></i>
          </button>
          <button @click="showLogoutModal = true" class="bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
            {{ t('profile.logout') }}
            <i class="pi pi-sign-out"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-4 mb-6">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900">{{ t('orders.title') }}</h2>
        <button class="text-green-600 hover:underline text-sm font-semibold">{{ t('orders.viewAll') }}</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center mb-10">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && orders.length === 0" class="text-center text-gray-600 py-8">
        <p>{{ t('orders.empty') }}</p>
      </div>

      <!-- Orders Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left rtl:text-right table-auto">
          <thead>
            <tr class="text-gray-500 text-sm border-b border-gray-200">
              <th class="p-4 whitespace-nowrap">{{ t('orders.id') }}</th>
              <th class="p-4 whitespace-nowrap">{{ t('orders.date') }}</th>
              <th class="p-4 whitespace-nowrap">{{ t('orders.warehouse') }}</th>
              <th class="p-4 whitespace-nowrap">{{ t('orders.statu') }}</th>
              <th class="p-4 whitespace-nowrap">{{ t('orders.amount') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b border-gray-100">
              <td class="p-4 text-gray-700 font-medium whitespace-nowrap">{{ order.number }}</td>
              <td class="p-4 text-gray-500 whitespace-nowrap">{{ formatDate(order.created_at) }}</td>
              <td class="p-4 text-gray-700 whitespace-nowrap">{{ order.warehouse.name }}</td>
              <td class="p-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-full',
                    {
                      'bg-green-100 text-green-700': order.status_description === 'delivered',
                      'bg-red-100 text-red-700': order.status_description === 'cancelled',
                      'bg-yellow-100 text-yellow-700': order.status_description === 'pending'
                    }
                  ]"
                >
                  {{ t(`orders.status.${order.status_description}`) }}
                </span>
              </td>
              <td class="p-4 text-gray-700 font-semibold whitespace-nowrap">{{ order.total_price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <Dialog v-model:visible="showLogoutModal" modal header="Confirm Logout" :style="{ width: '25rem' }">
      <p class="m-0 mb-4">{{ t('profile.logoutConfirm') }}</p>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary" @click="showLogoutModal = false" />
        <Button label="Logout" severity="danger" @click="handleLogout" />
      </div>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useAuthStore } from '../../../stores/Auth'
const authStore = useAuthStore()
// Localization and toast
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

// Reactive state
const orders = ref([]);
const loading = ref(false);
const showLogoutModal = ref(false);
const profile = ref({
  id: null,
  name: '',
  owner_name: '',
  license_number: '',
  phone: '',
  address: '',
  lat: '',
  long: '',
  status: null,
  pharmacy_logo: null,
  status_description: ''
});

// Fetch profile data from API
const fetchProfile = async () => {
  try {
    const response = await axios.get('/api/pharmacy/profile/data');
    if (response.data.success && response.data.data) {
      profile.value = response.data.data;
    } else {
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('profile.fetchError'),
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('profile.fetchError'),
      life: 3000,
    });
    console.error('Error fetching profile:', error);
  }
};

// Fetch orders from API
const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/order');
    if (response.data.success && response.data.data) {
      orders.value = response.data.data;
    } else {
      orders.value = [];
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('orders.empty'),
        life: 3000,
      });
    }
  } catch (error) {
    orders.value = [];
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('orders.fetchError'),
      life: 3000,
    });
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false;
  }
};

// Handle logout
const handleLogout = async () => {
  try {
    authStore.pharmacyhandleLogout()
    router.push({ name: 'login' });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('profile.logoutError'),
      life: 3000,
    });
    console.error('Error logging out:', error);
  } finally {
    showLogoutModal.value = false;
  }
};

// Navigate to edit profile page
const goToEditProfile = () => {
  router.push({ name: 'profile-edit' });
};

// Format date to DD MMM YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Initialize data
onMounted(() => {
  fetchProfile();
  fetchOrders();
});
</script>

<style scoped lang="scss">
.font-\[Inter\] {
  font-family: Inter, sans-serif;
}

@media screen and (max-width: 768px) {
  .flex-col.md\:flex-row {
    flex-direction: column;
  }
}
</style>
