import apiClient from "../../../api/client";
export const loginRequest = (credentials) =>
  apiClient.post("/v1/core/login/", credentials);

export const registerRequest = (formData) =>
  apiClient.post("/v1/core/register/", formData);

export const getProfileRequest = () => apiClient.get("/v1/core/profile/");

export const updateProfileRequest = async (updatedData) => {
  const { data } = await apiClient.patch("/v1/core/profile/", updatedData);
  return data;
};