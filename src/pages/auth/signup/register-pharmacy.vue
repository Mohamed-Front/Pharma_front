<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div class="w-full max-w-4xl bg-white rounded-2xl p-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
        {{ $t('auth.register_pharmacy') }}
      </h2>

      <!-- Form Container -->
      <div v-if="!submitted || !requestData.number" class="space-y-8">
        <!-- Basic Information -->
        <div class="grid gap-6 lg:grid-cols-2 grid-cols-1">
          <div class="relative">
            <label for="pharmacyName" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.pharmacy_name') }} *
            </label>
            <input
              v-model="form.name"
              id="pharmacyName"
              name="name"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              :class="{ 'border-red-500': errors.name }"
              placeholder="أدخل اسم الصيدلية"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.name">{{ errors.name }}</small>
          </div>

          <div class="relative">
            <label for="country" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.country') }} *
            </label>
            <input
              v-model="form.country"
              id="country"
              name="country"
              readonly
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              :class="{ 'border-red-500': errors.country }"
              placeholder="أدخل اسم البلد"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.country">{{ errors.country }}</small>
          </div>

          <div class="relative">
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.city') }} *
            </label>
            <select
              v-model="form.city"
              id="city"
              name="city"
              required
              @change="updateMapLocation"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              :class="{ 'border-red-500': errors.city }"
            >
              <option value="" disabled selected>اختر المدينة</option>
              <option v-for="city in cities" :key="city.Governorate_en" :value="city.Governorate_en" >
                {{ city.Governorate_ar }} ({{ city.Governorate_en }})
              </option>
            </select>
            <small class="text-red-500 mt-1 block" v-if="errors.city">{{ errors.city }}</small>
          </div>

          <div class="relative">
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.address') }} *
            </label>
            <input
              v-model="form.address"
              id="address"
              name="address"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              :class="{ 'border-red-500': errors.address }"
              placeholder="أدخل العنوان"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.address">{{ errors.address }}</small>
          </div>

          <div class="relative">
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.phone') }} *
            </label>
            <input
              v-model="form.phone"
              id="phone"
              name="phone"
              type="tel"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              :class="{ 'border-red-500': errors.phone }"
              placeholder="أدخل رقم الهاتف"
              @input="validatePhone"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.phone">{{ errors.phone }}</small>
          </div>

          <div class="relative">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.password') }} *
            </label>
            <input
              v-model="form.password"
              id="password"
              name="password"
              type="password"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              :class="{ 'border-red-500': errors.password }"
              placeholder="أدخل كلمة السر"
              @input="validatePassword"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.password">{{ errors.password }}</small>
          </div>

          <div class="relative">
            <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.confirm_password') }} *
            </label>
            <input
              v-model="form.password_confirmation"
              id="passwordConfirmation"
              name="password_confirmation"
              type="password"
              required
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              :class="{ 'border-red-500': errors.password_confirmation }"
              placeholder="تأكيد كلمة السر"
              @input="validatePasswordConfirmation"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.password_confirmation">{{ errors.password_confirmation }}</small>
          </div>

          <div class="relative">
            <label for="nationalIdNumber" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.national_id_number') }}
            </label>
            <input
              v-model="form.national_id_number"
              id="nationalIdNumber"
              name="national_id_number"
              type="text"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              :class="{ 'border-red-500': errors.national_id_number }"
              placeholder="أدخل رقم الهوية"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.national_id_number">{{ errors.national_id_number }}</small>
          </div>

          <div class="relative">
            <label for="licenseNumber" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.license_number') }}
            </label>
            <input
              v-model="form.license_number"
              id="licenseNumber"
              name="license_number"
              type="text"
              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              :class="{ 'border-red-500': errors.license_number }"
              placeholder="أدخل رقم الترخيص"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.license_number">{{ errors.license_number }}</small>
          </div>

          <div class="relative">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('auth.email') }}
            </label>
            <input
              v-model="form.email"
              id="email"
              name="email"
              type="email"

              class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"

              placeholder="أدخل الإيميل"
              @input="validateEmail"
            />
            <small class="text-red-500 mt-1 block" v-if="errors.email">{{ errors.email }}</small>
          </div>
        </div>

        <!-- Location Information -->
        <div class="space-y-6">
          <h4 class="text-xl font-semibold text-gray-800 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            {{ $t('auth.location_information') }}
          </h4>
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('auth.location') }}</label>
            <GoogleMap
              @click="handleMapClick"
              style="width: 100%; height: 300px; border-radius: 12px; overflow: hidden;"
              :center="{ lat: form.lat ? parseFloat(form.lat) : 33.5158, lng: form.long ? parseFloat(form.long) : 36.2939 }"
              :zoom="14"
              class="shadow-md"
            >
              <Marker
                v-if="form.lat && form.long"
                :options="{ position: { lat: parseFloat(form.lat), lng: parseFloat(form.long) } }"
              />
            </GoogleMap>

          </div>
        </div>

        <!-- Owner Information -->
        <div class="space-y-6">
          <h4 class="text-xl font-semibold text-gray-800 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            {{ $t('auth.owner_information') }}
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Practice Certificate -->
            <div>
              <label class="block text-sm font-medium text-center text-gray-700 mb-1">{{ $t('auth.practice_certificate') }}</label>
              <label
                @dragover.prevent="handleDragOver('practice_certificate')"
                @dragleave="handleDragLeave('practice_certificate')"
                @drop.prevent="onImageUpload($event, 'practice_certificate')"
                :class="{ 'border-green-400 bg-green-50': isDragging.practice_certificate, 'border-gray-200': !isDragging.practice_certificate }"
                class="w-full h-28 rounded-lg cursor-pointer transition-all duration-300 hover:border-green-400 border"
              >
                <input
                  type="file"
                  @change="onImageUpload($event, 'practice_certificate')"
                  accept="image/*"
                  class="hidden"
                  id="practice_certificate"
                />
                <div v-if="form.practice_certificate_preview" class="p-4">
                  <div class="relative group">
                    <img
                      :src="form.practice_certificate_preview"
                      alt="Practice Certificate Preview"
                      class="object-cover w-full h-32 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-40 transition-all duration-300">
                      <div class="space-x-3 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <button
                          type="button"
                          @click.stop="removeImage('practice_certificate')"
                          class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        >
                          <i class="text-sm pi pi-trash"></i>
                        </button>
                        <button
                          type="button"
                          @click.stop="editImage('practice_certificate')"
                          class="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition"
                        >
                          <i class="text-sm pi pi-pencil"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-center text-gray-500">{{ $t('auth.click_or_drag_to_change_photo') }}</p>
                </div>
                <div v-else class="flex flex-col items-center justify-center h-full p-4">
                  <div class="p-3 mb-2 bg-green-100 rounded-full">
                    <i class="text-xl text-green-500 pi pi-image"></i>
                  </div>
                  <p class="mb-1 text-sm text-center text-gray-600">
                    <span class="font-medium text-green-500">{{ $t('auth.click_to_upload') }}</span> {{ $t('auth.or_drag_and_drop') }}
                  </p>
                  <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
                </div>
              </label>
              <small class="text-red-500 mt-1 block" v-if="errors.practice_certificate">{{ errors.practice_certificate }}</small>
            </div>

            <!-- Pharmacy Logo -->
            <div>
              <label class="block text-sm text-center font-medium text-gray-700 mb-1">{{ $t('auth.pharmacy_logo') }}</label>
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
                <div v-if="form.pharmacy_logo_preview" class="p-4">
                  <div class="relative group">
                    <img
                      :src="form.pharmacy_logo_preview"
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
                  <p class="mt-2 text-sm text-center text-gray-500">{{ $t('auth.click_or_drag_to_change_photo') }}</p>
                </div>
                <div v-else class="flex flex-col items-center justify-center h-full p-4">
                  <div class="p-3 mb-2 bg-green-100 rounded-full">
                    <i class="text-xl text-green-500 pi pi-image"></i>
                  </div>
                  <p class="mb-1 text-sm text-center text-gray-600">
                    <span class="font-medium text-green-500">{{ $t('auth.click_to_upload') }}</span> {{ $t('auth.or_drag_and_drop') }}
                  </p>
                  <p class="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 1MB)</p>
                </div>
              </label>
              <small class="text-red-500 mt-1 block" v-if="errors.pharmacy_logo">{{ errors.pharmacy_logo }}</small>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end mt-8">
          <button
            @click="submitForm"
            type="button"
            class="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!isFormValid"
          >
            {{ $t('auth.create_account') }}
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="submitted && requestData.number" class="text-center">
        <div class="p-8 rounded-2xl bg-green-50 shadow-md">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <i class="text-3xl text-green-500 pi pi-check"></i>
          </div>
          <h3 class="mb-2 text-2xl font-bold text-green-800">{{ $t('auth.request_submitted') }}</h3>
          <p class="mb-6 text-gray-600">{{ $t('auth.request_submitted_description') }}</p>

          <div class="p-6 mb-6 bg-white border border-green-200 rounded-lg shadow-sm">
            <div class="text-sm font-medium text-gray-500">{{ $t('auth.request_number') }}</div>
            <div class="mt-1 text-2xl font-bold text-green-600">{{ requestData.number }}</div>
          </div>

          <p class="mb-6 text-sm text-gray-500">{{ $t('auth.request_submitted_note') }}</p>

          <button
            @click="resetForm"
            class="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-300"
          >
            {{ $t('auth.back_to_home') }}
          </button>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { GoogleMap, Marker } from 'vue3-google-map'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()

