// import { useState, useEffect, useCallback } from "react";
// import client from "../api/client";

// export const useNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // دالة جلب الإشعارات
//   const fetchNotifications = useCallback(async () => {
//     try {
//       const res = await client.get("/v1/notifications/");
//       setNotifications(res.data);
//       // حساب غير المقروءة
//       const count = res.data.filter((n) => !n.is_read).length;
//       setUnreadCount(count);
//     } catch (error) {
//       console.error("Failed to fetch notifications", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // دالة تحديد الكل كمقروء
//   const markAllAsRead = async () => {
//     try {
//       await client.post("/v1/notifications/mark_all_read/");
//       // تحديث الحالة محلياً لتوفير طلب جديد
//       setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
//       setUnreadCount(0);
//     } catch (error) {
//       console.error("Error marking all read", error);
//     }
//   };

//   // دالة تحديد إشعار واحد كمقروء
//   const markAsRead = async (id) => {
//     try {
//       await client.post(`/v1/notifications/${id}/mark_read/`);
//       setNotifications((prev) =>
//         prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
//       );
//       setUnreadCount((prev) => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error("Error marking read", error);
//     }
//   };

//   // تشغيل الجلب عند التحميل
//   useEffect(() => {
//     fetchNotifications();

//     // يمكن تفعيل polling كل دقيقة للتحديث التلقائي
//     const interval = setInterval(fetchNotifications, 60000);
//     return () => clearInterval(interval);
//   }, [fetchNotifications]);

//   return {
//     notifications,
//     unreadCount,
//     loading,
//     markAllAsRead,
//     markAsRead,
//     refresh: fetchNotifications,
//   };
// };
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotificationsRequest,
  markNotificationAsReadRequest,
  markAllNotificationsAsReadRequest,
} from "../features/dashboard/api/dashboardApi";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // 1. جلب البيانات
  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationsRequest,
    refetchInterval: 30000, // تحديث تلقائي كل 30 ثانية
  });

  // 2. تحديث إشعار واحد
  const markAsRead = useMutation({
    mutationFn: markNotificationAsReadRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }); // لتحديث العداد في الهيدر
    },
  });

  // 3. تحديث الكل
  const markAllAsRead = useMutation({
    mutationFn: markAllNotificationsAsReadRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    refresh: refetch,
    markAsRead: (id) => markAsRead.mutate(id),
    markAllAsRead: () => markAllAsRead.mutate(),
  };
};
