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

        <!-- Map Link -->
        <div class="mb-4">
          <label for="map_link" class="block text-sm font-medium text-gray-700">
            {{ $t('settings.mapLink') }}
          </label>
          <InputText
            id="map_link"
            v-model="setting.map_link"
            type="url"
            placeholder="https://maps.google.com/..."
            class="mt-2 w-full border rounded p-2"
            :class="{ 'border-red-500': errors.map_link }"
          />
          <p class="mt-1 text-xs text-gray-500">
            {{ $t('settings.mapLinkHint') }}
          </p>
          <div v-if="errors.map_link || error?.map_link" class="mt-1 text-red-500 text-sm">
            {{ errors.map_link || error.map_link?.[0] }}
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

        <!-- Banners Upload & Preview -->
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

              <!-- Empty state -->
              <div v-if="banners.length === 0" class="flex flex-col items-center justify-center py-8">
                <div class="bg-blue-100 p-4 rounded-full mb-4">
                  <i class="pi pi-images text-blue-500 text-3xl"></i>
                </div>
                <p class="text-sm text-center text-gray-600 mb-1">
                  <span class="text-blue-500 font-medium">{{ $t('settings.uploadBanners') }}</span> {{ $t('settings.orDragDrop') }}
                </p>
                <p class="text-xs text-gray-400">{{ $t('settings.fileTypes') }}</p>
              </div>

              <!-- Grid with existing + add-more -->
              <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                <!-- Existing banners -->
                <div
                  v-for="(banner, index) in banners"
                  :key="banner.id ?? index"
                  class="relative group"
                >
                  <img
                    :src="banner.preview"
                    alt="Banner preview"
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

                <!-- Add more -->
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

        <!-- Submit -->
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

const { t, locale } = useI18n();
const toast = useToast();
const apiUrl = import.meta.env.VITE_API_URL || 'https://pharma-service-838894765790.us-central1.run.app';

// ---------- Language ----------
const getAppLang = () => localStorage.getItem('appLang') || 'en';
const appLang = ref(getAppLang());
locale.value = appLang.value;
watch(appLang, (newLang) => {
  locale.value = newLang;
  localStorage.setItem('appLang', newLang);
});

/* ------------------------------------------------------------------ */
/* Reactive data                                                      */
/* ------------------------------------------------------------------ */
const setting = ref({
  id: null,
  email: '',
  phone: '',
  location: '',
  map_link: '',
  privacy_policy_en: '',
  privacy_policy_ar: '',
  terms_and_conditions_en: '',
  terms_and_conditions_ar: '',
  media: [], // raw media array from API (kept for reference)
});

const currentPrivacyPolicy = computed({
  get: () => (appLang.value === 'ar' ? setting.value.privacy_policy_ar || '' : setting.value.privacy_policy_en || ''),
  set: (v) => (appLang.value === 'ar' ? (setting.value.privacy_policy_ar = v) : (setting.value.privacy_policy_en = v)),
});

const currentTermsConditions = computed({
  get: () => (appLang.value === 'ar' ? setting.value.terms_and_conditions_ar || '' : setting.value.terms_and_conditions_en || ''),
  set: (v) => (appLang.value === 'ar' ? (setting.value.terms_and_conditions_ar = v) : (setting.value.terms_and_conditions_en = v)),
});

/* ------------------------------------------------------------------ */
/* UI state & validation                                              */
/* ------------------------------------------------------------------ */
const errors = reactive({
  email: '',
  phone: '',
  location: '',
  map_link: '',
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

/* Banners – each item: { id?, preview, file? } */
const banners = ref([]);

/* ------------------------------------------------------------------ */
/* Form validation                                                    */
/* ------------------------------------------------------------------ */
const isFormValid = computed(() => {
  return (
    setting.value.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setting.value.email) &&
    setting.value.phone.trim() &&
    setting.value.phone.length <= 15 &&
    setting.value.location.trim() &&
    setting.value.map_link.trim() &&
    !errors.email &&
    !errors.phone &&
    !errors.location &&
    !errors.map_link &&
    !errors.mainLogo &&
    !errors.footerLogo &&
    !errors.banners
  );
});

const validateEmail = () => {
  errors.email = !setting.value.email.trim()
    ? t('validation.emailRequired')
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setting.value.email)
      ? t('validation.invalidEmail')
      : '';
};

const validatePhone = () => {
  errors.phone = !setting.value.phone.trim()
    ? t('validation.phoneRequired')
    : setting.value.phone.length > 15
      ? t('validation.phoneTooLong')
      : '';
};

const validateForm = () => {
  validateEmail();
  validatePhone();
  errors.location = setting.value.location.trim() ? '' : t('validation.locationRequired');
  errors.banners = banners.value.length > 0 ? '' : t('validation.atLeastOneBanner');
};

/* ------------------------------------------------------------------ */
/* Image helpers (main / footer)                                      */
/* ------------------------------------------------------------------ */
const handleDragOver = (type) => (e) => {
  e.preventDefault();
  if (type === 'main') isDraggingMain.value = true;
  else if (type === 'footer') isDraggingFooter.value = true;
  else if (type === 'banners') isDraggingBanners.value = true;
};

const handleDragLeave = (type) => () => {
  if (type === 'main') isDraggingMain.value = false;
  else if (type === 'footer') isDraggingFooter.value = false;
  else if (type === 'banners') isDraggingBanners.value = false;
};

