import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// 1. استيراد مخزن Zustand الاحترافي
import { useAuthStore } from "../../features/auth/store/authStore";
import { useGuestUsage } from "../../hooks/useGuestUsage";
import { FaLock } from "react-icons/fa";

const AuthGuardButton = ({ children, onClick, className, ...props }) => {
  // 2. جلب حالة المستخدم من Zustand
  const user = useAuthStore((state) => state.user);

  const { hasRemainingTries, incrementUsage, remainingTries } = useGuestUsage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    // الحالة 1: المستخدم مسجل دخول -> نفذ العملية فوراً
    if (user) {
      if (onClick) onClick(e);
      return;
    }

    // الحالة 2: زائر ولديه محاولات مجانية -> خصم محاولة ونفذ
    if (hasRemainingTries) {
      incrementUsage(); // زيادة استهلاك المحاولات
      if (onClick) onClick(e);

      // تنبيه بسيط للمستخدم (يمكنك استبداله بـ Toast لاحقاً)
      alert(`متبقي لديك ${remainingTries - 1} محاولات مجانية قبل التسجيل`);
      return;
    }

    // الحالة 3: زائر وانتهت محاولاته -> إظهار نافذة القفل
    setShowModal(true);
  };

  const handleLoginRedirect = () => {
    navigate("/login", { state: { from: location } });
  };

  return (
    <>
      <button onClick={handleClick} className={className} {...props}>
        {children}
      </button>

      {/* نافذة القفل - التصميم الأصلي كما هو بالظبط */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md animate-in fade-in duration-300 px-4">
          <div
            className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border-t-[6px] border-gold relative overflow-hidden"
            dir="rtl"
          >
            {/* أيقونة القفل الفخمة */}
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner animate-bounce">
              <FaLock />
            </div>

            <h3 className="text-2xl font-black text-navy mb-3 tracking-tight">
              استنفدت المحاولات المجانية
            </h3>

            <p className="text-gray-500 mb-8 text-sm leading-relaxed font-medium">
              لقد قمت بتجربة الأداة{" "}
              <span className="text-navy font-bold">3 مرات</span>. للحصول على
              تحليل غير محدود وحفظ مشاريعك للعودة إليها لاحقاً، يرجى إنشاء حسابك
              المجاني.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full py-4 bg-navy text-gold font-black uppercase tracking-widest rounded-2xl hover:bg-navy-light transition-all shadow-xl shadow-navy/20 active:scale-95"
              >
                إنشاء حساب الآن
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 text-gray-400 hover:text-navy text-xs font-black uppercase tracking-tighter transition-colors"
              >
                سأفعل ذلك لاحقاً
              </button>
            </div>

            {/* زخرفة خفيفة في زاوية المودال */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gold/5 rounded-full"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthGuardButton;
