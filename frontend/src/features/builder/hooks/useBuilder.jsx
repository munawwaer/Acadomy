import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLandingPageRequest,
  updateLandingPageRequest,
  submitLeadRequest,
  trackVisitRequest,
} from "../api/builderApi";

export const useLandingPage = (slug) => {
  return useQuery({
    queryKey: ["landing-page", slug],
    queryFn: () => getLandingPageRequest(slug),
    enabled: !!slug,
  });
};

export const useSaveLandingPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLandingPageRequest,
    onSuccess: (data) => {
      // تحديث الكاش بالبيانات الجديدة فوراً
      queryClient.setQueryData(["landing-page", data.slug], data);
    },
  });
};

// هوك جلب الصفحة (موجود سابقاً ولكن سنضيف له التتبع)
export const usePublicLandingPage = (slug) => {
  return useQuery({
    queryKey: ["public-page", slug],
    queryFn: async () => {
      const data = await getLandingPageRequest(slug);
      // تتبع الزيارة في الخلفية فور النجاح
      trackVisitRequest(slug).catch(() => {});
      return data;
    },
    enabled: !!slug,
  });
};

// هوك إرسال العميل الجديد
export const useSubmitLead = () => {
  return useMutation({
    mutationFn: submitLeadRequest,
  });
};
