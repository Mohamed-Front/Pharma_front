```vue
<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'primeicons/primeicons.css'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const warehouses = ref([])
const loading = ref(true)
const appLang = ref(localStorage.getItem('appLang') || 'en')

// Static fallback data
const staticWarehouses = [

]
const WarehouseDetails =(id)=>{
  router.push({name:'pharmacy-warehouse-details',params:{id:id}})
}
// Fetch warehouses from API
const fetchWarehouses = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/pharmacy-home/get/warehouses')
    if (response.data.success && response.data.data?.length > 0) {
      warehouses.value = response.data.data.map(warehouse => ({
        ...warehouse,
        name_ar: warehouse.name,
        name_en: warehouse.name, // Assuming API provides only one name; adjust if bilingual names are available
        description_ar: warehouse.description_ar || 'مستودع يقدم خدمات موثوقة',
        description_en: warehouse.description_en || 'Warehouse providing reliable services',
        rating: warehouse.rating || 4.5,
        tags: warehouse.tags || [
          { name_ar: 'التوصيل 24/7', name_en: '24/7 Delivery' },
          { name_ar: 'متصل بأكثر من 50 صيدلية', name_en: 'Connected to 50+ Pharmacies' }
        ],
        address: warehouse.address || 'Unknown Address'
      }))
    } else {
      warehouses.value = staticWarehouses
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('error.noData'),
        life: 3000
      })
    }
  } catch (error) {
    warehouses.value = staticWarehouses
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error.fetchWarehouses'),
      life: 3000
    })
    console.error('Error fetching warehouses:', error)
  } finally {
    loading.value = false
  }
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/path/to/fallback-image.jpg' // Replace with actual fallback image path
}

// Method to truncate text to a specific length
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

onMounted(() => {
  fetchWarehouses()
})
</script>

<template>
  <div class="bg-white">
    <div class="max-w-7xl mx-auto p-4 md:p-8">
      <div class="flex flex-col items-center justify-center p-6 md:p-8 text-center rounded-lg mb-8">
        <div class="flex items-center gap-2 mb-2">
          <i class="pi pi-arrow-left text-[#1B8A45] text-lg" :class="{ 'pi-arrow-right': appLang === 'ar' }"></i>
          <span class="text-sm md:text-base font-bold text-[#1B8A45]">
            {{ t('featured_warehouses') }}
          </span>
        </div>
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight">
          {{ t('warehouse_expertise') }}
          <span class="text-[#1B8A45]">{{ t('warehouses') }}</span>
          {{ t('and_distribution') }}
          <span class="text-[#1B8A45]">{{ t('medications') }}</span>
        </h2>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-4 mt-6">
        <i class="pi pi-spin pi-spinner text-3xl text-gray-600" aria-label="Loading spinner"></i>
      </div>
      <div v-else-if="warehouses.length === 0" class="text-center text-gray-500 py-4 mt-6">
        {{ t('error.noWarehouses') }}
      </div>

      <swiper
        v-else
        :modules="[Autoplay]"
        :slides-per-view="3"
        :space-between="24"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :speed="5000"
        :grab-cursor="true"
        :css-mode="true"
        :simulate-touch="false"
        :touch-start-prevent-default="true"
        :touch-ratio="1.5"
        class="mb-8"
        :breakpoints="{
          320: { slidesPerView: 1, spaceBetween: 16 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 }
        }"
        :dir="appLang === 'ar' ? 'rtl' : 'ltr'"
      >
        <SwiperSlide
          v-for="warehouse in warehouses"
          :key="warehouse.id"
          @click="router.push({ name: 'pharmacy-warehouse-details',params:{id:warehouse.id} })"
          class="bg-white rounded-lg shadow-md z-50 cursor-pointer p-6 border-t-4 border-[#1B8A45] flex flex-col"
        >
          <div    class="flex items-center justify-between w-full mb-4">
            <div class="flex items-center gap-2">
              <i class="pi pi-briefcase text-[#1B8A45] text-xl my-auto" aria-label="Warehouse icon"></i>
              <h3 class="text-lg font-bold text-gray-800">
                {{ appLang === 'en' ? warehouse.name_en : warehouse.name_ar }}
              </h3>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-star-fill text-[#EAB308] text-base" aria-label="Rating star"></i>
              <span class="text-sm font-bold text-gray-800">{{ warehouse.rating }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 mb-4">
            <img
              v-if="warehouse.media?.[0]?.url"
              :src="warehouse.media[0].url"
              :alt="appLang === 'en' ? warehouse.name_en : warehouse.name_ar"
              class="w-16 h-16 object-cover rounded-lg"
              @error="handleImageError"
            />
            <div>
              <p class="text-sm text-gray-600">
                {{ truncateText(appLang === 'en' ? warehouse.description_en : warehouse.description_ar, 60) }}
              </p>
              <p class="text-sm text-gray-600">{{ truncateText(warehouse.address, 60) }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mt-auto w-full">
            <span
              v-for="tag in warehouse.tags"
              :key="tag.name_en"
              class="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full"
            >
              {{ appLang === 'en' ? tag.name_en : tag.name_ar }}
            </span>
          </div>
        </SwiperSlide>
      </swiper>

      <div class="flex justify-center mt-8">
        <button
          class="flex items-center justify-center px-10 py-3 font-bold text-[#1B8A45] border-2 border-[#1B8A45] rounded-full transition-colors hover:bg-[#1B8A45] hover:text-white"
          @click="router.push({ name: 'pharmacy-warehouses' })"
          :aria-label="t('all_warehouses')"
        >
          {{ t('all_warehouses') }}
          <i class="mr-2 pi pi-arrow-left" :class="{ 'pi-arrow-right': appLang === 'ar' }"></i>
        </button>
      </div>

      <Toast />
    </div>
  </div>
</template>

<style scoped>
.swiper {
  @apply w-full;
}
</style>
```
