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
const loading = ref(true)
const delete_id = ref('')
const orders = ref(null)
const deleteDialog = ref(false)
const createDialog = ref(false)
const editDialog = ref(false)
const selectedOrders = ref(null)
const dt = ref(null)
const filters = ref({})
const fromDate = ref('')
const toDate = ref('')

const orderForm = ref({
  number: '',
  pharmacy_id: '',
  warehouse_id: '',
  status: '',
  total_price: '',
})
const selectedOrderId = ref(null)

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)
const from = ref(0)
const to = ref(0)

// Status severity mapping for Tag component
const getStatusSeverity = (status) => {
  switch (status.toLowerCase()) {
    case 'نشط':
    case 'pending':
      return 'warning'
    case 'قيد الانتظار':
    case 'waiting':
      return 'info'
    case 'مرتجع':
    case 'returned':
      return 'danger'
    case 'مُنجز':
    case 'completed':
    case 'مُسلم':
    case 'delivered':
      return 'success'
    default:
      return 'info'
  }
}

// Function to determine if an action should be enabled based on status
const canPerformAction = (order, action) => {
  const status = order.status
  const statusDescription = order.status_description?.toLowerCase() || ''

  switch (action) {
    case 'view':
      // Always allow viewing
      return true

    case 'delete':
      // Allow deletion only for pending/active orders (status 1)
      return status === 1

    case 'accept':
      // Allow accepting only for pending/active orders (status 1)
      return status === 1

    case 'cancel':
      // Allow canceling for pending/active (1) or waiting (2) orders
      return status === 1 || status === 2

    case 'deliver':
      // Allow delivering for waiting orders (status 2)
      return status === 2

    case 'return':
      // Allow returning for delivered orders (status 3)
      return status === 3

    case 'edit':
      // Allow editing only for pending/active orders (status 1)
      return status === 1

    default:
      return false
  }
}

