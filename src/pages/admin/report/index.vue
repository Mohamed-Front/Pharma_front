<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast()
const loadingWarehouses = ref(true)
const loadingPharmacies = ref(true)
const warehousesReport = ref(null)
const pharmaciesReport = ref(null)
const dtWarehouses = ref(null)
const dtPharmacies = ref(null)
const filtersWarehouses = ref({})
const filtersPharmacies = ref({})
const searchQueryWarehouses = ref('')
const searchQueryPharmacies = ref('')
const activeTab = ref(0)

// Get application language from localStorage
const appLang = ref(localStorage.getItem('appLang') || 'en')

// Pagination variables for Warehouses
const currentPageWarehouses = ref(1)
const totalRecordsWarehouses = ref(0)
const rowsPerPageWarehouses = ref(10)
const totalPagesWarehouses = ref(0)
const fromWarehouses = ref(0)
const toWarehouses = ref(0)

// Pagination variables for Pharmacies
const currentPagePharmacies = ref(1)
const totalRecordsPharmacies = ref(0)
const rowsPerPagePharmacies = ref(10)
const totalPagesPharmacies = ref(0)
const fromPharmacies = ref(0)
const toPharmacies = ref(0)

const exportCSVWarehouses = () => {
  if (dtWarehouses.value && warehousesReport.value?.length) {
    dtWarehouses.value.exportCSV()
  } else {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('report.noDataToExport'),
      life: 3000
    })
  }
}

const exportCSVPharmacies = () => {
  if (dtPharmacies.value && pharmaciesReport.value?.length) {
    dtPharmacies.value.exportCSV()
  } else {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('report.noDataToExport'),
      life: 3000
    })
  }
}

const initFiltersWarehouses = () => {
  filtersWarehouses.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}

const initFiltersPharmacies = () => {
  filtersPharmacies.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}

const fetchWarehousesReport = () => {
  loadingWarehouses.value = true
  axios
    .get('https://pharma-service-838894765790.us-central1.run.app/api/report/admin/warehouses', {
      params: {
        page: currentPageWarehouses.value,
        limit: rowsPerPageWarehouses.value,
        search: searchQueryWarehouses.value
      }
    })
    .then((res) => {
      loadingWarehouses.value = false
      warehousesReport.value = res.data.data
      totalRecordsWarehouses.value = res.data.pagination.total
      totalPagesWarehouses.value = res.data.pagination.last_page
      fromWarehouses.value = res.data.pagination.from
      toWarehouses.value = res.data.pagination.to
    })
    .catch((error) => {
      loadingWarehouses.value = false
      const message = error.response?.data?.message || t('report.warehousesLoadError')
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: message,
        life: 3000
      })
      console.error('Error fetching warehouses report:', error)
    })
}

const fetchPharmaciesReport = () => {
  loadingPharmacies.value = true
  axios
    .get('https://pharma-service-838894765790.us-central1.run.app/api/report/admin/pharmacies', {
      params: {
        page: currentPagePharmacies.value,
        limit: rowsPerPagePharmacies.value,
        search: searchQueryPharmacies.value
      }
    })
    .then((res) => {
      loadingPharmacies.value = false
      pharmaciesReport.value = res.data.data
      totalRecordsPharmacies.value = res.data.pagination.total
      totalPagesPharmacies.value = res.data.pagination.last_page
      fromPharmacies.value = res.data.pagination.from
      toPharmacies.value = res.data.pagination.to
    })
    .catch((error) => {
      loadingPharmacies.value = false
      const message = error.response?.data?.message || t('report.pharmaciesLoadError')
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: message,
        life: 3000
      })
      console.error('Error fetching pharmacies report:', error)
    })
}

watch(searchQueryWarehouses, () => {
  currentPageWarehouses.value = 1
  fetchWarehousesReport()
})

watch(searchQueryPharmacies, () => {
  currentPagePharmacies.value = 1
  fetchPharmaciesReport()
})

