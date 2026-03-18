import { create } from 'zustand';
import { User } from '@/common/types/domain';
import { authStorage } from '@/services/auth-storage';

type AuthState = {
  token: string | null;
  user: User | null;
  setSession: (payload: { token: string; user: User }) => void;
  clearSession: () => void;
};

const persisted = authStorage.get();

export const useAuthStore = create<AuthState>((set) => ({
  token: persisted?.token ?? null,
  user: (persisted?.user as User | null) ?? null,
  setSession: ({ token, user }) => {
    authStorage.save({ token, user });
    set({ token, user });
  },
  clearSession: () => {
    authStorage.clear();
    set({ token: null, user: null });
  },
}));