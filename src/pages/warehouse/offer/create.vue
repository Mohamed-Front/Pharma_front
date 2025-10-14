<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const form = ref();
const loading = ref(false);
const products = ref([]);

// Form Data
const offerData = ref({
  product_id: null,
  min_limit: null,
  max_limit: null,
  quantity: null,
  quantity_unit: null,
  discount_type: null,
  discount_value: null,
  start_date: null,
  end_date: null,
  description: ''
});

// Validation Errors
const errors = ref({
  product_id: false,
  min_limit: false,
  max_limit: false,
  quantity: false,
  quantity_unit: false,
  discount_type: false,
  discount_value: false,
  start_date: false,
  end_date: false
});

// Fetch dropdown options for products
const fetchDropdownOptions = async () => {
  try {
    const productsRes = await axios.get('/api/product');
    products.value = productsRes.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error_fetching_data'), life: 3000 });
  }
};

// Validate form
const validateForm = () => {
  errors.value.product_id = !offerData.value.product_id;
  errors.value.min_limit = offerData.value.min_limit === null || offerData.value.min_limit === '';
  errors.value.max_limit = offerData.value.max_limit === null || offerData.value.max_limit === '';
  errors.value.quantity = offerData.value.quantity === null || offerData.value.quantity === '';
  errors.value.quantity_unit = !offerData.value.quantity_unit;
  errors.value.discount_type = !offerData.value.discount_type;
  errors.value.discount_value = offerData.value.discount_value === null || offerData.value.discount_value === '';
  errors.value.start_date = !offerData.value.start_date;
  errors.value.end_date = !offerData.value.end_date;

  return !Object.values(errors.value).some(error => error);
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    await axios.post('/api/offer', offerData.value);
    router.push({ name: 'offers' });
    toast.add({ severity: 'success', summary: t('success'), detail: t('offer_created'), life: 3000 });
  } catch (error) {
    console.error('Error:', error);
    const message = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat().join(', ')
      : t('error_creating_offer');
    toast.add({ severity: 'error', summary: t('error'), detail: message, life: 3000 });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDropdownOptions();
});
</script>

<template>
  <div v-can="'create offers'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ $t('offer.create_new_offer') }}</h1>

    <Form ref="form" :model="offerData" @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Product -->
        <div class="space-y-2">
          <label for="product" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.product') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="product"
            v-model="offerData.product_id"
            :options="products"
            optionLabel="commercial_name"
            optionValue="id"
            :placeholder="$t('offer.select_product')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.product_id }"
          />
        </div>

        <!-- Min Limit -->
        <div class="space-y-2">
          <label for="min_limit" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.min_limit') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="min_limit"
            v-model="offerData.min_limit"
            :useGrouping="false"
            :placeholder="$t('offer.enter_min_limit')"
            class="w-full"
            inputClass="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.min_limit }"
          />
        </div>

        <!-- Max Limit -->
        <div class="space-y-2">
          <label for="max_limit" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.max_limit') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="max_limit"
            v-model="offerData.max_limit"
            :useGrouping="false"
            :placeholder="$t('offer.enter_max_limit')"
            class="w-full"
            inputClass="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.max_limit }"
          />
        </div>

        <!-- Quantity -->
        <div class="space-y-2">
          <label for="quantity" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.quantity') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="quantity"
            v-model="offerData.quantity"
            :useGrouping="false"
            :placeholder="$t('offer.enter_quantity')"
            class="w-full"
            inputClass="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.quantity }"
          />
        </div>

        <!-- Quantity Unit -->
        <div class="space-y-2">
          <label for="quantity_unit" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.quantity_unit') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="quantity_unit"
            v-model="offerData.quantity_unit"
            :options="[
              { label: 'Tablets', value: 1 },
              { label: 'Capsules', value: 2 },
              { label: 'Units', value: 3 },
              { label: 'bottle', value: 4 },
              { label: 'can', value: 5 }

            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('offer.select_quantity_unit')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.quantity_unit }"
          />
        </div>

        <!-- Discount Type -->
        <div class="space-y-2">
          <label for="discount_type" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.discount_type') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="discount_type"
            v-model="offerData.discount_type"
            :options="[
              { label: 'Percentage', value: 1 },
              { label: 'Fixed Amount', value: 2 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('offer.select_discount_type')"
            class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.discount_type }"
          />
        </div>

        <!-- Discount Value -->
        <div class="space-y-2">
          <label for="discount_value" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.discount_value') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="discount_value"
            v-model="offerData.discount_value"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :placeholder="$t('offer.enter_discount_value')"
            class="w-full"
            inputClass="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'p-invalid': errors.discount_value }"
          />
        </div>

        <!-- Start Date -->
        <div class="space-y-2">
          <label for="start_date" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.start_date') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="start_date"
            v-model="offerData.start_date"
            type="date"
            :placeholder="$t('offer.enter_start_date')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.start_date }"
          />
        </div>

        <!-- End Date -->
        <div class="space-y-2">
          <label for="end_date" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.end_date') }} <span class="text-red-500">*</span>
          </label>
          <InputText
            id="end_date"
            v-model="offerData.end_date"
            type="date"
            :placeholder="$t('offer.enter_end_date')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="{ 'p-invalid': errors.end_date }"
          />
        </div>

        <!-- Description -->
        <div class="space-y-2 md:col-span-2">
          <label for="description" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.description') }}
          </label>
          <Textarea
            id="description"
            v-model="offerData.description"
            :placeholder="$t('offer.enter_description')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex justify-center">
        <Button
          type="submit"
          label="Create Offer"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
          @click="submitForm"
        >
          <span v-if="!loading">{{ $t('offer.create_offer') }}</span>
          <i v-else class="pi pi-spinner pi-spin"></i>
        </Button>
      </div>
    </Form>
  </div>
  <Toast />
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
}
.transition-colors {
  transition-property: background-color, border-color, color;
}
.duration-300 {
  transition-duration: 300ms;
}

/* Custom scrollbar for dropdowns */
:deep(.p-dropdown-panel .p-dropdown-items-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f1f1f1;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar) {
  width: 6px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}
:deep(.p-dropdown-panel .p-dropdown-items-wrapper::-webkit-scrollbar-thumb) {
  background-color: #3b82f6;
  border-radius: 3px;
}

/* Validation styles */
:deep(.p-inputtext.p-invalid),
:deep(.p-textarea.p-invalid),
:deep(.p-dropdown.p-invalid),
:deep(.p-multiselect.p-invalid) {
  border-color: var(--red-500);
}
</style>
