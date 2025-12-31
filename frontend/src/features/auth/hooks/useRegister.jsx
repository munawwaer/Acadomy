// src/features/auth/hooks/useRegister.js
import { useMutation } from "@tanstack/react-query";
import { registerRequest, getProfileRequest } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (formData) => {
      // 1. إرسال بيانات التسجيل للباك آند
      const { data: regData } = await registerRequest(formData);
      const token = regData.token;

      // 2. تحديث التوكن في الـ Store مؤقتاً
      // لكي يتمكن الـ apiClient (Interceptor) من استخدامه في طلب البروفايل
      useAuthStore.setState({ token });

      // 3. جلب بيانات البروفايل (بناءً على طلبك في الكود السابق)
      const { data: userData } = await getProfileRequest();

      return { user: userData, token };
    },
    onSuccess: (data) => {
      // 4. حفظ البيانات النهائية في الخزنة (الاسم، الإيميل، والتوكن)
      setAuth(data.user, data.token);
    },
    onError: (error) => {
      // هنا نمسك أي خطأ سواء من التسجيل أو من جلب البروفايل
      console.error("Registration Flow Error:", error.response?.data);
    },
  });
};
