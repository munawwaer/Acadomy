import apiClient from "../../../api/client";
// جلب بيانات صفحة الهبوط
export const getLandingPageRequest = async (slug) => {
  const { data } = await apiClient.get(`/v1/launchpad/pages/${slug}/`);
  return data;
};

// تحديث بيانات صفحة الهبوط (PATCH)
export const updateLandingPageRequest = async ({ slug, formData }) => {
  const { data } = await apiClient.patch(
    `/v1/launchpad/pages/${slug}/`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

// تتبع الزيارات (Track Visit)
export const trackVisitRequest = (slug) =>
  apiClient.post(`/v1/launchpad/pages/${slug}/track_visit/`);

// إرسال بيانات العميل (Lead Submit)
export const submitLeadRequest = (leadData) =>
  apiClient.post("/v1/launchpad/leads/", leadData);
