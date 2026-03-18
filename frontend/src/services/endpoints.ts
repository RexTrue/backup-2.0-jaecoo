export const endpoints = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  customers: {
    list: '/customers',
    create: '/customers',
  },
  vehicles: {
    list: '/vehicles',
    create: '/vehicles',
  },
  workOrders: {
    list: '/work-orders',
    create: '/work-orders',
  },
  services: {
    list: '/services',
    create: '/services',
    detail: (serviceId: string | number) => `/services/${serviceId}`,
    status: (serviceId: string | number) => `/services/${serviceId}/status`,
    notes: (serviceId: string | number) => `/services/${serviceId}/notes`,
  },
  users: {
    list: '/users',
    create: '/users',
  },
  schedules: {
    create: '/schedules',
  },
  reports: {
    export: '/reports/export',
  },
} as const;
