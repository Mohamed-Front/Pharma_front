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
const scientificStructures = ref(null)
const deleteDialog = ref(false)
const createDialog = ref(false)
const editDialog = ref(false)
const selectedScientificStructures = ref(null)
const dt = ref(null)
const filters = ref({})
const searchQuery = ref('')
const scientificStructureForm = ref({
  name: '',
  description: ''
})
const selectedScientificStructureId = ref(null)
const errors = ref({ name: false, description: false })

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

const deleteScientificStructure = () => {
  axios.delete(`/api/scientific-structure/${delete_id.value}`)
    .then(() => {
      fetchData()
      deleteDialog.value = false
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('scientificStructure.deleteSuccess'),
        life: 3000
      })
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('scientificStructure.deleteError'),
        life: 3000
      })
    })
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
}

const resetForm = () => {
  scientificStructureForm.value = {
    name: '',
    description: ''
  }
  selectedScientificStructureId.value = null
  errors.value = { name: false, description: false }
}

const validateForm = () => {
  errors.value.name = !scientificStructureForm.value.name
  errors.value.description = !scientificStructureForm.value.description
  return !errors.value.name && !errors.value.description
}

const openNew = () => {
  resetForm()
  createDialog.value = true
}

const openEdit = (id) => {
  selectedScientificStructureId.value = id
  axios.get(`/api/scientific-structure/${id}`)
    .then((res) => {
      scientificStructureForm.value = {
        name: res.data.data.name,
        description: res.data.data.description
      }
      editDialog.value = true
    })
    .catch(error => {
      toast.add({
        severity: 'error',
        summary: t('error'),
        detail: t('scientificStructure.loadError'),
        life: 3000
      })
      console.error("Error fetching scientific structure:", error)
    })
}

const saveScientificStructure = () => {
  if (!validateForm()) {

    return
  }

  if (selectedScientificStructureId.value) {
    // Update existing scientific structure
    axios.put(`/api/scientific-structure/${selectedScientificStructureId.value}`, scientificStructureForm.value)
      .then(() => {
        fetchData()
        editDialog.value = false
        toast.add({
          severity: 'success',
          summary: t('success'),
          detail: t('scientificStructure.updateSuccess'),
          life: 3000
        })
        resetForm()
      })
      .catch(error => {
        toast.add({
          severity: 'error',
          summary: t('error'),
          detail: t('scientificStructure.updateError'),
          life: 3000
        })
      })
  } else {
    // Create new scientific structure
    axios.post('/api/scientific-structure', scientificStructureForm.value)
      .then(() => {
        fetchData()
        createDialog.value = false
        toast.add({
          severity: 'success',
          summary: t('success'),
          detail: t('scientificStructure.createSuccess'),
          life: 3000
        })
        resetForm()
      })
      .catch(error => {
        toast.add({
          severity: 'error',
          summary: t('error'),
          detail: t('scientificStructure.createError'),
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
  axios.get("/api/scientific-structure", {
    params: {
      page: currentPage.value,
      limit: rowsPerPage.value,
      search: searchQuery.value
    }
  }).then((res) => {
    loading.value = false
    scientificStructures.value = res.data.data
    totalRecords.value = res.data.pagination.total
    totalPages.value = res.data.pagination.last_page
    from.value = res.data.pagination.from
    to.value = res.data.pagination.to
  }).catch(error => {
    loading.value = false
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('scientificStructure.loadError'),
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
});
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="p-4 card shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t('scientificStructures') }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" :placeholder="t('scientificStructure.search')" />
              </span>
              <Button
                :label="t('scientificStructure.export')"
                icon="pi pi-upload"
                class="p-export"
                @click="exportCSV"
              />
              <Button
                :label="t('scientificStructure.new')"
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
            :value="scientificStructures"
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

            <Column field="name" :header="t('scientificStructure.name')" :sortable="true" header-style="width:20%; min-width:12rem;">
              <template #body="slotProps">
                {{ slotProps.data.name }}
              </template>
            </Column>

            <Column field="description" :header="t('scientificStructure.description')" :sortable="true" header-style="width:20%; min-width:12rem;">
              <template #body="slotProps">
                {{ slotProps.data.description }}
              </template>
            </Column>

            <Column :header="t('actions')" header-style="min-width:10rem;">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-detail"
                  @click="openEdit(slotProps.data.id)"
                  v-tooltip.top="t('edit')"
                />
                <Button
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
                <p class="text-xl">{{ t('scientificStructure.noData') }}</p>
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

        <!-- Create Scientific Structure Dialog -->
        <Dialog
          v-model:visible="createDialog"
          :style="{ width: '450px' }"
          :header="t('scientificStructure.createTitle')"
          :modal="true"
        >
          <div class="p-fluid">
            <div class="field my-1">
              <p for="name" class="my-1">{{ t('scientificStructure.name') }}</p>
              <InputText
                id="name"
                v-model="scientificStructureForm.name"
                required
                :placeholder="t('scientificStructure.name')"
                :class="{ 'p-invalid': errors.name }"
              />
            </div>
            <div class="field my-1">
              <p for="description" class="my-1">{{ t('scientificStructure.description') }}</p>
              <Textarea
                id="description"
                v-model="scientificStructureForm.description"
                required
                :placeholder="t('scientificStructure.description')"
                rows="4"
                :class="{ 'p-invalid': errors.description }"
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
              @click="saveScientificStructure"
            />
          </template>
        </Dialog>

        <!-- Edit Scientific Structure Dialog -->
        <Dialog
          v-model:visible="editDialog"
          :style="{ width: '450px' }"
          :header="t('scientificStructure.editTitle')"
          :modal="true"
        >
          <div class="p-fluid">
            <div class="field my-1">
              <p for="name_edit" class="my-1">{{ t('scientificStructure.name') }}</p>
              <InputText
                id="name_edit"
                v-model="scientificStructureForm.name"
                required
                :placeholder="t('scientificStructure.name')"
                :class="{ 'p-invalid': errors.name }"
              />
            </div>
            <div class="field my-1">
              <p for="description_edit" class="my-1">{{ t('scientificStructure.description') }}</p>
              <Textarea
                id="description_edit"
                v-model="scientificStructureForm.description"
                required
                :placeholder="t('scientificStructure.description')"
                rows="4"
                :class="{ 'p-invalid': errors.description }"
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
              @click="saveScientificStructure"
            />
          </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="t('scientificStructure.deleteConfirmTitle')"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ t('scientificStructure.deleteConfirmMessage') }}</span>
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
              @click="deleteScientificStructure"
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

:deep(.p-inputtext.p-invalid),
:deep(.p-textarea.p-invalid) {
  border-color: var(--red-500);
}
</style>
