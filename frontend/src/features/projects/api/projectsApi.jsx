import apiClient from "../../../api/client";
export const fetchProjects = async () => {
  const { data } = await apiClient.get("/v1/projects/");
  return data;
};

export const createProject = async (projectData) => {
  const { data } = await apiClient.post("/v1/projects/", projectData);
  return data;
};
export const fetchProjectById = async (id) => {
  const { data } = await apiClient.get(`/v1/projects/${id}/`);
  return data;
};

export const analyzeProjectRequest = async (projectId) => {
  const { data } = await apiClient.post(`/v1/projects/${projectId}/analyze/`);
  return data;
};

// 1. توليد المقترح الاستراتيجي
export const generateStrategyRequest = async (projectId) => {
  const { data } = await apiClient.post("/v1/intelligence/strategies/generate_proposal/", {
    project: projectId,
  });
  return data;
};

// 2. اعتماد الاستراتيجية وبناء صفحة الهبوط
export const buildLandingPageRequest = async ({ strategyId, suggestions }) => {
  const { data } = await apiClient.post(`/v1/intelligence/strategies/${strategyId}/build_landing_page/`, {
    approved_solutions: suggestions,
  });
  return data;
};

// جلب المشاريع العامة (المنشورة)
export const fetchPublicProjectsRequest = async () => {
  const { data } = await apiClient.get("/v1/projects/"); // تأكد من المسار في الباك آند
  return data;
};