export interface INavigationRoute {
  name: string
  displayName: string
  meta: {
    icon: string
    permission?: string | string[]
  }
  show?: string | string[]
  disabled?: boolean
  children?: INavigationRoute[]
}

const navigationRoutes = {
  root: {
    name: '/',
    displayName: 'navigation.home',
    meta: {
      icon: 'home'
    }
  },

  // Admin routes (type 1)
  admin: [
    {
      name: 'dashboard',
      displayName: 'navigation.dashboard',
      show: ['list users'],
      meta: {
        icon: 'dashboard',
      },
    },
    {
      name: 'statistics',
      displayName: 'navigation.users_management',
      show: ['list users', 'list permissions', 'list roles'],
      meta: {
        icon: 'people',
      },
      disabled: true,
      children: [
        {
          name: 'users',
          displayName: 'navigation.users',
          show: 'list users',
          meta: {
            icon: 'person'
          }
        },
        {
          name: 'roles',
          displayName: 'navigation.roles',
          show: 'list roles',
          meta: {
            icon: 'security'
          }
        },
        {
          name: 'Permission',
          displayName: 'navigation.permissions',
          show: 'list permissions',
          meta: {
            icon: 'lock'
          }
        },
      ],
    },
    {
      name: 'categories',
      displayName: 'navigation.categories',
      meta: {
        icon: 'category'
      }
    },
      {
      name: 'companies',
      displayName: 'companies',
      meta: {
        icon: 'business'
      }
    },
    {
      name: 'scientific-structur',
      displayName: 'navigation.scientific_structur',
      meta: {
        icon: 'science'
      }
    },
    {
      name: 'pharmacy-request',
      displayName: 'navigation.pharmacy_request',
      show: ['list pharmacy requests'],
      meta: {
        icon: 'medical_services'
      },
    },
    {
      name: 'warehouse_request',
      displayName: 'warehouse_request',
      show: ['list warehouse requests'],
      meta: {
        icon: 'warehouse'
      },
    },
    {
      name: 'admin-report',
      displayName: 'admin_report',
      show: ['list warehouse requests'],
      meta: {
        icon: 'assessment'
      },
    },
     {
      name: 'notification',
      displayName: 'navigation.notifications',
      meta: {
        icon: 'notifications'
      },
    },


    {
      name: 'settings',
      displayName: 'navigation.settings',
      show: ['list warehouse requests'],
      meta: {
        icon: 'settings'
      }
    },


  ] as INavigationRoute[],

  // Warehouse routes (type 2)
  warehouse: [
    {
      name: 'warehouse_dashboard',
      displayName: 'warehouse_dashboard',
      meta: {
        icon: 'dashboard'
      }
    },
    {
      name: 'products',
      displayName: 'navigation.products',
      meta: {
        icon: 'inventory_2'
      }
    },

    {
      name: 'order',
      displayName: 'navigation.orders',
      meta: {
        icon: 'shopping_cart'
      }
    },
    {
      name: 'offers',
      displayName: 'navigation.offers',
      meta: {
        icon: 'local_offer'
      }
    },
    {
      name: 'invoices',
      displayName: 'navigation.invoice',
      meta: {
        icon: 'receipt'
      }
    },
    {
      name: 'reports',
      displayName: 'navigation.reports',
      meta: {
        icon: 'assessment'
      }
    },
   {
      name: 'warehouse-notification',
      displayName: 'navigation.notifications',

      meta: {
        icon: 'notifications'
      }
    },
    {
      name: 'warehouse-profile',
      displayName: 'navigation.profile',
      meta: {
        icon: 'account_circle'
      }
    },


  ] as INavigationRoute[],

  // Pharmacy routes (type 3)
  pharmacy: [] as INavigationRoute[],
}

// Helper function to filter routes based on user permissions
export function getFilteredRoutes(userType: number, userPermissions: string[]): INavigationRoute[] {
  const hasPermission = (required: string | string[] | undefined): boolean => {
    if (!required) return true
    if (typeof required === 'string') return userPermissions.includes(required)
    return required.some(perm => userPermissions.includes(perm))
  }

  const filterRoutes = (routes: INavigationRoute[]): INavigationRoute[] => {
    return routes
      .filter(route => hasPermission(route.show))
      .map(route => ({
        ...route,
        children: route.children ? filterRoutes(route.children) : undefined
      }))
  }

  switch (userType) {
    case 1: // Admin
      return filterRoutes(navigationRoutes.admin)
    case 2: // Warehouse
      return filterRoutes(navigationRoutes.warehouse)
    case 3: // Pharmacy
      return filterRoutes(navigationRoutes.pharmacy)
    default:
      return []
  }
}

export default {
  ...navigationRoutes,
  getFilteredRoutes
}
