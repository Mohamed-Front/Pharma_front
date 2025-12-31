<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()

// Tab Index: 0 = pharmacy, 1 = warehouse
const activeTab = ref(0)

// Data
const loading = ref(true)
const cities = ref([])
const delete_id = ref('')
const deleteDialog = ref(false)
const createDialog = ref(false)
const editDialog = ref(false)
const selectedCityId = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')

// Track loading state for status change per row
const statusLoading = ref({}) // { id: true }

// Form
const cityForm = ref({
  name: '',
  lat: '',
  long: '',
  type: 'pharmacy'
})
const errors = ref({
  name: false,
  lat: false,
  long: false,
  type: false
})

// Fetch all data
const fetchData = async () => {
  loading.value = true
  try {
    const type = activeTab.value === 0 ? 'pharmacy' : 'warehouse'
    const res = await axios.get('/api/city', {
      params: {
        limit: 1000000,
        search: searchQuery.value,
        type,

      }
    })
    cities.value = res.data.data || []
  } catch {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('city.loadError'),
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Export CSV
const exportCSV = () => dt.value?.exportCSV()

// Delete
const confirmDelete = (id) => {
  delete_id.value = id
  deleteDialog.value = true
}

const deleteCity = async () => {
  try {
    await axios.delete(`/api/city/${delete_id.value}`)
    await fetchData()
    deleteDialog.value = false
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: t('city.deleteSuccess'),
      life: 3000
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('city.deleteError'),
      life: 3000
    })
  }
}

// **NEW: Change Status**
const changeStatus = async (id) => {
  statusLoading.value[id] = true
  try {
    // Optimistically update UI
    const city = cities.value.find(c => c.id === id)
    const oldStatus = city.status
    city.status = city.status === 1 ? 0 : 1 // Toggle

    await axios.post(`/api/city/change-status/${id}`)


     fetchData()
  } catch (error) {
    // Revert on error
    const city = cities.value.find(c => c.id === id)
    if (city) city.status = city.status === 1 ? 0 : 1

    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.response?.data?.message || t('city.statusChangeError'),
      life: 4000
    })
  } finally {
    statusLoading.value[id] = false
  }
}

// Filters
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
}

// Form
const resetForm = () => {
  cityForm.value = {
    name: '',
    lat: '',
    long: '',
    type: activeTab.value === 0 ? 'pharmacy' : 'warehouse'
  }
  selectedCityId.value = null
  errors.value = { name: false, lat: false, long: false, type: false }
}

const validateForm = () => {
  const lat = parseFloat(cityForm.value.lat)
  const long = parseFloat(cityForm.value.long)

  errors.value.name = !cityForm.value.name.trim()
  errors.value.type = !['pharmacy', 'warehouse'].includes(cityForm.value.type)
  errors.value.lat = isNaN(lat) || lat < -90 || lat > 90
  errors.value.long = isNaN(long) || long < -180 || long > 180

  return !Object.values(errors.value).some(v => v)
}

const openNew = () => {
  resetForm()
  createDialog.value = true
}

const openEdit = async (id) => {
  selectedCityId.value = id
  try {
    const res = await axios.get(`/api/city/${id}`)
    cityForm.value = {
      name: res.data.data.name,
      lat: String(res.data.data.lat),
      long: String(res.data.data.long),
      type: res.data.data.type
    }
    editDialog.value = true
  } catch {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('city.loadError'),
      life: 3000
    })
  }
}

const saveCity = async () => {
  if (!validateForm()) {
    toast.add({
      severity: 'warn',
      summary: t('validation.error'),
      detail: t('validation.fixErrors'),
      life: 4000
    })
    return
  }

  const payload = {
    name: cityForm.value.name.trim(),
    lat: parseFloat(cityForm.value.lat),
    long: parseFloat(cityForm.value.long),
    type: cityForm.value.type
  }

  try {
    if (selectedCityId.value) {
      await axios.put(`/api/city/${selectedCityId.value}`, payload)
    } else {
      await axios.post('/api/city', payload)
    }

    await fetchData()
    createDialog.value = editDialog.value = false
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: selectedCityId.value ? t('city.updateSuccess') : t('city.createSuccess'),
      life: 3000
    })
    resetForm()
  } catch (error) {
    const msg = error.response?.data?.message || t('city.saveError')
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: msg,
      life: 5000
    })
  }
}

// Watchers
watch(activeTab, () => {
  searchQuery.value = ''
  filters.value.global.value = null
  fetchData()
})