// Cities data
const cities = ref([
  { Governorate_ar: 'دمشق', Governorate_en: 'Damascus', Latitude: 33.5158, Longitude: 36.2939, Status: 'active' },
  { Governorate_ar: 'دمشق ريف', Governorate_en: 'Rif Dimashq', Latitude: 33.5719, Longitude: 36.402, Status: 'active' },
  { Governorate_ar: 'حلب', Governorate_en: 'Aleppo', Latitude: 36.2019, Longitude: 37.1612, Status: 'not active' },
  { Governorate_ar: 'حمص', Governorate_en: 'Homs', Latitude: 34.7308, Longitude: 36.709, Status: 'not active' },
  { Governorate_ar: 'حماة', Governorate_en: 'Hama', Latitude: 35.1318, Longitude: 36.7578, Status: 'not active' },
  { Governorate_ar: 'إدلب', Governorate_en: 'Idlib', Latitude: 35.9306, Longitude: 36.6339, Status: 'not active' },
  { Governorate_ar: 'اللاذقية', Governorate_en: 'Latakia', Latitude: 35.5167, Longitude: 35.7833, Status: 'not active' },
  { Governorate_ar: 'طرطوس', Governorate_en: 'Tartus', Latitude: 34.889, Longitude: 35.8866, Status: 'not active' },
  { Governorate_ar: 'الرقة', Governorate_en: 'Raqqa', Latitude: 35.95, Longitude: 39.0167, Status: 'not active' },
  { Governorate_ar: 'دير الزور', Governorate_en: 'Deir ez-Zor', Latitude: 35.3333, Longitude: 40.15, Status: 'not active' },
  { Governorate_ar: 'الحسكة', Governorate_en: 'Al-Hasakah', Latitude: 36.502, Longitude: 40.747, Status: 'not active' },
  { Governorate_ar: 'درعا', Governorate_en: 'Daraa', Latitude: 32.6189, Longitude: 36.1029, Status: 'not active' },
  { Governorate_ar: 'السويداء', Governorate_en: 'As-Suwayda', Latitude: 32.708, Longitude: 36.569, Status: 'not active' },
  { Governorate_ar: 'القنيطرة', Governorate_en: 'Quneitra', Latitude: 33.125, Longitude: 35.823, Status: 'not active' }
])

