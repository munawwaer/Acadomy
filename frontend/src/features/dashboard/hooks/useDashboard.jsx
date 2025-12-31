import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getNotifications } from "../api/dashboardApi";

export const useDashboardData = () => {
  // نجلب الإحصائيات والإشعارات بالتوازي
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const [stats, notifications] = await Promise.all([
        getDashboardStats(),
        getNotifications(),
      ]);
      return { stats, notifications };
    },
  });
};