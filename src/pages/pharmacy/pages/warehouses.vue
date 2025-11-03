```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'
import { useRouter } from "vue-router"
const router = useRouter()

const { t } = useI18n()
const toast = useToast()

// Reactive state
const warehouses = ref([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)

// Static fallback data
const staticWarehouses = []
const WarehouseDetails =(id)=>{
  router.push({name:'pharmacy-warehouse-details',params:{id:id}})
}
// Fetch warehouses from API
const fetchWarehouses = async (page = 1) => {
  loading.value = true
  try {
    const searchParam = searchQuery.value ? `search=${encodeURIComponent(searchQuery.value)}&` : ''
    const response = await axios.get(`/api/pharmacy-home/get/warehouses?${searchParam}page=${page}`)
    if (response.data.success && response.data.data?.length > 0) {
      warehouses.value = response.data.data.map(warehouse => ({
        ...warehouse,
        name_ar: warehouse.name, // Map API 'name' to 'name_ar'
        description_ar: warehouse.description_ar || '', // Fallback description
           tags: warehouse.tags || [
          { name_ar: `متصل بأكثر من ${warehouse.connected_pharmacies} صيدلية`, name_en: `Connected to ${warehouse.connected_pharmacies} Pharmacies` }
        ],        rating: warehouse.total_rating || 0.0 // Fallback rating
      }))
      totalPages.value = response.data.pagination.last_page || 1
      currentPage.value = response.data.pagination.current_page || 1
    } else {
      warehouses.value = staticWarehouses
      totalPages.value = 1
      currentPage.value = 1
      toast.add({
        severity: 'warn',
        summary: t('warning'),
        detail: t('error.noData'),
        life: 3000
      })
    }
  } catch (error) {
    warehouses.value = staticWarehouses
    totalPages.value = 1
    currentPage.value = 1
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
  event.target.src = '/path/to/fallback-image.jpg' // Replace with actual fallback image
}

// Filter warehouses based on search query
const filteredWarehouses = computed(() => {
  if (!searchQuery.value) return warehouses.value
  return warehouses.value.filter(warehouse =>
    warehouse.name_ar.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    warehouse.address.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Handle page change
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchWarehouses(page)
  }
}

// Watch for search query changes with debounce
import { watch } from 'vue'
import { debounce } from 'lodash'
watch(
  searchQuery,
  debounce(() => {
    currentPage.value = 1
    fetchWarehouses(1)
  }, 300)
)

// Initial data fetch
onMounted(() => {
  fetchWarehouses()
});
</script>

<template>
  <div class="bg-gray-50">
    <div class="py-10 px-4 md:px-8 max-w-7xl m-auto">
      <!-- Search Bar -->
      <div class="flex justify-center mb-8">
        <div class="relative w-full max-w-lg">
          <InputText
            v-model="searchQuery"
            :placeholder="t('navbar.search')"
            class="w-full p-3 pr-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

        </div>
      </div>

      <!-- Warehouse Grid -->
      <div v-if="loading" class="flex justify-center mb-10">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      </div>
      <div v-else-if="filteredWarehouses.length === 0" class="text-center text-gray-500 mb-10">
        {{ t('error.noMatchingWarehouses') }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div
        @click="WarehouseDetails(warehouse.id)"
          v-for="warehouse in filteredWarehouses"
          :key="warehouse.id"
          class="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 flex flex-col"
        >
          <div class="flex items-center justify-between w-full mb-4">
            <div class="flex items-center gap-2">
              <i class="pi pi-briefcase text-green-600 text-xl my-auto"></i>
              <h3 class="text-lg font-bold text-gray-800">{{ warehouse.name_ar }}</h3>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-star-fill text-yellow-400 text-base"></i>
              <span class="text-sm font-bold text-gray-800">{{ warehouse.rating }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 mb-4">
            <img
              v-if="warehouse.media?.[0]?.url"
              :src="warehouse.media[0].url"
              alt="Warehouse Logo"
              class="w-16 h-16 object-cover rounded-lg"
              @error="handleImageError"
            />
            <div>
              <p class="text-sm text-gray-600">{{ warehouse.description_ar }}</p>
              <p class="text-sm text-gray-600">{{ warehouse.address }}</p>
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
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && totalPages > 1" class="flex justify-center items-center gap-2">
        <Button
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white text-gray-600 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
          @click="changePage(currentPage - 1)"
        >
          <i class="pi pi-chevron-left"></i>
        </Button>
        <Button
          v-for="page in Math.min(totalPages, 5)"
          :key="page"
          :label="page.toString()"
          :class="['pagination-button', { active: currentPage === page }]"
          @click="changePage(page)"
        />
        <span v-if="totalPages > 5" class="px-4 py-2 text-gray-500">...</span>
        <Button
          v-if="totalPages > 5"
          :label="totalPages.toString()"
          :class="['pagination-button', { active: currentPage === totalPages }]"
          @click="changePage(totalPages)"
        />
        <Button
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-white text-gray-600 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
          @click="changePage(currentPage + 1)"
        >
          <i class="pi pi-chevron-right"></i>
        </Button>
      </div>

      <Toast />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-inputtext) {
  width: 100%;
  max-width: 600px;
}

:deep(.p-button) {
  &.p-button-success {
    background-color: #059669;
    &:hover {
      background-color: #047857;
    }
  }
}

.pagination-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  color: #1f2937;
}

.pagination-button:hover {
  background-color: #f3f4f6;
}

.pagination-button.active {
  background-color: #059669;
  color: #ffffff;
}

.pagination-button.active:hover {
  background-color: #047857;
}

@media screen and (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
```
