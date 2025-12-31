import { Link } from "react-router-dom";
import {
  FaPlus,
  FaRocket,
  FaUsers,
  FaChartPie,
  FaBell,
  FaBrain,
  FaArrowLeft,
  FaMagic,
  FaStar,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useDashboardData } from "../../features/dashboard/hooks/useDashboard";
import { useAuthStore } from "../../features/auth/store/authStore";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const DashboardHome = () => {
  // 1. جلب البيانات من الهوك (إدارة الحالة آلياً عبر TanStack Query)
  const { data, isLoading, error, refetch } = useDashboardData();

  // 2. جلب بيانات المستخدم من Zustand Store
  const user = useAuthStore((state) => state.user);

  // حالة التحميل
  if (isLoading) return <LoadingSpinner message="جاري تجهيز لوحة القيادة..." />;

  // حالة الخطأ (تم تعديل التصميم ليكون منطقياً للخطأ وليس للتحميل)
  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4 text-center">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-sm border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl">
            <FaExclamationTriangle />
          </div>
          <h2 className="text-xl font-bold text-navy">
            عذراً، حدث خطأ أثناء جلب البيانات
          </h2>
          <p className="text-gray-500 text-sm max-w-xs">
            تأكد من اتصالك بالإنترنت أو حاول تحديث الصفحة مرة أخرى.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-navy text-white px-6 py-2 rounded-lg font-bold hover:bg-navy-light transition-all"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );

  // استخراج البيانات (بعد التأكد من عدم وجود تحميل أو خطأ)
  const { stats, notifications } = data;

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-10 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. رأس الصفحة الترحيبي (تم تنظيف التكرار) */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-navy mb-2 flex items-center gap-2">
              صباح الخير، {user?.full_name || user?.name || "المستخدم"}{" "}
              <span className="text-2xl animate-bounce">👋</span>
            </h1>
            <p className="text-gray-500 font-medium">
              إليك نظرة عامة على أداء مشاريعك اليوم ومستجدات النظام.
            </p>
          </div>
          <Link
            to="/new-project"
            className="group bg-navy text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:bg-navy-light hover:shadow-lg hover:shadow-navy/20"
          >
            <span>مشروع جديد</span>
            <div className="bg-white/20 p-1.5 rounded-md group-hover:rotate-90 transition-transform">
              <FaPlus size={14} />
            </div>
          </Link>
        </header>

        {/* 2. بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="المشاريع النشطة"
            value={stats.total_projects}
            icon={<FaRocket />}
            color="bg-blue-500"
            subText="مشروع قيد العمل والتحليل"
          />
          <StatCard
            title="إجمالي المهتمين (Leads)"
            value={stats.total_leads}
            icon={<FaUsers />}
            color="bg-emerald-500"
            subText="عملاء محتملون تم تسجيلهم"
          />
          <StatCard
            title="تحليلات النظام"
            value={stats.total_views}
            icon={<FaChartPie />}
            color="bg-purple-500"
            subText="إجمالي زيارات صفحات الهبوط"
          />
        </div>

        {/* 3. منطقة المحتوى (المشاريع + التحديثات) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* اليمين: المشاريع الحالية */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                <h2 className="text-xl font-bold text-navy flex items-center gap-3">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold">
                    <FaRocket size={18} />
                  </div>
                  مشاريعك الحالية
                </h2>
                {stats.total_projects > 0 && (
                  <Link
                    to="/projects"
                    className="text-sm font-bold text-gray-400 hover:text-navy flex items-center gap-2 transition-colors group"
                  >
                    عرض الكل{" "}
                    <FaArrowLeft
                      size={10}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                  </Link>
                )}
              </div>

              {stats.total_projects === 0 ? (
                <div
                  className="border-2 border-dashed border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center h-[320px] hover:border-gold/40 transition-colors group cursor-pointer"
                  onClick={() => (window.location.href = "/new-project")}
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 group-hover:bg-gold/10 group-hover:text-gold transition-all duration-500">
                    <FaMagic size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    لا توجد مشاريع حتى الآن
                  </h3>
                  <p className="text-gray-400 text-sm max-w-xs mb-8">
                    ابدأ رحلتك بإنشاء مشروعك الأول وسنقوم بمساعدتك في تحليله
                    بالكامل.
                  </p>
                  <span className="text-navy font-black text-sm border-b-2 border-gold pb-1 px-4 hover:bg-gold/5 transition-colors">
                    ابدأ الآن
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-10 bg-gray-50/50 rounded-2xl text-center border border-gray-100">
                    <p className="text-gray-500 font-medium">
                      لديك {stats.total_projects} مشاريع نشطة.
                    </p>
                    <Link
                      to="/projects"
                      className="inline-block mt-4 text-navy font-bold hover:text-gold transition-colors"
                    >
                      انتقل لصفحة المشاريع للتفاصيل
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* اليسار: آخر التحديثات (Timeline) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-navy flex items-center gap-2">
                🔔 آخر التحديثات
              </h2>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            </div>

            <div className="relative border-r-2 border-gray-100 mr-3 space-y-8 pb-4">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400 pr-6 py-4">
                  لا توجد إشعارات جديدة حتى الآن.
                </p>
              ) : (
                notifications
                  .slice(0, 5)
                  .map((note, index) => (
                    <TimelineItem
                      key={index}
                      icon={getNotificationIcon(note.data?.event_type)}
                      title={note.title}
                      desc={note.message}
                      time={note.created_at}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- المكونات الفرعية (Sub-components) ---

const StatCard = ({ title, value, icon, color, subText }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
    <div className="flex justify-between items-start mb-6">
      <div
        className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}
      >
        <span className={`${color.replace("bg-", "text-")}`}>{icon}</span>
      </div>
    </div>
    <h3 className="text-4xl font-black text-navy mb-2 tracking-tight">
      {value}
    </h3>
    <p className="text-gray-500 font-bold text-sm mb-2">{title}</p>
    <p className="text-xs text-gray-300 font-medium">{subText}</p>
  </div>
);

const TimelineItem = ({ icon, title, desc, time }) => {
  const dateObj = new Date(time);
  const formattedTime = dateObj.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = dateObj.toLocaleDateString("ar-EG");

  return (
    <div className="relative pr-8 group">
      <div className="absolute -right-[9px] top-1 bg-white p-1">
        <div className="w-3.5 h-3.5 rounded-full bg-gray-200 border-4 border-white group-hover:bg-gold group-hover:scale-125 transition-all shadow-sm"></div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h4 className="text-sm font-black text-navy group-hover:text-gold transition-colors">
            {title}
          </h4>
        </div>
        <div className="text-[11px] text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3 group-hover:bg-white group-hover:shadow-sm transition-all">
          {desc}
        </div>
        <div className="text-[9px] text-gray-400 font-bold flex gap-3 px-1">
          <span>{formattedDate}</span>
          <span className="text-gray-200">•</span>
          <span>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

// --- دوال مساعدة ---
const getNotificationIcon = (type) => {
  switch (type) {
    case "FIRST_LEAD":
      return <FaUsers className="text-emerald-500 text-xs" />;
    case "READY_TO_LAUNCH":
      return <FaRocket className="text-gold text-xs" />;
    case "STRATEGY_GENERATED":
      return <FaBrain className="text-purple-500 text-xs" />;
    case "WELCOME_USER":
      return <FaStar className="text-yellow-400 text-xs" />;
    default:
      return <FaBell className="text-gray-400 text-xs" />;
  }
};

export default DashboardHome;
