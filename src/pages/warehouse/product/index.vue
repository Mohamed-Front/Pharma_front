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
const products = ref(null)
const deleteDialog = ref(false)
const createDialog = ref(false)
const editDialog = ref(false)
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const productForm = ref({
  commercial_name: '',
  quantity: '',
  quantity_unit: '',
  price: '',
  price_unit: '',
  category_id: '',
  company_id: ''
})
const selectedProductId = ref(null)

// Pagination variables
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(10)
const totalPages = ref(0)
const from = ref(0)
const to = ref(0)

const exportCSV = () => {
  dt.value.exportCSV()
}

const confirmDelete = (id) => {
  delete_id.value = id
  deleteDialog.value = true
}

const deleteProduct = () => {
  axios.delete(`/api/product/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('product.deleteSuccess'),
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('product.deleteError'),
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
  productForm.value = {
    commercial_name: '',
    quantity: '',
    quantity_unit: '',
    price: '',
    price_unit: '',
    category_id: '',
    company_id: ''
  }
  selectedProductId.value = null
}

const openNew = () => {
  router.push({ name: 'product-create' })
}

const openEdit = (id) => {
  router.push({ name: 'product-update', params: { id: id } })
}

const saveProduct = () => {
  axios.post('/api/product', productForm.value)
    .then(() => {
      fetchData()
      createDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('product.createSuccess'),
        life: 3000
      })
      resetForm()
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('product.createError'),
        life: 3000
      })
    })
}

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  loading.value = true
  axios.get("/api/product", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loading.value = false
    products.value = res.data.data
    totalRecords.value = res.data.pagination.total
    totalPages.value = res.data.pagination.last_page
    from.value = res.data.pagination.from
    to.value = res.data.pagination.to
  }).catch(error => {
    loading.value = false
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('product.loadError'),
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
  <div v-can="'list products'" class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('product.managementTitle') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="$t('product.search')" />
              </span>
              <Button
                v-can="'create products'"
                :label="t('product.export')"
                icon="pi pi-upload"
                class="p-export"
                @click="exportCSV"
              />
              <Button
                v-can="'create products'"
                :label="t('product.new')"
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
            v-can="'list products'"
            :value="products"
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

            <Column field="commercial_name" :header="t('product.commercialName')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.commercial_name }}
              </template>
            </Column>
            <Column field="media[0].url" :header="t('product.image')" header-style="width:10%; min-width:8rem;">
              <template #body="slotProps">
                <img
                  v-if="slotProps.data.media && slotProps.data.media[0] && slotProps.data.media[0].url"
                  :src="slotProps.data.media[0].url"
                  alt="Product Image"
                  style="width: 50px; height: auto;"
                />
                <span v-else>{{ t('product.noImage') }}</span>
              </template>
            </Column>
            <Column field="quantity" :header="t('product.quantity')" :sortable="true" header-style="width:10%; min-width:8rem;">
              <template #body="slotProps">
                {{ slotProps.data.quantity }} {{ slotProps.data.quantity_unit }}
              </template>
            </Column>

            <Column field="price" :header="t('product.price')" :sortable="true" header-style="width:10%; min-width:8rem;">
              <template #body="slotProps">
                {{ slotProps.data.price }} {{ slotProps.data.price_unit }}
              </template>
            </Column>

            <Column field="category.name_en" :header="t('product.category')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.category.name_en }}
              </template>
            </Column>

            <Column field="company.name" :header="t('product.company')" :sortable="true" header-style="width:15%; min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.company.name }}
              </template>
            </Column>

            <Column :header="t('product.actions')" header-style="min-width:10rem;">
              <template #body="slotProps">
                <Button
                  v-can="'edit products'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="openEdit(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete products'"
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
                <p class="text-xl">{{ t('product.noData') }}</p>
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
                {{ t('product.showing') }} {{ from }} {{ t('product.to') }} {{ to }} {{ t('product.of') }} {{ totalRecords }} {{ t('product.entries') }}
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

        <!-- Create Product Dialog -->
        <Dialog
          v-model:visible="createDialog"
          :style="{ width: '450px' }"
          :header="t('product.createTitle')"
          :modal="true"
        >
          <div class="p-fluid">
            <div class="field my-1">
              <p for="commercial_name" class="my-1">{{ t('product.commercialName') }}</p>
              <InputText
                id="commercial_name"
                v-model="productForm.commercial_name"
                required
                :placeholder="t('product.commercialName')"
              />
            </div>
            <div class="field my-1">
              <p for="quantity" class="my-1">{{ t('product.quantity') }}</p>
              <InputText
                id="quantity"
                v-model="productForm.quantity"
                type="number"
                required
                :placeholder="t('product.quantity')"
              />
            </div>
            <div class="field my-1">
              <p for="quantity_unit" class="my-1">{{ t('product.quantityUnit') }}</p>
              <InputText
                id="quantity_unit"
                v-model="productForm.quantity_unit"
                required
                :placeholder="t('product.quantityUnit')"
              />
            </div>
            <div class="field my-1">
              <p for="price" class="my-1">{{ t('product.price') }}</p>
              <InputText
                id="price"
                v-model="productForm.price"
                type="number"
                required
                :placeholder="t('product.price')"
              />
            </div>
            <div class="field my-1">
              <p for="price_unit" class="my-1">{{ t('product.priceUnit') }}</p>
              <InputText
                id="price_unit"
                v-model="productForm.price_unit"
                required
                :placeholder="t('product.priceUnit')"
              />
            </div>
            <div class="field my-1">
              <p for="category_id" class="my-1">{{ t('product.categoryId') }}</p>
              <InputText
                id="category_id"
                v-model="productForm.category_id"
                type="number"
                required
                :placeholder="t('product.categoryId')"
              />
            </div>
            <div class="field my-1">
              <p for="company_id" class="my-1">{{ t('product.companyId') }}</p>
              <InputText
                id="company_id"
                v-model="productForm.company_id"
                type="number"
                required
                :placeholder="t('product.companyId')"
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
              @click="saveProduct"
            />
          </template>
        </Dialog>

        <!-- Edit Product Dialog -->
        <Dialog
          v-model:visible="editDialog"
          :style="{ width: '450px' }"
          :header="t('product.editTitle')"
          :modal="true"
        >
          <div class="p-fluid">
            <div class="field my-1">
              <p for="commercial_name_edit" class="my-1">{{ t('product.commercialName') }}</p>
              <InputText
                id="commercial_name_edit"
                v-model="productForm.commercial_name"
                required
                :placeholder="t('product.commercialName')"
              />
            </div>
            <div class="field my-1">
              <p for="quantity_edit" class="my-1">{{ t('product.quantity') }}</p>
              <InputText
                id="quantity_edit"
                v-model="productForm.quantity"
                type="number"
                required
                :placeholder="t('product.quantity')"
              />
            </div>
            <div class="field my-1">
              <p for="quantity_unit_edit" class="my-1">{{ t('product.quantityUnit') }}</p>
              <InputText
                id="quantity_unit_edit"
                v-model="productForm.quantity_unit"
                required
                :placeholder="t('product.quantityUnit')"
              />
            </div>
            <div class="field my-1">
              <p for="price_edit" class="my-1">{{ t('product.price') }}</p>
              <InputText
                id="price_edit"
                v-model="productForm.price"
                type="number"
                required
                :placeholder="t('product.price')"
              />
            </div>
            <div class="field my-1">
              <p for="price_unit_edit" class="my-1">{{ t('product.priceUnit') }}</p>
              <InputText
                id="price_unit_edit"
                v-model="productForm.price_unit"
                required
                :placeholder="t('product.priceUnit')"
              />
            </div>
            <div class="field my-1">
              <p for="category_id_edit" class="my-1">{{ t('product.categoryId') }}</p>
              <InputText
                id="category_id_edit"
                v-model="productForm.category_id"
                type="number"
                required
                :placeholder="t('product.categoryId')"
              />
            </div>
            <div class="field my-1">
              <p for="company_id_edit" class="my-1">{{ t('product.companyId') }}</p>
              <InputText
                id="company_id_edit"
                v-model="productForm.company_id"
                type="number"
                required
                :placeholder="t('product.companyId')"
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
              @click="saveProduct"
            />
          </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('product.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('product.deleteConfirmMessage') }}</span>
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
              @click="deleteProduct"
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
