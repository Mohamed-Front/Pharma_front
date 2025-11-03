<template>
  <va-card class="card">
    <div class="flex justify-center">
      <form @submit.prevent="onSubmit" class="flex flex-col w-3/4 py-9">
        <h2 class="pb-4 text-center va-text-bold">
          {{ $t('settings.updateSettings') }}
        </h2>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">
            {{ $t('settings.email') }}
          </label>
          <InputText
            id="email"
            v-model="setting.email"
            type="email"
            required
            aria-required="true"
            class="mt-2 w-full border rounded p-2"
            :class="{ 'border-red-500': errors.email }"
            @input="validateEmail"
          />
          <div v-if="errors.email || error?.email" class="mt-1 text-red-500 text-sm">
            {{ errors.email || error.email?.[0] }}
          </div>
        </div>

        <!-- Phone -->
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700">
            {{ $t('settings.phone') }}
          </label>
          <InputText
            id="phone"
            v-model="setting.phone"
            type="text"
            required
            aria-required="true"
            class="mt-2 w-full border rounded p-2"
            :class="{ 'border-red-500': errors.phone }"
            @input="validatePhone"
          />
          <div v-if="errors.phone || error?.phone" class="mt-1 text-red-500 text-sm">
            {{ errors.phone || error.phone?.[0] }}
          </div>
        </div>

        <!-- Location -->
        <div class="mb-4">
          <label for="location" class="block text-sm font-medium text-gray-700">
            {{ $t('settings.location') }}
          </label>
          <InputText
            id="location"
            v-model="setting.location"
            type="text"
            required
            aria-required="true"
            class="mt-2 w-full border rounded p-2"
            :class="{ 'border-red-500': errors.location }"
          />
          <div v-if="errors.location || error?.location" class="mt-1 text-red-500 text-sm">
            {{ errors.location || error.location?.[0] }}
          </div>
        </div>

        <!-- Google Map -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('settings.mapLocation') }}
          </label>
          <GoogleMap
            style="width: 100%; height: 400px; border-radius: 8px;"
            :center="mapCenter"
            :zoom="10"
            @click="handleMapClick"
            class="rounded border shadow-md"
          >
            <Marker
              v-if="setting.lat && setting.long"
              :options="{ position: { lat: parseFloat(setting.lat), lng: parseFloat(setting.long) } }"
            />
          </GoogleMap>
          <div class="mt-2 text-sm text-gray-600">
            {{ $t('settings.currentCoords') }}: {{ setting.lat || 'Not set' }}, {{ setting.long || 'Not set' }}
          </div>
          <div v-if="errors.lat || errors.long || error?.lat || error?.long" class="mt-1 text-red-500 text-sm">
            <span v-if="errors.lat || error?.lat">{{ errors.lat || error.lat?.[0] }}</span>
            <span v-if="errors.long || error?.long">{{ errors.long || error.long?.[0] }}</span>
          </div>
        </div>

        <!-- Privacy Policy -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">
            {{ $t('settings.privacyPolicy') }}
          </label>
          <Editor
            id="privacy_policy"
            v-model="currentPrivacyPolicy"
            editorStyle="height: 200px"
            class="my-2"
          />
          <div v-if="error?.privacy_policy" class="mt-1 text-red-500 text-sm">
            {{ error.privacy_policy?.[0] }}
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">
            {{ $t('settings.termsConditions') }}
          </label>
          <Editor
            id="terms_and_conditions"
            v-model="currentTermsConditions"
            editorStyle="height: 200px"
            class="my-2"
          />
          <div v-if="error?.terms_and_conditions" class="mt-1 text-red-500 text-sm">
            {{ error.terms_and_conditions?.[0] }}
          </div>
        </div>

        <!-- Main Logo Upload -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">
            {{ $t('settings.mainLogo') }}
          </label>
          <div class="flex justify-center mt-2">
            <label
              @dragover.prevent="handleDragOver('main')"
              @dragleave="handleDragLeave('main')"
              @drop.prevent="onImageUpload($event, 'main')"
              :class="{ 'border-blue-500 bg-blue-50': isDraggingMain, 'border-gray-300': !isDraggingMain }"
              class="cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition duration-300"
            >
              <input
                type="file"
                @change="onImageUpload($event, 'main')"
                accept="image/*"
                class="hidden"
                aria-label="Upload main logo"
                id="main-logo-upload"
              />
              <div v-if="mainLogoPreview" class="p-4">
                <div class="relative group">
                  <img
                    :src="mainLogoPreview"
                    alt="Main Logo Preview"
                    class="w-full max-h-64 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <div class="opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button
                        type="button"
                        @click.stop="removeImage('main')"
                        class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <i class="pi pi-trash text-sm"></i>
                      </button>
                      <label
                        class="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                      >
                        <i class="pi pi-pencil text-sm"></i>
                        <input
                          type="file"
                          @change="onImageUpload($event, 'main')"
                          accept="image/*"
                          class="hidden"
                          aria-label="Replace main logo"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">{{ $t('settings.changeLogo') }}</p>
              </div>
              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-image text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{ $t('settings.upload') }}</span> {{ $t('settings.orDragDrop') }}
                </p>
                <p class="text-xs text-gray-400">{{ $t('settings.fileTypes') }}</p>
              </div>
            </label>
          </div>
          <div v-if="errors.mainLogo" class="mt-1 text-red-500 text-sm">
            {{ errors.mainLogo }}
          </div>
        </div>

        <!-- Footer Logo Upload -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">
            {{ $t('settings.footerLogo') }}
          </label>
          <div class="flex justify-center mt-2">
            <label
              @dragover.prevent="handleDragOver('footer')"
              @dragleave="handleDragLeave('footer')"
              @drop.prevent="onImageUpload($event, 'footer')"
              :class="{ 'border-blue-500 bg-blue-50': isDraggingFooter, 'border-gray-300': !isDraggingFooter }"
              class="cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition duration-300"
            >
              <input
                type="file"
                @change="onImageUpload($event, 'footer')"
                accept="image/*"
                class="hidden"
                aria-label="Upload footer logo"
                id="footer-logo-upload"
              />
              <div v-if="footerLogoPreview" class="p-4">
                <div class="relative group">
                  <img
                    :src="footerLogoPreview"
                    alt="Footer Logo Preview"
                    class="w-full max-h-64 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <div class="opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button
                        type="button"
                        @click.stop="removeImage('footer')"
                        class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <i class="pi pi-trash text-sm"></i>
                      </button>
                      <label
                        class="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                      >
                        <i class="pi pi-pencil text-sm"></i>
                        <input
                          type="file"
                          @change="onImageUpload($event, 'footer')"
                          accept="image/*"
                          class="hidden"
                          aria-label="Replace footer logo"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-500">{{ $t('settings.changeLogo') }}</p>
              </div>
              <div v-else class="p-8 flex flex-col items-center justify-center">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-image text-blue-500 text-2xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{ $t('settings.upload') }}</span> {{ $t('settings.orDragDrop') }}
                </p>
                <p class="text-xs text-gray-400">{{ $t('settings.fileTypes') }}</p>
              </div>
            </label>
          </div>
          <div v-if="errors.footerLogo" class="mt-1 text-red-500 text-sm">
            {{ errors.footerLogo }}
          </div>
        </div>

        <!-- Banners Upload -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">
            {{ $t('settings.banners') }} ({{ banners.length }})
          </label>
          <div class="flex justify-center mt-2">
            <label
              @dragover.prevent="handleDragOver('banners')"
              @dragleave="handleDragLeave('banners')"
              @drop.prevent="onBannerUpload($event)"
              :class="{ 'border-blue-500 bg-blue-50': isDraggingBanners, 'border-gray-300': !isDraggingBanners }"
              class="cursor-pointer w-full max-w-4xl rounded-xl border-2 border-dashed transition duration-300 p-6"
            >
              <input
                type="file"
                multiple
                @change="onBannerUpload($event)"
                accept="image/*"
                class="hidden"
                id="banners-upload"
              />
              <div v-if="banners.length === 0" class="flex flex-col items-center justify-center py-8">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-images text-blue-500 text-3xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{ $t('settings.uploadBanners') }}</span> {{ $t('settings.orDragDrop') }}
                </p>
                <p class="text-xs text-gray-400">{{ $t('settings.fileTypes') }}</p>
              </div>

              <!-- Banners Grid -->
              <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                <div
                  v-for="(banner, index) in banners"
                  :key="index"
                  class="relative group"
                >
                  <img
                    :src="banner.preview"
                    alt="Banner Preview"
                    class="w-full h-32 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300 rounded-lg">
                    <div class="opacity-0 group-hover:opacity-100 space-x-2 transition-all duration-300">
                      <button
                        type="button"
                        @click.stop="removeBanner(index)"
                        class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      >
                        <i class="pi pi-trash text-sm"></i>
                      </button>
                      <label
                        class="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                      >
                        <i class="pi pi-pencil text-sm"></i>
                        <input
                          type="file"
                          @change="replaceBanner($event, index)"
                          accept="image/*"
                          class="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Add More Button -->
                <label
                  class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition h-32"
                >
                  <i class="pi pi-plus text-2xl text-gray-400 mb-1"></i>
                  <span class="text-xs text-gray-500">{{ $t('settings.addMore') }}</span>
                  <input
                    type="file"
                    multiple
                    @change="onBannerUpload($event)"
                    accept="image/*"
                    class="hidden"
                  />
                </label>
              </div>
            </label>
          </div>
          <div v-if="errors.banners" class="mt-1 text-red-500 text-sm">
            {{ errors.banners }}
          </div>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          :label="isSubmitting ? $t('settings.updating') : $t('settings.update')"
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded p-2"
          :disabled="isSubmitting || !isFormValid"
        />
      </form>
    </div>

    <Toast />
  </va-card>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Editor from 'primevue/editor';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { GoogleMap, Marker } from 'vue3-google-map';

