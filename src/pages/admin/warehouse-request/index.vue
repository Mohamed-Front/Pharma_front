<script setup>
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch, computed } from 'vue'
import axios from "axios"
import { useRouter } from "vue-router"
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash-es'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

// === Tab Control ===
const activeTab = ref(0) // 0: Warehouses, 1: Requests, 2: Distinctive

// === Warehouses Tab ===
const warehouses = ref([])
const loadingWarehouses = ref(true)
const deleteWarehouseId = ref('')
const deleteWarehouseDialog = ref(false)

// === Requests Tab ===
const loadingRequests = ref(true)
const delete_id = ref('')
const reject_id = ref('')
const accept_id = ref('')
const warehouseRequests = ref([])
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

// Action loading states
const accepting = ref(false)
const rejecting = ref(false)
const deletingRequest = ref(false)
const deletingWarehouse = ref(false)
const savingDistinctive = ref(false)
const removingDistinctive = ref(false)

// === Distinctive Warehouses Tab ===
const distinctiveWarehouses = ref([])
const loadingDistinctive = ref(true)
const distinctiveDialog = ref(false)
const removeDistinctiveDialog = ref(false)
const isUpdate = ref(false)
const selectedPeriod = ref(null)
const selectedWarehouse = ref(null)
const fromDate = ref('')
const toDate = ref('')
const currentPeriodId = ref(null)

// === Expanded Rows ===
const expandedRows = ref([])

// === Filters ===
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}
onBeforeMount(() => {
  initFilters()
})

// === Status Severity Helper ===
const getStatusSeverity = (status) => {
  switch (status) {
    case 1: return 'success'  // active
    case 2: return 'warning'  // pending
    case 3: return 'danger'   // rejected
    default: return 'info'
  }
}

// === Fetch Data ===
const fetchWarehouses = () => {
  loadingWarehouses.value = true
  axios.get("/api/warehouse")
    .then((res) => {
      warehouses.value = res.data.data || []
      loadingWarehouses.value = false
    })
    .catch((error) => {
      loadingWarehouses.value = false
      toast.add({ severity: 'error', summary: t('error'), detail: t('warehouse.loadError'), life: 3000 })
      console.error("Error fetching warehouses:", error)
    })
}

const fetchDistinctiveWarehouses = () => {
  loadingDistinctive.value = true
  axios.get("/api/warehouse?is_distinctive=1")
    .then((res) => {
      distinctiveWarehouses.value = res.data.data || []
      loadingDistinctive.value = false
    })
    .catch((error) => {
      loadingDistinctive.value = false
      toast.add({ severity: 'error', summary: t('error'), detail: t('distinctiveWarehouses.loadError'), life: 3000 })
      console.error("Error fetching distinctive warehouses:", error)
    })
}

const fetchRequests = () => {
  loadingRequests.value = true
  axios.get("/api/warehouse-request", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loadingRequests.value = false
    warehouseRequests.value = res.data.data || []
    const pagination = res.data.pagination || {}
    totalRecords.value = pagination.total || 0
    totalPages.value = pagination.last_page || 1
    from.value = pagination.from || 0
    to.value = pagination.to || 0
  }).catch((error) => {
    loadingRequests.value = false
    toast.add({ severity: 'error', summary: t('error'), detail: t('warehouseRequest.loadError'), life: 3000 })
    console.error("Error fetching requests:", error)
  })
}

// === Row Expand / Collapse ===
const onRowExpand = (event) => {
  expandedRows.value = [...expandedRows.value, event.data]
}

const onRowCollapse = (event) => {
  expandedRows.value = expandedRows.value.filter(r => r.id !== event.data.id)
}

// === Actions ===
const confirmDeleteWarehouse = (id) => {
  deleteWarehouseId.value = id
  deleteWarehouseDialog.value = true
}

const deleteWarehouse = () => {
  deletingWarehouse.value = true
  axios.delete(`/api/warehouse/${deleteWarehouseId.value}`)
    .then(() => {
      fetchWarehouses()
      fetchDistinctiveWarehouses()
      deleteWarehouseDialog.value = false
      toast.add({ severity: 'success', summary: t('success'), detail: t('warehouse.deleteSuccess'), life: 3000 })
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: t('error'), detail: t('warehouse.deleteError'), life: 3000 })
    })
    .finally(() => deletingWarehouse.value = false)
}

const confirmDelete = (id) => { delete_id.value = id; deleteDialog.value = true }
const confirmReject = (id) => { reject_id.value = id; rejected_message.value = ''; rejectDialog.value = true }
const confirmAccept = (id) => { accept_id.value = id; acceptDialog.value = true }

