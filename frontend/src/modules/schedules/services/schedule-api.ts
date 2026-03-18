import { apiClient } from '@/services/api-client';
import { endpoints } from '@/services/endpoints';

export type CreateSchedulePayload = {
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  nik: string;
  no_rangka: string;
  keluhan: string;
  catatan?: string | null;
};

export async function createSchedule(payload: CreateSchedulePayload) {
  const { data } = await apiClient.post<Record<string, unknown>>(endpoints.schedules.create, payload);
  return data;
}
