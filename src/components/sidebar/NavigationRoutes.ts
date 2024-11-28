export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'hotspots',
      displayName: 'menu.hotspots',
      meta: {
        icon: 'group',
      },
      children: [
        {
          name: 'hotspot-profiles-list',
          displayName: 'menu.hotspot-profiles-list',
        },
        {
          name: 'hotspot-profile-radcheck-properties',
          displayName: 'menu.hotspot-profiles-radcheck-properties',
        },
        {
          name: 'hotspot-profile-radreply-properties',
          displayName: 'menu.hotspot-profiles-radreply-properties',
        },
        {
          name: 'hotspot-packages-list',
          displayName: 'menu.hotspot-packages-list',
        },
      ],
    },
    {
      name: 'client',
      displayName: 'menu.clients',
      meta: {
        icon: 'folder_shared',
      },
      children: [
        {
          name: 'clients',
          displayName: 'menu.clients',
        },
        {
          name: 'client-bindings',
          displayName: 'menu.client-bindings',
        },
      ],
    },
    {
      name: 'customers',
      displayName: 'menu.customers',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'users',
      displayName: 'menu.users',
      meta: {
        icon: 'group',
      },
      children: [
        {
          name: 'users-lists',
          displayName: 'menu.users-lists',
        },
        {
          name: 'users-levels',
          displayName: 'menu.users-levels',
        },
      ],
    },
    // {
    //   name: 'projects',
    //   displayName: 'menu.projects',
    //   meta: {
    //     icon: 'folder_shared',
    //   },
    // },
    {
      name: 'payments',
      displayName: 'menu.payments',
      meta: {
        icon: 'credit_card',
      },
      children: [
        {
          name: 'payment-methods',
          displayName: 'menu.payment-methods',
        },
        {
          name: 'pricing-plans',
          displayName: 'menu.pricing-plans',
        },
        {
          name: 'billing',
          displayName: 'menu.billing',
        },
      ],
    },
    // {
    //   name: 'auth',
    //   displayName: 'menu.auth',
    //   meta: {
    //     icon: 'login',
    //   },
    //   children: [
    //     {
    //       name: 'login',
    //       displayName: 'menu.login',
    //     },
    //     {
    //       name: 'signup',
    //       displayName: 'menu.signup',
    //     },
    //     {
    //       name: 'recover-password',
    //       displayName: 'menu.recover-password',
    //     },
    //   ],
    // },

    // {
    //   name: 'faq',
    //   displayName: 'menu.faq',
    //   meta: {
    //     icon: 'quiz',
    //   },
    // },
    {
      name: 'nas',
      displayName: 'menu.nas',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'traces',
      displayName: 'menu.traces',
      meta: {
        icon: 'person_search',
      },
    },
    {
      name: 'preferences',
      displayName: 'menu.preferences',
      meta: {
        icon: 'manage_accounts',
      },
    },
    {
      name: 'settings',
      displayName: 'menu.settings',
      meta: {
        icon: 'settings',
      },
    },
  ] as INavigationRoute[],
}
