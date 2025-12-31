<template>
  <!-- Main container for the footer, with RTL direction -->
  <footer class="bg-green-700 text-white py-12" dir="rtl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
        <!-- Logo Section -->
        <div class="flex ">
          <img
            v-if="footerLogo"
            :src="footerLogo"
            alt="Pharma Bank Logo"
            class="h-32 w-auto mb-4 object-contain drop-shadow-md"
            @error="footerLogo = null"
          />
          <img
            v-else
            src="../../../assets/media.png"
            alt="Fallback Logo"
            class="h-32 w-auto mb-4 object-contain opacity-70"
          />
        </div>

        <!-- Main Links Section -->
        <div class="">
          <h3 class="text-xl font-bold mb-4">الرئيسية</h3>
          <ul class="space-y-2 text-right">
            <li><a href="/" class="hover:underline">الرئيسية</a></li>
            <li><a href="/pharmacy-offers" class="hover:underline">العروض</a></li>
            <li><a href="/pharmacy-warehouses" class="hover:underline">المستودعات</a></li>
            <li><a href="/" class="hover:underline">الاكثر طلبا</a></li>
            <li><a href="/pharmacy-categories" class="hover:underline">التصنيفات</a></li>
          </ul>
        </div>

        <!-- Contact Information Section -->
        <div class="">
          <h3 class="text-xl font-bold mb-4">بيانات التواصل</h3>
          <ul class="space-y-3 text-right">
            <a :href="link" class="flex items-center justify-end gap-2">
              <span class="text-right">{{ location }}</span>
              <i class="pi pi-map-marker text-white"></i>
            </a>
            <li class="flex items-center justify-end gap-2">
              <span class="text-right">{{ phone }}</span>
              <i class="pi pi-phone text-white"></i>
            </li>
            <li class="flex items-center justify-end gap-2">
              <span class="text-right">{{ email }}</span>
              <i class="pi pi-envelope text-white"></i>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer Divider -->
      <hr class="border-t border-green-500 my-8">

      <!-- Bottom Bar with Copyright and Legal Links -->
      <div class="flex flex-col md:flex-row items-center justify-between text-sm text-center md:text-right space-y-4 md:space-y-0">
        <div class="flex space-x-4 space-x-reverse">
          <a href="/Privacy-Policy" class="hover:underline">سياسة الخصوصية</a>
          <a href="/terms-condition" class="hover:underline">الشروط والأحكام</a>
        </div>
        <p>&copy; {{ currentYear }} Pharma Bank جميع الحقوق محفوظة</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

// Reactive state
const footerLogo = ref('')
const location = ref('جاري التحميل...')
const phone = ref('جاري التحميل...')
const email = ref('جاري التحميل...')
const link = ref('جاري التحميل...')
const loading = ref(true)

const toast = useToast()

// Current year for copyright
const currentYear = computed(() => new Date().getFullYear())

// Fetch settings from API
const fetchSettings = async () => {
  try {
    const { data } = await axios.get('/api/setting/not/auth')

    if (data.success && data.data) {
      const settings = data.data

      // Set contact info
      location.value = settings.location || 'غير متوفر'
      phone.value = settings.phone || 'غير متوفر'
      email.value = settings.email || 'غير متوفر'
      link.value = settings.link || 'غير متوفر'

      // Find footer logo from media
      const footerLogoMedia = settings.media?.find(m => m.name === 'footer_logo')
      if (footerLogoMedia?.url) {
        footerLogo.value = footerLogoMedia.url
      }
    } else {
      throw new Error('Invalid response structure')
    }
  } catch (error) {
    console.error('Failed to load footer settings:', error)
    toast.add({
      severity: 'warn',
      summary: 'تحذير',
      detail: 'فشل تحميل بيانات التذييل',
      life: 3000,
    })

    // Fallback values
    location.value = '123 Road, demashq, syria'
    phone.value = '+88369445214'
    email.value = 'info@pharmabank.com'
  } finally {
    loading.value = false
  }
}

// Load on component mount
onMounted(() => {
  fetchSettings()
});
</script>