// Form data
const form = reactive({
  name: '',
  country: 'سوريا',
  city: '',
  address: '',
  phone: '',
  password: '',
  password_confirmation: '',
  national_id_number: '',
  license_number: '',
  email: '',
  practice_certificate: null as File | null,
  practice_certificate_name: '',
  practice_certificate_preview: null as string | null,
  pharmacy_logo: null as File | null,
  pharmacy_logo_name: '',
  pharmacy_logo_preview: null as string | null,
  lat: '',
  long: '',
  location_link: ''
})

// Error messages
const errors = reactive({
  name: '',
  country: '',
  city: '',
  address: '',
  phone: '',
  password: '',
  password_confirmation: '',
  national_id_number: '',
  license_number: '',
  email: '',
  practice_certificate: '',
  pharmacy_logo: '',
  lat: '',
  long: ''
})

// Request data after successful submission
const requestData = reactive({
  number: '',
  name: '',
  email: '',
  createdAt: ''
})

const submitted = ref(false)
const isDragging = ref({
  practice_certificate: false,
  pharmacy_logo: false
})

// Validation functions
const validatePhone = () => {
  if (!form.phone.trim()) {
    errors.phone = t('auth.phone_required')
  } else if (form.phone.length > 15) {
    errors.phone = t('auth.phone_too_long')
  } else {
    errors.phone = ''
  }
}

