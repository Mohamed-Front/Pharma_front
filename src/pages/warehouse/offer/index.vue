<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import axios from "axios"
import { useRouter } from "vue-router"
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag' // Import Tag component

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const loading = ref(true)
const delete_id = ref('')
const offers = ref(null)
const deleteDialog = ref(false)
const createDialog = ref(false)
const editDialog = ref(false)
const selectedOffers = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const offerForm = ref({
  description: '',
  limit: '',
  start_date: '',
  end_date: '',
  status: ''
})
const selectedOfferId = ref(null)

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)
const from = ref(0)
const to = ref(0)

const getStatusSeverity = (status) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return 'info' // Blue tag for upcoming
    case 'active':
      return 'success' // Green tag for active
    case 'expired':
      return 'danger' // Red tag for expired
    default:
      return 'secondary' // Default gray tag for unknown status
  }
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const confirmDelete = (id) => {
  delete_id.value = id
  deleteDialog.value = true
}

const deleteOffer = () => {
  axios.delete(`/api/offer/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('offer.deleteSuccess'),
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('offer.deleteError'),
        life: 3000
      })
    })
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}

const resetForm = () => {
  offerForm.value = {
    description: '',
    limit: '',
    start_date: '',
    end_date: '',
    status: ''
  }
  selectedOfferId.value = null
}

const openNew = () => {
 router.push({name:'offers-create'})
}

const openEdit = (id) => {
 router.push({name:'offers-update',params:{id:id}})
}

const saveOffer = () => {
  const url = selectedOfferId.value ? `/api/offer/${selectedOfferId.value}` : '/api/offer'
  const method = selectedOfferId.value ? 'put' : 'post'

  axios[method](url, offerForm.value)
    .then(() => {
      fetchData()
      createDialog.value = false
      editDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: selectedOfferId.value ? t('offer.updateSuccess') : t('offer.createSuccess'),
        life: 3000
      })
      resetForm()
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: selectedOfferId.value ? t('offer.updateError') : t('offer.createError'),
        life: 3000
      })
    })
}

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  loading.value = true
  axios.get("/api/offer", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loading.value = false
    offers.value = res.data.data
    totalRecords.value = res.data.pagination.total
    totalPages.value = res.data.pagination.last_page
    from.value = res.data.pagination.from
    to.value = res.data.pagination.to
  }).catch(error => {
    loading.value = false
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('offer.loadError'),
      life: 3000
    })
    console.error("Error fetching data:", error)
  })
}

watch(searchQuery, () => {
  currentPage.value = 1
  fetchData()
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchData()
  }
}

const changeRowsPerPage = (rows) => {
  rowsPerPage.value = rows.value
  currentPage.value = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div v-can="'list offers'" class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('offer.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="$t('offer.search')" />
              </span>
              <Button
                v-can="'create offers'"
                :label="t('offer.export')"
                icon="pi pi-upload"
                class="p-export"
                @click="exportCSV"
              />
              <Button
                v-can="'create offers'"
                :label="t('offer.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="openNew"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            v-can="'list offers'"
            :value="offers"
            :loading="loading"
            data-key="id"
            :paginator="false"
            :rows="rowsPerPage"
            :filters="filters"
            :totalRecords="totalRecords"
            responsive-layout="scroll"
            stripedRows
            showGridlines
            class="p-datatable-sm"
          >
            <Column selection-mode="multiple" header-style="width: 3rem"></Column>
                <Column field="product.commercial_name" :header="t('offer.product')" :sortable="true" header-style="width:20%; min-width:12rem;">
              <template #body="slotProps">
                {{ slotProps.data.product?.commercial_name }}
              </template>
            </Column>
            <Column field="description" :header="t('offer.description')" :sortable="true" header-style="width:20%; min-width:12rem;">
              <template #body="slotProps">
                {{ slotProps.data.description }}
              </template>
            </Column>

            <Column field="max_limit" :header="t('offer.max_limit')" :sortable="true" header-style="width:10%; min-width:8rem;">
              <template #body="slotProps">
                {{ slotProps.data.max_limit }}
              </template>
            </Column>
             <Column field="min_limit" :header="t('offer.min_limit')" :sortable="true" header-style="width:10%; min-width:8rem;">
              <template #body="slotProps">
                {{ slotProps.data.min_limit }}
              </template>
            </Column>

            <Column field="start_date" :header="t('offer.start_date')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                {{ new Date(slotProps.data.start_date).toLocaleDateString() }}
              </template>
            </Column>

            <Column field="end_date" :header="t('offer.start_date')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                {{ new Date(slotProps.data.end_date).toLocaleDateString() }}
              </template>
            </Column>

            <Column field="status" :header="t('offer.status')" :sortable="true" header-style="width:10%; min-width:8rem;">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.status"
                  :severity="getStatusSeverity(slotProps.data.status)"
                  class="text-sm"
                />
              </template>
            </Column>

            <Column :header="t('offer.actions')" header-style="min-width:10rem;">
              <template #body="slotProps">
                <Button
                  v-can="'edit offers'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="openEdit(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete offers'"
                  icon="pi pi-trash mx-2"
                  class="p-delete"
                  @click="confirmDelete(slotProps.data.id)"
                  v-tooltip.top="t('delete')"
                />
              </template>
            </Column>

            <template #empty>
              <div class="py-4 text-center">
                <i class="mb-2 text-2xl pi pi-exclamation-circle" />
                <p class="text-xl">{{ t('offer.noData') }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex py-4 justify-content-center align-items-center">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>

          <!-- Custom Pagination -->
          <div class="mt-3 p-paginator p-component p-unselectable-text" v-if="totalPages > 0">
            <div class="p-paginator-left-content">
              <span class="p-paginator-current">
                {{ t('offer.showing') }} {{ from }} {{ t('offer.to') }} {{ to }} {{ t('offer.of') }} {{ totalRecords }} {{ t('offer.entries') }}
              </span>
            </div>
            <div class="p-paginator-right-content">
              <span class="p-paginator-pages">
                <button
                  class="p-paginator-first p-paginator-element p-link"
                  :disabled="currentPage === 1"
                  @click="goToPage(1)"
                >
                  <span class="p-paginator-icon pi pi-angle-double-left"></span>
                </button>
                <button
                  class="p-paginator-prev p-paginator-element p-link"
                  :disabled="currentPage === 1"
                  @click="goToPage(currentPage - 1)"
                >
                  <span class="p-paginator-icon pi pi-angle-left"></span>
                </button>

                <button
                  v-for="page in totalPages"
                  :key="page"
                  class="p-paginator-page p-paginator-element p-link"
                  :class="{ 'p-highlight': currentPage === page }"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>

                <button
                  class="p-paginator-next p-paginator-element p-link"
                  :disabled="currentPage === totalPages"
                  @click="goToPage(currentPage + 1)"
                >
                  <span class="p-paginator-icon pi pi-angle-right"></span>
                </button>
                <button
                  class="p-paginator-last p-paginator-element p-link"
                  :disabled="currentPage === totalPages"
                  @click="goToPage(totalPages)"
                >
                  <span class="p-paginator-icon pi pi-angle-double-right"></span>
                </button>
              </span>

              <span class="p-paginator-rpp-options">
                <Dropdown
                  v-model="rowsPerPage"
                  :options="[5, 10, 20, 30]"
                  @change="changeRowsPerPage"
                  class="ml-2"
                  style="width: 100px"
                />
              </span>
            </div>
          </div>
        </div>


        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('offer.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('offer.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button
              :label="t('no')"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              :label="t('yes')"
              icon="pi pi-check"
              class="p-button-text p-button-danger"
              @click="deleteOffer"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
label {
  margin-bottom: 10px !important;
}
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

:deep(.p-tag) {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

:deep(.p-tag-info) {
  background-color: var(--blue-100);
  color: var(--blue-700);
}

:deep(.p-tag-success) {
  background-color: var(--green-100);
  color: var(--green-700);
}

:deep(.p-tag-danger) {
  background-color: var(--red-100);
  color: var(--red-700);
}

:deep(.p-tag-secondary) {
  background-color: var(--gray-100);
  color: var(--gray-700);
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
