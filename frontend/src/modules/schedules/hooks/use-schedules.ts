import { useMutation } from '@tanstack/react-query';
import { createSchedule, type CreateSchedulePayload } from '@/modules/schedules/services/schedule-api';

export function useCreateSchedule() {
  return useMutation({
    mutationFn: (payload: CreateSchedulePayload) => createSchedule(payload),
  });
}