const validatePassword = () => {
  if (!form.password.trim()) {
    errors.password = t('auth.password_required')
  } else if (form.password.length < 8) {
    errors.password = t('auth.password_too_short')
  } else {
    errors.password = ''
  }
  validatePasswordConfirmation()
}

const validatePasswordConfirmation = () => {
  if (!form.password_confirmation.trim()) {
    errors.password_confirmation = t('auth.confirm_password_required')
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = t('auth.passwords_dont_match')
  } else {
    errors.password_confirmation = ''
  }
}

const validateEmail = () => {
  if (!form.email.trim()) {
    errors.email = t('auth.email_required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('auth.invalid_email')
  } else {
    errors.email = ''
  }
}

// Form validation
const isFormValid = computed(() => {
  return (
    form.name.trim() !== '' &&
    form.country.trim() !== '' &&
    form.city.trim() !== '' &&
    form.address.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.phone.length <= 15 &&
    form.password.trim() !== '' &&
    form.password.length >= 8 &&
    form.password === form.password_confirmation &&
    !errors.name &&
    !errors.country &&
    !errors.city &&
    !errors.address &&
    !errors.phone &&
    !errors.password &&
    !errors.password_confirmation &&
    !errors.email
  )
})

// Drag and drop handlers
const handleDragOver = (type: 'practice_certificate' | 'pharmacy_logo') => {
  isDragging.value[type] = true
}

const handleDragLeave = (type: 'practice_certificate' | 'pharmacy_logo') => {
  isDragging.value[type] = false
}

const onImageUpload = (event: Event | DragEvent, type: 'practice_certificate' | 'pharmacy_logo') => {
  const file = (event as DragEvent).dataTransfer?.files?.[0] || (event.target as HTMLInputElement).files?.[0]
  if (file) {
    if (!file.type.match('image.*')) {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('auth.invalid_image_type'),
        life: 3000
      })
      return
    }
    if (file.size > 1024 * 1024) { // 1MB limit
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('auth.image_too_large'),
        life: 3000
      })
      return
    }
    form[type] = file
    form[`${type}_name`] = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      form[`${type}_preview`] = e.target?.result as string
    }
    reader.readAsDataURL(file)
    isDragging.value[type] = false
  }
}

const removeImage = (type: 'practice_certificate' | 'pharmacy_logo') => {
  form[type] = null
  form[`${type}_name`] = ''
  form[`${type}_preview`] = null
  const input = document.getElementById(type) as HTMLInputElement
  if (input) input.value = ''
}

