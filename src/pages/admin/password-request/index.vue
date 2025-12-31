<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import axios from "axios"
import { useRouter } from "vue-router"
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Toolbar from 'primevue/toolbar'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'

// 1. Define the base URL for the link generation
const BASE_URL = 'https://admin.pharmabank.sy/auth/change-password/'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const loading = ref(true)
const delete_id = ref('')
const requests = ref(null) // Changed from 'offers'
const deleteDialog = ref(false)
const createDialog = ref(false) // Not used in this context, but kept for completeness
const editDialog = ref(false) // Not used in this context, but kept for completeness
const selectedRequests = ref(null) // Changed from 'selectedOffers'
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const requestForm = ref({ // Changed from 'offerForm'
  description: '', // These fields are for an old form, can be removed if not needed for request
  limit: '',
  start_date: '',
  end_date: '',
  status: ''
})
const selectedRequestId = ref(null) // Changed from 'selectedOfferId'

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)
const from = ref(0)
const to = ref(0)

/**
 * Maps the status code (number) to a severity/color for the PrimeVue Tag component.
 * Assuming:
 * status 2 = Pending (Info/Blue)
 * status 1 = Approved (Success/Green)
 * status 3 = Rejected (Danger/Red)
 * @param {number} status - The status code from the API response (e.g., 1, 2, 3)
 * @returns {string} - The severity string ('info', 'success', 'danger', 'secondary')
 */
const getStatusSeverity = (status) => {
  switch (status) {
    case 2: // Assuming 2 is 'Pending' or 'In Progress'
      return 'info'
    case 1: // Assuming 1 is 'Approved'
      return 'success'
    case 3: // Assuming 3 is 'Rejected' or 'Cancelled'
      return 'danger'
    default:
      return 'secondary' // Default for unknown status
  }
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const confirmDelete = (id) => {
  delete_id.value = id
  deleteDialog.value = true
}

const deleteRequest = () => {
  // Update to the correct API endpoint for deleting password requests if needed
  // This currently uses the /api/offer endpoint, which should be updated.
  // For now, I'll use the placeholder delete route, but this part needs verification.
  axios.delete(`/api/change-password-request/${delete_id.value}`) // Placeholder: adjust route as necessary
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('passwordRequest.deleteSuccess'), // Changed translation key
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('passwordRequest.deleteError'), // Changed translation key
        life: 3000
      })
    })
}

/**
 * Copies the full URL to the password request to the clipboard.
 * @param {string} requestNumber - The 'number' field from the request data.
 */
const copyLink = async (requestNumber) => {
  const fullUrl = `${BASE_URL}${requestNumber}`
  try {
    // 2. Use the modern Clipboard API
    await navigator.clipboard.writeText(fullUrl)
    toast.add({
      severity: 'success',
      summary: t('success'),
      detail: `${t('passwordRequest.linkCopied')}: ${requestNumber}`, // Assuming 'linkCopied' is a translation key
      life: 3000
    })
  } catch (err) {
    console.error('Failed to copy text: ', err)
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('passwordRequest.copyLinkError'), // Assuming 'copyLinkError' is a translation key
      life: 3000
    })
  }
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}

const resetForm = () => {
  requestForm.value = {
    description: '',
    limit: '',
    start_date: '',
    end_date: '',
    status: ''
  }
  selectedRequestId.value = null
}

// These functions are for creation/editing, which usually redirects for a complex form.
// They are kept as placeholders but now refer to 'passwordRequest' context.
const openNew = () => {
  router.push({ name: 'passwordRequests-create' }) // Assuming a create route exists
}

const openEdit = (id) => {
  router.push({ name: 'passwordRequests-update', params: { id: id } }) // Assuming an update route exists
}

// The 'saveOffer' logic is renamed to 'saveRequest' but is likely not needed
// for this view if it only manages listing/deleting. I'm commenting out the body
// as it conflicts with the new data structure/flow, but keeping the function definition.
/*
const saveRequest = () => {
  const url = selectedRequestId.value ? `/api/change-password-request/${selectedRequestId.value}` : '/api/change-password-request'
  const method = selectedRequestId.value ? 'put' : 'post'

  axios[method](url, requestForm.value)
    .then(() => {
      fetchData()
      createDialog.value = false
      editDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: selectedRequestId.value ? t('passwordRequest.updateSuccess') : t('passwordRequest.createSuccess'),
        life: 3000
      })
      resetForm()
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: selectedRequestId.value ? t('passwordRequest.updateError') : t('passwordRequest.createError'),
        life: 3000
      })
    })
}
*/

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  loading.value = true
  // Corrected the API endpoint as per the user's request
  axios.get("/api/change-password-request", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loading.value = false
    requests.value = res.data.data // Changed to 'requests'
    totalRecords.value = res.data.pagination.total
    totalPages.value = res.data.pagination.last_page
    from.value = res.data.pagination.from
    to.value = res.data.pagination.to
  }).catch(error => {
    loading.value = false
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('passwordRequest.loadError'), // Changed translation key
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
  <div class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('passwordRequest.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">

              <Button

                :label="t('passwordRequest.export')"
                icon="pi pi-upload"
                class="p-export"
                @click="exportCSV"
              />

            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            :value="requests"
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

            <Column field="number" :header="t('passwordRequest.number')" :sortable="true" header-style="width:15%; min-width:12rem;">
              <template #body="slotProps">
                {{ slotProps.data.number }}
              </template>
            </Column>

            <Column field="requestable.name" :header="t('passwordRequest.requestableName')" :sortable="true" header-style="width:20%; min-width:15rem;">
              <template #body="slotProps">
                {{ slotProps.data.requestable?.name }}
              </template>
            </Column>

            <Column field="type" :header="t('passwordRequest.type')" :sortable="true" header-style="width:10%; min-width:8rem;">
              <template #body="slotProps">
                {{ slotProps.data.type }}
              </template>
            </Column>

            <Column field="phone" :header="t('passwordRequest.phone')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.phone }}
              </template>
            </Column>

            <Column field="status_description" :header="t('passwordRequest.status')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.status_description"
                  :severity="getStatusSeverity(slotProps.data.status)"
                  class="text-sm"
                />
              </template>
            </Column>

            <Column :header="t('passwordRequest.actions')" header-style="min-width:10rem;">
              <template #body="slotProps">
                <Button
                  icon="pi pi-link"
                  class="p-detail"
                  :disabled="slotProps.data.status==1"
                  @click="copyLink(slotProps.data.number)"
                  v-tooltip.top="t('passwordRequest.copyLink')"
                />


              </template>
            </Column>

            <template #empty>
              <div class="py-4 text-center">
                <i class="mb-2 text-2xl pi pi-exclamation-circle" />
                <p class="text-xl">{{ t('passwordRequest.noData') }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex py-4 justify-content-center align-items-center">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>

          <div class="mt-3 p-paginator p-component p-unselectable-text" v-if="totalPages > 0">
            <div class="p-paginator-left-content">
              <span class="p-paginator-current">
                {{ t('passwordRequest.showing') }} {{ from }} {{ t('passwordRequest.to') }} {{ to }} {{ t('passwordRequest.of') }} {{ totalRecords }} {{ t('passwordRequest.entries') }}
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


        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('passwordRequest.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('passwordRequest.deleteConfirmMessage') }}</span>
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
              @click="deleteRequest"
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
