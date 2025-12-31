import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
// 1. استيراد المخازن والهوكس الاحترافية
import { useAuthStore } from "../../features/auth/store/authStore";
import { useDashboardData } from "../../features/dashboard/hooks/useDashboard";
import AdminSidebar from "./AdminSidebar";

import {
  FaBars,
  FaBell,
  FaAngleRight,
  FaAngleLeft,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);

  // 2. جلب بيانات المسؤول من Zustand
  const user = useAuthStore((state) => state.user);

  // 3. جلب الإشعارات الحقيقية باستخدام محركنا الموحد
  const { data: dashboardData } = useDashboardData();
  const notifications = dashboardData?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div
      className="flex h-screen bg-[#f8f9fc] font-sans overflow-hidden"
      dir="rtl"
    >
      {/* Sidebar Component (نفس كودك) */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Header - الهيدر الاحترافي */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 h-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-navy p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaBars size={20} />
            </button>

            <button
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:block text-navy p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isSidebarCollapsed ? (
                <FaAngleLeft size={20} />
              ) : (
                <FaAngleRight size={20} />
              )}
            </button>

            <h1 className="text-xl font-black text-navy hidden md:block uppercase tracking-tight">
              لوحة تحكم <span className="text-gold">النظام</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* حقل البحث */}
            <div className="hidden lg:flex items-center bg-gray-50 rounded-2xl border border-gray-200 px-4 h-11 w-72 focus-within:ring-2 focus-within:ring-gold/20 transition-all">
              <FaSearch className="text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="بحث في المستخدمين أو المشاريع..."
                className="bg-transparent border-none outline-none text-sm text-navy w-full font-medium"
              />
            </div>

            {/* Notifications Dropdown (Live Data) */}
            <NotificationsDropdown
              notifications={notifications}
              unreadCount={unreadCount}
            />

            {/* Profile - مربوط ببيانات المسؤول من Zustand */}
            <div className="flex items-center gap-3 border-r border-gray-100 pr-4 mr-2 group cursor-pointer">
              <div className="flex flex-col items-end leading-tight hidden sm:flex">
                <span className="text-xs font-black text-navy uppercase">
                  {user?.full_name?.split(" ")[0] || "Admin"}
                </span>
                <span className="text-[10px] text-gold font-bold uppercase tracking-tighter">
                  Super Admin
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-navy text-gold flex items-center justify-center font-black shadow-lg shadow-navy/20 border-2 border-white group-hover:scale-105 transition-transform duration-300">
                {user?.full_name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-navy/60 z-40 md:hidden backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </div>
  );
};

// --- مكون القائمة المنسدلة للإشعارات (نفس تصميمك الأصلي بالظبط) ---
const NotificationsDropdown = ({ notifications, unreadCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className={`relative p-2.5 rounded-xl transition-all ${
          isOpen
            ? "bg-gold/10 text-gold"
            : "text-gray-400 hover:text-navy hover:bg-gray-100"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount > 9 ? "+9" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute left-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-navy text-sm uppercase tracking-wider">
                الإشعارات
              </h3>
              <Link
                to="/admin/notifications"
                onClick={() => setIsOpen(false)}
                className="text-[10px] text-gold font-black uppercase hover:underline"
              >
                عرض السجل بالكامل
              </Link>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center gap-2">
                  <FaBell className="text-gray-100 text-4xl" />
                  <p className="text-gray-400 text-xs font-bold font-sans">
                    لا توجد تنبيهات جديدة
                  </p>
                </div>
              ) : (
                notifications.slice(0, 5).map((note) => (
                  <div
                    key={note.id}
                    className={`px-4 py-4 border-b border-gray-50 hover:bg-blue-50/20 transition cursor-pointer flex gap-4 items-start ${
                      !note.is_read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${
                        !note.is_read
                          ? "bg-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p
                        className={`text-xs leading-relaxed mb-1 ${
                          !note.is_read
                            ? "font-black text-navy"
                            : "text-gray-500"
                        }`}
                      >
                        {note.message || note.title}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                        {new Date(note.created_at).toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
