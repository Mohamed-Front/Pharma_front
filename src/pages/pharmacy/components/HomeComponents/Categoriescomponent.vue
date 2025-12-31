```vue
<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const categories = ref([])
const loading = ref(true)
const appLang = ref(localStorage.getItem('appLang') || 'en')

// Fetch categories from API
const fetchCategories = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/pharmacy-home/get/categories')
    // Assuming API returns categories with icon field (e.g., 'pi-heart-fill')
    categories.value = response.data.data.map(category => ({
      ...category,
      icon: category.icon || 'pi-heart-fill' // Fallback icon if not provided
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

// Method to truncate category name to a specific length
const truncateName = (name, maxLength) => {
  if (name.length <= maxLength) return name
  return name.slice(0, maxLength) + '...'
}

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <div class="bg-[#F6FAFF]">
    <div class="bg-[#F6FAFF] py-14 px-4 max-w-7xl m-auto">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl md:text-2xl font-bold text-gray-800">
          {{ t('categories') }}
        </h2>
        <a
          href="#"
          class="flex items-center invisible text-green-600 font-bold gap-2 hover:underline"
          @click.prevent="router.push({ name: 'AllCategories' })"
        >
          {{ t('category.allCategories') }}
          <i
            class="pi pi-chevron-left text-sm"
            :class="{ 'pi-chevron-right': appLang === 'ar' }"
          ></i>
        </a>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-4 mt-6">
        <i class="pi pi-spin pi-spinner text-3xl text-gray-600"></i>
      </div>

      <swiper
        v-else
        :modules="[Autoplay]"
        :slides-per-view="4"
        :space-between="16"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :speed="5000"
        :grab-cursor="true"
        :css-mode="true"
        :simulate-touch="false"
        :touch-start-prevent-default="true"
        :touch-ratio="1.5"
        class="mt-6"
        :breakpoints="{
          320: { slidesPerView: 2, spaceBetween: 8 },
          640: { slidesPerView: 3, spaceBetween: 12 },
          768: { slidesPerView: 4, spaceBetween: 16 },
          1024: { slidesPerView: 6, spaceBetween: 16 }
        }"
        :dir="appLang === 'ar' ? 'rtl' : 'ltr'"
      >
        <SwiperSlide
          v-for="category in categories"
          :key="category.id"
          class="flex flex-col cursor-pointer items-center border p-6 bg-white rounded-lg shadow-sm   hover:shadow-md transition-shadow"
          @click="router.push({ name: 'pharmacy-category-details', params: { id: category.id } })"
        >
           <img :src="category?.media[0]?.url" class="m-auto w-16 h-10">
          <p class="text-sm font-semibold text-center pt-2 text-gray-700">
            {{ truncateName(appLang === 'en' ? category.name_en : category.name_ar, 20) }}
          </p>
        </SwiperSlide>
      </swiper>
    </div>
  </div>
</template>

<style scoped>
.swiper {
  @apply w-full;
}
</style>
```
