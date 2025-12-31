// 1. استبدال الاستيرادات القديمة بالجديدة
import { useAuthStore } from "../../../features/auth/store/authStore";
import { useAnalyzeProject } from "../../../features/projects/hooks/useProjects";
import {
  FaSearch,
  FaStar,
  FaExclamationTriangle,
  FaChartLine,
  FaGlobe,
  FaLightbulb,
  FaUsers,
  FaCommentAlt,
  FaRegClock,
  FaMagic,
  FaCheckCircle,
  FaEye,
} from "react-icons/fa";

// استبقاء المكونات الفرعية التي تستخدمها أنت (مثل AuthGuardButton و useGuestUsage)
import AuthGuardButton from "../../auth/AuthGuardButton";
import { useGuestUsage } from "../../../hooks/useGuestUsage";

const AnalysisStage = ({ project, onUpdate }) => {
  // 2. استخدام الهوك الجديد للتحليل
  const { mutate: analyze, isPending } = useAnalyzeProject();

  // 3. جلب المستخدم من Zustand
  const user = useAuthStore((state) => state.user);

  // 4. التقرير يأتي مباشرة من بيانات المشروع الممررة
  const report = project.research_report || null;

  const { remainingTries, MAX_FREE_TRIES } = useGuestUsage();

  const handleAnalyze = () => {
    // 5. تنفيذ التحليل عبر الهوك
    analyze(project.id, {
      onSuccess: () => {
        if (onUpdate) onUpdate(); // تحديث مساحة العمل بعد النجاح
      },
    });
  };

  // --- الحالة 1: شاشة البدء (نفس تصميمك تماماً) ---
  if (project.stage === "IDEA" || !report) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-gray-100">
              <FaSearch className="text-2xl text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            تحليل السوق والمنافسين
          </h2>

          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            قم بتحليل سوق{" "}
            <span className="text-blue-600 font-semibold">
              {project.target_sector}
            </span>{" "}
            واكتشف الفرص المتاحة أمام مشروعك
            <span className="block text-gray-700 font-medium mt-1">
              "{project.title}"
            </span>
          </p>

          <div className="mb-8">
            <AuthGuardButton
              onClick={handleAnalyze}
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-shadow flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحليل...
                </>
              ) : (
                <>
                  <FaMagic />
                  ابدأ التحليل الآن
                </>
              )}
            </AuthGuardButton>
          </div>

          <div className="space-y-4 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <FaRegClock className="text-gray-400" />
              <span>يستغرق التحليل 5-10 ثوانٍ</span>
            </div>
            {!user && (
              <div className="flex items-center justify-center gap-2">
                <FaEye className="text-gray-400" />
                <span>متبقي {remainingTries} تحليل مجاني</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- الحالة 2: لوحة النتائج (نفس تصميمك تماماً) ---
  return (
    <div className="space-y-6">
      {/* شريط الزوار */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg border border-blue-200 flex items-center justify-center">
                <span className="text-blue-600 font-bold">
                  {remainingTries}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  تحليلات متبقية
                </h4>
                <p className="text-gray-600 text-xs">
                  {remainingTries} من أصل {MAX_FREE_TRIES} عملية تحليل
                </p>
              </div>
            </div>
            <div className="w-24">
              <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${(remainingTries / MAX_FREE_TRIES) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* العنوان الرئيسي */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-800">نتائج التحليل</h1>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {project.target_sector}
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          تحليل شامل للسوق بناءً على مشروعك "{project.title}"
        </p>
      </div>

      {/* الشبكة الرئيسية (المنافسين) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-600 text-sm" />
              </div>
              <h2 className="font-semibold text-gray-800">المنافسين</h2>
            </div>
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
              {(report.competitors_data || []).length} نتيجة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(report.competitors_data || []).map((comp, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-600">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {comp.name}
                      </h3>
                      <p className="text-gray-600 text-xs line-clamp-2 mt-1">
                        {comp.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.round(comp.rating || 0)
                              ? "fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    {comp.rating && (
                      <span className="text-xs text-gray-500 mt-1">
                        {comp.rating}/5
                      </span>
                    )}
                  </div>
                </div>
                {comp.raw_reviews?.[0] && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-gray-600 text-xs italic bg-gray-50 p-2 rounded italic">
                      "{comp.raw_reviews[0]}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* الشريط الجانبي (المشاكل والملخص) */}
        <div className="space-y-6">
          <div className="bg-white border border-red-50 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500" />
              <h3 className="font-semibold text-gray-800 text-sm">
                المشاكل المكتشفة
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {(report.detected_problems || []).map((problem, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 bg-red-50/50 rounded border border-red-100 text-xs text-gray-700"
                >
                  {problem}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-400" /> ملخص التحليل
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-gray-400">عدد المنافسين</span>
                <span>{(report.competitors_data || []).length}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">قطاع السوق</span>
                <span>{project.target_sector}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisStage;
