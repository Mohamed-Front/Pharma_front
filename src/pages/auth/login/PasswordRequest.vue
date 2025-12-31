<template>
  <div class=" bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-12">
    <div class="w-full">
      <div v-if="success" class="text-center animate-fadeIn">
        <div class="bg-white rounded-2xl shadow-xl p-10 border border-green-100">
          <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <i class="pi pi-check text-4xl text-green-600"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('password_reset.request_sent') }}</h2>
          <p class="text-gray-600 mb-8 leading-relaxed">
            {{ $t('password_reset.request_sent_description') }}
            <br />
            <span class="font-semibold text-green-600">{{ form.phone }}</span>
          </p>
          <button @click="resetForm"
            class="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300">
            {{ $t('password_reset.back_to_login') }}
          </button>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ $t('password_reset.title') }}</h1>
          <p class="text-gray-500">{{ $t('password_reset.subtitle') }}</p>
        </div>

        <form @submit.prevent="submitRequest" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('password_reset.account_type') }} *
            </label>
            <div class="grid grid-cols-2 gap-4">
              <label
                :class="{ 'border-green-500 bg-green-50': form.type === 'pharmacy', 'border-2': true }"
                class="flex items-center justify-center p-4 rounded-xl cursor-pointer transition-all"
              >
                <input type="radio" v-model="form.type" value="pharmacy" class="sr-only" required id="type-pharmacy" />
                <div class="text-center">
                  <i class="pi pi-home text-2xl text-green-600 mb-2"></i>
                  <span class="block text-sm font-medium text-gray-700">{{ $t('common.pharmacy') }}</span>
                </div>
              </label>

              <label
                :class="{ 'border-teal-500 bg-teal-50': form.type === 'warehouse', 'border-2': true }"
                class="flex items-center justify-center p-4 rounded-xl cursor-pointer transition-all"
              >
                <input type="radio" v-model="form.type" value="warehouse" class="sr-only" id="type-warehouse" />
                <div class="text-center">
                  <i class="pi pi-warehouse text-2xl text-teal-600 mb-2"></i>
                  <span class="block text-sm font-medium text-gray-700">{{ $t('common.warehouse') }}</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.phone') }} *
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                <i class="pi pi-phone"></i>
              </span>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                placeholder="09xxxxxxxx"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                :class="{ 'border-red-500': errors.phone }"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading "
            class="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <span>{{ loading ? $t('common.sending') : $t('password_reset.send_request') }}</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <router-link to="/auth/login" class="text-sm text-green-600 hover:text-green-700 font-medium transition">
            ← {{ $t('password_reset.back_to_login') }}
          </router-link>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import axios from 'axios'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()

// Form state
const form = reactive({
  type: 'pharmacy' as 'pharmacy' | 'warehouse',
  phone: ''
})

// UI state
const loading = ref(false)
const success = ref(false)

// Errors
const errors = reactive({
  phone: ''
})

// Validate phone (Syrian format: starts with 09 and 10 digits total)

// Auto-format phone as user types


// Check if form is valid
const isValid = computed(() => {
  return /^09\d{8}$/.test(form.phone.replace(/\D/g, '')) && form.type
})

// Submit request
const submitRequest = async () => {
  if (errors.phone ) return

  loading.value = true

  try {
    // NOTE: Replace '/api/change-password-request' with your actual API endpoint
    await axios.post('/api/change-password-request', {
      type: form.type,
      phone: form.phone.replace(/\D/g, '') // Send clean number
    })

    success.value = true
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('password_reset.request_sent_success'),
      life: 5000
    })
  } catch (error: any) {
    // NOTE: Standard error handling
    const message = error.response?.data?.message || t('password_reset.request_failed')
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: message,
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

// Reset form and navigate to login
const resetForm = () => {
  form.type = 'pharmacy'
  form.phone = ''
  success.value = false
  router.push('/auth/login')
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* This class ensures the radio button is completely hidden but still focusable for accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
