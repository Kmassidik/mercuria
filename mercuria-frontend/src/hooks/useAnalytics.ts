import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api";

export function useDailyMetrics(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["analytics-daily", startDate, endDate],
    queryFn: () => analyticsApi.getDailyMetrics(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useHourlyMetrics(startTime: string, endTime: string) {
  return useQuery({
    queryKey: ["analytics-hourly", startTime, endTime],
    queryFn: () => analyticsApi.getHourlyMetrics(startTime, endTime),
    enabled: !!startTime && !!endTime,
  });
}

export function useMetricsSummary(
  startDate: string,
  endDate: string,
  period = "daily"
) {
  return useQuery({
    queryKey: ["analytics-summary", startDate, endDate, period],
    queryFn: () => analyticsApi.getSummary(startDate, endDate, period),
    enabled: !!startDate && !!endDate,
  });
}

// FIXED: Removed userId parameter - backend extracts user from JWT token
export function useUserAnalytics(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["user-analytics", startDate, endDate],
    queryFn: () => analyticsApi.getUserAnalytics(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

// FIXED: Removed userId parameter - backend extracts user from JWT token
export function useUserSnapshots(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["user-snapshots", startDate, endDate],
    queryFn: () => analyticsApi.getUserSnapshots(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}
