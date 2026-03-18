export const queryKeys = {
  auth: ['auth'] as const,
  dashboard: ['dashboard'] as const,
  customers: ['customers'] as const,
  customerDetail: (nik: string) => ['customers', nik] as const,
  vehicles: ['vehicles'] as const,
  vehicleDetail: (id: string) => ['vehicles', id] as const,
  workOrders: ['work-orders'] as const,
  services: ['services'] as const,
  serviceDetail: (id: string | number) => ['services', id] as const,
  users: ['users'] as const,
};