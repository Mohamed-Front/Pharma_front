<template>
  <div class="bg-gradient-to-r from-[#F6FAFF] to-[#F6FAFF] rounded-lg overflow-hidden">
    <!-- Swiper Carousel for Banners -->
    <swiper
      v-if="banners.length > 0"
      :modules="[Autoplay, Navigation, Pagination]"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
      :navigation="true"
      :pagination="{ clickable: true }"
      :dir="appLang === 'ar' ? 'rtl' : 'ltr'"
      class="w-full"
    >
      <swiper-slide v-for="(banner, index) in banners" :key="index">
        <div class="flex w-full items-center justify-center p-4 md:p-8">
          <img
            :src="banner.url"
            :alt="`Banner ${index + 1}`"
            class="w-full max-h-96 object-contain drop-shadow-lg rounded-lg"
            @error="handleImageError"
          />
        </div>
      </swiper-slide>
    </swiper>

    <!-- Optional: Show placeholder if no banners -->
    <div v-else class="flex items-center justify-center h-48 md:h-64 bg-gray-100 rounded-lg">
      <p class="text-gray-500">{{ t('noBanners') || 'No banners available' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'primeicons/primeicons.css'

import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const toast = useToast()

// App language for RTL/LTR
const appLang = ref(localStorage.getItem('appLang') || 'en')

// Banners from API (filtered from media where name === 'banners')
const banners = ref([])



// Fetch banners from settings → `data.media` where name === 'banners'
const fetchBanners = async () => {
  try {
    const { data } = await axios.get(`/api/setting/not/auth`)

    if (data.success && Array.isArray(data.data?.media)) {
      // Filter media items where name === 'banners'
      const bannerMedia = data.data.media
        .filter(item => item.name === 'banners')
        .map(item => ({
          url: item.url
        }))

      if (bannerMedia.length > 0) {
        banners.value = bannerMedia
      } else {
        console.warn('No banner images found in media array.')
      }
    } else {
      console.warn('Invalid response structure or no media found.')
    }
  } catch (error) {
    console.error('Error fetching banners:', error)
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('error.loadBanners') || 'Failed to load banners',
      life: 3000,
    })
  }
}

// Load on mount
onMounted(() => {
  fetchBanners()
})
</script>

<style scoped>
/* Customize Swiper navigation & pagination */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #10b981;
  background: rgba(255, 255, 255, 0.9);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 20px;
  font-weight: bold;
}

:deep(.swiper-pagination-bullet) {
  background: #cbd5e1;
  opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
  background: #10b981;
  opacity: 1;
}

/* Responsive image height */
@media (max-width: 768px) {
  img {
    max-height: 220px;
  }
}
</style>
