```vue
<template>
  <va-card class="card my-4 p-[2%] min-h-[50vh] max-w-7xl">
    <div class="flex">
      <div>
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center h-64">
          <ProgressSpinner style="width: 50px; height: 50px" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center text-red-500">
          <p class="text-lg font-semibold">{{ $t('error.title') }}</p>
          <p>{{ error }}</p>
        </div>

        <!-- Privacy Policy Content -->
        <div v-else-if="currentPrivacyPolicy" class="prose max-w-none" :dir="appLang === 'ar' ? 'rtl' : 'ltr'">
          <div v-html="sanitizedPrivacyPolicy" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center text-gray-600">
          <p>{{ $t('privacyPolicy.noContent') }}</p>
        </div>
      </div>
    </div>

    <Toast />
  </va-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import DOMPurify from 'dompurify';

const { t } = useI18n();
const toast = useToast();

// Get/Set app language from localStorage
const getAppLang = () => localStorage.getItem('appLang') || 'en';
const appLang = ref(getAppLang());

/* ------------------------------------------------------------------ */
/* Reactive data                                                      */
/* ------------------------------------------------------------------ */
const privacyPolicyEn = ref('');
const privacyPolicyAr = ref('');
const isLoading = ref(false);
const error = ref(null);

/* ------------------------------------------------------------------ */
/* Computed properties                                                */
/* ------------------------------------------------------------------ */
const currentPrivacyPolicy = computed(() => {
  return appLang.value === 'ar' ? privacyPolicyAr.value : privacyPolicyEn.value;
});

const sanitizedPrivacyPolicy = computed(() => {
  return DOMPurify.sanitize(currentPrivacyPolicy.value);
});

/* ------------------------------------------------------------------ */
/* Load privacy policy data                                           */
/* ------------------------------------------------------------------ */
onMounted(async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.get('/api/setting/not/auth');
    const payload = data.data;
    privacyPolicyEn.value = payload.privacy_policy_en ?? '';
    privacyPolicyAr.value = payload.privacy_policy_ar ?? '';
    if (!currentPrivacyPolicy.value) {
      toast.add({
        severity: 'warn',
        summary: t('privacyPolicy.warning'),
        detail: t('privacyPolicy.noContent'),
        life: 3000,
      });
    }
  } catch (e) {
    error.value = e.response?.data?.message || t('error.loadPrivacyPolicy');
    toast.add({
      severity: 'error',
      summary: t('error.title'),
      detail: error.value,
      life: 3000,
    });
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.card {
  margin: 10px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Tailwind Prose for rich text styling */
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

/* RTL support for Arabic */
[dir="rtl"] .prose {
  text-align: right;
}

[dir="rtl"] .prose ul {
  padding-right: 1.5rem;
  padding-left: 0;
  list-style-position: outside;
}
</style>
```
