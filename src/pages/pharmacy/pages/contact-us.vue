<template>
  <div class="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
    <div class="max-w-7xl mx-auto">

      <!-- Contact Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div class="bg-red-100 p-3 rounded-full mb-4">
            <i class="pi pi-building text-red-500 text-4xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">{{ t('contact.location') }}</h3>
          <p class="text-sm text-gray-600 mb-1">{{ t('contact.area') }}</p>
          <p class="text-sm text-gray-500">{{ t('contact.workingHours') }}</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div class="bg-yellow-100 p-3 rounded-full mb-4">
            <i class="pi pi-envelope text-yellow-500 text-4xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">{{ t('contact.emailTitle') }}</h3>
          <a href="mailto:info@pharmabank.sy" class="text-sm text-green-600 hover:underline mb-1">info@pharmabank.sy</a>
          <p class="text-sm text-gray-500">{{ t('contact.emailResponse') }}</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <div class="bg-orange-100 p-3 rounded-full mb-4">
            <i class="pi pi-phone text-orange-500 text-4xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">{{ t('contact.phoneTitle') }}</h3>
          <a href="tel:+963933123456" class="text-sm text-green-600 hover:underline mb-1">+963 933 123 456</a>
          <p class="text-sm text-gray-500">{{ t('contact.phoneHours') }}</p>
        </div>
      </div>

      <!-- Contact Form Section -->
      <div class="bg-white rounded-lg shadow-md flex flex-col-reverse lg:flex-row items-center p-8 lg:p-12 gap-10">
        <!-- Form -->
        <div class="w-full lg:w-1/2 text-right">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{{ t('contact.formTitle') }}</h2>
          <p class="text-base text-gray-700 mb-6">
            {{ t('contact.formSubtitle') }}
          </p>

          <form @submit.prevent="submitForm" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  v-model="form.name"
                  type="text"
                  :placeholder="t('contact.namePlaceholder')"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                  :class="{ 'border-red-500': errors.name }"
                  required
                />
                <p v-if="errors.name" class="text-red-500 text-xs mt-1 text-right">{{ errors.name }}</p>
              </div>
              <div>
                <input
                  v-model="form.email"
                  type="email"
                  :placeholder="t('contact.emailPlaceholder')"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                  :class="{ 'border-red-500': errors.email }"
                  required
                />
                <p v-if="errors.email" class="text-red-500 text-xs mt-1 text-right">{{ errors.email }}</p>
              </div>
            </div>

            <div>
              <input
                v-model="form.phone"
                type="tel"
                :placeholder="t('contact.phonePlaceholder')"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
                :class="{ 'border-red-500': errors.phone }"
                required
              />
              <p v-if="errors.phone" class="text-red-500 text-xs mt-1 text-right">{{ errors.phone }}</p>
            </div>

            <div>
              <textarea
                v-model="form.message"
                :placeholder="t('contact.messagePlaceholder')"
                rows="5"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right resize-none"
                :class="{ 'border-red-500': errors.message }"
                required
              ></textarea>
              <p v-if="errors.message" class="text-red-500 text-xs mt-1 text-right">{{ errors.message }}</p>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full md:w-auto flex items-center justify-center gap-2"
            >
              <i v-if="loading" class="pi pi-spin pi-spinner"></i>
              {{ loading ? t('contact.sending') : t('contact.sendButton') }}
            </button>
          </form>
        </div>

        <!-- Illustration -->
        <div class="w-full lg:w-1/2 flex justify-center lg:justify-start">
          <img
            src="../../../assets/contact.png"
            alt="Contact Us Illustration"
            class="max-w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import Toast from 'primevue/toast';

const { t } = useI18n();
const toast = useToast();

// Form state
const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const loading = ref(false);

// Validation
const validateForm = () => {
  let isValid = true;
  errors.name = '';
  errors.email = '';
  errors.phone = '';
  errors.message = '';

  if (!form.name.trim()) {
    errors.name = t('contact.errors.nameRequired');
    isValid = false;
  }

  if (!form.email.trim()) {
    errors.email = t('contact.errors.emailRequired');
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = t('contact.errors.emailInvalid');
    isValid = false;
  }

  if (!form.phone.trim()) {
    errors.phone = t('contact.errors.phoneRequired');
    isValid = false;
  } else if (!/^\+?\d{7,15}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = t('contact.errors.phoneInvalid');
    isValid = false;
  }

  if (!form.message.trim()) {
    errors.message = t('contact.errors.messageRequired');
    isValid = false;
  } else if (form.message.trim().length < 10) {
    errors.message = t('contact.errors.messageTooShort');
    isValid = false;
  }

  return isValid;
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    const response = await axios.post('/api/contactus', {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim()
    });

    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('contact.successMessage'),
        life: 5000
      });

      // Reset form
      form.name = '';
      form.email = '';
      form.phone = '';
      form.message = '';
    } else {
      throw new Error(response.data.message || 'Unknown error');
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('contact.errorMessage'),
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Tailwind handles everything */
</style>
