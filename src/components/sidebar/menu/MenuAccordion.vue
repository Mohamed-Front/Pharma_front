<template>
  <va-accordion v-model="accordionValue" class="sidebar-accordion va-sidebar__menu__inner" multiple>

    <va-collapse v-for="(route, idx) in filteredRoutes" :key="idx">
      <template #header>
        <va-sidebar-item
          :active="isRouteActive(route)"
          :to="route.children ? undefined : { name: route.name }"
          :disabled="route.disabled"
        >
          <va-sidebar-item-content>
            <va-icon :name="route.meta.icon" class="va-sidebar-item__icon" />
            <va-sidebar-item-title>
              {{ t(route.displayName) }}
            </va-sidebar-item-title>
            <va-icon v-if="route.children" :name="accordionValue[idx] ? 'expand_less' : 'expand_more'" />
          </va-sidebar-item-content>
        </va-sidebar-item>
      </template>

      <template v-if="route.children">
        <va-sidebar-item
          v-for="(child, index) in route.children"
          :key="index"
          class="mx-4"
          :active="isRouteActive(child)"
          :to="{ name: child.name }"
        >
          <va-sidebar-item-content>
            <div class="va-sidebar-item__icon" />
            <va-sidebar-item-title>
              {{ t(child.displayName) }}
            </va-sidebar-item-title>
          </va-sidebar-item-content>
        </va-sidebar-item>
      </template>
    </va-collapse>


  </va-accordion>
  <div class="w-[85%] m-auto  mb-10 ">
      <Button
        :label='$t("Log_Out")'
        class="w-full"
        style="background-color: #EF0000 !important;"
        severity="danger"
        icon="pi pi-sign-out"
        @click="logout"
      />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../../stores/Auth'
import Button from 'primevue/button'
import axios from 'axios'
import { INavigationRoute } from '../NavigationRoutes'
import { getFilteredRoutes } from '../NavigationRoutes'

const props = withDefaults(
  defineProps<{
    items?: INavigationRoute[]
  }>(),
  {
    items: () => [],
  },
)

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const accordionValue = ref<boolean[]>([])
const userPermissions = ref<string[]>([])
const userType = ref<number>(0)

const dashboardRoute = computed(() => {
  switch (userType.value) {
    case 1: return '/admin/dashboard'
    case 2: return '/warehouse/dashboard'
    case 3: return '/pharmacy/dashboard'
    default: return '/auth/login'
  }
})

const filteredRoutes = computed(() => {
  return getFilteredRoutes(userType.value, userPermissions.value)
})

onMounted(() => {
  // Initialize user permissions and type
  const permissions = localStorage.getItem('userPermissions')
  const type = localStorage.getItem('type')

  userPermissions.value = permissions ? JSON.parse(permissions) : []
  userType.value = type ? parseInt(type) : 0

  // Initialize accordion state based on active routes
  accordionValue.value = filteredRoutes.value.map(r => isItemExpanded(r))
})

const isRouteActive = (item: INavigationRoute): boolean => {
  return item.name === route.name
}

const isItemExpanded = (item: INavigationRoute): boolean => {
  if (!item.children) return false

  const isCurrentItemActive = isRouteActive(item)
  const isChildActive = !!item.children.find(child =>
    child.children ? isItemExpanded(child) : isRouteActive(child)
  )

  return isCurrentItemActive || isChildActive
}

const logout = async () => {
    const type =localStorage.getItem('type')
    if(type ==2 ){
      authStore.warehoushandleLogout()
    }else
     authStore.adminhandleLogout()

    localStorage.removeItem('userPermissions')
    localStorage.removeItem('type')
    router.push({ name: 'login' })

}
</script>

<style lang="scss">
.sidebar-accordion {
  height: 100%;
  display: flex;
  flex-direction: column;

  .va-sidebar-item {
    &__icon {
      margin-right: 0.5rem;
    }

    &-content {
      display: flex;
      align-items: center;
      width: 100%;
    }

    &-title {
      flex-grow: 1;
    }
  }

  .mx-4 {
    margin-left: 1rem;
    margin-right: 1rem;
  }
}
</style>
