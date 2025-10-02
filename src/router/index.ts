import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/Auth'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import WebLayout from '../layouts/WebLayout.vue'
import Page404Layout from '../layouts/Page404Layout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'
import UIRoute from '../pages/admin/ui/route'

const routes: Array<RouteRecordRaw> = [
  // Pharmacy routes
  {
    name: 'pharmacy',
    path: '/pharmacy',
    component: WebLayout,
    children: [
      {
        name: 'home',
        path: '/',
        component: () => import('../pages/pharmacy/pages/home.vue'),
      },
      {
        name: 'cart',
        path: '/cart',
        component: () => import('../pages/pharmacy/pages/cart.vue'),
      },
      {
        name: 'pharmacy-categories',
        path: '/pharmacy-categories',
        component: () => import('../pages/pharmacy/pages/categories.vue'),
      },
     {
        name: 'pharmacy-offers',
        path: '/pharmacy-offers',
        component: () => import('../pages/pharmacy/pages/offers.vue'),
      },
     {
        name: 'pharmacy-getmedicen',
        path: '/pharmacy-getmedicen',
        component: () => import('../pages/pharmacy/pages/getmedicen.vue'),
      },

      {
        name: 'pharmacy-warehouses',
        path: '/pharmacy-warehouses',
        component: () => import('../pages/pharmacy/pages/warehouses.vue'),
      },


       {
        name: 'pharmacy-category-details',
        path: '/pharmacy-category-details/:id',
        component: () => import('../pages/pharmacy/pages/category-details.vue'),
      },
        {
        name: 'pharmacy-warehouse-details',
        path: '/pharmacy-warehouse-details/:id',
        component: () => import('../pages/pharmacy/pages/warehouse-details.vue'),
      },
       {
        name: 'pharmacy-orders',
        path: '/pharmacy-orders',
        component: () => import('../pages/pharmacy/pages/orders.vue'),
      },

      {
        name: 'pharmacy-contact-us',
        path: '/pharmacy-contact-us',
        component: () => import('../pages/pharmacy/pages/contact-us.vue'),
      },
      {
        name: 'pharmacy-profile',
        path: '/pharmacy-profile',
        component: () => import('../pages/pharmacy/pages/profile.vue'),
      },
      UIRoute,
    ],
  },

  // 404 routes
  {
    name: 'not-found-advanced',
    path: '/404',
    component: Page404Layout,
    children: [
      {
        name: 'not-found-advanced',
        path: 'not-found-advanced',
        component: () => import('../pages/404-pages/VaPageNotFound.vue'),
      },
    ],
  },

  // Admin routes
  {
    name: 'admin',
    path: '/admin',
    component: AppLayout,
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: 'roles',
        path: 'roles',
        component: () => import('../pages/admin/roles/index.vue'),
      },
      {
        name: 'roles-update',
        path: 'roles-update/:id',
        component: () => import('../pages/admin/roles/update.vue'),
      },
      {
        name: 'roles-create',
        path: 'roles-create',
        component: () => import('../pages/admin/roles/create.vue'),
      },
      {
        name: 'Permission',
        path: 'Permission',
        component: () => import('../pages/admin/Permissions/index.vue'),
      },
        {
        name: 'scientific-structur',
        path: 'scientific-structur',
        component: () => import('../pages/admin/scientific-structur/index.vue'),
      },
      {
        name: 'categories',
        path: 'categories',
        component: () => import('../pages/admin/Categories/index.vue'),
      },
      {
        name: 'statistics',
        path: 'users_management',
        children: [
          {
            name: 'users',
            path: 'users',
            component: () => import('../pages/admin/users/users.vue'),
          },
          {
            name: 'pharmacy-request',
            path: 'pharmacy-request',
            component: () => import('../pages/admin/pharmacy-request/index.vue'),
          },
          {
            name: 'pharmacy_request_show',
            path: 'pharmacy_request_show/:id',
            component: () => import('../pages/admin/pharmacy-request/show.vue'),
          },
          {
            name: 'warehouse_request',
            path: 'warehouse-request',
            component: () => import('../pages/admin/warehouse-request/index.vue'),
          },
          {
            name: 'warehouse_request_show',
            path: 'warehouse_request_show/:id',
            component: () => import('../pages/admin/warehouse-request/show.vue'),
          },
          {
            name: 'user-edit',
            path: 'user-edite/:id',
            component: () => import('../pages/admin/users/edite.vue'),
          },
          {
            name: 'user-create',
            path: 'user-create',
            component: () => import('../pages/admin/users/create.vue'),
          },
        ],
      },
      {
        name: 'settings',
        path: 'settings',
        children: [],
      },
      UIRoute,
    ],
  },

  // Warehouse routes
  {
    name: 'warehouse',
    path: '/warehouse',
    component: AppLayout,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (!authStore.warehouseauthenticated) {
        return next({ name: 'login' });
      }

      next();
    },
    children: [
      {
        name: 'warehouse_dashboard',
        path: 'dashboard',
        component: () => import('../pages/warehouse/dashboard/Dashboard.vue'),
      },

       {
        name: 'invoices',
        path: 'invoices',
        component: () => import('../pages/warehouse/invoice/index.vue'),
      },
       {
        name: 'invoice_show',
        path: 'invoices-show/:id',
        component: () => import('../pages/warehouse/invoice/show.vue'),
      },

      {
        name: 'companies',
        path: 'companies',
        component: () => import('../pages/warehouse/company/index.vue'),
      },
      {
        name: 'products',
        path: 'products',
        component: () => import('../pages/warehouse/product/index.vue'),
      },
       {
        name: 'order',
        path: 'order',
        component: () => import('../pages/warehouse/order/index.vue'),
      },
       {
        name: 'order_show',
        path: 'order-show/:id',
        component: () => import('../pages/warehouse/order/show.vue'),
      },


      {
        name: 'product-create',
        path: 'product-create',
        component: () => import('../pages/warehouse/product/create.vue'),
      },
      {
        name: 'product-update',
        path: 'product-update/:id',
        component: () => import('../pages/warehouse/product/update.vue'),
      },
      {
        name: 'offers',
        path: 'offers',
        component: () => import('../pages/warehouse/offer/index.vue'),
      },
      {
        name: 'offers-create',
        path: 'offers-create',
        component: () => import('../pages/warehouse/offer/create.vue'),
      },
      {
        name: 'offers-update',
        path: 'offers-update/:id',
        component: () => import('../pages/warehouse/offer/update.vue'),
      },

      UIRoute,
    ],
  },

  // Auth routes (accessible to all)
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/login/Login.vue'),
      },
      {
        name: 'register-storehouse',
        path: 'register-storehouse',
        component: () => import('../pages/auth/signup/register-storehouse.vue'),
      },
      {
        name: 'register-pharmacy',
        path: 'register-pharmacy',
        component: () => import('../pages/auth/signup/register-pharmacy.vue'),
      },
      {
        name: 'inquiry',
        path: 'inquiry',
        component: () => import('../pages/auth/login/inquiry.vue'),
      },
      {
        name: 'inquiry-warehous',
        path: 'inquiry-warehous/:id',
        component: () => import('../pages/auth/login/inquiry-warehous.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/signup/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/recover-password/RecoverPassword.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    } else {
      document.querySelector('.app-layout__page')?.scrollTo(0, 0);
    }
  },
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Define public pharmacy routes that don't require authentication
  const publicPharmacyRoutes = ['home', 'pharmacy-categories','pharmacy-warehouses','pharmacy-getmedicen','pharmacy-offers','pharmacy-contact-us','pharmacy-category-details','pharmacy-warehouse-details'];

  // If user is authenticated, redirect from auth routes to their dashboard
  // if (
  //   (authStore.adminauthenticated || authStore.pharmacyauthenticated || authStore.warehouseauthenticated) &&
  //   to.path.startsWith('/auth')
  // ) {
  //   if (authStore.adminauthenticated && authStore.type === '1') {
  //     return next({ name: 'dashboard' }); // Admin dashboard
  //   }
  //   if (authStore.warehouseauthenticated && authStore.type === '2') {
  //     return next({ name: 'warehouse_dashboard' }); // Warehouse dashboard
  //   }
  //   if (authStore.pharmacyauthenticated && authStore.type === '3') {
  //     return next({ name: 'home' }); // Pharmacy home
  //   }
  // }

  // Admin routes: require adminauthenticated
  if (to.path.startsWith('/admin') && !authStore.adminauthenticated) {
    return next({ name: 'login' });
  }

  // Pharmacy routes: require pharmacyauthenticated for non-public routes
  if (
    to.path.startsWith('/pharmacy') &&
    !publicPharmacyRoutes.includes(to.name as string) &&
    !authStore.pharmacyauthenticated
  ) {
    return next({ name: 'login' });
  }

  // Allow access to login if not authenticated
  if (
    to.name === 'login' &&
    !authStore.adminauthenticated &&
    !authStore.pharmacyauthenticated &&
    !authStore.warehouseauthenticated
  ) {
    return next();
  }

  next();
});

export default router;
