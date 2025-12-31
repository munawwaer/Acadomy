import {
  FaCheckDouble,
  FaBell,
  FaEnvelopeOpenText,
  FaCheck,
} from "react-icons/fa";
import { useNotifications } from "../../hooks/useNotifications";

const AdminNotifications = () => {
  // استخدام الهوك المطور (المنطق الآن خلف الكواليس)
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    isLoading,
    refresh,
  } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-10">
      {/* رأس الصفحة - تصميمك الأصلي */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy flex items-center gap-2">
            <FaBell className="text-gold" /> مركز الإشعارات
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            إدارة وتنبيهات النظام والنشاطات الحديثة
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => refresh()}
            className="px-5 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-white hover:shadow-sm font-black text-xs uppercase tracking-wider transition-all"
          >
            تحديث القائمة
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="flex items-center gap-2 px-5 py-2 bg-navy text-white rounded-xl hover:bg-navy-light shadow-lg shadow-navy/20 font-black text-xs uppercase tracking-wider transition-all"
            >
              <FaCheckDouble /> تحديد الكل كمقروء
            </button>
          )}
        </div>
      </div>

      {/* قائمة الإشعارات - تصميمك الأصلي */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-navy border-t-gold rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold text-sm">
              جاري جلب آخر التنبيهات...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center p-8">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-6 rotate-12">
              <FaBell size={40} />
            </div>
            <h3 className="text-xl font-black text-navy mb-2">
              لا توجد إشعارات حالياً
            </h3>
            <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
              أنت مطلع على كل شيء! لا توجد تنبيهات جديدة تتطلب تدخل الإدارة.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((note) => (
              <div
                key={note.id}
                className={`p-6 flex gap-5 transition-all duration-300 hover:bg-blue-50/20 group ${
                  !note.is_read ? "bg-blue-50/40" : "opacity-80"
                }`}
              >
                {/* الأيقونة الذكية */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110 shadow-sm
                    ${
                      !note.is_read
                        ? "bg-navy text-gold"
                        : "bg-gray-100 text-gray-400"
                    }`}
                >
                  {!note.is_read ? <FaEnvelopeOpenText /> : <FaCheck />}
                </div>

                {/* المحتوى */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-2">
                    <h4
                      className={`text-base leading-none ${
                        !note.is_read
                          ? "font-black text-navy"
                          : "font-bold text-gray-500"
                      }`}
                    >
                      {note.verb || note.title || "إشعار من النظام"}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter bg-gray-50 px-2 py-1 rounded-md">
                      {new Date(note.timestamp).toLocaleString("ar-EG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      !note.is_read
                        ? "text-gray-700 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {note.description ||
                      "قام أحد المستخدمين بنشاط جديد يتطلب مراجعتك."}
                  </p>

                  {/* أزرار الإجراءات */}
                  {!note.is_read && (
                    <button
                      onClick={() => markAsRead(note.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-navy flex items-center gap-2 transition-colors border border-gold/20 px-3 py-1.5 rounded-lg hover:bg-gold/10"
                    >
                      <FaCheck size={10} /> تم الإطلاع
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
