import { frontendMode } from '@/config/frontend-mode';

export function shouldUseMockFallback(isError: boolean) {
  return frontendMode.enableMockFallback && isError;
}