const { t, locale } = useI18n();
const toast = useToast();
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
const apiUrl = import.meta.env.VITE_API_URL || 'https://backend.pharmabank.sy';

// Get/Set app language from localStorage
const getAppLang = () => localStorage.getItem('appLang') || 'en';
const appLang = ref(getAppLang());
locale.value = appLang.value;

/* ------------------------------------------------------------------ */
/* Reactive data                                                      */
/* ------------------------------------------------------------------ */
const setting = ref({
  id: null,
  email: '',
  phone: '',
  location: '',
  lat: '',
  long: '',
  privacy_policy_en: '',
  privacy_policy_ar: '',
  terms_and_conditions_en: '',
  terms_and_conditions_ar: '',
  media: [],
});

const currentPrivacyPolicy = computed({
  get: () => (appLang.value === 'ar' ? setting.value.privacy_policy_ar || '' : setting.value.privacy_policy_en || ''),
  set: (value) => {
    if (appLang.value === 'ar') {
      setting.value.privacy_policy_ar = value;
    } else {
      setting.value.privacy_policy_en = value;
    }
  },
});

const currentTermsConditions = computed({
  get: () => (appLang.value === 'ar' ? setting.value.terms_and_conditions_ar || '' : setting.value.terms_and_conditions_en || ''),
  set: (value) => {
    if (appLang.value === 'ar') {
      setting.value.terms_and_conditions_ar = value;
    } else {
      setting.value.terms_and_conditions_en = value;
    }
  },
});

