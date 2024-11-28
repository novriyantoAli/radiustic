import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

import { useAuthStore } from '../stores/auth-store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
    meta: {
      isAuth: true,
    },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'dashboard' },
    meta: {
      isAuth: true,
    },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
        meta: {
          isAuth: true,
        },
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
        meta: {
          isAuth: true,
        },
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
        meta: {
          isAuth: true,
        },
      },
      {
        name: 'traces',
        path: 'traces',
        component: () => import('../pages/trace/Traces.vue'),
        meta: {
          isAuth: true,
        },
      },
      {
        name: 'customers',
        path: 'customers',
        component: () => import('../pages/customers/CustomersPage.vue'),
        meta: {
          isAuth: true,
        },
      },
      {
        name: 'client',
        path: '/client',
        component: RouteViewComponent,
        children: [
          {
            name: 'clients',
            path: 'clients',
            component: () => import('../pages/clients/ClientsPage.vue'),
            meta: {
              isAuth: true,
            },
          },
          {
            name: 'client-bindings',
            path: 'client-bindings',
            component: () => import('../pages/client-binding/ClientBindingPage.vue'),
            meta: {
              isAuth: true,
            },
          },
        ],
      },
      {
        name: 'users',
        path: '/users',
        component: RouteViewComponent,
        children: [
          {
            name: 'users-lists',
            path: 'users-lists',
            component: () => import('../pages/users/UsersPage.vue'),
            meta: {
              isAuth: true,
            },
          },
          {
            name: 'users-levels',
            path: 'users-levels',
            component: () => import('../pages/levels/LevelsPage.vue'),
            meta: {
              isAuth: true,
            },
          },
        ],
      },
      {
        name: 'hotspots',
        path: '/hotspots',
        component: RouteViewComponent,
        children: [
          {
            name: 'hotspot-profiles',
            path: '/hotspot-profiles',
            component: RouteViewComponent,
            children: [
              {
                name: 'hotspot-profiles-list',
                path: 'hotspot-profiles-list',
                component: () => import('../pages/hotspot-profiles/HotspotProfilesPage.vue'),
                meta: {
                  isAuth: true,
                },
              },
              {
                name: 'hotspot-profile-radcheck-properties',
                path: 'hotspot-profile-radcheck-properties',
                component: () => import('../pages/hotspot-profile-radcheck-properties/RadcheckPage.vue'),
                meta: {
                  isAuth: true,
                },
              },
              {
                name: 'hotspot-profile-radreply-properties',
                path: 'hotspot-profile-radreply-properties',
                component: () => import('../pages/hotspot-profile-radreply-properties/RadreplyPage.vue'),
                meta: {
                  isAuth: true,
                },
              },
              {
                name: 'hotspot-packages-list',
                path: 'hotspot-packages-list',
                component: () => import('../pages/hotspot-packages/HotspotPackagesPage.vue'),
                meta: {
                  isAuth: true,
                },
              },
            ],
          },
        ],
      },
      {
        name: 'payments',
        path: '/payments',
        component: RouteViewComponent,
        children: [
          {
            name: 'payment-methods',
            path: 'payment-methods',
            component: () => import('../pages/payments/PaymentsPage.vue'),
            meta: {
              isAuth: true,
            },
          },
          {
            name: 'billing',
            path: 'billing',
            component: () => import('../pages/billing/BillingPage.vue'),
            meta: {
              isAuth: true,
            },
          },
          {
            name: 'pricing-plans',
            path: 'pricing-plans',
            component: () => import('../pages/pricing-plans/PricingPlans.vue'),
            meta: {
              isAuth: true,
            },
          },
        ],
      },
      {
        name: 'nas',
        path: '/nas',
        meta: {
          isAuth: false,
        },
        component: () => import('../pages/nas/NassPage.vue'),
      },
      // {
      //   name: 'faq',
      //   path: '/faq',
      //   component: () => import('../pages/faq/FaqPage.vue'),
      //   meta: {
      //     isAuth: true
      //   }
      // },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: {
      isAuth: false,
    },
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
        meta: {
          isAuth: false,
        },
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
        meta: {
          isAuth: false,
        },
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
        meta: {
          isAuth: false,
        },
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
        meta: {
          isAuth: false,
        },
      },
      {
        path: '',
        redirect: { name: 'login' },
        meta: {
          isAuth: false,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/auth/login', '/404']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()
  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath
    return '/auth/login'
  } else if (auth.user && to.path == '/auth/login') {
    return '/dashboard'
  }
})

export default router
