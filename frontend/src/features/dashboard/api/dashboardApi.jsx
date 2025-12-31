import apiClient from "../../../api/client";
export const getDashboardStats = async () => {
  const { data } = await apiClient.get("v1/core/dashboard/stats/");
  return data;
};

export const getNotifications = async () => {
  const { data } = await apiClient.get("/v1/notifications/");
  return data;
};
// جلب كافة الإشعارات
export const fetchNotificationsRequest = async () => {
  const { data } = await apiClient.get("/v1/notifications/");
  return data;
};

// تحديد إشعار واحد كمقروء
export const markNotificationAsReadRequest = async (id) => {
  const { data } = await apiClient.post(
    `/v1/notifications/${id}/mark-as-read/`
  );
  return data;
};

// تحديد الكل كمقروء
export const markAllNotificationsAsReadRequest = async () => {
  const { data } = await apiClient.post("/v1/notifications/mark-all-read/");
  return data;
};
