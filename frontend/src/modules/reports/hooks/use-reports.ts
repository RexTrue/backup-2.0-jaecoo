import { useMutation } from '@tanstack/react-query';
import { requestReport, type ReportFilterPayload } from '@/modules/reports/services/report-api';

export function useRequestReport() {
  return useMutation({
    mutationFn: (payload: ReportFilterPayload) => requestReport(payload),
  });
}