const errors = reactive({
  email: '',
  phone: '',
  location: '',
  lat: '',
  long: '',
  mainLogo: '',
  footerLogo: '',
  banners: '',
});

const error = ref({});
const mainLogoFile = ref(null);
const footerLogoFile = ref(null);
const mainLogoPreview = ref(null);
const footerLogoPreview = ref(null);
const isDraggingMain = ref(false);
const isDraggingFooter = ref(false);
const isDraggingBanners = ref(false);
const isSubmitting = ref(false);

// Banners
const banners = ref([]); // { file, preview }

watch(appLang, (newLang) => {
  locale.value = newLang;
  localStorage.setItem('appLang', newLang);
});

/* ------------------------------------------------------------------ */
/* Computed properties                                                */
/* ------------------------------------------------------------------ */
const mapCenter = computed(() => ({
  lat: setting.value.lat ? parseFloat(setting.value.lat) : 33.5138,
  lng: setting.value.long ? parseFloat(setting.value.long) : 36.2765,
}));

const isFormValid = computed(() => {
  return (
    setting.value.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setting.value.email) &&
    setting.value.phone.trim() &&
    setting.value.phone.length <= 15 &&
    setting.value.location.trim() &&
    !errors.email &&
    !errors.phone &&
    !errors.location &&
    !errors.lat &&
    !errors.long &&
    !errors.mainLogo &&
    !errors.footerLogo &&
    !errors.banners
  );
});

