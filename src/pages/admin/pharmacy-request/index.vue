<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import axios from "axios"
import { useRouter } from "vue-router"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

// Tab control: 0 = Pharmacies, 1 = Requests
const activeTab = ref(0)

// === Pharmacies Tab ===
const pharmacies = ref([])
const loadingPharmacies = ref(true)
const deletePharmacyId = ref('')
const deletePharmacyDialog = ref(false)

// === Requests Tab ===
const loadingRequests = ref(true)
const delete_id = ref('')
const reject_id = ref('')
const accept_id = ref('')
const pharmacyRequests = ref([])
const deleteDialog = ref(false)
const rejectDialog = ref(false)
const acceptDialog = ref(false)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const rejected_message = ref('')

// Pagination
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)
const from = ref(0)
const to = ref(0)

// Export CSV
const exportCSV = () => {
  if (dt.value) dt.value.exportCSV()
}

// === Pharmacy Delete ===
const confirmDeletePharmacy = (id) => {
  deletePharmacyId.value = id
  deletePharmacyDialog.value = true
}

const deletePharmacy = () => {
  axios.delete(`/api/pharmacy/${deletePharmacyId.value}`)
    .then(() => {
      fetchPharmacies()
      deletePharmacyDialog.value = false
      toast.add({ severity: 'success', summary: t('success'), detail: t('pharmacy.deleteSuccess'), life: 3000 })
    })
    .catch((error) => {
      deletePharmacyDialog.value = false
      toast.add({ severity: 'error', summary: t('error'), detail: t('pharmacy.deleteError'), life: 3000 })
      console.error("Delete pharmacy error:", error)
    })
}

// === Request Actions ===
const confirmDelete = (id) => {
  delete_id.value = id
  deleteDialog.value = true
}

const confirmReject = (id) => {
  reject_id.value = id
  rejected_message.value = ''
  rejectDialog.value = true
}

const confirmAccept = (id) => {
  accept_id.value = id
  acceptDialog.value = true
}

const deleteRequest = () => {
  axios.delete(`/api/pharmacy-request/${delete_id.value}`)
    .then(() => {
      fetchRequests()
      deleteDialog.value = false
      toast.add({ severity: 'success', summary: t('success'), detail: t('pharmacyRequest.deleteSuccess'), life: 3000 })
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: t('error'), detail: t('pharmacyRequest.deleteError'), life: 3000 })
    })
}

const acceptRequest = () => {
  axios.post(`/api/pharmacy-request/accept/${accept_id.value}`)
    .then(() => {
      fetchRequests()
      acceptDialog.value = false
      toast.add({ severity: 'success', summary: t('success'), detail: t('pharmacyRequest.acceptSuccess'), life: 3000 })
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: t('error'), detail: t('pharmacyRequest.acceptError'), life: 3000 })
    })
}

const rejectRequest = () => {
  if (!rejected_message.value.trim()) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('pharmacyRequest.rejectedMessageRequired'), life: 3000 })
    return
  }

  axios.post(`/api/pharmacy-request/reject/${reject_id.value}`, { rejected_message: rejected_message.value })
    .then(() => {
      fetchRequests()
      rejectDialog.value = false
      toast.add({ severity: 'success', summary: t('success'), detail: t('pharmacyRequest.rejectSuccess'), life: 3000 })
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: t('error'), detail: t('pharmacyRequest.rejectError'), life: 3000 })
    })
}

const showDetails = (id) => {
  router.push({ name: 'pharmacy_request_show', params: { id } })
}

// Status severity helper
const getStatusSeverity = (status) => {
  switch (status) {
    case 1: return 'success'  // نشط
    case 2: return 'warning'  // قيد الانتظار
    case 3: return 'danger'   // مرفوض
    default: return 'info'
  }
}

// Filters
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}

onBeforeMount(() => {
  initFilters()
})

// Fetch Data
const fetchPharmacies = () => {
  loadingPharmacies.value = true
  axios.get("/api/pharmacy")
    .then((res) => {
      pharmacies.value = res.data.data || []
      loadingPharmacies.value = false
    })
    .catch((error) => {
      loadingPharmacies.value = false
      toast.add({ severity: 'error', summary: t('error'), detail: t('pharmacy.loadError'), life: 3000 })
      console.error("Error fetching pharmacies:", error)
    })
}

const fetchRequests = () => {
  loadingRequests.value = true
  axios.get("/api/pharmacy-request", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loadingRequests.value = false
    pharmacyRequests.value = res.data.data || []
    const pagination = res.data.pagination || {}
    totalRecords.value = pagination.total || 0
    totalPages.value = pagination.last_page || 1
    from.value = pagination.from || 0
    to.value = pagination.to || 0
  }).catch((error) => {
    loadingRequests.value = false
    toast.add({ severity: 'error', summary: t('error'), detail: t('pharmacyRequest.loadError'), life: 3000 })
    console.error("Error fetching requests:", error)
  })
}

// Watch search
watch(searchQuery, () => {
  if (activeTab.value === 1) {
    currentPage.value = 1
    fetchRequests()
  }
})

