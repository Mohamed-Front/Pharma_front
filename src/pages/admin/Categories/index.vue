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
const categories = ref(null)
const deleteDialog = ref(false)
const createDialog = ref(false)
const editDialog = ref(false)
const selectedCategories = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const categoryForm = ref({
  name_en: '',
  name_ar: '',
  date: '',
  category_image: null
})
const selectedCategoryId = ref(null)
const errors = ref({ name_en: false, name_ar: false, date: false, category_image: false })

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

const deleteCategory = () => {
  axios.delete(`/api/category/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('category.deleteSuccess'),
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('category.deleteError'),
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
  categoryForm.value = {
    name_en: '',
    name_ar: '',
    date: '',
    category_image: null
  }
  selectedCategoryId.value = null
  errors.value = { name_en: false, name_ar: false, date: false, category_image: false }
}

const validateForm = () => {
  errors.value.name_en = !categoryForm.value.name_en
  errors.value.name_ar = !categoryForm.value.name_ar
  errors.value.date = !categoryForm.value.date
  errors.value.category_image = false // Image is optional
  return !errors.value.name_en && !errors.value.name_ar && !errors.value.date
}

const openNew = () => {
  resetForm()
  createDialog.value = true
}

const openEdit = (id) => {
  selectedCategoryId.value = id
  axios.get(`/api/category/${id}`)
    .then((res) => {
      categoryForm.value = {
        name_en: res.data.data.name_en,
        name_ar: res.data.data.name_ar,
        date: res.data.data.date,
        category_image: null // Reset image for edit, as file inputs can't be pre-filled
      }
      editDialog.value = true
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('category.loadError'),
        life: 3000
      })
      console.error("Error fetching category:", error)
    })
}

const saveCategory = () => {
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('category.validationError'),
      life: 3000
    })
    return
  }

  const formData = new FormData()
  formData.append('name_en', categoryForm.value.name_en)
  formData.append('name_ar', categoryForm.value.name_ar)
  formData.append('date', categoryForm.value.date)
  if (categoryForm.value.category_image) {
    formData.append('category_image', categoryForm.value.category_image)
  }

  if (selectedCategoryId.value) {
    // Update existing category
    formData.append('_method', 'post') // For Laravel or similar frameworks that require PUT spoofing
    axios.post(`/api/category/${selectedCategoryId.value}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        fetchData()
        editDialog.value = false
        toast.add({
          severity: 'success',
          summary: t('success'),
          detail: t('category.updateSuccess'),
          life: 3000
        })
        resetForm()
      })
      .catch(error => {
        toast.add({
          severity: 'error',
          summary: t('error'),
          detail: error.response?.data?.message || t('category.updateError'),
          life: 3000
        })
      })
  } else {
    // Create new category
    axios.post('/api/category', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        fetchData()
        createDialog.value = false
        toast.add({
          severity: 'success',
          summary: t('success'),
          detail: t('category.createSuccess'),
          life: 3000
        })
        resetForm()
      })
      .catch(error => {
        toast.add({
          severity: 'error',
          summary: t('error'),
          detail: error.response?.data?.message || t('category.createError'),
          life: 3000
        })
      })
  }
}

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  loading.value = true
  axios.get("/api/category", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loading.value = false
    categories.value = res.data.data
    totalRecords.value = res.data.pagination.total
    totalPages.value = res.data.pagination.last_page
    from.value = res.data.pagination.from
    to.value = res.data.pagination.to
  }).catch(error => {
    loading.value = false
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('category.loadError'),
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
  <div v-can="'list categories'" class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('categories') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery"  />
              </span>
              <Button
                v-can="'create categories'"
                :label="t('category.export')"
                icon="pi pi-upload"
                class="p-export"
                @click="exportCSV"
              />
              <Button
                v-can="'create categories'"
                :label="t('category.new')"
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
            v-can="'list categories'"
            :value="categories"
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

            <Column field="name_en" :header="t('category.name_en')" :sortable="true" header-style="width:20%; min-width:12rem;">
              <template #body="slotProps">
                {{ slotProps.data.name_en }}
              </template>
            </Column>

            <Column field="name_ar" :header="t('category.name_ar')" :sortable="true" header-style="width:20%; min-width:12rem;">
              <template #body="slotProps">
                {{ slotProps.data.name_ar }}
              </template>
            </Column>

            <Column field="date" :header="t('category.date')" :sortable="true" header-style="width:20%; min-width:12rem;">
              <template #body="slotProps">
                {{ slotProps.data.date }}
              </template>
            </Column>

            <Column field="category_image" :header="t('category.image')" header-style="width:10%; min-width:8rem;">
              <template #body="slotProps">
                <img
                  v-if="slotProps.data.media"
                  :src="slotProps.data.media[0].url"
                  alt="Category Image"
                  style="width: 50px; height: auto;"
                />
                <span v-else>{{ t('category.noImage') }}</span>
              </template>
            </Column>

            <Column :header="t('actions')" header-style="min-width:10rem;">
              <template #body="slotProps">
                <Button
                  v-can="'edit categories'"
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="openEdit(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
                  v-can="'delete categories'"
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
                <p class="text-xl">{{ t('category.noData') }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex py-4 justify-content-center align-items-center">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div

>
            </template>
          </DataTable>

          <!-- Custom Pagination -->
          <div class="mt-3 p-paginator p-component p-unselectable-text" v-if="totalPages > 0">
            <div class="p-paginator-left-content">
              <span class="p-paginator-current">
                {{ t('showing') }} {{ from }} {{ t('to') }} {{ to }} {{ t('of') }} {{ totalRecords }} {{ t('entries') }}
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

        <!-- Create Category Dialog -->
        <Dialog
          v-model:visible="createDialog"
          :style="{ width: '450px' }"
          :header="t('category.createTitle')"
          :modal="true"
        >
          <div class="p-fluid">
            <div class="field my-1">
              <p for="name_en" class="my-1">{{ t('category.name_en') }}</p>
              <InputText
                id="name_en"
                v-model="categoryForm.name_en"
                required
                :placeholder="t('category.name_en')"
                :class="{ 'p-invalid': errors.name_en }"
              />
            </div>
            <div class="field my-1">
              <p for="name_ar" class="my-1">{{ t('category.name_ar') }}</p>
              <InputText
                id="name_ar"
                v-model="categoryForm.name_ar"
                required
                :placeholder="t('category.name_ar')"
                :class="{ 'p-invalid': errors.name_ar }"
              />
            </div>
            <div class="field my-1">
              <p for="date" class="my-1">{{ t('category.date') }}</p>
              <InputText
                id="date"
                v-model="categoryForm.date"
                type="date"
                required
                :placeholder="t('category.date')"
                :class="{ 'p-invalid': errors.date }"
              />
            </div>
            <div class="field my-1">
              <p for="category_image" class="my-1">{{ t('category.image') }}</p>
              <input
                id="category_image"
                type="file"
                accept="image/*"
                @change="categoryForm.category_image = $event.target.files[0]"
                :class="{ 'p-invalid': errors.category_image }"
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
              @click="saveCategory"
            />
          </template>
        </Dialog>

        <!-- Edit Category Dialog -->
        <Dialog
          v-model:visible="editDialog"
          :style="{ width: '450px' }"
          :header="t('category.editTitle')"
          :modal="true"
        >
          <div class="p-fluid">
            <div class="field my-1">
              <p for="name_en_edit" class="my-1">{{ t('category.name_en') }}</p>
              <InputText
                id="name_en_edit"
                v-model="categoryForm.name_en"
                required
                :placeholder="t('category.name_en')"
                :class="{ 'p-invalid': errors.name_en }"
              />
            </div>
            <div class="field my-1">
              <p for="name_ar_edit" class="my-1">{{ t('category.name_ar') }}</p>
              <InputText
                id="name_ar_edit"
                v-model="categoryForm.name_ar"
                required
                :placeholder="t('category.name_ar')"
                :class="{ 'p-invalid': errors.name_ar }"
              />
            </div>
            <div class="field my-1">
              <p for="date_edit" class="my-1">{{ t('category.date') }}</p>
              <InputText
                id="date_edit"
                v-model="categoryForm.date"
                type="date"
                required
                :placeholder="t('category.date')"
                :class="{ 'p-invalid': errors.date }"
              />
            </div>
            <div class="field my-1">
              <p for="category_image_edit" class="my-1">{{ t('category.image') }}</p>
              <input
                id="category_image_edit"
                type="file"
                accept="image/*"
                @change="categoryForm.category_image = $event.target.files[0]"
                :class="{ 'p-invalid': errors.category_image }"
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
              @click="saveCategory"
            />
          </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('category.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('category.deleteConfirmMessage') }}</span>
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
              @click="deleteCategory"
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

:deep(.p-inputtext.p-invalid) {
  border-color: var(--red-500);
}

input[type="file"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--surface-border);
  border-radius: 4px;
}

input[type="file"].p-invalid {
  border-color: var(--red-500);
}
</style>
