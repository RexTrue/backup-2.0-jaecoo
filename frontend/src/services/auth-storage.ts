import { authConfig } from '@/config/auth.config';

type AuthPayload = {
  token: string | null;
  user: unknown | null;
};

export const authStorage = {
  get(): AuthPayload | null {
    const raw = localStorage.getItem(authConfig.storageKey);
    return raw ? JSON.parse(raw) : null;
  },
  save(payload: AuthPayload) {
    localStorage.setItem(authConfig.storageKey, JSON.stringify(payload));
  },
  getToken() {
    return this.get()?.token ?? null;
  },
  clear() {
    localStorage.removeItem(authConfig.storageKey);
  },
};