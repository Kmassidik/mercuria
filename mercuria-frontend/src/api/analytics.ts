import { analyticsClient } from "@/api/client";
import type {
  DailyMetric,
  HourlyMetric,
  MetricsSummary,
  UserAnalytics,
  UserSnapshot,
} from "@/types";

interface DataResponse<T> {
  data: T;
}

export const analyticsApi = {
  getDailyMetrics: (startDate: string, endDate: string) =>
    analyticsClient
      .get<DataResponse<DailyMetric[]>>("/api/v1/analytics/daily", {
        params: { start_date: startDate, end_date: endDate },
      })
      .then((r) => r.data.data),

  getHourlyMetrics: (startTime: string, endTime: string) =>
    analyticsClient
      .get<DataResponse<HourlyMetric[]>>("/api/v1/analytics/hourly", {
        params: { start_time: startTime, end_time: endTime },
      })
      .then((r) => r.data.data),

  getSummary: (startDate: string, endDate: string, period = "daily") =>
    analyticsClient
      .get<DataResponse<MetricsSummary>>("/api/v1/analytics/summary", {
        params: { start_date: startDate, end_date: endDate, period },
      })
      .then((r) => r.data.data),

  // FIXED: Changed from /api/v1/analytics/users/${userId} to /api/v1/analytics/me
  // User ID is extracted from JWT token on the backend
  getUserAnalytics: (startDate: string, endDate: string) =>
    analyticsClient
      .get<DataResponse<UserAnalytics>>("/api/v1/analytics/me", {
        params: { start_date: startDate, end_date: endDate },
      })
      .then((r) => r.data.data),

  // FIXED: Changed from /api/v1/analytics/users/${userId}/snapshots to /api/v1/analytics/me/snapshots
  // User ID is extracted from JWT token on the backend
  getUserSnapshots: (startDate: string, endDate: string) =>
    analyticsClient
      .get<DataResponse<UserSnapshot[]>>("/api/v1/analytics/me/snapshots", {
        params: { start_date: startDate, end_date: endDate },
      })
      .then((r) => r.data.data),
};
