import apiClient from "../../../api/client";
// جلب إحصائيات الإدارة الشاملة
export const fetchAdminStatsRequest = async () => {
  const { data } = await apiClient.get("/v1/core/admin/stats/");
  return data;
};