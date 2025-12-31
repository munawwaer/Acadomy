import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjects,
  createProject,
  fetchProjectById,
  analyzeProjectRequest,
  fetchPublicProjectsRequest
} from "../api/projectsApi";

// هوك لجلب المشاريع
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
};

// هوك لإنشاء مشروع جديد
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // بعد نجاح الإضافة، أخبر TanStack Query أن بيانات المشاريع القديمة "انتهت صلاحيتها"
      // هذا سيجعل التطبيق يجلب القائمة الجديدة تلقائياً بدون تحديث الصفحة
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
export const useProject = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id, // لا يشتغل إلا إذا كان الـ ID موجوداً
  });
};
export const useAnalyzeProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analyzeProjectRequest,
    onSuccess: (data, projectId) => {
      // تحديث بيانات المشروع في الكاش فوراً لكي تظهر النتائج
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const usePublicProjects = () => {
  return useQuery({
    queryKey: ["public-projects"],
    queryFn: fetchPublicProjectsRequest,
  });
};