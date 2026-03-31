export const frontendMode = {
  enableMockFallback: (import.meta.env.VITE_ENABLE_MOCK_FALLBACK ?? 'false') === 'true',
};
