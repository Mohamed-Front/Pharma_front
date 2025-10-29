<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();

const loading = ref(false);
const products = ref([]);
const isEditing = ref(false);

// Form Data
const offerData = ref({
  product_id: null,
  min_limit: null,
  max_limit: null,
  quantity: null,
  quantity_unit: null,
  discount_type: null, // 1 = %, 2 = Fixed, 3 = Gift
  discount_value: null,
  gift_product_id: null,
  gift_quantity: null,
  start_date: null,
  end_date: null,
  description: ''
});

// Validation Errors
const errors = ref({
  product_id: false,
  quantity: false,
  quantity_unit: false,
  discount_type: false,
  discount_value: false,
  gift_product_id: false,
  gift_quantity: false,
  min_limit: false,
  max_limit: false,
  start_date: false,
  end_date: false
});

// Fetch products
const fetchProducts = async () => {
  try {
    const res = await axios.get('/api/product');
    products.value = res.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error_fetching_data'), life: 3000 });
  }
};

// Fetch offer for editing
const fetchOffer = async (id) => {
  try {
    const res = await axios.get(`/api/offer/${id}`);
    const data = res.data.data;

    offerData.value = {
      product_id: data.product_id,
      quantity: data.quantity,
      quantity_unit: data.quantity_unit,
      discount_type: data.discount_type,
      discount_value: data.discount_value ?? null,
      gift_product_id: data.gift_product_id ?? null,
      gift_quantity: data.gift_quantity ?? null,
      min_limit: data.min_limit,
      max_limit: data.max_limit,
      start_date: data.start_date?.split('T')[0] || null,
      end_date: data.end_date?.split('T')[0] || null,
      description: data.description || ''
    };
  } catch (error) {
    console.error('Error fetching offer:', error);
    toast.add({ severity: 'error', summary: t('error'), detail: t('error_fetching_offer'), life: 3000 });
    router.push({ name: 'offers' });
  }
};

// Reset conditional fields
watch(() => offerData.value.discount_type, (newType) => {
  if (newType === 3) {
    offerData.value.discount_value = null;
  } else {
    offerData.value.gift_product_id = null;
    offerData.value.gift_quantity = null;
  }
});

// Validate form
const validateForm = () => {
  // Reset errors
  Object.keys(errors.value).forEach(key => errors.value[key] = false);

  // Required fields
  errors.value.product_id = !offerData.value.product_id;
  errors.value.quantity = offerData.value.quantity === null || offerData.value.quantity === '';
  errors.value.quantity_unit = !offerData.value.quantity_unit;
  errors.value.discount_type = !offerData.value.discount_type;
  errors.value.min_limit = offerData.value.min_limit === null || offerData.value.min_limit === '';
  errors.value.max_limit = offerData.value.max_limit === null || offerData.value.max_limit === '';
  errors.value.start_date = !offerData.value.start_date;
  errors.value.end_date = !offerData.value.end_date;

  // Conditional validations
  if (offerData.value.discount_type === 3) {
    errors.value.gift_product_id = !offerData.value.gift_product_id;
    errors.value.gift_quantity = offerData.value.gift_quantity === null || offerData.value.gift_quantity <= 0;
  } else {
    errors.value.discount_value = offerData.value.discount_value === null || offerData.value.discount_value === '';
  }

  // Min/Max logic
  if (offerData.value.min_limit != null && offerData.value.max_limit != null) {
    if (offerData.value.min_limit > offerData.value.max_limit) {
      errors.value.max_limit = true;
    }
  }

  // Quantity within limits
  if (offerData.value.quantity != null && offerData.value.min_limit != null && offerData.value.max_limit != null) {
    if (offerData.value.quantity < offerData.value.min_limit || offerData.value.quantity > offerData.value.max_limit) {
      errors.value.quantity = true;
    }
  }

  // Discount value range
  if (offerData.value.discount_type === 1 && offerData.value.discount_value != null) {
    if (offerData.value.discount_value < 0 || offerData.value.discount_value > 100) {
      errors.value.discount_value = true;
    }
  }
  if (offerData.value.discount_type === 2 && offerData.value.discount_value != null) {
    if (offerData.value.discount_value < 0) {
      errors.value.discount_value = true;
    }
  }

  // Date validation
  if (offerData.value.start_date && offerData.value.end_date) {
    const start = new Date(offerData.value.start_date);
    const end = new Date(offerData.value.end_date);
    if (end < start) {
      errors.value.end_date = true;
      toast.add({ severity: 'error', summary: t('error'), detail: t('end_date_before_start'), life: 3000 });
    }
  }

  return !Object.values(errors.value).some(Boolean);
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    toast.add({ severity: 'error', summary: t('error'), detail: t('please_fill_required_fields'), life: 3000 });
    return;
  }

  loading.value = true;
  try {
    const payload = { ...offerData.value };

    // Remove unused fields
    if (payload.discount_type !== 3) {
      delete payload.gift_product_id;
      delete payload.gift_quantity;
    }
    if (payload.discount_type === 3) {
      delete payload.discount_value;
    }

    if (isEditing.value) {
      await axios.put(`/api/offer/${route.params.id}`, payload);
      toast.add({ severity: 'success', summary: t('success'), detail: t('offer_updated'), life: 3000 });
    } else {
      await axios.post('/api/offer', payload);
      toast.add({ severity: 'success', summary: t('success'), detail: t('offer_created'), life: 3000 });
    }

    router.push({ name: 'offers' });
  } catch (error) {
    console.error('Error:', error);
    let message = isEditing.value ? t('error_updating_offer') : t('error_creating_offer');

    if (error.response?.status === 422) {
      const errs = error.response.data.errors;
      message = Object.values(errs).flat().join(', ');
      Object.keys(errs).forEach(key => {
        if (key in errors.value) errors.value[key] = true;
      });
    } else if (error.response?.status === 500) {
      message = t('server_error');
    }

    toast.add({ severity: 'error', summary: t('error'), detail: message, life: 3000 });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
  if (route.params.id) {
    isEditing.value = true;
    fetchOffer(route.params.id);
  }
});
</script>

