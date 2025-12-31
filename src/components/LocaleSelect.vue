<template>
  <div class="flex items-center">
    <Dropdown
      v-model="selectedLanguage"
      :options="languages"
      optionLabel="name"
      class="language-dropdown-custom"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value" class="language-option-custom">
          <img
            :src="getFlagSrc(slotProps.value.code)"
            :alt="`${slotProps.value.name} flag`"
            class="language-flag-custom"
          />
          <span class="language-code-custom">{{ slotProps.value.code.toUpperCase() }}</span>
        </div>
      </template>

      <template #option="slotProps">
        <div class="language-option-custom">
          <img
            :src="getFlagSrc(slotProps.option.code)"
            :alt="`${slotProps.option.name} flag`"
            class="language-flag-custom"
          />
          <span class="language-name-custom">{{ slotProps.option.name }}</span>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import i18n from "../plugins/i18n";
import { useAppLangStore } from "../stores/AppLangStore";
import Dropdown from 'primevue/dropdown';
import 'primeicons/primeicons.css';

const appLang = useAppLangStore();

const languages = ref([
  { name: 'English', code: 'en', dir: 'rtl' },
  { name: 'العربية', code: 'ar', dir: 'ltr' }
]);

const selectedLanguage = computed({
  get() {
    return languages.value.find(lang => lang.code === appLang.appLang) || languages.value[0];
  },
  set(newLang) {
    changeLocale(newLang);
  }
});

const changeLocale = (newLang) => {
  document.body.dir = newLang.dir;
  i18n.global.locale.value = newLang.code;
  appLang.setAppLang(newLang.code);
  appLang.setAppRtl(newLang.dir === 'rtl');
};

const getFlagSrc = (langCode) => {
  const flags = {
    // علم المملكة المتحدة (بريطانيا العظمى) للغة الإنجليزية
    en: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/gb.svg',
    // **تم التغيير هنا: من علم مصر (eg) إلى علم سوريا (sy) للغة العربية**
    ar: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/sy.svg'
  };
  return flags[langCode];
};
</script>


<style scoped>
.language-dropdown-custom :deep(.p-dropdown) {
  @apply rounded-xl border border-gray-300 shadow-sm transition-all duration-200 ease-in-out;
  @apply hover:border-green-600;
  padding: 0.5rem 0.75rem; /* Reduced padding */
  min-width: 100px;
}

.language-dropdown-custom :deep(.p-dropdown-trigger) {
  display: none !important;
}

.language-dropdown-custom :deep(.p-dropdown-label-container) {
  padding: 0;
}

.language-dropdown-custom :deep(.p-dropdown-label) {
  @apply p-0;
}

.language-option-custom {
  @apply flex items-center justify-start gap-2;
}

.language-flag-custom {
  @apply w-8 h-8 rounded-md shadow-sm;
  object-fit: cover;
}

.language-code-custom {
  @apply text-base font-bold text-gray-800;
}

.language-name-custom {
  @apply text-sm text-gray-700;
}

.language-dropdown-custom :deep(.p-dropdown-items-wrapper) {
  @apply rounded-xl overflow-hidden shadow-lg;
}
</style>
