import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateStrategyRequest,
  buildLandingPageRequest,
} from "../api/strategyApi";

export const useGenerateStrategy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateStrategyRequest,
    onSuccess: (_, projectId) => {
      // تحديث بيانات المشروع ليعرف أن الاستراتيجية أصبحت موجودة
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};

export const useBuildLandingPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: buildLandingPageRequest,
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};
