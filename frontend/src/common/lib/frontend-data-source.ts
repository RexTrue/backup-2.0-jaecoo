import { frontendMode } from '@/config/frontend-mode';
import { getLocalEntities, mergeEntities, type Key } from '@/common/lib/local-entity-store';

export function getCollectionFromMode<T>(
  key: Key,
  backendItems: T[] | undefined,
  getId: (item: T) => string | number,
): T[] {
  // Since we're no longer using mock fallbacks, always return backend data
  // Local data is only used for offline functionality and merging
  return mergeEntities(backendItems ?? [], getLocalEntities<T>(key), getId);
}

export function getReferenceCollection<T>(key: Key): T[] {
  // Return local entities for reference data that might not be in backend yet
  return getLocalEntities<T>(key);
}
