import { useQuery } from "@tanstack/react-query";
import { getPageStatsRequest, getLeadsRequest } from "../api/LeadsStageApi";
export const useLeadsData = (slug) => {
  // 1. جلب إحصائيات الصفحة
  const statsQuery = useQuery({
    queryKey: ["page-stats", slug],
    queryFn: () => getPageStatsRequest(slug),
    enabled: !!slug,
  });

  const pageId = statsQuery.data?.id;

  // 2. جلب العملاء (يعتمد على نجاح الطلب الأول)
  const leadsQuery = useQuery({
    queryKey: ["leads-list", pageId],
    queryFn: () => getLeadsRequest(pageId),
    enabled: !!pageId,
  });

  return {
    pageStats: statsQuery.data,
    leads: leadsQuery.data || [],
    isLoading: statsQuery.isLoading || leadsQuery.isLoading,
    error: statsQuery.error || leadsQuery.error,
  };
};