// Function to get action label based on status
const getActionLabel = (order, action) => {
  const status = order.status
  const statusDescription = order.status_description?.toLowerCase() || ''

  switch (action) {
    case 'accept':
      return status === 1 ? t('order.accept') : t('order.confirm')

    case 'cancel':
      return status === 1 ? t('order.cancel') : t('order.reject')

    case 'deliver':
      return t('order.deliver')

    case 'return':
      return t('order.return')

    default:
      return t(`order.${action}`)
  }
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const confirmDelete = (id) => {
  delete_id.value = id
  deleteDialog.value = true
}

const deleteOrder = () => {
  axios.delete(`/api/order/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('order.deleteSuccess'),
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('order.deleteError'),
        life: 3000
      })
    })
}

const changeStatus = (id, status, currentStatus) => {
  let successMessage = ''
  let errorMessage = ''

  switch (status) {
    case 2: // Accept to waiting
      successMessage = t('order.acceptSuccess')
      errorMessage = t('order.acceptError')
      break
    case 5: // Cancel
      successMessage = t('order.cancelSuccess')
      errorMessage = t('order.cancelError')
      break
    case 3: // Deliver
      successMessage = t('order.deliverSuccess')
      errorMessage = t('order.deliverError')
      break
    case 4: // Return
      successMessage = t('order.returnSuccess')
      errorMessage = t('order.returnError')
      break
    default:
      successMessage = t('order.statusChanged')
      errorMessage = t('order.statusChangeError')
  }

  axios.post(`/api/order/change-status/${id}?status=${status}`)
    .then(() => {
      fetchData()
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: successMessage,
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: errorMessage,
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
  orderForm.value = {
    number: '',
    pharmacy_id: '',
    warehouse_id: '',
    status: '',
    total_price: '',
  }
  selectedOrderId.value = null
}

const openEdit = (id) => {
  router.push({ name: 'order_show', params: { id: id } })
}

const saveOrder = () => {
  axios.post('/api/order', orderForm.value)
    .then(() => {
      fetchData()
      createDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('order.createSuccess'),
        life: 3000
      })
      resetForm()
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('order.createError'),
        life: 3000
      })
    })
}

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  loading.value = true
  axios.get("/api/order", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      from: fromDate.value,
      to: toDate.value
    }
  }).then((res) => {
    loading.value = false
    orders.value = res.data.data
    totalRecords.value = res.data.pagination.total
    totalPages.value = res.data.pagination.last_page
    from.value = res.data.pagination.from
    to.value = res.data.pagination.to
  }).catch(error => {
    loading.value = false
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('order.loadError'),
      life: 3000
    })
    console.error("Error fetching data:", error)
  })
}

watch([fromDate, toDate], () => {
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
  <div v-can="'list orders'" class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('order.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-calendar" />
                <InputText v-model="fromDate" type="date" :placeholder="t('order.fromDate')" />
              </span>
              <span class="p-input-icon-left">
                <i class="pi pi-calendar" />
                <InputText v-model="toDate" type="date" :placeholder="t('order.toDate')" />
              </span>
              <Button
                v-can="'create orders'"
                :label="t('order.export')"
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
            v-can="'list orders'"
            :value="orders"
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

            <Column field="number" :header="t('order.orderNumber')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.number }}
              </template>
            </Column>
            <Column field="pharmacy.name" :header="t('order.pharmacy')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.pharmacy.name }}
              </template>
            </Column>
            <Column field="warehouse.name" :header="t('order.warehouse')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.warehouse.name }}
              </template>
            </Column>
            <Column field="status_description" :header="t('order.status')" :sortable="true" header-style="width:10%; min-width:8rem;">
              <template #body="slotProps">
                <Tag :value="slotProps.data.status_description" :severity="getStatusSeverity(slotProps.data.status_description)" />
              </template>
            </Column>
            <Column field="total_price" :header="t('order.totalPrice')" :sortable="true" header-style="width:10%; min-width:8rem;">
              <template #body="slotProps">
                {{ slotProps.data.total_price }}
              </template>
            </Column>
            <Column field="created_at" :header="t('order.createdAt')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.created_at }}
              </template>
            </Column>
            <Column :header="t('order.actions')" header-style="min-width:20rem;">
              <template #body="slotProps">
                <div class="flex gap-1">
                  <!-- View Button - Always enabled -->
                  <Button
                    v-can="'edit orders'"
                    icon="pi pi-eye"
                    class=" p-detail"
                    :disabled="!canPerformAction(slotProps.data, 'view')"
                    @click="openEdit(slotProps.data.id)"
                    v-tooltip.top="t('view')"
                  />

                  <!-- Delete Button - Only for status 1 (pending/active) -->
                  <Button

                    icon="pi pi-trash"
                    class=" p-delete"
                    :disabled="!canPerformAction(slotProps.data, 'delete')"
                    @click="confirmDelete(slotProps.data.id)"
                    v-tooltip.top="t('delete')"
                  />

                  <!-- Accept/Confirm Button - Only for status 1 (pending/active) -->
                  <Button
                    v-can="'edit orders'"
                    :icon="slotProps.data.status === 1 ? 'pi pi-check' : 'pi pi-check-circle'"
                    :class="[
                      'p-detai',
                      slotProps.data.status === 1 ? 'p-detai' : 'p-detai',
                      'p-detail'
                    ]"
                    :disabled="!canPerformAction(slotProps.data, 'accept')"
                    @click="changeStatus(slotProps.data.id, 2, slotProps.data.status)"
                    v-tooltip.top="getActionLabel(slotProps.data, 'accept')"
                  />

                  <!-- Cancel/Reject Button - For status 1 & 2 -->
                  <Button
                    v-can="'edit orders'"
                    :icon="slotProps.data.status === 1 ? 'pi pi-times' : 'pi pi-times-circle'"
                    :class="[
                      'p-delete',
                      slotProps.data.status === 1 ? 'p-delete' : 'p-delete',
                      'p-delete'
                    ]"
                    :disabled="!canPerformAction(slotProps.data, 'cancel')"
                    @click="changeStatus(slotProps.data.id, 5, slotProps.data.status)"
                    v-tooltip.top="getActionLabel(slotProps.data, 'cancel')"
                  />

                  <!-- Deliver Button - Only for status 2 (waiting) -->
                  <Button
                    v-can="'edit orders'"
                    icon="pi pi-truck"
                    class="p-detail"
                    :disabled="!canPerformAction(slotProps.data, 'deliver')"
                    @click="changeStatus(slotProps.data.id, 3, slotProps.data.status)"
                    v-tooltip.top="t('order.deliver')"
                  />

                  <!-- Return Button - Only for status 3 (delivered) -->
                  <Button
                    v-can="'edit orders'"
                    icon="pi pi-undo"
                    class=" p-detail"
                    :disabled="!canPerformAction(slotProps.data, 'return')"
                    @click="changeStatus(slotProps.data.id, 4, slotProps.data.status)"
                    v-tooltip.top="t('order.return')"
                  />
                </div>
              </template>
            </Column>

            <template #empty>
              <div class="py-4 text-center">
                <i class="mb-2 text-2xl pi pi-exclamation-circle" />
                <p class="text-xl">{{ t('order.noData') }}</p>
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
                {{ t('order.showing') }} {{ from }} {{ t('order.to') }} {{ to }} {{ t('order.of') }} {{ totalRecords }} {{ t('order.entries') }}
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

        <!-- Create Order Dialog -->
        <Dialog
          v-model:visible="createDialog"
          :style="{ width: '450px' }"
          :header="t('order.createTitle')"
          :modal="true"
        >
          <div class="p-fluid">
            <div class="field my-1">
              <p for="number" class="my-1">{{ t('order.orderNumber') }}</p>
              <InputText
                id="number"
                v-model="orderForm.number"
                required
                :placeholder="t('order.orderNumber')"
              />
            </div>
            <div class="field my-1">
              <p for="pharmacy_id" class="my-1">{{ t('order.pharmacyId') }}</p>
              <InputText
                id="pharmacy_id"
                v-model="orderForm.pharmacy_id"
                type="number"
                required
                :placeholder="t('order.pharmacyId')"
              />
            </div>
            <div class="field my-1">
              <p for="warehouse_id" class="my-1">{{ t('order.warehouseId') }}</p>
              <InputText
                id="warehouse_id"
                v-model="orderForm.warehouse_id"
                type="number"
                required
                :placeholder="t('order.warehouseId')"
              />
            </div>
            <div class="field my-1">
              <p for="status" class="my-1">{{ t('order.status') }}</p>
              <InputText
                id="status"
                v-model="orderForm.status"
                required
                :placeholder="t('order.status')"
              />
            </div>
            <div class="field my-1">
              <p for="total_price" class="my-1">{{ t('order.totalPrice') }}</p>
              <InputText
                id="total_price"
                v-model="orderForm.total_price"
                type="number"
                required
                :placeholder="t('order.totalPrice')"
              />
            </div>
          </div>
          <template #footer>
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              class="p-button-text"
              @click="createDialog = false"
            />
            <Button
              :label="t('save')"
              icon="pi pi-check"
              class="p-button-text p-button-success"
              @click="saveOrder"
            />
          </template>
        </Dialog>

        <!-- Edit Order Dialog -->
        <Dialog
          v-model:visible="editDialog"
          :style="{ width: '450px' }"
          :header="t('order.editTitle')"
          :modal="true"
        >
          <div class="p-fluid">
            <div class="field my-1">
              <p for="number_edit" class="my-1">{{ t('order.orderNumber') }}</p>
              <InputText
                id="number_edit"
                v-model="orderForm.number"
                required
                :placeholder="t('order.orderNumber')"
              />
            </div>
            <div class="field my-1">
              <p for="pharmacy_id_edit" class="my-1">{{ t('order.pharmacyId') }}</p>
              <InputText
                id="pharmacy_id_edit"
                v-model="orderForm.pharmacy_id"
                type="number"
                required
                :placeholder="t('order.pharmacyId')"
              />
            </div>
            <div class="field my-1">
              <p for="warehouse_id_edit" class="my-1">{{ t('order.warehouseId') }}</p>
              <InputText
                id="warehouse_id_edit"
                v-model="orderForm.warehouse_id"
                type="number"
                required
                :placeholder="t('order.warehouseId')"
              />
            </div>
            <div class="field my-1">
              <p for="status_edit" class="my-1">{{ t('order.status') }}</p>
              <InputText
                id="status_edit"
                v-model="orderForm.status"
                required
                :placeholder="t('order.status')"
              />
            </div>
            <div class="field my-1">
              <p for="total_price_edit" class="my-1">{{ t('order.totalPrice') }}</p>
              <InputText
                id="total_price_edit"
                v-model="orderForm.total_price"
                type="number"
                required
                :placeholder="t('order.totalPrice')"
              />
            </div>
          </div>
          <template #footer>
            <Button
              :label="t('cancel')"
              icon="pi pi-times"
              class="p-button-text"
              @click="editDialog = false"
            />
            <Button
              :label="t('save')"
              icon="pi pi-check"
              class="p-button-text p-button-success"
              @click="saveOrder"
            />
          </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('order.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('order.deleteConfirmMessage') }}</span>
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
              @click="deleteOrder"
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

/* Action buttons styling */
:deep(.p-button.p-button-rounded) {
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.125rem;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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

  /* Stack action buttons on mobile */
  :deep(.flex.gap-1) {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
}
</style>