const goToPageWarehouses = (page) => {
  if (page >= 1 && page <= totalPagesWarehouses.value) {
    currentPageWarehouses.value = page
    fetchWarehousesReport()
  }
}

const changeRowsPerPageWarehouses = (rows) => {
  rowsPerPageWarehouses.value = rows.value
  currentPageWarehouses.value = 1
  fetchWarehousesReport()
}

const goToPagePharmacies = (page) => {
  if (page >= 1 && page <= totalPagesPharmacies.value) {
    currentPagePharmacies.value = page
    fetchPharmaciesReport()
  }
}

const changeRowsPerPagePharmacies = (rows) => {
  rowsPerPagePharmacies.value = rows.value
  currentPagePharmacies.value = 1
  fetchPharmaciesReport()
}

onBeforeMount(() => {
  initFiltersWarehouses()
  initFiltersPharmacies()
})

onMounted(() => {
  fetchWarehousesReport()
  fetchPharmaciesReport()
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <h2 class="text-2xl font-bold mb-4">{{ t('report.title') }}</h2>

        <Toast />

        <TabView v-model:activeIndex="activeTab">
          <!-- Warehouses Report Tab -->
          <TabPanel :header="t('report.warehousesTitle')">
            <div class="card">
              <div class="flex justify-between mb-3">
                <h3 class="text-xl font-semibold">{{ t('report.warehousesTitle') }}</h3>
                <div class="flex gap-2">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="searchQueryWarehouses" :placeholder="t('report.searchWarehouses')" />
                  </span>
                  <Button
                    :label="t('report.export')"
                    icon="pi pi-upload"
                    class="p-export"
                    @click="exportCSVWarehouses"
                  />
                </div>
              </div>
              <DataTable
                ref="dtWarehouses"
                :value="warehousesReport"
                :loading="loadingWarehouses"
                data-key="id"
                :paginator="false"
                :rows="rowsPerPageWarehouses"
                :filters="filtersWarehouses"
                :totalRecords="totalRecordsWarehouses"
                responsive-layout="scroll"
                stripedRows
                showGridlines
                class="p-datatable-sm"
              >
                <Column field="name" :header="t('warehouse.name')" :sortable="true" header-style="width:25%; min-width:15rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.name }}
                  </template>
                </Column>
                <Column field="phone" :header="t('warehouse.phone')" :sortable="true" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.phone }}
                  </template>
                </Column>
                <Column field="total_sold" :header="t('report.totalSold')" :sortable="true" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.total_sold || 0 }}
                  </template>
                </Column>
                <Column field="orders_count" :header="t('report.ordersCount')" :sortable="true" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.orders_count || 0 }}
                  </template>
                </Column>
                <Column field="status_description" :header="t('warehouse.status')" :sortable="true" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.status_description }}
                  </template>
                </Column>

                <template #empty>
                  <div class="py-4 text-center">
                    <i class="mb-2 text-2xl pi pi-exclamation-circle" />
                    <p class="text-xl">{{ t('report.noWarehousesData') }}</p>
                  </div>
                </template>

                <template #loading>
                  <div class="flex py-4 justify-content-center align-items-center">
                    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
                  </div>
                </template>
              </DataTable>

              <!-- Custom Pagination for Warehouses -->
              <div class="mt-3 p-paginator p-component p-unselectable-text" v-if="totalPagesWarehouses > 0">
                <div class="p-paginator-left-content">
                  <span class="p-paginator-current">
                    {{ t('warehouse.showing') }} {{ fromWarehouses }} {{ t('warehouse.to') }} {{ toWarehouses }} {{ t('warehouse.of') }} {{ totalRecordsWarehouses }} {{ t('warehouse.entries') }}
                  </span>
                </div>
                <div class="p-paginator-right-content">
                  <span class="p-paginator-pages">
                    <button
                      class="p-paginator-first p-paginator-element p-link"
                      :disabled="currentPageWarehouses === 1"
                      @click="goToPageWarehouses(1)"
                    >
                      <span class="p-paginator-icon pi pi-angle-double-left"></span>
                    </button>
                    <button
                      class="p-paginator-prev p-paginator-element p-link"
                      :disabled="currentPageWarehouses === 1"
                      @click="goToPageWarehouses(currentPageWarehouses - 1)"
                    >
                      <span class="p-paginator-icon pi pi-angle-left"></span>
                    </button>

                    <button
                      v-for="page in totalPagesWarehouses"
                      :key="page"
                      class="p-paginator-page p-paginator-element p-link"
                      :class="{ 'p-highlight': currentPageWarehouses === page }"
                      @click="goToPageWarehouses(page)"
                    >
                      {{ page }}
                    </button>

                    <button
                      class="p-paginator-next p-paginator-element p-link"
                      :disabled="currentPageWarehouses === totalPagesWarehouses"
                      @click="goToPageWarehouses(currentPageWarehouses + 1)"
                    >
                      <span class="p-paginator-icon pi pi-angle-right"></span>
                    </button>
                    <button
                      class="p-paginator-last p-paginator-element p-link"
                      :disabled="currentPageWarehouses === totalPagesWarehouses"
                      @click="goToPageWarehouses(totalPagesWarehouses)"
                    >
                      <span class="p-paginator-icon pi pi-angle-double-right"></span>
                    </button>
                  </span>

                  <span class="p-paginator-rpp-options">
                    <Dropdown
                      v-model="rowsPerPageWarehouses"
                      :options="[5, 10, 20, 30]"
                      @change="changeRowsPerPageWarehouses"
                      class="ml-2"
                      style="width: 100px"
                    />
                  </span>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Pharmacies Report Tab -->
          <TabPanel :header="t('report.pharmaciesTitle')">
            <div class="card">
              <div class="flex justify-between mb-3">
                <h3 class="text-xl font-semibold">{{ t('report.pharmaciesTitle') }}</h3>
                <div class="flex gap-2">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="searchQueryPharmacies" :placeholder="t('report.searchPharmacies')" />
                  </span>
                  <Button
                    :label="t('report.export')"
                    icon="pi pi-upload"
                    class="p-export"
                    @click="exportCSVPharmacies"
                  />
                </div>
              </div>
              <DataTable
                ref="dtPharmacies"
                :value="pharmaciesReport"
                :loading="loadingPharmacies"
                data-key="id"
                :paginator="false"
                :rows="rowsPerPagePharmacies"
                :filters="filtersPharmacies"
                :totalRecords="totalRecordsPharmacies"
                responsive-layout="scroll"
                stripedRows
                showGridlines
                class="p-datatable-sm"
              >
                <Column field="name" :header="t('pharmacy.name')" :sortable="true" header-style="width:25%; min-width:15rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.name }}
                  </template>
                </Column>
                <Column field="phone" :header="t('pharmacy.phone')" :sortable="true" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.phone }}
                  </template>
                </Column>
                <Column field="total_sold" :header="t('report.totalSold')" :sortable="true" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.total_sold || 0 }}
                  </template>
                </Column>
                <Column field="orders_count" :header="t('report.ordersCount')" :sortable="true" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.orders_count || 0 }}
                  </template>
                </Column>
                <Column field="status_description" :header="t('pharmacy.status')" :sortable="true" header-style="width:15%; min-width:10rem;">
                  <template #body="slotProps">
                    {{ slotProps.data.status_description }}
                  </template>
                </Column>

                <template #empty>
                  <div class="py-4 text-center">
                    <i class="mb-2 text-2xl pi pi-exclamation-circle" />
                    <p class="text-xl">{{ t('report.noPharmaciesData') }}</p>
                  </div>
                </template>

                <template #loading>
                  <div class="flex py-4 justify-content-center align-items-center">
                    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
                  </div>
                </template>
              </DataTable>

              <!-- Custom Pagination for Pharmacies -->
              <div class="mt-3 p-paginator p-component p-unselectable-text" v-if="totalPagesPharmacies > 0">
                <div class="p-paginator-left-content">
                  <span class="p-paginator-current">
                    {{ t('pharmacy.showing') }} {{ fromPharmacies }} {{ t('pharmacy.to') }} {{ toPharmacies }} {{ t('pharmacy.of') }} {{ totalRecordsPharmacies }} {{ t('pharmacy.entries') }}
                  </span>
                </div>
                <div class="p-paginator-right-content">
                  <span class="p-paginator-pages">
                    <button
                      class="p-paginator-first p-paginator-element p-link"
                      :disabled="currentPagePharmacies === 1"
                      @click="goToPagePharmacies(1)"
                    >
                      <span class="p-paginator-icon pi pi-angle-double-left"></span>
                    </button>
                    <button
                      class="p-paginator-prev p-paginator-element p-link"
                      :disabled="currentPagePharmacies === 1"
                      @click="goToPagePharmacies(currentPagePharmacies - 1)"
                    >
                      <span class="p-paginator-icon pi pi-angle-left"></span>
                    </button>

                    <button
                      v-for="page in totalPagesPharmacies"
                      :key="page"
                      class="p-paginator-page p-paginator-element p-link"
                      :class="{ 'p-highlight': currentPagePharmacies === page }"
                      @click="goToPagePharmacies(page)"
                    >
                      {{ page }}
                    </button>

                    <button
                      class="p-paginator-next p-paginator-element p-link"
                      :disabled="currentPagePharmacies === totalPagesPharmacies"
                      @click="goToPagePharmacies(currentPagePharmacies + 1)"
                    >
                      <span class="p-paginator-icon pi pi-angle-right"></span>
                    </button>
                    <button
                      class="p-paginator-last p-paginator-element p-link"
                      :disabled="currentPagePharmacies === totalPagesPharmacies"
                      @click="goToPagePharmacies(totalPagesPharmacies)"
                    >
                      <span class="p-paginator-icon pi pi-angle-double-right"></span>
                    </button>
                  </span>

                  <span class="p-paginator-rpp-options">
                    <Dropdown
                      v-model="rowsPerPagePharmacies"
                      :options="[5, 10, 20, 30]"
                      @change="changeRowsPerPagePharmacies"
                      class="ml-2"
                      style="width: 100px"
                    />
                  </span>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable) {
  font-size: 0.9rem;

  .p-datatable-thead > tr > th {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
  }

  .p-datatable-tbody > tr {
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--surface-hover);
    }
  }
}

