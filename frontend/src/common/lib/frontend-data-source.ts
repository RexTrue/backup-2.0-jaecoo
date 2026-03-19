import { frontendMode } from '@/config/frontend-mode';
import { getLocalEntities, mergeEntities, type LocalEntityKey } from '@/common/lib/local-entity-store';

export function getCollectionFromMode<T>(
  key: LocalEntityKey,
  backendItems: T[] | undefined,
  getId: (item: T) => string | number,
): T[] {
  if (!frontendMode.isDemoDataMode) {
    return backendItems ?? [];
  }

  return mergeEntities(backendItems ?? [], getLocalEntities<T>(key), getId);
}

export function getReferenceCollection<T>(key: LocalEntityKey): T[] {
  if (!frontendMode.isDemoDataMode) {
    return [];
  }

  return getLocalEntities<T>(key);
}