/* ------------------------------------------------------------------ */
/* Validation functions                                               */
/* ------------------------------------------------------------------ */
const validateEmail = () => {
  if (!setting.value.email.trim()) {
    errors.email = t('validation.emailRequired');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setting.value.email)) {
    errors.email = t('validation.invalidEmail');
  } else {
    errors.email = '';
  }
};

const validatePhone = () => {
  if (!setting.value.phone.trim()) {
    errors.phone = t('validation.phoneRequired');
  } else if (setting.value.phone.length > 15) {
    errors.phone = t('validation.phoneTooLong');
  } else {
    errors.phone = '';
  }
};

const validateForm = () => {
  validateEmail();
  validatePhone();
  errors.location = setting.value.location.trim() ? '' : t('validation.locationRequired');
  errors.lat = setting.value.lat && !isNaN(parseFloat(setting.value.lat)) && parseFloat(setting.value.lat) >= -90 && parseFloat(setting.value.lat) <= 90 ? '' : t('validation.invalidLat');
  errors.long = setting.value.long && !isNaN(parseFloat(setting.value.long)) && parseFloat(setting.value.long) >= -180 && parseFloat(setting.value.long) <= 180 ? '' : t('validation.invalidLong');
  errors.banners = banners.value.length > 0 ? '' : t('validation.atLeastOneBanner');
};

/* ------------------------------------------------------------------ */
/* Google Map handlers                                                */
/* ------------------------------------------------------------------ */
const handleMapClick = (event) => {
  if (!event.latLng) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error.mapClick'),
      life: 3000,
    });
    return;
  }
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();
  setting.value.lat = lat.toString();
  setting.value.long = lng.toString();
  validateForm();
};

/* ------------------------------------------------------------------ */
/* Image upload handlers                                              */
/* ------------------------------------------------------------------ */
const handleDragOver = (type) => {
  return (event) => {
    event.preventDefault();
    if (type === 'main') isDraggingMain.value = true;
    else if (type === 'footer') isDraggingFooter.value = true;
    else if (type === 'banners') isDraggingBanners.value = true;
  };
};

const handleDragLeave = (type) => {
  return () => {
    if (type === 'main') isDraggingMain.value = false;
    else if (type === 'footer') isDraggingFooter.value = false;
    else if (type === 'banners') isDraggingBanners.value = false;
  };
};

const handleImageUpload = (file, type) => {
  if (!file.type.match('image.*')) {
    const key = type === 'main' ? 'mainLogo' : type === 'footer' ? 'footerLogo' : 'banners';
    errors[key] = t('settings.invalidImageType');
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('settings.invalidImageType'),
      life: 3000,
    });
    return false;
  }
  if (file.size > 2 * 1024 * 1024) {
    const key = type === 'main' ? 'mainLogo' : type === 'footer' ? 'footerLogo' : 'banners';
    errors[key] = t('settings.imageTooLarge');
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('settings.imageTooLarge'),
      life: 3000,
    });
    return false;
  }
  return true;
};

const onImageUpload = (event, type) => {
  const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
  if (file && handleImageUpload(file, type)) {
    if (type === 'main') {
      mainLogoFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => (mainLogoPreview.value = e.target.result);
      reader.readAsDataURL(file);
      isDraggingMain.value = false;
      errors.mainLogo = '';
    } else if (type === 'footer') {
      footerLogoFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => (footerLogoPreview.value = e.target.result);
      reader.readAsDataURL(file);
      isDraggingFooter.value = false;
      errors.footerLogo = '';
    }
  }
};

const removeImage = (type) => {
  if (type === 'main') {
    mainLogoFile.value = null;
    mainLogoPreview.value = null;
    errors.mainLogo = '';
  } else if (type === 'footer') {
    footerLogoFile.value = null;
    footerLogoPreview.value = null;
    errors.footerLogo = '';
  }
};

