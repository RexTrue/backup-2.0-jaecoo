import { ServiceStatus } from '@/common/types/domain';

export type DashboardKpiCard = { label: string; value: string; tone: string; chip?: string; href: string };
export type DashboardFocusCard = { label: string; value: string; chip?: string; tone: string; href: string };
export type DashboardWorkOrderItem = { wo: string; plate: string; model: string; status: ServiceStatus; time: string };
export type DashboardTimelineItem = { time: string; text: string; status: ServiceStatus };
export type DashboardPriorityItem = { title: string; status: ServiceStatus; note: string; href: string };

export type DashboardConfig = {
  eyebrow: string;
  heading: string;
  heroImage: string;
  focusCards: DashboardFocusCard[];
  kpis: DashboardKpiCard[];
  statusCounts: Record<ServiceStatus, number>;
  timeline: DashboardTimelineItem[];
  activeList: DashboardWorkOrderItem[];
  priorityList: DashboardPriorityItem[];
};
