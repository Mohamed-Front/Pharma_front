<template>
  <div class="bg-gray-50 min-h-screen p-4 md:p-8">
    <div
      class="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-8"
    >
      <div class="flex flex-col-reverse md:flex-row items-center text-center gap-6">
        <img
          :src="profile.pharmacy_logo || `https://api.dicebear.com/9.x/initials/svg?seed=${profile.name}`"
          :alt="t('profile.alt')"
          class="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border-4 border-gray-200 shadow-md"
        />
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
            <span class="text-sm font-semibold text-gray-700">{{ t(`${profile.status_description}`) }}</span>

          </div>
          <button
            @click="openEditProfileModal"
            class="bg-[#0E3758] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors hover:bg-opacity-90"
          >
            {{ t('profile.edit') }}
            <i class="pi pi-file-edit"></i>
          </button>
          <button
            @click="showLogoutModal = true"
            class="bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors hover:bg-red-700"
          >
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

      <div v-if="loading" class="flex justify-center mb-10">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>

      <div v-else-if="!loading && orders.length === 0" class="text-center text-gray-600 py-8">
        <p>{{ t('orders.empty') }}</p>
      </div>

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
                      'bg-yellow-100 text-yellow-700': order.status_description === 'pending',
                    },
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

    <Dialog
      v-model:visible="showEditModal"
      modal
      :header="t('profile.edit')"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      class="p-dialog-rounded"
    >
      <div class="p-fluid grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="field">
          <label for="name" class="font-bold">{{ t('profile.name') }}</label>
          <InputText
            id="name"
            v-model="editProfileData.name"
            :placeholder="t('profile.name')"
            class="p-inputtext-sm"
          />
        </div>

        <div class="field">
          <label for="owner_name" class="font-bold">{{ t('profile.owner_name') }}</label>
          <InputText
            id="owner_name"
            v-model="editProfileData.owner_name"
            :placeholder="t('profile.owner_name')"
            class="p-inputtext-sm"
          />
        </div>

        <div class="field">
          <label for="license_number" class="font-bold">{{ t('profile.license_number') }}</label>
          <InputText
            id="license_number"
            v-model="editProfileData.license_number"
            :placeholder="t('profile.license_number')"
            class="p-inputtext-sm"
          />
        </div>

        <div class="field">
          <label for="phone" class="font-bold">{{ t('profile.phone') }}</label>
          <InputText
            id="phone"
            v-model="editProfileData.phone"
            :placeholder="t('profile.phone')"
            class="p-inputtext-sm"
          />
        </div>

        <div class="field md:col-span-2">
          <label for="address" class="font-bold">{{ t('profile.address') }}</label>
          <InputText
            id="address"
            v-model="editProfileData.address"
            :placeholder="t('profile.address')"
            class="p-inputtext-sm"
          />
        </div>

        <div class="field">
          <label for="lat" class="font-bold">{{ t('profile.lat') }}</label>
          <InputText
            id="lat"
            v-model="editProfileData.lat"
            :placeholder="t('profile.lat')"
            class="p-inputtext-sm bg-gray-100 cursor-not-allowed"
            readonly
          />
        </div>

        <div class="field">
          <label for="long" class="font-bold">{{ t('profile.long') }}</label>
          <InputText
            id="long"
            v-model="editProfileData.long"
            :placeholder="t('profile.long')"
            class="p-inputtext-sm bg-gray-100 cursor-not-allowed"
            readonly
          />
        </div>

        <div class="field md:col-span-2">
          <label class="font-bold">{{ t('profile.location') }}</label>
          <GoogleMap
            @click="handleMapClick"
            style="width: 100%; height: 300px; border-radius: 8px; overflow: hidden;"
            :center="{ lat: editProfileData.lat ? parseFloat(editProfileData.lat) : 33.5158, lng: editProfileData.long ? parseFloat(editProfileData.long) : 36.2939 }"
            :zoom="14"
            class="shadow-md"
          >
            <Marker
              v-if="editProfileData.lat && editProfileData.long"
              :options="{ position: { lat: parseFloat(editProfileData.lat), lng: parseFloat(editProfileData.long) } }"
            />
          </GoogleMap>
          <small class="text-gray-500">{{ t('profile.map_instruction') }}</small>
        </div>

        <div class="field md:col-span-2">
          <label class="font-bold text-center">{{ t('profile.pharmacy_logo') }}</label>
          <label
            @dragover.prevent="handleDragOver('pharmacy_logo')"
            @dragleave="handleDragLeave('pharmacy_logo')"
            @drop.prevent="onImageUpload($event, 'pharmacy_logo')"
            :class="{ 'border-green-400 bg-green-50': isDragging.pharmacy_logo, 'border-gray-200': !isDragging.pharmacy_logo }"
            class="w-full h-40 rounded-lg cursor-pointer transition-all duration-300 hover:border-green-400 border-2 border-dashed"
          >
            <input
              type="file"
              @change="onImageUpload($event, 'pharmacy_logo')"
              accept="image/*"
              class="hidden"
              id="pharmacy_logo"
            />
            <div v-if="editProfileData.pharmacy_logo_preview" class="p-4">
              <div class="relative group">
                <img
                  :src="editProfileData.pharmacy_logo_preview"
                  alt="Pharmacy Logo Preview"
                  class="object-contain w-full h-32 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-40 transition-all duration-300">
                  <div class="space-x-3 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                      type="button"
                      @click.stop="removeImage('pharmacy_logo')"
                      class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <i class="text-sm pi pi-trash"></i>
                    </button>
                    <button
                      type="button"
                      @click.stop="editImage('pharmacy_logo')"
                      class="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition"
                    >
                      <i class="text-sm pi pi-pencil"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center h-full p-4">
              <div class="p-3 mb-2 bg-green-100 rounded-full">
                <i class="text-xl text-green-500 pi pi-image"></i>
              </div>
              <p class="mb-1 text-sm text-center text-gray-600">
                <span class="font-medium text-green-500">{{ t('auth.click_to_upload') }}</span> {{ t('auth.or_drag_and_drop') }}
              </p>
              <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
            </div>
          </label>
        </div>
      </div>

      <template #footer>
        <Button
          :label="t('common.cancel')"
          icon="pi pi-times"
          @click="showEditModal = false"
          class="p-button-secondary"
          text
        />
        <Button
          :label="t('common.save')"
          icon="pi pi-check"
          @click="updateProfile"
          :loading="isSaving"
          class="bg-[#0E3758] text-white hover:bg-[#1a5b8f] border-transparent"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showLogoutModal"
      modal
      :header="t('profile.confirmLogout')"
      :style="{ width: '25rem' }"
      class="p-dialog-rounded"
    >
      <p class="m-0 mb-4">{{ t('profile.logoutConfirm') }}</p>
      <div class="flex justify-end gap-2">
        <Button
          :label="t('common.cancel')"
          severity="secondary"
          @click="showLogoutModal = false"
          class="p-button-secondary"
        />
        <Button :label="t('profile.logout')" severity="danger" @click="handleLogout" />
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
import InputText from 'primevue/inputtext';
import { GoogleMap, Marker } from 'vue3-google-map'; // <-- Import Google Map components
import { useAuthStore } from '../../../stores/Auth';