<template>
  <div v-can="'create offers'" class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      {{ $t(isEditing ? 'offer.edit_offer' : 'offer.create_new_offer') }}
    </h1>

    <form @submit.prevent="submitForm" class="space-y-6">
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
            class="w-full"
            :class="{ 'p-invalid': errors.product_id }"
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
            :min="0"
            :placeholder="$t('offer.enter_quantity')"
            class="w-full"
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
              { label: 'Bottle', value: 4 },
              { label: 'Can', value: 5 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('offer.select_quantity_unit')"
            class="w-full"
            :class="{ 'p-invalid': errors.quantity_unit }"
          />
        </div>

        <!-- Discount Type -->
        <div class="space-y-2">
          <label for="discount_type" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.discount_type') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            id="discount_type"
            v-model="offerData.discount_type"
            :options="[
              { label: $t('offer.percentage'), value: 1 },
              { label: $t('offer.fixed_amount'), value: 2 },
              { label: $t('offer.gift'), value: 3 }
            ]"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('offer.select_discount_type')"
            class="w-full"
            :class="{ 'p-invalid': errors.discount_type }"
          />
        </div>

        <!-- Discount Value (Percentage / Fixed) -->
        <div v-if="offerData.discount_type === 1 || offerData.discount_type === 2" class="space-y-2">
          <label for="discount_value" class="block text-sm font-medium text-gray-700">
            {{ offerData.discount_type === 1 ? $t('offer.percentage') : $t('offer.fixed_amount') }}
            <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="discount_value"
            v-model="offerData.discount_value"
            :mode="offerData.discount_type === 1 ? 'decimal' : 'decimal'"
            :minFractionDigits="offerData.discount_type === 1 ? 0 : 2"
            :maxFractionDigits="2"
            :min="0"
            :max="offerData.discount_type === 1 ? 100 : null"
            :placeholder="$t('offer.enter_discount_value')"
            class="w-full"
            :class="{ 'p-invalid': errors.discount_value }"
          />
          <small v-if="offerData.discount_type === 1" class="text-gray-500">Max 100%</small>
        </div>

        <!-- Gift Product -->
        <div v-if="offerData.discount_type === 3" class="space-y-2">
          <label for="gift_product_id" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.gift_product') }} <span class="text-red-500">*</span>
          </label>
          <Dropdown
            filter
            id="gift_product_id"
            v-model="offerData.gift_product_id"
            :options="products"
            optionLabel="commercial_name"
            optionValue="id"
            :placeholder="$t('offer.select_gift_product')"
            class="w-full"
            :class="{ 'p-invalid': errors.gift_product_id }"
          />
        </div>

        <!-- Gift Quantity -->
        <div v-if="offerData.discount_type === 3" class="space-y-2">
          <label for="gift_quantity" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.gift_quantity') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="gift_quantity"
            v-model="offerData.gift_quantity"
            :useGrouping="false"
            :min="1"
            :placeholder="$t('offer.enter_gift_quantity')"
            class="w-full"
            :class="{ 'p-invalid': errors.gift_quantity }"
          />
        </div>

        <!-- Min Limit -->
        <div class="space-y-2">
          <label for="min_limit" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.min_limit_tooltip') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="min_limit"
            v-model="offerData.min_limit"
            :useGrouping="false"
            :min="0"
            :placeholder="$t('offer.enter_min_limit')"
            class="w-full"
            :class="{ 'p-invalid': errors.min_limit }"
          />
        </div>

        <!-- Max Limit -->
        <div class="space-y-2">
          <label for="max_limit" class="block text-sm font-medium text-gray-700">
            {{ $t('offer.max_limit_tooltip') }} <span class="text-red-500">*</span>
          </label>
          <InputNumber
            id="max_limit"
            v-model="offerData.max_limit"
            :useGrouping="false"
            :min="0"
            :placeholder="$t('offer.enter_max_limit')"
            class="w-full"
            :class="{ 'p-invalid': errors.max_limit }"
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
            class="w-full"
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
            class="w-full"
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
            class="w-full"
            rows="4"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-6 flex justify-center">
        <Button
          type="submit"
          :label="$t(isEditing ? 'offer.update_offer' : 'offer.create_offer')"
          icon="pi pi-plus"
          :loading="loading"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        />
      </div>
    </form>
  </div>

  <Toast />
</template>

<style scoped>
label {
  font-weight: 600;
  color: #374151;
}

.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}

:deep(.p-invalid) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

:deep(.p-button) {
  font-weight: 600;
}
</style>
