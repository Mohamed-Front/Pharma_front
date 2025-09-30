<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  selectedCategory: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['selectCategory'])

const appLang = computed(() => localStorage.getItem('appLang') || 'ar')

const getCategoryName = (category) => {
  return appLang.value === 'en' ? category.name_en : category.name_ar
}
</script>

<template>
  <div v-if="props.loading" class="flex justify-center mb-10">
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
  </div>
  <div v-else class="flex flex-wrap justify-center gap-3 mb-10">
    <Button
      v-for="category in props.categories"
      :key="category.id"
      :label="getCategoryName(category)"
      :style="props.selectedCategory === category.id
        ? {
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            backgroundColor: '#059669',
            color: '#ffffff',
            ':hover': { backgroundColor: '#047857' }
          }
        : {
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            backgroundColor: '#ffffff !important',
            color: '#000000',
            border: '1px solid #e5e7eb',
            ':hover': { backgroundColor: '#f3f4f6' }
          }"
      @click="emit('selectCategory', category.id)"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.p-button) {
  &.p-button-success {
    background-color: #059669;
    &:hover {
      background-color: #047857;
    }
  }
}
</style>
