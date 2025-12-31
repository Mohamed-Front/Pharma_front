```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8">
    <div class="w-full max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
      <!-- Header -->
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent font-[Inter]">
        {{ $t('profile.title') }}
      </h2>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <ProgressSpinner />
      </div>

      <!-- Profile Form -->
      <div v-else class="space-y-8">
        <!-- Basic Information -->
        <div class="grid gap-6 lg:grid-cols-2 grid-cols-1">
          <div class="relative">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1 font-[Inter]">
              {{ $t('profile.warehouse_name') }} *
            </label>
            <input
              v-model="profile.name"
              id="name"
              name="name"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 font-[Inter]"
              :class="{ 'border-red-500': errors.name }"
              :placeholder="$t('profile.enter_warehouse_name')"
              @input="validateName"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.name">{{ errors.name }}</small>
          </div>

          <div class="relative">
            <label for="owner_name" class="block text-sm font-medium text-gray-700 mb-1 font-[Inter]">
              {{ $t('profile.owner_name') }} *
            </label>
            <input
              v-model="profile.owner_name"
              id="owner_name"
              name="owner_name"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 font-[Inter]"
              :class="{ 'border-red-500': errors.owner_name }"
              :placeholder="$t('profile.enter_owner_name')"
              @input="validateOwnerName"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.owner_name">{{ errors.owner_name }}</small>
          </div>

          <div class="relative">
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1 font-[Inter]">
              {{ $t('profile.phone') }} *
            </label>
            <input
              v-model="profile.phone"
              id="phone"
              name="phone"
              type="tel"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 font-[Inter]"
              :class="{ 'border-red-500': errors.phone }"
              :placeholder="$t('profile.enter_phone')"
              @input="validatePhone"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.phone">{{ errors.phone }}</small>
          </div>

          <div class="relative">
            <label for="country" class="block text-sm font-medium text-gray-700 mb-1 font-[Inter]">
              {{ $t('profile.country') }} *
            </label>
            <input
              v-model="profile.country"
              id="country"
              name="country"
              type="text"
              readonly
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 font-[Inter]"
              :class="{ 'border-red-500': errors.country }"
              :placeholder="$t('profile.enter_country')"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.country">{{ errors.country }}</small>
          </div>

          <div class="relative">
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1 font-[Inter]">
              {{ $t('profile.city') }} *
            </label>
            <select
              v-model="profile.city"
              id="city"
              name="city"
              required
              @change="updateMapLocation"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 font-[Inter]"
              :class="{ 'border-red-500': errors.city }"
            >
              <option value="" disabled selected>اختر المدينة</option>
              <option v-for="city in cities" :key="city.name" :value="city.name" >
                {{ city.name }}
              </option>
            </select>
            <small class="text-red-500 mt-1 block" v-if="errors.city">{{ errors.city }}</small>
          </div>

          <div class="relative">
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1 font-[Inter]">
              {{ $t('profile.address') }} *
            </label>
            <input
              v-model="profile.address"
              id="address"
              name="address"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 font-[Inter]"
              :class="{ 'border-red-500': errors.address }"
              :placeholder="$t('profile.enter_address')"
              @input="validateAddress"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.address">{{ errors.address }}</small>
          </div>

          <div class="relative">
            <label for="license_number" class="block text-sm font-medium text-gray-700 mb-1 font-[Inter]">
              {{ $t('profile.license_number') }}
            </label>
            <input
              v-model="profile.license_number"
              id="license_number"
              name="license_number"
              type="text"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 font-[Inter]"
              :placeholder="$t('profile.enter_license_number')"
            />
          </div>


        </div>

        <!-- Location Information -->
        <div class="space-y-6">
          <h4 class="text-xl font-semibold text-gray-800 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent font-[Inter]">
            {{ $t('profile.location_information') }}
          </h4>
          <div v-if='iframeSrc' class="w-full h-80 rounded-lg overflow-hidden shadow-md">
              <iframe
                :src="iframeSrc"
                width="100%"
                height="100%"
                style="border:0;"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>


          </div>
        </div>

        <!-- Pharmacy Logo -->
        <div class="space-y-6">
          <h4 class="text-xl font-semibold text-gray-800 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent font-[Inter]">
            {{ $t('profile.pharmacy_logo') }}
          </h4>
          <div class="relative">
            <label
              @dragover.prevent="handleDragOver('pharmacy_logo')"
              @dragleave="handleDragLeave('pharmacy_logo')"
              @drop.prevent="onImageUpload($event, 'pharmacy_logo')"
              :class="{ 'border-green-400 bg-green-50': isDragging.pharmacy_logo, 'border-gray-200': !isDragging.pharmacy_logo }"
              class="w-full h-28 rounded-lg cursor-pointer transition-all duration-300 hover:border-green-400 border"
            >
              <input
                type="file"
                @change="onImageUpload($event, 'pharmacy_logo')"
                accept="image/*"
                class="hidden"
                id="pharmacy_logo"
              />
              <div v-if="profile.pharmacy_logo_preview || profile.pharmacy_logo" class="p-4">
                <div class="relative group">
                  <img
                    :src="profile.pharmacy_logo_preview || profile.pharmacy_logo"
                    alt="Pharmacy Logo Preview"
                    class="object-cover w-full h-32 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
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
                <p class="mt-2 text-sm text-center text-gray-500 font-[Inter]">{{ $t('profile.click_or_drag_to_change_photo') }}</p>
              </div>
              <div v-else class="flex flex-col items-center justify-center h-full p-4">
                <div class="p-3 mb-2 bg-green-100 rounded-full">
                  <i class="text-xl text-green-500 pi pi-image"></i>
                </div>
                <p class="mb-1 text-sm text-center text-gray-600 font-[Inter]">
                  <span class="font-medium text-green-500">{{ $t('profile.click_to_upload') }}</span> {{ $t('profile.or_drag_and_drop') }}
                </p>
                <p class="text-xs text-gray-400 font-[Inter]">SVG, PNG, JPG or GIF (max. 1MB)</p>
              </div>
            </label>
          </div>
        </div>


        <!-- Action Buttons -->
        <div class="flex justify-between mt-8">

          <Button
            :label="$t('profile.save_changes')"
            :disabled="!isFormValid || isSubmitting"
            :loading="isSubmitting"
            class="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-300 font-[Inter]"
            @click="submitForm"
          />
        </div>
      </div>

      <!-- Logout Confirmation Modal -->
      <Dialog
        v-model:visible="showLogoutModal"
        :header="$t('profile.logout')"
        modal
        :style="{ width: '400px' }"
        class="font-[Inter]"
      >
        <p class="mb-4">{{ $t('profile.logout_confirm') }}</p>
        <div class="flex justify-end space-x-4">
          <Button
            :label="$t('profile.cancel')"
            text
            @click="showLogoutModal = false"
          />
          <Button
            :label="$t('profile.logout')"
            severity="danger"
            @click="handleLogout"
          />
        </div>
      </Dialog>

      <Toast />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { GoogleMap, Marker } from 'vue3-google-map';
import { useAuthStore } from '@/stores/Auth';

const authStore = useAuthStore();
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

// Cities data
const cities = ref([])
 const Getcities=()=>{
  axios.get(`api/city?type=warehouse&status=1`).then((res)=>{
    cities.value=res.data.data
  })
 }

onMounted(() => {
  Getcities()
})
// Filter active cities
const activeCities = computed(() => cities.value.filter(city => city.Status === 'active'));
const defualtelink=ref('')
// Reactive state
const orders = ref([]);
const loading = ref(false);
const isSubmitting = ref(false);
const showLogoutModal = ref(false);
const isDragging = ref({
  pharmacy_logo: false,
});
const profile = reactive({
  id: null as number | null,
  name: '',
  owner_name: '',
  license_number: '',
  phone: '',
  country: 'سوريا',
  city: '',
  address: '',
  lat: '',
  long: '',
  location_link: '',
  status: null as number | null,
  status_description: '',
  total_rating: null as number | null,
  media: [] as any[],
  pharmacy_logo: null as string | null,
  pharmacy_logo_preview: null as string | null,
  pharmacy_logo_file: null as File | null,
});
const errors = reactive({
  name: '',
  owner_name: '',
  phone: '',
  country: '',
  city: '',
  address: '',
});
const iframeSrc = computed(() => {
  if (profile.location_link) {
    // Google Maps embed URL from the simple q=lat,lng link
     const embed = `https://www.google.com/maps?q=${profile.lat},${profile.long}&hl=es;z=14&output=embed`
    return embed
  }else{
    return defualtelink.value
  }
})
// Fetch profile data
const fetchProfile = async () => {
  try {
    const response = await axios.get('/api/warehouse/profile/data');
    if (response.data.success && response.data.data) {
      Object.assign(profile, response.data.data);
      profile.country = 'سوريا'; // Ensure country is set to Syria
      if (response.data.data.media && response.data.data.media.length > 0) {
        profile.pharmacy_logo = response.data.data.media[0].url;
      }
      defualtelink.value = `https://www.google.com/maps?q=${response.data.data.lat},${response.data.data.long}&hl=es;z=14&output=embed`
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

// Fetch orders
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

// Validation functions
const validateName = () => {
  if (!profile.name.trim()) {
    errors.name = t('profile.warehouse_name_required');
  } else {
    errors.name = '';
  }
};

const validateOwnerName = () => {
  if (!profile.owner_name.trim()) {
    errors.owner_name = t('profile.owner_name_required');
  } else {
    errors.owner_name = '';
  }
};

const validatePhone = () => {
  if (!profile.phone.trim()) {
    errors.phone = t('profile.phone_required');
  } else if (profile.phone.length > 15) {
    errors.phone = t('profile.phone_too_long');
  } else {
    errors.phone = '';
  }
};

const validateCountry = () => {
  if (!profile.country.trim()) {
    errors.country = t('profile.country_required');
  } else {
    errors.country = '';
  }
};

const validateCity = () => {
  if (!profile.city.trim()) {
    errors.city = t('profile.city_required');
  } else {
    errors.city = '';
  }
};

const validateAddress = () => {
  if (!profile.address.trim()) {
    errors.address = t('profile.address_required');
  } else {
    errors.address = '';
  }
};

// Form validation
const isFormValid = computed(() => {
  return (
    profile.name.trim() !== '' &&
    profile.owner_name.trim() !== '' &&
    profile.phone.trim() !== '' &&
    profile.phone.length <= 15 &&
    profile?.country !== '' &&
    profile?.city !== '' &&
    profile.address.trim() !== '' &&
    !errors.name &&
    !errors.owner_name &&
    !errors.phone &&
    !errors.country &&
    !errors.city &&
    !errors.address
  );
});

// Image upload handlers
const handleDragOver = (type: 'pharmacy_logo') => {
  isDragging.value[type] = true;
};

const handleDragLeave = (type: 'pharmacy_logo') => {
  isDragging.value[type] = false;
};

const onImageUpload = (event: Event | DragEvent, type: 'pharmacy_logo') => {
  const file = (event as DragEvent).dataTransfer?.files?.[0] || (event.target as HTMLInputElement).files?.[0];
  if (file) {
    if (!file.type.match('image.*')) {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('profile.invalid_image_type'),
        life: 3000,
      });
      return;
    }
    if (file.size > 1024 * 1024) {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('profile.image_too_large'),
        life: 3000,
      });
      return;
    }
    profile[`${type}_file`] = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      profile[`${type}_preview`] = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    isDragging.value[type] = false;
  }
};