const deleteRequest = () => {
  deletingRequest.value = true
  axios.delete(`/api/warehouse-request/${delete_id.value}`)
    .then(() => {
      fetchRequests()
      deleteDialog.value = false
      toast.add({ severity: 'success', summary: t('success'), detail: t('warehouseRequest.deleteSuccess'), life: 3000 })
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: t('error'), detail: t('warehouseRequest.deleteError'), life: 3000 })
    })
    .finally(() => deletingRequest.value = false)
}

const acceptRequest = () => {
  accepting.value = true
  axios.post(`/api/warehouse-request/accept/${accept_id.value}`)
    .then(() => {
      fetchRequests()
      acceptDialog.value = false
      toast.add({ severity: 'success', summary: t('success'), detail: t('warehouseRequest.acceptSuccess'), life: 3000 })
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: t('error'), detail: t('warehouseRequest.acceptError'), life: 3000 })
    })
    .finally(() => accepting.value = false)
}

const rejectRequest = () => {
  if (!rejected_message.value.trim()) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('warehouseRequest.rejectedMessageRequired'), life: 3000 })
    return
  }
  rejecting.value = true
  axios.post(`/api/warehouse-request/reject/${reject_id.value}`, { rejected_message: rejected_message.value })
    .then(() => {
      fetchRequests()
      rejectDialog.value = false
      toast.add({ severity: 'success', summary: t('success'), detail: t('warehouseRequest.rejectSuccess'), life: 3000 })
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: t('error'), detail: t('warehouseRequest.rejectError'), life: 3000 })
    })
    .finally(() => rejecting.value = false)
}

const showDetails = (id) => {
  router.push({ name: 'warehouse_request_show', params: { id } })
}

// === Distinctive Actions ===
const openDistinctiveDialog = (warehouse, period = null) => {
  selectedWarehouse.value = warehouse
  selectedPeriod.value = period
  isUpdate.value = !!period
  currentPeriodId.value = period?.id || null
  fromDate.value = period?.from_date || ''
  toDate.value = period?.to_date || ''
  distinctiveDialog.value = true
}

const saveDistinctive = () => {
  if (!fromDate.value || !toDate.value) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('distinctiveWarehouses.datesRequired'), life: 3000 })
    return
  }
  savingDistinctive.value = true
  const payload = { warehouse_id: selectedWarehouse.value.id, from_date: fromDate.value, to_date: toDate.value }
  const url = isUpdate.value
    ? `/api/warehouse/update/distinctive-period/${currentPeriodId.value}`
    : '/api/warehouse/add/distinctive-period'
  const method = isUpdate.value ? axios.put : axios.post

  method(url, payload)
    .then(() => {
      fetchWarehouses()
      fetchDistinctiveWarehouses()
      distinctiveDialog.value = false
      toast.add({ severity: 'success', summary: t('success'), detail: isUpdate.value ? t('distinctiveWarehouses.updateSuccess') : t('distinctiveWarehouses.addSuccess'), life: 3000 })
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: t('error'), detail: isUpdate.value ? t('distinctiveWarehouses.updateError') : t('distinctiveWarehouses.addError'), life: 3000 })
    })
    .finally(() => savingDistinctive.value = false)
}

const confirmRemoveDistinctive = (periodId) => {
  currentPeriodId.value = periodId
  removeDistinctiveDialog.value = true
}

const removeDistinctive = () => {
  removingDistinctive.value = true
  axios.delete(`/api/warehouse/delete/distinctive-period/${currentPeriodId.value}`)
    .then(() => {
      fetchWarehouses()
      fetchDistinctiveWarehouses()
      removeDistinctiveDialog.value = false
      toast.add({ severity: 'success', summary: t('success'), detail: t('distinctiveWarehouses.removeSuccess'), life: 3000 })
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: t('error'), detail: t('distinctiveWarehouses.removeError'), life: 3000 })
    })
    .finally(() => removingDistinctive.value = false)
}

// === Pagination & Search ===
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    fetchRequests()
  }
}

const changeRowsPerPage = (rows) => {
  rowsPerPage.value = rows
  currentPage.value = 1
  fetchRequests()
}

watch(searchQuery, debounce(() => {
  if (activeTab.value === 1) {
    currentPage.value = 1
    fetchRequests()
  }
}, 500))

// === Lifecycle ===
onMounted(() => {
  if (activeTab.value === 0) fetchWarehouses()
  else if (activeTab.value === 1) fetchRequests()
  else fetchDistinctiveWarehouses()
})

