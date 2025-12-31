import { useQuery } from "@tanstack/react-query";
import { fetchAdminStatsRequest } from "../api/adminApi";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStatsRequest,
    // تحديث البيانات تلقائياً كل 5 دقائق لأنها لوحة مراقبة
    refetchInterval: 5 * 60 * 1000, 
  });
};