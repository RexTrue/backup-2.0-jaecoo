const isBrowser = typeof window !== 'undefined';

type Key = 'users' | 'customers' | 'vehicles' | 'work-orders' | 'services' | 'schedules';

const storageKeys: Record<Key, string> = {
  users: 'jaecoo.local.users',
  customers: 'jaecoo.local.customers',
  vehicles: 'jaecoo.local.vehicles',
  'work-orders': 'jaecoo.local.work-orders',
  services: 'jaecoo.local.services',
  schedules: 'jaecoo.local.schedules',
};

function readRaw(key: Key): unknown[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(storageKeys[key]);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(key: Key, value: unknown[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(storageKeys[key], JSON.stringify(value));
}

export function getLocalEntities<T>(key: Key): T[] {
  return readRaw(key) as T[];
}

export function appendLocalEntity<T>(key: Key, value: T) {
  const current = getLocalEntities<T>(key);
  writeRaw(key, [value, ...current]);
}

export function mergeEntities<T>(base: T[], local: T[], getId: (item: T) => string | number): T[] {
  const seen = new Set<string>();
  const merged = [...local, ...base];
  return merged.filter((item) => {
    const id = String(getId(item));
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
