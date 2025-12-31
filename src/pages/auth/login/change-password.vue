
<template>
  <div class=" bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="w-full">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ $t('auth.change_password') }}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        {{ $t('auth.enter_new_password') }}
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success Message -->
        <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md text-center">
          {{ $t('auth.password_changed_successfully') }}
          <router-link :to="{ name: 'login' }" class="underline font-medium">
            {{ $t('auth.sign_in_now') }}
          </router-link>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {{ error }}
        </div>

        <!-- Form (only show if not successful yet) -->
        <form v-if="!success" @submit.prevent="changePassword" class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.new_password') }}
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                :class="{ 'border-red-500': form.errors.password }"
              />

            </div>
            <p v-if="form.errors.password" class="mt-1 text-sm text-red-600">
              {{ form.errors.password }}
            </p>
          </div>

          <div>
            <label for="confirmation_password" class="block text-sm font-medium text-gray-700">
              {{ $t('auth.confirm_new_password') }}
            </label>
            <div class="mt-1">
              <input
                id="confirmation_password"
                v-model="form.confirmation_password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                :class="{ 'border-red-500': form.errors.confirmation_password }"
              />
            </div>
            <p v-if="form.errors.confirmation_password" class="mt-1 text-sm text-red-600">
              {{ form.errors.confirmation_password }}
            </p>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span v-if="!loading">{{ $t('auth.change_password') }}</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('common.processing') }}
              </span>
            </button>
          </div>
        </form>

        <!-- Back to login -->
        <div class="mt-6 text-center">
          <router-link :to="{ name: 'login' }" class="text-sm text-green-600 hover:text-green-500">
            ← {{ $t('auth.back_to_login') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const number = ref<string>('')
const loading = ref(false)
const success = ref(false)
const error = ref<string | null>(null)
const showPassword = ref(false)

const form = reactive({
  password: '',
  confirmation_password: '',
  errors: {
    password: '',
    confirmation_password: ''
  }
})

onMounted(() => {
  const tokenFromUrl = route.params.number as string
  if (!tokenFromUrl) {
    error.value = t('auth.invalid_or_missing_token')
    return
  }
  number.value = tokenFromUrl
})

const validateForm = () => {
  let isValid = true
  form.errors.password = ''
  form.errors.confirmation_password = ''

  if (form.password.length < 6) {
    form.errors.password = t('auth.password_too_short')
    isValid = false
  }

  if (form.password !== form.confirmation_password) {
    form.errors.confirmation_password = t('auth.passwords_do_not_match')
    isValid = false
  }

  return isValid
}

const changePassword = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = null

  try {
    await axios.post('/api/change-password-request/update-password', {
      number: number.value,
      password: form.password,
      confirmation_password: form.confirmation_password
    })

    success.value = true
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || t('auth.change_password_failed')
    error.value = typeof message === 'string' ? message : t('auth.change_password_failed')
  } finally {
    loading.value = false
  }
}
</script>
