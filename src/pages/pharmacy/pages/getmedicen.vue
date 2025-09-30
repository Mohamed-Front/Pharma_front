<template>
  <div class="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
      <!-- Header Section -->
      <div class="mb-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {{ t('drugSearch.title') }}
        </h2>
        <p class="mt-2 text-gray-600">{{ t('drugSearch.subtitle') }}</p>
      </div>

      <!-- Barcode Input Form -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <InputText
          v-model="barcode"
          :placeholder="t('drugSearch.enterBarcode')"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button
          :label="t('drugSearch.search')"
          icon="pi pi-search"
          :loading="loading"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          :disabled="!barcode.trim()"
          @click="fetchDrugDetails"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-16">
        <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="4" class="text-indigo-500" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16 bg-red-50 rounded-lg">
        <svg class="mx-auto w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="mt-4 text-lg text-red-600 font-medium">{{ error.message || t('drugSearch.error') }}</p>
      </div>

      <!-- Drug Details -->
      <div v-else-if="drugDetails" class="p-6 bg-gray-50 rounded-lg">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ t('drugSearch.details') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <p><strong class="text-gray-900">{{ t('drugSearch.brandName') }}:</strong>
              <span class="text-gray-600">{{ drugDetails.brand_name || 'N/A' }}</span></p>
            <p><strong class="text-gray-900">{{ t('drugSearch.manufacturer') }}:</strong>
              <span class="text-gray-600">{{ drugDetails.manufacturer_name || 'N/A' }}</span></p>
            <p><strong class="text-gray-900">{{ t('drugSearch.description') }}:</strong>
              <span class="text-gray-600">{{ drugDetails.description || 'N/A' }}</span></p>
            <p><strong class="text-gray-900">{{ t('drugSearch.color') }}:</strong>
              <span class="text-gray-600">{{ drugDetails.color || 'N/A' }}</span></p>
            <p><strong class="text-gray-900">{{ t('drugSearch.shape') }}:</strong>
              <span class="text-gray-600">{{ drugDetails.shape || 'N/A' }}</span></p>
            <p><strong class="text-gray-900">{{ t('drugSearch.size') }}:</strong>
              <span class="text-gray-600">{{ drugDetails.size || 'N/A' }}</span></p>
            <p><strong class="text-gray-900">{{ t('drugSearch.packaging') }}:</strong>
              <span class="text-gray-600">{{ drugDetails.packaging || 'N/A' }}</span></p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="mx-auto w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5v4m0 4v4m0-8h6m-6 0H3" />
        </svg>
        <p class="mt-4 text-lg text-gray-500 font-medium">{{ t('drugSearch.empty') }}</p>
      </div>

      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';

// Localization and toast
const { t } = useI18n({
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      drugSearch: {
        title: 'Drug Barcode Search',
        subtitle: 'Enter a barcode to find drug information',
        enterBarcode: 'Enter barcode',
        search: 'Search',
        emptyBarcode: 'Please enter a barcode',
        error: 'An error occurred while fetching drug details',
        success: 'Drug details retrieved successfully',
        details: 'Drug Details',
        brandName: 'Brand Name',
        manufacturer: 'Manufacturer',
        description: 'Description',
        color: 'Color',
        shape: 'Shape',
        size: 'Size',
        packaging: 'Packaging',
        empty: 'No drug details available. Search with a barcode.',
      },
      warning: 'Warning',
      error: 'Error',
      success: 'Success',
    },
    ar: {
      drugSearch: {
        title: 'البحث عن الأدوية باستخدام الباركود',
        subtitle: 'أدخل الباركود للعثور على معلومات الدواء',
        enterBarcode: 'أدخل الباركود',
        search: 'بحث',
        emptyBarcode: 'يرجى إدخال الباركود',
        error: 'حدث خطأ أثناء جلب تفاصيل الدواء',
        success: 'تم استرداد تفاصيل الدواء بنجاح',
        details: 'تفاصيل الدواء',
        brandName: 'اسم العلامة التجارية',
        manufacturer: 'الشركة المصنعة',
        description: 'الوصف',
        color: 'اللون',
        shape: 'الشكل',
        size: 'الحجم',
        packaging: 'التعبئة والتغليف',
        empty: 'لا توجد تفاصيل للدواء متاحة. ابحث باستخدام الباركود.',
      },
      warning: 'تحذير',
      error: 'خطأ',
      success: 'نجاح',
    },
  },
});
const toast = useToast();

// Reactive state
const barcode = ref('');
const drugDetails = ref(null);
const loading = ref(false);
const error = ref(null);

// Fetch drug details from RxNav API
const fetchDrugDetails = async () => {
  if (!barcode.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: t('warning'),
      detail: t('drugSearch.emptyBarcode'),
      life: 3000,
    });
    return;
  }

  loading.value = true;
  error.value = null;
  drugDetails.value = null;

  try {
    const url = `https://rxnav.nlm.nih.gov/REST/ndcproperties.json?id=${encodeURIComponent(barcode.value.trim())}`;
    const response = await axios.get(url);

    if (response.data.ndcPropertyList?.ndcProperty?.length > 0) {
      const props = response.data.ndcPropertyList.ndcProperty[0];
      const propertyConcepts = props.propertyConceptList?.propertyConcept || [];

      // Map property concepts to a lookup object for easier access
      const propMap = propertyConcepts.reduce((acc, concept) => {
        acc[concept.propName] = concept.propValue;
        return acc;
      }, {});

      drugDetails.value = {
        brand_name: props.brandName || 'Unknown',
        manufacturer_name: propMap['LABELER'] || 'Unknown',
        description: props.synonym || 'No description available',
        color: propMap['COLORTEXT'] || 'N/A',
        shape: propMap['SHAPETEXT'] || 'N/A',
        size: propMap['SIZE'] || 'N/A',
        packaging: props.packagingList?.packaging?.[0] || 'N/A',
      };
      toast.add({
        severity: 'success',
        summary: t('success'),
        detail: t('drugSearch.success'),
        life: 3000,
      });
    } else {
      throw new Error('No matches found!');
    }
  } catch (err) {
    error.value = {
      code: err.response?.status || 'UNKNOWN_ERROR',
      message: err.message || t('drugSearch.error'),
    };
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: error.value.message,
      life: 3000,
    });
    console.error('Error fetching drug details:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap');

:deep(.p-inputtext) {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500;
}

:deep(.p-button) {
  @apply px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200;
}

:deep(.p-button .p-button-icon) {
  @apply mr-2;
}

/* Arabic font for Arabic locale */
html[lang="ar"] {
  font-family: 'Amiri', serif;
  direction: rtl;
}
</style>
