import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { login } from '@/modules/auth/services/auth-api';
import { useAuthStore } from '@/modules/auth/store/auth-store';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setSession({ token: data.accessToken, user: data.user });
    },
    throwOnError: false,
    meta: {
      friendlyErrorMessage: 'Gagal masuk ke sistem.',
    },
  });
}

export function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      'Terjadi kesalahan saat memproses login.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan saat memproses login.';
}