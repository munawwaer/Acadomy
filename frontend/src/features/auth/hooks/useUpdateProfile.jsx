// src/features/auth/hooks/useUpdateProfile.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileRequest } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: (updatedUser) => {
      // 1. تحديث البيانات في Zustand لكي يتغير الاسم في كل الموقع فوراً
      setAuth(updatedUser, token);
      // 2. تحديث الكاش في TanStack Query
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
