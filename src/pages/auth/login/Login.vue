```vue
<template>
  <div class="flex flex-col lg:flex-row min-h-[75vh] m-auto bg-gray-50">
    <!-- Image Section with Overlay -->
    <div class="hidden lg:block lg:w-1/2 relative">
      <img
        src="../../../assets/login.png"
        alt="Login Image"
        class="w-fast h-full object-cover"
      >
      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="text-white p-8 text-center">
          <h2 class="text-3xl font-bold mb-4">{{ $t('auth.welcome_to_pharma') }}</h2>
          <p class="text-xl">{{ $t('auth.welcome_description') }}</p>
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <div class="lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h1 class="text-2xl font-bold text-green-700 text-center">{{ $t('auth.login') }}</h1>

        <!-- Error Messages -->
        <!-- <div v-if="authStore.authErrors.length" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
          {{ authStore.authErrors.join(', ') }}
        </div> -->

        <form @submit.prevent="onsubmit" class="space-y-6">
          <!-- phone Input -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">{{ $t('auth.phone') }}</label>
            <InputText
              id="phone"

              v-model="form.phone"
              class="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
              :class="{ 'border-red-500': phoneErrors.length }"

            />
            <p v-if="phoneErrors.length" class="mt-1 text-sm text-red-600">{{ phoneErrors.join(', ') }}</p>
          </div>

          <!-- Password Input with Toggle -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">{{ $t('auth.password') }}</label>
            <div class="relative">
              <InputText
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                class="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                :class="{ 'border-red-500': passwordErrors.length }"

              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                @click="showPassword = !showPassword"
              >
                <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="passwordErrors.length" class="mt-1 text-sm text-red-600">{{ passwordErrors.join(', ') }}</p>
          </div>
          <p v-if="authStore.authErrors.length>0" class="w-full text-center py-1 text-red-600"> {{ authStore.authErrors }}</p>



          <!-- Submit Button -->
          <div class="flex justify-center">
            <button
              type="submit"
              :disabled="!formReady"
              class="w-full sm:w-1/2 py-2 px-4 bg-green-600 text-white text-lg font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('auth.login_button') }}
            </button>
          </div>
        </form>

        <!-- Registration Link -->
        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            {{ $t('auth.no_account') }}
            <router-link :to="{ name: 'signup' }" class="font-medium text-green-600 hover:text-green-500">
              {{ $t('auth.sing_up') }}
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../../stores/Auth'
import InputText from 'primevue/inputtext'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  phone: '',
  password: '',
})
const keepLoggedIn = ref(false)
const phoneErrors = ref<string[]>([])
const passwordErrors = ref<string[]>([])
const showPassword = ref(false)

const formReady = computed(() => {
  return form.value.phone && !phoneErrors.value.length && form.value.password && !passwordErrors.value.length
})

const validatephone = (phone: string): string[] => {
  const errors: string[] = []
  if (!phone) {
    errors.push(t('auth.errors.phone_required'))
    return errors
  }

  return errors
}

const validatePassword = (password: string): string[] => {
  const errors: string[] = []
  if (!password) {
    errors.push(t('auth.errors.password_required'))
    return errors
  }
  if (password.length < 6) {
    errors.push(t('auth.errors.password_too_short'))
  }
  return errors
}

const onsubmit = async () => {
  phoneErrors.value = validatephone(form.value.phone)
  passwordErrors.value = validatePassword(form.value.password)

  if (formReady.value) {
    try {
      await authStore.handleLogin({ ...form.value, keepLoggedIn: keepLoggedIn.value })

    } catch (error) {
      console.error('Login failed:', error)
    }
  }
}
</script>

<style scoped>
/* Custom styles for the form */
.bg-gray-50 {
  background-color: #f9fafb;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(27, 138, 69, 0.2);
}

@media (max-width: 1023px) {
  .flex-col {
    flex-direction: column;
  }
  .lg\:w-1\/2 {
    width: 100%;
  }
  .min-h-[75vh] {
    min-height: auto;
  }
}
</style>
```