watch(activeTab, (newTab) => {
  if (newTab === 0) fetchWarehouses()
  else if (newTab === 1) { searchQuery.value = ''; currentPage.value = 1; fetchRequests() }
  else fetchDistinctiveWarehouses()
})

const openNew = () => router.push({ name: 'add-storehouse' })
const exportCSV = () => dt.value?.exportCSV()
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">
              {{ activeTab === 0 ? t('warehouse.title') : activeTab === 1 ? t('warehouseRequest.title') : t('distinctiveWarehouses.title') }}
            </h2>
          </template>
          <template #end>
            <div class="flex gap-2">
              <span v-if="activeTab === 1" class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('warehouseRequest.search')" />
              </span>
              <Button v-if="activeTab === 1" :label="t('warehouseRequest.export')" icon="pi pi-upload" class="p-button-outlined p-button-sm" @click="exportCSV" />
              <Button v-if="activeTab === 1" :label="t('warehouseRequest.new')" icon="pi pi-plus" class="p-button-success" @click="openNew" />
            </div>
          </template>
        </Toolbar>

        <TabView v-model:activeIndex="activeTab">

          <!-- Warehouses Tab -->
          <TabPanel :header="t('warehouse.tabWarehouses')">
            <DataTable :value="warehouses" :loading="loadingWarehouses" responsiveLayout="scroll" stripedRows showGridlines class="p-datatable-sm">
              <Column field="name" :header="t('warehouse.name')" :sortable="true"><template #body="{data}">{{ data.name }}</template></Column>
              <Column field="phone" :header="t('warehouse.phone')" :sortable="true"><template #body="{data}">{{ data.phone }}</template></Column>
              <Column field="city" :header="t('warehouse.city')" :sortable="true"><template #body="{data}">{{ data.city || '-' }}</template></Column>
              <Column field="address" :header="t('warehouse.address')" :sortable="true"><template #body="{data}">{{ data.address }}</template></Column>
              <Column field="status_description" :header="t('warehouse.status')">
                <template #body="{data}">
                  <Tag :value="data.status_description" :severity="data.status === 1 ? 'success' : 'danger'" />
                </template>
              </Column>
              <Column field="is_distinctive" :header="t('distinctiveWarehouses.distinctive')">
                <template #body="{data}">
                  <Tag :value="data.is_distinctive ? t('yes') : t('no')" :severity="data.is_distinctive ? 'success' : 'info'" />
                </template>
              </Column>
              <Column :header="t('actions')" header-style="min-width:10rem;">
                <template #body="{data}">
                  <Button icon="pi pi-star" class="mr-2 p-detail" @click="openDistinctiveDialog(data)" v-tooltip.top="t('distinctiveWarehouses.makeDistinctive')" />
                </template>
              </Column>
              <template #empty>
                <div class="text-center py-6"><i class="pi pi-inbox text-6xl text-400 mb-3" /><p class="text-xl text-600">{{ t('warehouse.noData') }}</p></div>
              </template>
            </DataTable>
          </TabPanel>

          <!-- Requests Tab - Accept/Reject only on pending -->
          <TabPanel :header="t('warehouseRequest.tabRequests')">
            <Toast />
            <DataTable ref="dt" :value="warehouseRequests" :loading="loadingRequests" data-key="id" :paginator="false" :filters="filters" responsive-layout="scroll" stripedRows showGridlines class="p-datatable-sm">
              <Column selection-mode="multiple" header-style="width: 3rem"></Column>
              <Column field="number" :header="t('warehouseRequest.number')" :sortable="true"><template #body="{data}">{{ data.number }}</template></Column>
              <Column field="name" :header="t('warehouseRequest.name')" :sortable="true"><template #body="{data}">{{ data.name }}</template></Column>
              <Column field="email" :header="t('warehouseRequest.email')" :sortable="true"><template #body="{data}">{{ data.email || '-' }}</template></Column>
              <Column field="address" :header="t('warehouseRequest.address')" :sortable="true"><template #body="{data}">{{ data.address }}</template></Column>
              <Column field="status_description" :header="t('warehouseRequest.status')">
                <template #body="{data}">
                  <Tag :value="data.status_description" :severity="getStatusSeverity(data.status)" />
                </template>
              </Column>
              <Column :header="t('actions')" header-style="min-width:16rem;">
                <template #body="{data}">
                  <div class="flex gap-2">
                    <Button icon="pi pi-eye" class="p-detail" @click="showDetails(data.id)" v-tooltip.top="t('role.view')" />
                    <Button v-if="data.status === 2" v-can="'accept warehouse requests'" icon="pi pi-check" class="p-detail" @click="confirmAccept(data.id)" v-tooltip.top="t('order.accept')" :loading="accepting && accept_id === data.id" />
                    <Button v-if="data.status === 2" v-can="'reject warehouse requests'" icon="pi pi-times" class="p-delete" @click="confirmReject(data.id)" v-tooltip.top="t('order.reject')" :loading="rejecting && reject_id === data.id" />
                    <Button   v-if="data.status === 2 || data.status === 3" icon="pi pi-trash" class="p-delete" @click="confirmDelete(data.id)" v-tooltip.top="t('delete')" :loading="deletingRequest && delete_id === data.id" />
                  </div>
                </template>
              </Column>
              <template #empty>
                <div class="text-center py-6"><i class="pi pi-inbox text-6xl text-400 mb-3" /><p class="text-xl text-600">{{ t('warehouseRequest.noData') }}</p></div>
              </template>
            </DataTable>

            <!-- Pagination -->
            <div v-if="totalPages > 0" class="flex flex-wrap justify-between items-center mt-4 gap-3">
              <span class="text-500">{{ t('showing') }} {{ from }}–{{ to }} {{ t('of') }} {{ totalRecords }} {{ t('entries') }}</span>
              <div class="flex items-center gap-1">
                <Button icon="pi pi-angle-double-left" class="p-button-sm" :disabled="currentPage===1" @click="goToPage(1)" />
                <Button icon="pi pi-angle-left" class="p-button-sm" :disabled="currentPage===1" @click="goToPage(currentPage-1)" />
                <Button v-for="n in Math.min(5, totalPages)" :key="n" :label="(currentPage - 3 + n).toString()" class="p-button-sm" :class="{'p-highlight': currentPage === currentPage - 3 + n}" @click="goToPage(currentPage - 3 + n)" :disabled="currentPage - 3 + n < 1 || currentPage - 3 + n > totalPages" />
                <Button icon="pi pi-angle-right" class="p-button-sm" :disabled="currentPage===totalPages" @click="goToPage(currentPage+1)" />
                <Button icon="pi pi-angle-double-right" class="p-button-sm" :disabled="currentPage===totalPages" @click="goToPage(totalPages)" />
                <Dropdown v-model="rowsPerPage" :options="[5,10,20,50]" @change="changeRowsPerPage($event.value)" class="ml-2" style="width:80px" />
              </div>
            </div>
          </TabPanel>

          <!-- Distinctive Warehouses Tab -->
          <TabPanel :header="t('distinctiveWarehouses.tabDistinctive')">
            <DataTable :value="distinctiveWarehouses" :loading="loadingDistinctive" :expandedRows="expandedRows" @row-expand="onRowExpand" @row-collapse="onRowCollapse" data-key="id" responsiveLayout="scroll" stripedRows showGridlines class="p-datatable-sm">
              <Column expander style="width: 3rem" />
              <Column field="name" :header="t('warehouse.name')" :sortable="true"><template #body="{data}">{{ data.name }}</template></Column>
              <Column field="phone" :header="t('warehouse.phone')" :sortable="true"><template #body="{data}">{{ data.phone }}</template></Column>
              <Column field="city" :header="t('warehouse.city')" :sortable="true"><template #body="{data}">{{ data.city || '-' }}</template></Column>
              <Column field="address" :header="t('warehouse.address')" :sortable="true"><template #body="{data}">{{ data.address }}</template></Column>
              <Column field="status_description" :header="t('warehouse.status')">
                <template #body="{data}">
                  <Tag :value="data.status_description" :severity="data.status === 1 ? 'success' : 'danger'" />
                </template>
              </Column>
              <Column :header="t('actions')" header-style="min-width:12rem;">
                <template #body="{data}">
                  <Button icon="pi pi-plus" class="mr-2 p-detail" @click="openDistinctiveDialog(data)" v-tooltip.top="t('distinctiveWarehouses.addPeriod')" />
                </template>
              </Column>

              <template #expansion="slotProps">
                <div class="p-4 border-left-3 border-primary-500 bg-surface-50">
                  <div v-if="slotProps.data.distinctive_periods?.length" class="space-y-3">
                    <div v-for="period in slotProps.data.distinctive_periods" :key="period.id" class="flex items-center justify-between p-3 bg-white border-round shadow-2">
                      <Badge :value="`${period.from_date} → ${period.to_date}`" severity="info" class="text-sm font-medium" />
                      <div class="flex gap-2">
                        <Button icon="pi pi-pencil" class="p-button-sm p-button-info" @click="openDistinctiveDialog(slotProps.data, period)" v-tooltip.top="t('edit')" />
                        <Button icon="pi pi-times" class="p-button-sm p-button-danger" @click="confirmRemoveDistinctive(period.id)" v-tooltip.top="t('delete')" :loading="removingDistinctive && currentPeriodId === period.id" />
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-4 text-600 italic">{{ t('distinctiveWarehouses.noPeriods') }}</div>
                </div>
              </template>

              <template #empty>
                <div class="text-center py-6"><i class="pi pi-star text-6xl text-400 mb-3" /><p class="text-xl text-600">{{ t('distinctiveWarehouses.noData') }}</p></div>
              </template>
            </DataTable>
          </TabPanel>
        </TabView>

        <!-- All Modals (Dialogs) -->
        <Dialog v-model:visible="deleteWarehouseDialog" :style="{ width: '450px' }" :header="t('warehouse.deleteConfirmTitle')" :modal="true">
          <div class="flex align-items-center justify-content-center gap-3">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('warehouse.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="deleteWarehouseDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-danger" @click="deleteWarehouse" :loading="deletingWarehouse" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header="t('warehouseRequest.deleteConfirmTitle')" :modal="true">
          <div class="flex align-items-center justify-content-center gap-3">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('warehouseRequest.deleteConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-danger" @click="deleteRequest" :loading="deletingRequest" />
          </template>
        </Dialog>

        <Dialog v-model:visible="acceptDialog" :style="{ width: '450px' }" :header="t('warehouseRequest.acceptConfirmTitle')" :modal="true">
          <div class="flex align-items-center justify-content-center gap-3">
            <i class="pi pi-check-circle" style="font-size: 2rem; color: var(--green-500)" />
            <span>{{ t('warehouseRequest.acceptConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="acceptDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-success" @click="acceptRequest" :loading="accepting" />
          </template>
        </Dialog>

        <Dialog v-model:visible="rejectDialog" :style="{ width: '500px' }" :header="t('warehouseRequest.rejectConfirmTitle')" :modal="true">
          <div class=" gap-4">
            <div class="flex align-items-center gap-3">
              <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
              <span>{{ t('warehouseRequest.rejectConfirmMessage') }}</span>
            </div>
            <div>
              <label for="rejectedMessage">{{ t('warehouseRequest.rejectedMessage') }}</label>
              <Textarea v-model="rejected_message" id="rejectedMessage" rows="4" class="w-full mt-2" :placeholder="t('warehouseRequest.rejectedMessagePlaceholder')" />
            </div>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="rejectDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-danger" @click="rejectRequest" :loading="rejecting" />
          </template>
        </Dialog>

        <Dialog v-model:visible="distinctiveDialog" :style="{ width: '450px' }" :header="isUpdate ? t('distinctiveWarehouses.updateConfirmTitle') : t('distinctiveWarehouses.addConfirmTitle')" :modal="true">
          <div class="flex flex-column gap-4">
            <div>
              <label for="fromDate">{{ t('distinctiveWarehouses.fromDate') }}</label>
              <InputText :max="new Date()" type="date" v-model="fromDate" id="fromDate" class="w-full mt-2" />
            </div>
            <div>
              <label for="toDate">{{ t('distinctiveWarehouses.toDate') }}</label>
              <InputText :min="fromDate" type="date" v-model="toDate" id="toDate" class="w-full mt-2" />
            </div>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="distinctiveDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-success" @click="saveDistinctive" :loading="savingDistinctive" />
          </template>
        </Dialog>

        <Dialog v-model:visible="removeDistinctiveDialog" :style="{ width: '450px' }" :header="t('distinctiveWarehouses.removeConfirmTitle')" :modal="true">
          <div class="flex align-items-center justify-content-center gap-3">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('distinctiveWarehouses.removeConfirmMessage') }}</span>
          </div>
          <template #footer>
            <Button :label="t('no')" icon="pi pi-times" class="p-button-text" @click="removeDistinctiveDialog = false" />
            <Button :label="t('yes')" icon="pi pi-check" class="p-button-danger" @click="removeDistinctive" :loading="removingDistinctive" />
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
    letter-spacing: 0.5px;
  }
  .p-datatable-tbody > tr:hover {
    background-color: var(--surface-hover);
  }
}
</style>
