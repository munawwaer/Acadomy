import apiClient from "../../../api/client";
// جلب إحصائيات الصفحة (الزيارات)
export const getPageStatsRequest = async (slug) => {
  const { data } = await apiClient.get(`/v1/launchpad/pages/${slug}/`);
  return data;
};

// جلب قائمة العملاء (Leads)
export const getLeadsRequest = async (pageId) => {
  const { data } = await apiClient.get(`/v1/launchpad/leads/?landing_page=${pageId}`);
  return data;
};