const editImage = (type: 'practice_certificate' | 'pharmacy_logo') => {
  const input = document.getElementById(type) as HTMLInputElement
  if (input) input.click()
}

// Map click handler
const handleMapClick = (event: any) => {
  const clickedLatLng = event.latLng
  const lat = clickedLatLng.lat()
  const lng = clickedLatLng.lng()
  form.lat = lat.toString()
  form.long = lng.toString()
  form.location_link = `https://www.google.com/maps?q=${lat},${lng}`
}

// Update map location when city is selected
const updateMapLocation = () => {
  const selectedCity = cities.value.find(city => city.Governorate_en === form.city)
  if (selectedCity) {
    form.lat = selectedCity.Latitude.toString()
    form.long = selectedCity.Longitude.toString()
    form.location_link = `https://www.google.com/maps?q=${selectedCity.Latitude},${selectedCity.Longitude}`
  }
}

// Form submission
const submitForm = async () => {
  submitted.value = true

  // Validate form
  if (!form.name.trim()) errors.name = t('auth.pharmacy_name_required')
  if (!form.country.trim()) errors.country = t('auth.country_required')
  if (!form.city.trim()) errors.city = t('auth.city_required')
  if (!form.address.trim()) errors.address = t('auth.address_required')
  validatePhone()
  validatePassword()
  validatePasswordConfirmation()


  if (!isFormValid.value) return

  // Prepare form data for submission
  const formData = new FormData()
  formData.append('name', form.name)
  formData.append('country', form.country)
  formData.append('city', form.city)
  formData.append('address', form.address)
  formData.append('phone', form.phone)
  formData.append('password', form.password)
  formData.append('password_confirmation', form.password_confirmation)
  formData.append('email', form.email)
  if (form.national_id_number) formData.append('national_id_number', form.national_id_number)
  if (form.license_number) formData.append('license_number', form.license_number)
  if (form.practice_certificate) formData.append('practice_certificate', form.practice_certificate)
  if (form.pharmacy_logo) formData.append('pharmacy_logo', form.pharmacy_logo)
  if (form.lat) formData.append('lat', form.lat)
  if (form.long) formData.append('long', form.long)
  if (form.location_link) formData.append('location_link', form.location_link)

  try {
    const response = await axios.post('/api/pharmacy-request', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    // Save response data
    requestData.number = response.data.data.number
    requestData.name = response.data.data.name
    requestData.email = response.data.data.email
    requestData.createdAt = response.data.data.created_at

    // Show success toast
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('auth.pharmacy_created'),
      life: 3000
    })
  } catch (error: any) {
    console.error('Error submitting form:', error)
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('auth.pharmacy_creation_failed'),
      life: 3000
    })
  }
}

// Reset form
const resetForm = () => {
  form.name = ''
  form.country = ''
  form.city = ''
  form.address = ''
  form.phone = ''
  form.password = ''
  form.password_confirmation = ''
  form.national_id_number = ''
  form.license_number = ''
  form.email = ''
  form.practice_certificate = null
  form.practice_certificate_name = ''
  form.practice_certificate_preview = null
  form.pharmacy_logo = null
  form.pharmacy_logo_name = ''
  form.pharmacy_logo_preview = null
  form.lat = ''
  form.long = ''
  form.location_link = ''

  errors.name = ''
  errors.country = ''
  errors.city = ''
  errors.address = ''
  errors.phone = ''
  errors.password = ''
  errors.password_confirmation = ''
  errors.national_id_number = ''
  errors.license_number = ''
  errors.email = ''
  errors.practice_certificate = ''
  errors.pharmacy_logo = ''
  errors.lat = ''
  errors.long = ''

  submitted.value = false
  router.push('/')
}
</script>

<style scoped>
/* Custom styles for enhanced aesthetics */
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

/* Hover effects for inputs and select */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

/* Button hover effect */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* Image upload area hover effect */
label:hover {
  background-color: rgba(16, 185, 129, 0.05);
}
</style>