watch(searchQuery, (val) => {
  filters.value.global.value = val
})

// Lifecycle
onBeforeMount(initFilters)
onMounted(fetchData)
</script>

<template>
  <div v-can="'list cities'" class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">
              {{ activeTab === 0 ? t('city.pharmacy') : t('city.warehouse') }}
            </h2>
          </template>
          <template #end>
            <div class="flex gap-2 align-items-center">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="searchQuery"
                  :placeholder="t('search')"
                  class="w-full md:w-20rem"
                />
              </span>
              <Button
                v-can="'export cities'"
                :label="t('city.export')"
                icon="pi pi-upload"
                class="p-button-outlined"
                @click="exportCSV"
              />
              <Button
                v-can="'create cities'"
                :label="t('city.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="openNew"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <!-- PrimeVue TabView -->
        <TabView v-model:activeIndex="activeTab" class="mb-4">
          <TabPanel :header="t('city.pharmacy')"></TabPanel>
          <TabPanel :header="t('city.warehouse')"></TabPanel>
        </TabView>

        <!-- DataTable -->
        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="cities"
            :loading="loading"
            data-key="id"
            :paginator="false"
            :filters="filters"
            :globalFilterFields="['name', 'lat', 'long', 'type']"
            responsiveLayout="scroll"
            stripedRows
            showGridlines
            class="p-datatable-sm"
          >
            <Column field="id" header="ID" :sortable="true" style="width: 60px">
              <template #body="slotProps">{{ slotProps.data.id }}</template>
            </Column>

            <Column field="name" :header="t('city.name')" :sortable="true">
              <template #body="slotProps">{{ slotProps.data.name }}</template>
            </Column>

            <Column field="lat" :header="t('city.lat')" :sortable="true">
              <template #body="slotProps">{{ slotProps.data.lat }}</template>
            </Column>

            <Column field="long" :header="t('city.long')" :sortable="true">
              <template #body="slotProps">{{ slotProps.data.long }}</template>
            </Column>




            <Column field="status_description" :header="t('status_description')" :sortable="true">
              <template #body="slotProps">{{ slotProps.data.status_description }}</template>
            </Column>

            <!-- Actions -->
            <Column :header="t('actions')" headerStyle="min-width:12rem">
              <template #body="slotProps">
                <Button
                  v-can="'edit cities'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="openEdit(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete cities'"
                  icon="pi pi-trash"
                  class="p-delete mx-1"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                />
                <!-- Change Status Button -->
                <Button

                  :icon="slotProps.data.status === 1 ? 'pi pi-ban' : 'pi pi-check-circle'"
                  :class="[
                    '0',
                    slotProps.data.status === 1 ? 'p-detail' : 'p-delete'
                  ]"
                  :loading="statusLoading[slotProps.data.id]"
                  @click="changeStatus(slotProps.data.id)"
                  v-tooltip.top="slotProps.data.status === 1 ? t('deactivate') : t('activate')"
                />
              </template>
            </Column>

            <template #empty>
              <div class="py-4 text-center">
                <i class="mb-2 text-2xl pi pi-exclamation-circle" />
                <p class="text-xl">{{ t('city.noData') }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex py-4 justify-content-center align-items-center">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>

          <div class="mt-3 text-600 text-sm text-right" v-if="cities.length > 0">
            {{ t('total') }}: {{ cities.length }} {{ t('entries') }}
          </div>
        </div>
   <Dialog
          v-model:visible="createDialog "
          :style="{ width: '500px' }"
          :header="selectedCityId ? t('city.editTitle') : t('city.createTitle')"
          :modal="true"
          @hide="resetForm"
        >
          <div class="p-fluid">
            <div class="field my-3">
              <p class="py-1" for="name">{{ t('city.name') }} <span class="text-red-500">*</span></p>
              <InputText
                id="name"
                v-model="cityForm.name"
                :placeholder="t('city.name')"
                :class="{ 'p-invalid': errors.name }"
              />
              <small v-if="errors.name" class="p-error">{{ t('validation.required') }}</small>
            </div>

            <div class="field my-3">
              <p class="py-1" for="lat">{{ t('city.lat') }} <span class="text-red-500">*</span></p>
              <InputText
                id="lat"
                v-model="cityForm.lat"
                type="number"
                step="0.000001"
                placeholder="e.g. 30.0444 (-90 to 90)"
                :class="{ 'p-invalid': errors.lat }"
              />
              <small v-if="errors.lat" class="p-error">
                {{ t('validation.latRange') }} (-90 to 90)
              </small>
            </div>

            <div class="field my-3">
              <p class="py-1" for="long">{{ t('city.long') }} <span class="text-red-500">*</span></p>
              <InputText
                id="long"
                v-model="cityForm.long"
                type="number"
                step="0.000001"
                placeholder="e.g. 31.2357 (-180 to 180)"
                :class="{ 'p-invalid': errors.long }"
              />
              <small v-if="errors.long" class="p-error">
                Please enter a longitude between -180 and 180.
              </small>
            </div>

            <div class="field my-3">
              <p class="py-1" for="type">{{ t('city.type') }}</p>
              <Dropdown
                v-model="cityForm.type"
                :options="[
                  { label: t('city.pharmacy'), value: 'pharmacy' },
                  { label: t('city.warehouse'), value: 'warehouse' }
                ]"
                optionLabel="label"
                optionValue="value"
                :placeholder="t('city.selectType')"
                :class="{ 'p-invalid': errors.type }"
              />
            </div>
          </div>

          <template #footer>
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              class="p-button-text"
              @click="createDialog = editDialog = false"
            />
            <Button
              :label="t('save')"
              icon="pi pi-check"
              class="p-button-success"
              @click="saveCity"
            />
          </template>
        </Dialog>


        <Dialog
          v-model:visible="editDialog "
          :style="{ width: '500px' }"
          :header="selectedCityId ? t('city.editTitle') : t('city.createTitle')"
          :modal="true"
          @hide="resetForm"
        >
          <div class="p-fluid">
            <div class="field my-3">
              <p class="py-1" for="name">{{ t('city.name') }} <span class="text-red-500">*</span></p>
              <InputText
                id="name"
                v-model="cityForm.name"
                :placeholder="t('city.name')"
                :class="{ 'p-invalid': errors.name }"
              />
              <small v-if="errors.name" class="p-error">{{ t('validation.required') }}</small>
            </div>

            <div class="field my-3">
              <p class="py-1" for="lat">{{ t('city.lat') }} <span class="text-red-500">*</span></p>
              <InputText
                id="lat"
                v-model="cityForm.lat"
                type="number"
                step="0.000001"
                placeholder="e.g. 30.0444 (-90 to 90)"
                :class="{ 'p-invalid': errors.lat }"
              />
              <small v-if="errors.lat" class="p-error">
                {{ t('validation.latRange') }} (-90 to 90)
              </small>
            </div>

            <div class="field my-3">
              <p class="py-1" for="long">{{ t('city.long') }} <span class="text-red-500">*</span></p>
              <InputText
                id="long"
                v-model="cityForm.long"
                type="number"
                step="0.000001"
                placeholder="e.g. 31.2357 (-180 to 180)"
                :class="{ 'p-invalid': errors.long }"
              />
              <small v-if="errors.long" class="p-error">
                Please enter a longitude between -180 and 180.
              </small>
            </div>

            <div class="field my-3">
              <p class="py-1" for="type">{{ t('city.type') }}</p>
              <Dropdown
                v-model="cityForm.type"
                :options="[
                  { label: t('city.pharmacy'), value: 'pharmacy' },
                  { label: t('city.warehouse'), value: 'warehouse' }
                ]"
                optionLabel="label"
                optionValue="value"
                :placeholder="t('city.selectType')"
                :class="{ 'p-invalid': errors.type }"
              />
            </div>
          </div>

          <template #footer>
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              class="p-button-text"
              @click="createDialog = editDialog = false"
            />
            <Button
              :label="t('save')"
              icon="pi pi-check"
              class="p-button-success"
              @click="saveCity"
            />
          </template>
        </Dialog>

        <!-- Delete Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('city.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('city.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-danger" @click="deleteCity" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-tabview) {
  .p-tabview-nav {
    border: none;
    border-bottom: 2px solid var(--surface-border);

    li {
      margin-right: 1.5rem;

      .p-tabview-nav-link {
        padding: 1rem 0;
        font-weight: 600;
        border: none;
        border-bottom: 3px solid transparent;
        border-radius: 0;
        color: var(--text-color-secondary);

        &:hover {
          color: var(--primary-color);
        }
      }

      &.p-highlight .p-tabview-nav-link {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }
    }
  }
}

:deep(.p-datatable) {
  font-size: 0.9rem;

  .p-datatable-thead > tr > th {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
  }

  .p-datatable-tbody > tr:hover {
    background-color: var(--surface-hover);
  }
}
</style>
