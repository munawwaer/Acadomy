import apiClient from "../../../api/client";
// 1. توليد المقترح الاستراتيجي
export const generateStrategyRequest = async (projectId) => {
  const { data } = await apiClient.post(
    "/v1/intelligence/strategies/generate_proposal/",
    {
      project: projectId,
    }
  );
  return data;
};

// 2. اعتماد الاستراتيجية وبناء صفحة الهبوط
export const buildLandingPageRequest = async ({ strategyId, suggestions }) => {
  const { data } = await apiClient.post(
    `/v1/intelligence/strategies/${strategyId}/build_landing_page/`,
    {
      approved_solutions: suggestions,
    }
  );
  return data;
};
