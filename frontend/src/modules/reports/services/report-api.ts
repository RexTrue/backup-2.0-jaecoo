import { apiClient } from '@/services/api-client';
import { endpoints } from '@/services/endpoints';

export type ReportFilterPayload = {
  tanggal_mulai: string;
  tanggal_selesai: string;
  status?: string | null;
  role?: string | null;
  format: 'PDF' | 'CSV' | 'XLSX';
};

export async function requestReport(payload: ReportFilterPayload) {
  const { data } = await apiClient.post<Record<string, unknown>>(endpoints.reports.export, payload);
  return data;
}