// Pagination
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchRequests()
  }
}

const changeRowsPerPage = () => {
  currentPage.value = 1
  fetchRequests()
}

// Lifecycle
onMounted(() => {
  if (activeTab.value === 0) fetchPharmacies()
  else fetchRequests()
})

watch(activeTab, (newTab) => {
  if (newTab === 0) {
    fetchPharmacies()
  } else {
    searchQuery.value = ''
    currentPage.value = 1
    fetchRequests()
  }
})

const openNew = () => {
  router.push({ name: 'add-pharmacy' })
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">
              {{ activeTab === 0 ? t('pharmacy.title') : t('pharmacyRequest.title') }}
            </h2>
          </template>
          <template #end>
            <div class="flex gap-2">
              <span v-if="activeTab === 1" class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('pharmacyRequest.search')" />
              </span>
              <Button
                v-if="activeTab === 1"
                :label="t('pharmacyRequest.export')"
                icon="pi pi-upload"
                class="p-export"
                @click="exportCSV"
              />
              <Button
                :label="t('pharmacyRequest.new')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="openNew"
              />
            </div>
          </template>
        </Toolbar>

        <!-- Tabs -->
        <TabView v-model:activeIndex="activeTab">
          <!-- Pharmacies Tab -->
          <TabPanel :header="t('pharmacy.tabPharmacies')">
            <DataTable
              :value="pharmacies"
              :loading="loadingPharmacies"
              responsiveLayout="scroll"
              stripedRows
              showGridlines
              class="p-datatable-sm"
            >
              <Column field="name" :header="t('pharmacy.name')" :sortable="true">
                <template #body="slotProps">{{ slotProps.data.name }}</template>
              </Column>
              <Column field="phone" :header="t('pharmacy.phone')" :sortable="true">
                <template #body="slotProps">{{ slotProps.data.phone }}</template>
              </Column>
              <Column field="city" :header="t('pharmacy.city')" :sortable="true">
                <template #body="slotProps">{{ slotProps.data.city || '-' }}</template>
              </Column>
              <Column field="address" :header="t('pharmacy.address')" :sortable="true">
                <template #body="slotProps">{{ slotProps.data.address }}</template>
              </Column>
              <Column field="status_description" :header="t('pharmacy.status')">
                <template #body="slotProps">
                  <Tag
                    :value="slotProps.data.status_description"
                    :severity="slotProps.data.status === 1 ? 'success' : 'danger'"
                  />
                </template>
              </Column>

              <template #empty>
                <div class="py-4 text-center">
                  <i class="mb-2 text-2xl pi pi-exclamation-circle" />
                  <p class="text-xl">{{ t('pharmacy.noData') }}</p>
                </div>
              </template>
              <template #loading>
                <div class="flex py-4 justify-content-center align-items-center">
                  <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
                </div>
              </template>
            </DataTable>
          </TabPanel>

          <!-- Requests Tab -->
          <TabPanel :header="t('pharmacyRequest.tabRequests')">
            <Toast />

            <DataTable
              ref="dt"
              :value="pharmacyRequests"
              :loading="loadingRequests"
              data-key="id"
              :paginator="false"
              :filters="filters"
              responsive-layout="scroll"
              stripedRows
              showGridlines
              class="p-datatable-sm"
            >
              <Column selection-mode="multiple" header-style="width: 3rem"></Column>

              <Column field="number" :header="t('pharmacyRequest.number')" :sortable="true">
                <template #body="slotProps">{{ slotProps.data.number }}</template>
              </Column>
              <Column field="name" :header="t('pharmacyRequest.name')" :sortable="true">
                <template #body="slotProps">{{ slotProps.data.name }}</template>
              </Column>
              <Column field="email" :header="t('pharmacyRequest.email')" :sortable="true">
                <template #body="slotProps">{{ slotProps.data.email || '-' }}</template>
              </Column>
              <Column field="address" :header="t('pharmacyRequest.address')" :sortable="true">
                <template #body="slotProps">{{ slotProps.data.address }}</template>
              </Column>
              <Column field="status_description" :header="t('pharmacyRequest.status')">
                <template #body="slotProps">
                  <Tag
                    :value="slotProps.data.status_description"
                    :severity="getStatusSeverity(slotProps.data.status)"
                  />
                </template>
              </Column>

              <!-- Actions Column - Fixed Logic -->
              <Column :header="t('actions')" header-style="min-width:15rem;">
                <template #body="slotProps">
                  <div class="flex gap-2">
                    <!-- View -->
                    <Button
                      icon="pi pi-eye"
                      class="p-button-rounded p-detail p-button-sm"
                      @click="showDetails(slotProps.data.id)"
                      v-tooltip.top="t('role.view')"
                    />

                    <!-- Accept: Only if pending (status === 2) -->
                    <Button
                      v-if="slotProps.data.status === 2"
                      v-can="'accept pharmacy requests'"
                      icon="pi pi-check"
                      class="p-button-rounded p-detail p-button-sm"
                      @click="confirmAccept(slotProps.data.id)"
                      v-tooltip.top="t('order.accept')"
                    />

                    <!-- Reject: Only if pending (status === 2) -->
                    <Button
                      v-if="slotProps.data.status === 2"
                      v-can="'reject pharmacy requests'"
                      icon="pi pi-times"
                      class="p-button-rounded p-delete p-button-sm"
                      @click="confirmReject(slotProps.data.id)"
                      v-tooltip.top="t('order.reject')"
                    />

                    <!-- Delete: Always visible -->
                    <Button
                      v-if="slotProps.data.status === 2 || slotProps.data.status === 3"
                      icon="pi pi-trash"
                      class="p-button-rounded p-delete p-button-sm"
                      @click="confirmDelete(slotProps.data.id)"
                      v-tooltip.top="t('delete')"
                    />
                  </div>
                </template>
              </Column>

              <template #empty>
                <div class="py-4 text-center">
                  <i class="mb-2 text-2xl pi pi-exclamation-circle" />
                  <p class="text-xl">{{ t('pharmacyRequest.noData') }}</p>
                </div>
              </template>
              <template #loading>
                <div class="flex py-4 justify-content-center align-items-center">
                  <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
                </div>
              </template>
            </DataTable>

            <!-- Custom Pagination -->
            <div class="mt-3 p-paginator p-component" v-if="totalPages > 0">
              <div class="p-paginator-left-content">
                <span class="p-paginator-current">
                  {{ t('showing') }} {{ from }} {{ t('to') }} {{ to }} {{ t('of') }} {{ totalRecords }} {{ t('entries') }}
                </span>
              </div>
              <div class="p-paginator-right-content flex align-items-center gap-3">
                <div class="p-paginator-pages">
                  <button class="p-paginator-first p-link" :disabled="currentPage === 1" @click="goToPage(1)">
                    <span class="pi pi-angle-double-left"></span>
                  </button>
                  <button class="p-paginator-prev p-link" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
                    <span class="pi pi-angle-left"></span>
                  </button>

                  <button
                    v-for="page in totalPages"
                    :key="page"
                    class="p-paginator-page p-link"
                    :class="{ 'p-highlight': currentPage === page }"
                    @click="goToPage(page)"
                  >{{ page }}</button>

                  <button class="p-paginator-next p-link" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
                    <span class="pi pi-angle-right"></span>
                  </button>
                  <button class="p-paginator-last p-link" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">
                    <span class="pi pi-angle-double-right"></span>
                  </button>
                </div>

                <Dropdown
                  v-model="rowsPerPage"
                  :options="[5, 10, 20, 30, 50]"
                  @change="changeRowsPerPage"
                  class="ml-3"
                  style="width: 100px"
                />
              </div>
            </div>
          </TabPanel>
        </TabView>

        <!-- Dialogs -->
        <Dialog v-model:visible="deletePharmacyDialog" :style="{ width: '450px' }" :header="t('pharmacy.deleteConfirmTitle')" :modal="true">
          <div class="flex align-items-center justify-content-center gap-3">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('pharmacy.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="deletePharmacyDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-danger" @click="deletePharmacy" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header="t('pharmacyRequest.deleteConfirmTitle')" :modal="true">
          <div class="flex align-items-center justify-content-center gap-3">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('pharmacyRequest.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-danger" @click="deleteRequest" />
          </template>
        </Dialog>

        <Dialog v-model:visible="acceptDialog" :style="{ width: '450px' }" :header="t('pharmacyRequest.acceptConfirmTitle')" :modal="true">
          <div class="flex align-items-center justify-content-center gap-3">
            <i class="pi pi-check-circle" style="font-size: 2rem; color: var(--green-500)" />
            <span>{{ t('pharmacyRequest.acceptConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="acceptDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-success" @click="acceptRequest" />
          </template>
        </Dialog>

        <Dialog v-model:visible="rejectDialog" :style="{ width: '500px' }" :header="t('pharmacyRequest.rejectConfirmTitle')" :modal="true">
          <div class="flex flex-column gap-4">
            <div class="flex align-items-center gap-3">
              <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
              <span>{{ t('pharmacyRequest.rejectConfirmMessage') }}</span>
            </div>
            <div>
              <label for="rejectedMessage">{{ t('pharmacyRequest.rejectedMessage') }}</label>
              <Textarea
                v-model="rejected_message"
                id="rejectedMessage"
                rows="4"
                class="w-full mt-2"
                :placeholder="t('pharmacyRequest.rejectedMessagePlaceholder')"
              />
            </div>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="rejectDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-danger" @click="rejectRequest" />
          </template>
        </Dialog>
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
  }
  .p-datatable-tbody > tr:hover {
    background-color: var(--surface-hover);
  }
}

.p-paginator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  margin-top: 1rem;

  .p-paginator-page {
    min-width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    &.p-highlight {
      background: var(--primary-color);
      color: var(--primary-color-text);
    }
  }
}

@media (max-width: 768px) {
  .p-paginator {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