/* ------------------------------------------------------------------ */
/* Banner Upload Handlers                                             */
/* ------------------------------------------------------------------ */
const onBannerUpload = (event) => {
  const files = event.target.files || event.dataTransfer?.files;
  if (!files?.length) return;

  Array.from(files).forEach((file) => {
    if (handleImageUpload(file, 'banners')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        banners.value.push({
          file,
          preview: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  });

  isDraggingBanners.value = false;
  errors.banners = '';
};

const removeBanner = (index) => {
  banners.value.splice(index, 1);
  validateForm();
};

const replaceBanner = (event, index) => {
  const file = event.target.files?.[0];
  if (file && handleImageUpload(file, 'banners')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      banners.value[index] = {
        file,
        preview: e.target.result,
      };
    };
    reader.readAsDataURL(file);
  }
};

/* ------------------------------------------------------------------ */
/* Submit handler                                                     */
/* ------------------------------------------------------------------ */
const onSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  validateForm();
  if (!isFormValid.value) {
    toast.add({
      severity: 'error',
      summary: t('validation.error'),
      detail: t('validation.fillRequired'),
      life: 3000,
    });
    isSubmitting.value = false;
    return;
  }

  const body = new FormData();
  if (mainLogoFile.value) body.append('main_logo', mainLogoFile.value);
  if (footerLogoFile.value) body.append('footer_logo', footerLogoFile.value);

  banners.value.forEach((banner) => {
    body.append('banners[]', banner.file);
  });

  body.append('email', setting.value.email);
  body.append('phone', setting.value.phone);
  body.append('location', setting.value.location);
  body.append('lat', setting.value.lat);
  body.append('long', setting.value.long);
  body.append('privacy_policy_en', setting.value.privacy_policy_en);
  body.append('privacy_policy_ar', setting.value.privacy_policy_ar);
  body.append('terms_and_conditions_en', setting.value.terms_and_conditions_en);
  body.append('terms_and_conditions_ar', setting.value.terms_and_conditions_ar);

  try {
    const res = await axios.post(`${apiUrl}/api/setting`, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('settings.updated'),
      life: 3000,
    });
  } catch (e) {
    error.value = e.response?.data?.errors || {};
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: e.response?.data?.message || t('error.updateSettings'),
      life: 3000,
    });
    console.error(e);
  } finally {
    isSubmitting.value = false;
  }
};

/* ------------------------------------------------------------------ */
/* Load initial data                                                  */
/* ------------------------------------------------------------------ */
onMounted(async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/setting`);
    const payload = data.data;

    setting.value = {
      id: payload.id,
      email: payload.email ?? '',
      phone: payload.phone ?? '',
      location: payload.location ?? '',
      lat: payload.lat ?? '',
      long: payload.long ?? '',
      privacy_policy_en: payload.privacy_policy_en ?? '',
      privacy_policy_ar: payload.privacy_policy_ar ?? '',
      terms_and_conditions_en: payload.terms_and_conditions_en ?? '',
      terms_and_conditions_ar: payload.terms_and_conditions_ar ?? '',
      media: payload.media ?? [],
    };

    // Load logos
    const mainLogo = setting.value.media.find((m) => m.name === 'main_logo');
    if (mainLogo) mainLogoPreview.value = mainLogo.url;

    const footerLogo = setting.value.media.find((m) => m.name === 'footer_logo');
    if (footerLogo) footerLogoPreview.value = footerLogo.url;

    // Load banners
    const bannerMedias = setting.value.media.filter((m) => m.name === 'banner');
    banners.value = bannerMedias.map((m) => ({
      file: null,
      preview: m.url,
    }));

    validateForm();
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: e.response?.data?.message || t('error.loadSettings'),
      life: 3000,
    });
    console.error(e);
  }
});
</script>

<style scoped>
.card {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.border-red-500 {
  border-color: #ef4444;
}

.text-red-500 {
  color: #ef4444;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
.group:hover .group-hover\:bg-opacity-40 {
  background-color: rgba(0, 0, 0, 0.4);
}
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* RTL support */
[dir="rtl"] .flex {
  direction: rtl;
}
</style>
