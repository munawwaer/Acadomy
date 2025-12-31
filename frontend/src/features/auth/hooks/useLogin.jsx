// src/features/auth/hooks/useLogin.js
import { useMutation } from "@tanstack/react-query";
import { loginRequest, getProfileRequest } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials) => {
      // 1. طلب التوكن
      const { data } = await loginRequest(credentials);
      const token = data.token;

      // 2. حفظ التوكن مؤقتاً في Zustand لكي يستخدمه الـ Interceptor في الطلب القادم
      useAuthStore.setState({ token });

      // 3. جلب البروفايل فوراً باستخدام التوكن الجديد
      const { data: userData } = await getProfileRequest();
      return { user: userData, token };
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token); // الحفظ النهائي في الخزنة
    },
  });
};
