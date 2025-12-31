import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useCreateProject } from "../../features/projects/hooks/useProjects";
import { getErrorMessage } from "../../utils/errorHelpers"; // استيراد المساعد الذي برمجناه سابقاً
import {
  FaArrowRight,
  FaLightbulb,
  FaLayerGroup,
  FaPenFancy,
  FaChevronDown,
  FaRocket,
} from "react-icons/fa";

const NewProject = () => {
  const navigate = useNavigate();

  // الحالة المحلية للنموذج
  const [formData, setFormData] = useState({
    title: "",
    raw_description: "",
    target_sector: "GENERAL",
  });

  // استخدام الهوك الاحترافي (TanStack Query)
  const { mutate, isPending, error: apiError } = useCreateProject();

  const sectors = [
    { value: "GENERAL", label: "عام / غير محدد" },
    { value: "TECH", label: "تطبيق / تقنية" },
    { value: "FOOD", label: "مطاعم وكافيهات" },
    { value: "REAL_ESTATE", label: "عقارات ومقاولات" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // إرسال البيانات
    mutate(formData, {
      onSuccess: () => {
        // التوجيه لصفحة المشاريع بعد النجاح
        navigate("/projects");
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. زر العودة */}
      <div className="mb-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-navy transition-all text-sm font-bold group"
        >
          <FaArrowRight className="group-hover:-translate-x-1 transition-transform duration-300" />
          العودة لقائمة المشاريع
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* 2. رأس البطاقة (التصميم الذهبي والكحلي) */}
        <div className="bg-gradient-to-l from-navy/5 to-transparent p-10 border-b border-gray-50">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-white shadow-lg rounded-2xl text-gold border border-gray-50 animate-pulse">
              <FaLightbulb size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-navy mb-2">
                إطلاق مشروع جديد
              </h1>
              <p className="text-gray-500 leading-relaxed font-medium">
                حوّل فكرتك إلى واقع. املأ البيانات وسيقوم محرك الذكاء الاصطناعي
                بتحليلها فوراً.
              </p>
            </div>
          </div>
        </div>

        {/* 3. عرض رسائل الخطأ بشكل آمن */}
        {apiError && (
          <div className="mx-10 mt-8 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <span className="font-bold">تنبيه من النظام:</span>{" "}
            {getErrorMessage(apiError)}
          </div>
        )}

        {/* 4. النموذج (Form) */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* عنوان المشروع */}
          <div className="space-y-2">
            <Input
              label="اسم الفكرة أو المشروع"
              name="title"
              placeholder="مثال: منصة لتبادل المهارات البرمجية..."
              value={formData.title}
              onChange={handleChange}
              required
              className="focus:ring-gold/20"
            />
          </div>

          {/* قطاع المشروع (Select) */}
          <div className="relative group">
            <label className="block text-navy font-black mb-3 text-sm flex items-center gap-2">
              <FaLayerGroup className="text-gold" />
              قطاع المشروع المستهدف
            </label>

            <div className="relative">
              <select
                name="target_sector"
                value={formData.target_sector}
                onChange={handleChange}
                className="w-full p-4 pl-12 pr-4 rounded-2xl bg-gray-50 border border-gray-200 text-navy font-bold focus:outline-none focus:bg-white focus:ring-4 focus:ring-gold/10 focus:border-gold transition-all appearance-none cursor-pointer"
              >
                {sectors.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gold transition-colors">
                <FaChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* تفاصيل الفكرة (Textarea) */}
          <div className="space-y-2">
            <label className="block text-navy font-black mb-3 text-sm flex items-center gap-2">
              <FaPenFancy className="text-gold" />
              اشرح فكرتك بعمق
            </label>
            <textarea
              name="raw_description"
              rows="6"
              placeholder="ما هي المشكلة؟ وكيف يحلها مشروعك؟"
              value={formData.raw_description}
              onChange={handleChange}
              required
              className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-200 text-navy placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-gold/10 focus:border-gold transition-all resize-none leading-relaxed font-medium"
            ></textarea>
          </div>

          {/* زر الإرسال */}
          <div className="pt-6 border-t border-gray-50 flex items-center justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto min-w-[220px] py-4 bg-navy hover:bg-navy-light text-white rounded-2xl shadow-xl shadow-navy/20 flex items-center justify-center gap-3 group"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>جاري المعالجة...</span>
                </>
              ) : (
                <>
                  <span>إطلاق المشروع الآن</span>
                  <FaRocket className="group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] transition-transform" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