const authStore = useAuthStore();
// Localization and toast
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

// Reactive state
const orders = ref([]);
const loading = ref(false);
const showLogoutModal = ref(false);
const showEditModal = ref(false);
const isSaving = ref(false);

// State for logo upload and drag-and-drop
const isDragging = ref({ pharmacy_logo: false });
const newLogoFile = ref(null); // Holds the new File object for upload

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
  status_description: '',
});

// Reactive data for editing (a copy of the profile)
const editProfileData = ref({
  ...profile.value,
  pharmacy_logo_preview: null, // New reactive property for local logo preview
});

// Drag and drop handlers
const handleDragOver = (type) => {
  isDragging.value[type] = true;
};

const handleDragLeave = (type) => {
  isDragging.value[type] = false;
};

// Image Upload Handler
const onImageUpload = (event, type) => {
  const file = (event.dataTransfer?.files?.[0] || event.target.files?.[0]);
  if (file) {
    if (!file.type.match('image.*')) {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('auth.invalid_image_type'),
        life: 3000,
      });
      return;
    }
    if (file.size > 1024 * 1024) { // 1MB limit
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('auth.image_too_large'),
        life: 3000,
      });
      return;
    }

    // Set the new file for upload
    newLogoFile.value = file;
    // Set the preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      editProfileData.value.pharmacy_logo_preview = e.target?.result;
    };
    reader.readAsDataURL(file);
    isDragging.value[type] = false;
  }
};