const removeImage = (type: 'pharmacy_logo') => {
  profile[`${type}_file`] = null;
  profile[`${type}_preview`] = null;
  profile.pharmacy_logo = null;
  const input = document.getElementById(type) as HTMLInputElement;
  if (input) input.value = '';
};

const editImage = (type: 'pharmacy_logo') => {
  const input = document.getElementById(type) as HTMLInputElement;
  if (input) input.click();
};

// Map click handler
const handleMapClick = (event: any) => {
  const clickedLatLng = event.latLng;
  profile.lat = clickedLatLng.lat().toString();
  profile.long = clickedLatLng.lng().toString();
  profile.location_link = `https://www.google.com/maps?q=${profile.lat},${profile.long}`;
};

// Update map location when city is selected
const updateMapLocation = () => {
  const selectedCity = cities.value.find(city => city.name === profile.city)
  if (selectedCity) {
    profile.lat = selectedCity.lat.toString()
    profile.long = selectedCity.long.toString()
    profile.location_link = `https://www.google.com/maps?q=${selectedCity.lat},${selectedCity.long}`
  }
}


// Form submission
const submitForm = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  // Validate form
  validateName();
  validateOwnerName();
  validatePhone();
  validateCountry();
  validateCity();
  validateAddress();

  if (!isFormValid.value) {
    isSubmitting.value = false;
    return;
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('name', profile.name);
  formData.append('owner_name', profile.owner_name);
  formData.append('phone', profile.phone);
  formData.append('country', profile.country);
  formData.append('city', profile.city);
  formData.append('address', profile.address);
  if (profile.license_number) formData.append('license_number', profile.license_number);
  if (profile.lat) formData.append('lat', profile.lat);
  if (profile.long) formData.append('long', profile.long);
  if (profile.location_link) formData.append('location_link', profile.location_link);
  if (profile.pharmacy_logo_file) formData.append('pharmacy_logo', profile.pharmacy_logo_file);

  try {
    const response = await axios.post('/api/warehouse/profile/update', formData);
    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('profile.update_success'),
        life: 3000,
      });
      await fetchProfile();
    } else {
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('profile.update_failed'),
        life: 3000,
      });
    }
  } catch (error) {
    const message = error.response?.data?.errors
      ? Object.values(error.response.data.errors).join(', ')
      : t('profile.update_failed');
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: message,
      life: 3000,
    });
    console.error('Error updating profile:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// Handle logout
const handleLogout = async () => {
  try {
    await authStore.pharmacyhandleLogout();
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

// Format date
const formatDate = (dateString: string) => {
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

.transition-all {
  transition-property: all;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
}

.border-red-500 {
  border-color: #ef4444;
}

.text-red-500 {
  color: #ef4444;
}

input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

label:hover {
  background-color: rgba(16, 185, 129, 0.05);
}

@media screen and (max-width: 768px) {
  .flex-col.md\:flex-row {
    flex-direction: column;
  }
}
</style>
```
