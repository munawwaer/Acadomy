import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
// استيراد المخازن الجديدة (Zustand)
import { useAuthStore } from "../../features/auth/store/authStore";
import { useThemeStore } from "../../stores/useThemeStore";
// استيراد هوك الإشعارات (سنعتمد على TanStack Query)
import { useDashboardData } from "../../features/dashboard/hooks/useDashboard";

import {
  FaRocket,
  FaSignOutAlt,
  FaUser,
  FaHome,
  FaBell,
  FaMoon,
  FaSun,
  FaExclamationTriangle,
  FaStar,
  FaGem,
  FaServer,
  FaShieldAlt,
} from "react-icons/fa";

const DashboardLayout = () => {
  const navigate = useNavigate();

  // 1. جلب بيانات المستخدم وتسجيل الخروج من Zustand
  const { user, logout } = useAuthStore();

  // 2. جلب حالة الثيم من مخزن الثيم
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  // 3. جلب الإشعارات الحقيقية من نفس هوك الداشبورد (لتقليل طلبات الـ API)
  const { data } = useDashboardData();
  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // دالة تنسيق الإشعارات
  const getNotificationStyle = (type) => {
    const styles = {
      STRATEGY_GENERATED: { icon: <FaRocket />, color: "bg-purple-500" },
      FIRST_LEAD: { icon: <FaStar />, color: "bg-yellow-400" },
      SYSTEM_ALERT: { icon: <FaServer />, color: "bg-red-500" },
      DEFAULT: { icon: <FaBell />, color: "bg-gray-400" },
    };
    return styles[type] || styles.DEFAULT;
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
      dir="rtl"
    >
      {/* Navbar الاحترافي */}
      <nav
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-navy border-navy-dark"
        } text-white shadow-lg sticky top-0 z-50 h-16`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          {/* اليمين: الشعار والروابط */}
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <div className="bg-gold p-1.5 rounded-lg text-navy shadow-lg shadow-gold/20 animate-pulse">
                <FaRocket size={18} />
              </div>
              <span className="font-black text-lg hidden sm:block">
                أكاديمية <span className="text-gold">تأهيل</span> الأفكار
              </span>
            </div>

            <div className="hidden md:flex gap-2">
              <NavLink to="/dashboard" end className={navLinkStyles}>
                <FaHome size={14} /> مشاريعي
              </NavLink>
              <NavLink to="/profile" className={navLinkStyles}>
                <FaUser size={14} /> ملفي
              </NavLink>
            </div>
          </div>

          {/* اليسار: الأدوات */}
          <div className="flex items-center gap-4">
            {/* زر الثيم */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 transition-colors"
            >
              {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>

            {/* الإشعارات */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-white/10 relative transition-all"
              >
                <FaBell
                  size={18}
                  className={unreadCount > 0 ? "text-gold" : "text-gray-300"}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-navy">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* القائمة المنسدلة للإشعارات */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div
                    className={`absolute left-0 mt-4 w-80 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-in fade-in zoom-in duration-200 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="p-4 border-b border-gray-100 font-bold text-navy flex justify-between">
                      <span className={isDarkMode ? "text-gold" : ""}>
                        الإشعارات الأخيرة
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          جديد
                        </span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 text-xs">
                          لا يوجد إشعارات
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50/50 flex gap-3 ${
                              !n.is_read ? "bg-blue-50/20" : ""
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] ${
                                getNotificationStyle(n.event_type).color
                              }`}
                            >
                              {getNotificationStyle(n.event_type).icon}
                            </div>
                            <div>
                              <p
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-200" : "text-gray-800"
                                } ${!n.is_read ? "font-bold" : ""}`}
                              >
                                {n.title}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {n.message}
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

            <div className="h-6 w-px bg-white/20 hidden sm:block"></div>

            {/* الملف الشخصي والخروج */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-left items-end">
                <span className="text-xs font-bold">
                  {user?.full_name?.split(" ")[0]}
                </span>
                <span className="text-[9px] text-gold font-black uppercase tracking-tighter">
                  {user?.plan_tier}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <FaSignOutAlt size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// تنسيقات الروابط المشتركة
const navLinkStyles = ({ isActive }) =>
  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
    isActive
      ? "bg-white/10 text-gold shadow-inner"
      : "text-gray-300 hover:text-white hover:bg-white/5"
  }`;

export default DashboardLayout;