.p-paginator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 3px;

  .p-paginator-left-content {
    color: var(--text-color-secondary);
  }

  .p-paginator-right-content {
    display: flex;
    align-items: center;

    .p-paginator-pages {
      display: flex;
      margin: 0 0.5rem;

      button {
        text-align: center;
        min-width: 2.357rem;
        height: 2.357rem;
        margin: 0.143rem;
        border: 0 none;
        color: var(--text-color-secondary);
        background: transparent;
        border-radius: 50%;
        transition: background-color 0.2s;

        &:hover {
          background: var(--surface-hover);
        }

        &.p-highlight {
          color: var(--primary-color-text);
          background: var(--primary-color);
        }

        &:disabled {
          opacity: 0.5;
          cursor: default;
        }
      }
    }
  }
}

:deep(.p-tabview) {
  .p-tabview-nav {
    border-bottom: 2px solid var(--surface-border);
    margin-bottom: 1rem;

    .p-tabview-nav-link {
      font-weight: 600;
      color: var(--text-color-secondary);
      transition: color 0.2s;

      &.p-highlight {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
      }
    }
  }
}

@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }

  .p-paginator {
    flex-direction: column;
    gap: 1rem;

    .p-paginator-left-content {
      order: 2;
    }

    .p-paginator-right-content {
      order: 1;
    }
  }
}
</style>