const checkImage = (file, key) => {
  if (!file.type.match('image.*')) {
    errors[key] = t('settings.invalidImageType');
    toast.add({ severity: 'error', summary: t('error'), detail: t('settings.invalidImageType'), life: 3000 });
    return false;
  }
  if (file.size > 2 * 1024 * 1024) {
    errors[key] = t('settings.imageTooLarge');
    toast.add({ severity: 'error', summary: t('error'), detail: t('settings.imageTooLarge'), life: 3000 });
    return false;
  }
  return true;
};

const onImageUpload = (e, type) => {
  const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
  if (!file) return;
  const key = type === 'main' ? 'mainLogo' : 'footerLogo';
  if (!checkImage(file, key)) return;

  if (type === 'main') {
    mainLogoFile.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => (mainLogoPreview.value = ev.target.result);
    reader.readAsDataURL(file);
    isDraggingMain.value = false;
    errors.mainLogo = '';
  } else {
    footerLogoFile.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => (footerLogoPreview.value = ev.target.result);
    reader.readAsDataURL(file);
    isDraggingFooter.value = false;
    errors.footerLogo = '';
  }
};

const removeImage = (type) => {
  if (type === 'main') {
    mainLogoFile.value = null;
    mainLogoPreview.value = null;
    errors.mainLogo = '';
  } else {
    footerLogoFile.value = null;
    footerLogoPreview.value = null;
    errors.footerLogo = '';
  }
};

/* ------------------------------------------------------------------ */
/* Banners upload / replace / delete                                  */
/* ------------------------------------------------------------------ */
const onBannerUpload = (e) => {
  const files = e.target.files || e.dataTransfer?.files;
  if (!files?.length) return;

  Array.from(files).forEach((file) => {
    if (checkImage(file, 'banners')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        banners.value.push({ preview: ev.target.result, file });
      };
      reader.readAsDataURL(file);
    }
  });

  isDraggingBanners.value = false;
  errors.banners = '';
};

const removeBanner = (idx) => {
  banners.value.splice(idx, 1);
  validateForm();
};

const replaceBanner = (e, idx) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!checkImage(file, 'banners')) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    banners.value[idx] = { ...banners.value[idx], preview: ev.target.result, file };
  };
  reader.readAsDataURL(file);
};

/* ------------------------------------------------------------------ */
/* Submit                                                             */
/* ------------------------------------------------------------------ */
const onSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  validateForm();
  if (!isFormValid.value) {
    toast.add({ severity: 'error', summary: t('validation.error'), detail: t('validation.fillRequired'), life: 3000 });
    isSubmitting.value = false;
    return;
  }

  const body = new FormData();
  if (mainLogoFile.value) body.append('main_logo', mainLogoFile.value);
  if (footerLogoFile.value) body.append('footer_logo', footerLogoFile.value);
  banners.value.forEach((b) => b.file && body.append('banners[]', b.file));

  body.append('email', setting.value.email);
  body.append('phone', setting.value.phone);
  body.append('location', setting.value.location);
  body.append('link', setting.value.map_link);
  body.append('privacy_policy_en', setting.value.privacy_policy_en);
  body.append('privacy_policy_ar', setting.value.privacy_policy_ar);
  body.append('terms_and_conditions_en', setting.value.terms_and_conditions_en);
  body.append('terms_and_conditions_ar', setting.value.terms_and_conditions_ar);

  try {
    await axios.post(`${apiUrl}/api/setting`, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.add({ severity: 'success', summary: t('success'), detail: t('settings.updated'), life: 3000 });
  } catch (e) {
    error.value = e.response?.data?.errors || {};
    toast.add({ severity: 'error', summary: t('error'), detail: e.response?.data?.message || t('error.updateSettings'), life: 3000 });
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

    // ---- Basic fields ----
    setting.value = {
      id: payload.id,
      email: payload.email ?? '',
      phone: payload.phone ?? '',
      location: payload.location ?? '',
      map_link: payload.link ?? payload.map_link ?? '', // support both keys
      privacy_policy_en: payload.privacy_policy_en ?? '',
      privacy_policy_ar: payload.privacy_policy_ar ?? '',
      terms_and_conditions_en: payload.terms_and_conditions_en ?? '',
      terms_and_conditions_ar: payload.terms_and_conditions_ar ?? '',
      media: payload.media ?? [],
    };

    // ---- Logos ----
    const main = payload.media.find((m) => m.name === 'main_logo');
    if (main) mainLogoPreview.value = main.url;

    const footer = payload.media.find((m) => m.name === 'footer_logo');
    if (footer) footerLogoPreview.value = footer.url;

    // ---- Banners (name can be "banner" or "banners") ----
    const bannerMedias = payload.media.filter((m) => m.name === 'banner' || m.name === 'banners');
    banners.value = bannerMedias.map((m) => ({
      id: m.id,          // keep id for possible future delete-by-id
      preview: m.url,
      file: null,        // no file when loaded from server
    }));

    validateForm();
  } catch (e) {
    toast.add({ severity: 'error', summary: t('error'), detail: e.response?.data?.message || t('error.loadSettings'), life: 3000 });
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
.border-red-500 { border-color: #ef4444; }
.text-red-500   { color: #ef4444; }
button:disabled { opacity: .5; cursor: not-allowed; }

/* Hover effects */
.group:hover .group-hover\:scale-105 { transform: scale(1.05); }
.group:hover .group-hover\:bg-opacity-40 { background-color: rgba(0,0,0,.4); }
.group:hover .group-hover\:opacity-100   { opacity: 1; }

/* RTL */
[dir="rtl"] .flex { direction: rtl; }
</style>
