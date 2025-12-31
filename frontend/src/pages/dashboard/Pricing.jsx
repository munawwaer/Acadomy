import { useState } from "react";
// 1. استخدام مخزن Zustand الاحترافي
import { useAuthStore } from "../../features/auth/store/authStore";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCrown,
} from "react-icons/fa";

const Pricing = () => {
  // 2. جلب بيانات المستخدم الحالية من Zustand
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  // دالة محاكاة الدفع (جاهزة للربط مع Stripe)
  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // محاكاة انتظار بوابة الدفع
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("سيتم تحويلك إلى بوابة الدفع قريباً... (هذه نسخة تجريبية لـ Idea Academy)");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      {/* رأس الصفحة - تصميمك الأصلي */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-navy mb-4 tracking-tight">
          اختر الخطة المناسبة <span className="text-gold">لطموحك</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-md mx-auto">
          ابدأ مجاناً لاختبار أفكارك، وقم بالترقية عندما تصبح مستعداً لإطلاق مشروعك باحترافية.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* --- الخطة المجانية (Free) --- */}
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm relative flex flex-col h-full hover:shadow-xl transition-shadow duration-500">
          <div className="mb-8">
            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2">البداية (Free)</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-navy">مجاناً</span>
              <span className="text-gray-400 text-sm font-bold">/ للأبد</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mb-10 leading-relaxed">
            مثالية لتجربة المنصة وبناء نموذج أولي سريع لقطاعك المختار.
          </p>

          <ul className="space-y-5 mb-12 flex-1">
            <FeatureItem active text="تحليل منافسين (3 نتائج فقط)" />
            <FeatureItem active text="بناء صفحة هبوط واحدة" />
            <FeatureItem active text="نصوص ذكاء اصطناعي أساسية" />
            <FeatureItem active text="الألوان الأساسية للمنصة" />
            <FeatureItem inactive text="إزالة شعار الأكاديمية" />
            <FeatureItem inactive text="قوالب احترافية (Modern & Pro)" />
            <FeatureItem inactive text="تصدير بيانات المهتمين (CSV)" />
          </ul>

          <button
            disabled
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest border transition-all 
              ${user?.plan_tier === "FREE" 
                ? "bg-gray-50 text-gray-400 border-gray-100 cursor-default" 
                : "bg-white text-gray-300 border-gray-100"}`}
          >
            {user?.plan_tier === "FREE" ? "بافتك الحالية" : "متاحة دائماً"}
          </button>
        </div>

        {/* --- الخطة الاحترافية (PRO) - التصميم الملكي --- */}
        <div className="bg-navy rounded-3xl p-10 border-2 border-gold shadow-2xl transform md:-translate-y-6 relative overflow-hidden flex flex-col h-full group hover:scale-[1.02] transition-all duration-500">
          
          {/* شريط التميز الذهبي */}
          <div className="absolute top-0 right-0 bg-gold text-navy font-black text-[10px] uppercase tracking-tighter px-6 py-2 rounded-bl-2xl shadow-lg animate-pulse">
            الأكثر طلباً 👑
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-black text-gold uppercase tracking-widest mb-2 flex items-center gap-2">
              <FaCrown /> المحترفين (Pro)
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">29$</span>
              <span className="text-gray-400 text-sm font-bold">/ شهرياً</span>
            </div>
          </div>

          <p className="text-blue-200/70 text-sm mb-10 leading-relaxed">
            كل ما تحتاجه لإطلاق مئات الأفكار بهوية بصرية كاملة وتصدير البيانات للعمل الحقيقي.
          </p>

          <ul className="space-y-5 mb-12 text-white flex-1">
            <FeatureItem active text="تحليل منافسين غير محدود" color="text-gold" />
            <FeatureItem active text="صفحات هبوط لا محدودة لكل مشاريعك" color="text-gold" />
            <FeatureItem active text="توليد استراتيجيات ذكية لكل فكرة" color="text-gold" />
            <FeatureItem active text="تخصيص الألوان والخطوط بالكامل" color="text-gold" />
            <FeatureItem active text="جميع القوالب العصرية والمحترفة" color="text-gold" />
            <FeatureItem active text="تصدير بيانات العملاء إلى Excel" color="text-gold" />
            <FeatureItem active text="دعم فني عبر الواتساب للمحترفين" color="text-gold" />
          </ul>

          {user?.plan_tier === "PRO" ? (
            <div className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
              <FaCheckCircle /> أنت في القمة حالياً
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gold hover:bg-yellow-500 text-navy font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all hover:shadow-gold/40 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin"></div>
                  جاري التحويل...
                </div>
              ) : "ابدأ رحلة النجاح ⚡"}
            </button>
          )}

          <p className="text-center text-[10px] text-blue-300/50 mt-6 font-bold uppercase tracking-widest">
            ضمان استرجاع الأموال خلال 14 يوماً
          </p>
        </div>
      </div>
    </div>
  );
};

// مكون مساعد للقائمة (نفس تصميمك)
const FeatureItem = ({ text, inactive, color = "text-navy" }) => (
  <li className={`flex items-center gap-4 text-sm font-medium ${inactive ? "text-gray-400 opacity-40 grayscale" : ""}`}>
    {inactive ? (
      <FaTimesCircle className="shrink-0 text-gray-300" />
    ) : (
      <FaCheckCircle className={`shrink-0 ${color}`} />
    )}
    <span className="leading-none">{text}</span>
  </li>
);

export default Pricing;