const removeImage = (type) => {
  newLogoFile.value = null;
  editProfileData.value.pharmacy_logo_preview = null;
  // This will display the old logo from profile.pharmacy_logo until save, or initials if the old logo was null
  // We explicitly set the logo on the profile to null so the server knows to remove it on save, only if it wasn't null before.
  if (profile.value.pharmacy_logo) {
    editProfileData.value.pharmacy_logo = null;
  }

  const input = document.getElementById(type);
  if (input) input.value = '';
};

const editImage = (type) => {
  const input = document.getElementById(type);
  if (input) input.click();
};

// Map click handler for coordinates
const handleMapClick = (event) => {
  const clickedLatLng = event.latLng;
  const lat = clickedLatLng.lat();
  const lng = clickedLatLng.lng();
  editProfileData.value.lat = lat.toString();
  editProfileData.value.long = lng.toString();
};

// Function to open the edit modal and populate data
const openEditProfileModal = () => {
  // Deep copy of the current profile data
  editProfileData.value = { ...profile.value };
  // Set the initial logo preview to the existing logo URL
  editProfileData.value.pharmacy_logo_preview = profile.value.pharmacy_logo;
  // Reset the new file input
  newLogoFile.value = null;
  showEditModal.value = true;
};

// Function to handle profile update
const updateProfile = async () => {
  isSaving.value = true;
  try {
    const formData = new FormData();

    // Append all editable text fields
    formData.append('name', editProfileData.value.name);
    formData.append('owner_name', editProfileData.value.owner_name);
    formData.append('license_number', editProfileData.value.license_number || '');
    formData.append('phone', editProfileData.value.phone);
    formData.append('address', editProfileData.value.address);
    formData.append('lat', editProfileData.value.lat);
    formData.append('long', editProfileData.value.long);
    // Add the spoofing method for Laravel PUT/PATCH requests with FormData


    // Append the new logo file if a new one was selected
    if (newLogoFile.value) {
      formData.append('pharmacy_logo', newLogoFile.value);
    }
    // Handle logo removal case
    else if (profile.value.pharmacy_logo && editProfileData.value.pharmacy_logo === null) {
        // If the old profile had a logo, and the edit data now has null (due to removeImage)
        formData.append('remove_logo', 1); // Signal to the backend to remove the logo
    }

    const response = await axios.post('/api/pharmacy/profile/update', formData, {

    });

    if (response.data.success) {
      // Update the main profile data with the new values
      profile.value = { ...editProfileData.value };
      // After a successful update, the logo is no longer "new", so reset the file
      newLogoFile.value = null;
      showEditModal.value = false;
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('profile.updateSuccess'),
        life: 3000,
      });
      // Re-fetch profile data to ensure all server-side updates (like logo URL) are captured
      await fetchProfile();
    } else {
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: response.data.message || t('profile.updateError'),
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('profile.updateError'),
      life: 3000,
    });
    console.error('Error updating profile:', error);
  } finally {
    isSaving.value = false;
  }
};

// Fetch profile data from API
const fetchProfile = async () => {
  try {
    const response = await axios.get('/api/pharmacy/profile/data');
    if (response.data.success && response.data.data) {
      profile.value = response.data.data;
      // Also update the editable copy and its preview
      editProfileData.value = { ...response.data.data };
      editProfileData.value.pharmacy_logo_preview = response.data.data.pharmacy_logo;
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
      // Suppress toast for empty orders, the empty state handles it
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
    // Assuming authStore.pharmacyhandleLogout handles API call and token cleanup
    authStore.pharmacyhandleLogout();
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

// Format date to DD MMM YYYY (Adjust locale 'ar-EG' as needed for your project's target language)
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

// Custom styling for a fancier Dialog/Modal
:deep(.p-dialog-rounded) {
  border-radius: 12px;
  .p-dialog-header {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    background-color: #f8f9fa; /* Light grey header */
    padding-bottom: 1rem;
    .p-dialog-title {
      font-weight: 700;
      color: #0e3758; /* Dark blue title */
    }
  }
  .p-dialog-content {
    padding-top: 1rem;
  }
  .p-dialog-footer {
    border-top: 1px solid #e9ecef;
    padding-top: 1rem;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.p-inputtext-sm {
  padding: 0.75rem 0.75rem;
  font-size: 0.875rem; /* text-sm */
}
</style>
