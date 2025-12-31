import { useState } from "react";
// الاستيرادات الجديدة للمنطق
import { useAuthStore } from "../../../features/auth/store/authStore";
import {
  useLandingPage,
  useSaveLandingPage,
} from "../../../features/builder/hooks/useBuilder";
import { getErrorMessage } from "../../../utils/errorHelpers";

import Button from "../../../components/ui/Button";
import AlertDialog from "../../../components/ui/AlertDialog";
import {
  FaMobileAlt,
  FaDesktop,
  FaExternalLinkAlt,
  FaPalette,
  FaHeading,
  FaLayerGroup,
  FaQuestionCircle,
  FaLock,
  FaCrown,
  FaFont,
  FaImage,
  FaTrash,
  FaPlus,
  FaSave,
  FaBrush,
  FaMagic,
  FaUndo,
  FaShieldAlt,
} from "react-icons/fa";

// 1. المكون الحاوي (لجلب البيانات)
const BuilderStage = ({ project }) => {
  const { data: initialData, isLoading } = useLandingPage(
    project.landing_page_slug
  );

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">جاري تحميل مصمم الصفحة...</p>
        </div>
      </div>
    );
  }

  if (!initialData)
    return (
      <div className="p-10 text-center text-gray-500">
        يجب إنشاء الصفحة أولاً من خلال مرحلة الاستراتيجية.
      </div>
    );

  return (
    <LandingPageEditor
      key={initialData.id}
      project={project}
      initialData={initialData}
    />
  );
};

// 2. مكون المحرر (نفس تصميمك الأصلي بالظبط)
const LandingPageEditor = ({ project, initialData }) => {
  const { user } = useAuthStore();
  const isPro = user?.plan_tier !== "FREE";
  const { mutate: savePage, isPending: saving } = useSaveLandingPage();

  // الحالة تبدأ من البيانات الحقيقية فوراً
  const [pageData, setPageData] = useState({
    ...initialData,
    theme_config: {
      template_id: "simple",
      font_family: "Tajawal",
      font_size: "normal",
      primary: "#3B82F6",
      brand_name: project.title,
      ...initialData.theme_config,
    },
    questions: initialData.questions || [],
  });

  const [previewMode, setPreviewMode] = useState("desktop");
  const [activeTab, setActiveTab] = useState("design");
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  // --- نفس الدوال التي برمجتها أنت ---
  const showAlert = (title, message, type = "info", onConfirm = null) => {
    setAlertDialog({ isOpen: true, title, message, type, onConfirm });
  };
  const closeAlert = () => setAlertDialog({ ...alertDialog, isOpen: false });
  const handleChange = (e) =>
    setPageData({ ...pageData, [e.target.name]: e.target.value });
  const handleConfigChange = (key, value) =>
    setPageData({
      ...pageData,
      theme_config: { ...pageData.theme_config, [key]: value },
    });

  const handleThemeChange = (color, isPremium) => {
    if (isPremium && !isPro) {
      showAlert(
        "ميزة للمحترفين",
        "هذا اللون متاح فقط في باقة المحترفين. قم بالترقية للوصول إلى جميع الألوان والميزات المتقدمة.",
        "info"
      );
      return;
    }
    handleConfigChange("primary", color);
  };

  const handleTemplateChange = (template) => {
    if (template.type === "PRO" && !isPro) {
      showAlert(
        "تصميم للمحترفين",
        "هذا التصميم متاح فقط في باقة المحترفين. قم بالترقية للوصول إلى جميع القوالب والميزات المتقدمة.",
        "info"
      );
      return;
    }
    handleConfigChange("template_id", template.id);
  };

  const handleAddQuestion = () => {
    if (!isPro && pageData.questions.length >= 3) {
      showAlert(
        "حد أقصى للأسئلة",
        "الخطة المجانية تسمح بـ 3 أسئلة فقط. قم بالترقية لإضافة المزيد من الأسئلة.",
        "warning"
      );
      return;
    }
    const newQ = {
      tempId: Date.now(),
      question_text: "سؤال جديد",
      field_type: "TEXT",
      options: [],
      order: pageData.questions.length,
      required: true,
    };
    setPageData({ ...pageData, questions: [...pageData.questions, newQ] });
  };

  const handleUpdateQuestion = (index, key, value) => {
    const updatedQuestions = [...pageData.questions];
    updatedQuestions[index][key] = value;
    setPageData({ ...pageData, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (index) => {
    showAlert(
      "حذف السؤال",
      "هل أنت متأكد من رغبتك في حذف هذا السؤال؟ لا يمكن التراجع عن هذه العملية.",
      "warning",
      () => {
        const updatedQuestions = [...pageData.questions];
        updatedQuestions.splice(index, 1);
        setPageData({ ...pageData, questions: updatedQuestions });
      }
    );
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("main_headline", pageData.main_headline);
    formData.append("sub_headline", pageData.sub_headline);
    formData.append("theme_config", JSON.stringify(pageData.theme_config));
    pageData.questions.forEach((q, index) => {
      if (q.id) formData.append(`questions[${index}]id`, q.id);
      formData.append(`questions[${index}]question_text`, q.question_text);
      formData.append(`questions[${index}]field_type`, q.field_type);
      formData.append(`questions[${index}]order`, index);
      formData.append(`questions[${index}]required`, q.required);
      formData.append(
        `questions[${index}]options`,
        JSON.stringify(q.options || [])
      );
      if (q.image_a instanceof File)
        formData.append(`questions[${index}]image_a`, q.image_a);
      if (q.image_b instanceof File)
        formData.append(`questions[${index}]image_b`, q.image_b);
    });

    savePage(
      { slug: project.landing_page_slug, formData },
      {
        onSuccess: () =>
          showAlert(
            "تم الحفظ بنجاح",
            "تم حفظ جميع التغييرات بنجاح.",
            "success"
          ),
        onError: (err) =>
          showAlert("فشل في الحفظ", getErrorMessage(err), "error"),
      }
    );
  };

  const COLORS_FREE = [
    { name: "أزرق محيط", value: "#3B82F6" },
    { name: "بنفسجي", value: "#8B5CF6" },
    { name: "أخضر زمردي", value: "#10B981" },
  ];
  const COLORS_PRO = [
    { name: "أزرق داكن", value: "#1E40AF" },
    { name: "بنفسجي ملكي", value: "#7C3AED" },
    { name: "أحمر كرزي", value: "#DC2626" },
    { name: "أسود كلاسيكي", value: "#111827" },
    { name: "برتقالي ناري", value: "#EA580C" },
  ];
  const FONT_OPTIONS = [
    { id: "Tajawal", name: "تجوال", category: "عربي" },
    { id: "Cairo", name: "كايرو", category: "عربي" },
    { id: "IBM Plex Sans Arabic", name: "IBM Plex", category: "عربي" },
    { id: "Inter", name: "إنتر", category: "لاتيني" },
  ];
  const TEMPLATES = [
    {
      id: "simple",
      name: "بسيط وأنيق",
      description: "تصميم نظيف مع تركيز على المحتوى",
      type: "FREE",
      icon: "🔄",
    },
    {
      id: "modern",
      name: "عصري وجريء",
      description: "تصميم معاصر مع تأثيرات مرئية",
      type: "PRO",
      icon: "⚡",
    },
    {
      id: "professional",
      name: "احترافي",
      description: "مظهر رسمي وموثوق",
      type: "PRO",
      icon: "👔",
    },
  ];

  return (
    <>
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={closeAlert}
        {...alertDialog}
        showCancel={alertDialog.type === "warning"}
        confirmText={alertDialog.type === "warning" ? "نعم، متأكد" : "موافق"}
        cancelText="إلغاء"
      />

      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
        {/* شريط التحكم العلوي (نفس تصميمك) */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FaBrush className="text-white text-sm" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">مصمم الصفحة</h2>
                  <p className="text-xs text-gray-500">{project.title}</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {["design", "content", "form"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                      activeTab === tab
                        ? "bg-white shadow text-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {tab === "design" ? (
                      <>
                        <FaPalette className="inline mr-2" />
                        التصميم
                      </>
                    ) : tab === "content" ? (
                      <>
                        <FaHeading className="inline mr-2" />
                        المحتوى
                      </>
                    ) : (
                      <>
                        <FaQuestionCircle className="inline mr-2" />
                        النموذج
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-2 rounded-lg ${
                  previewMode === "mobile"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaMobileAlt />
              </button>
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-2 rounded-lg ${
                  previewMode === "desktop"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaDesktop />
              </button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                {saving ? (
                  "جاري الحفظ..."
                ) : (
                  <>
                    <FaSave /> حفظ
                  </>
                )}
              </Button>
              <a
                href={`/p/${pageData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
              >
                <FaExternalLinkAlt />
              </a>
            </div>
          </div>
        </div>

        {/* جسم المصمم (نفس تصميمك) */}
        <div className="flex-1 flex overflow-hidden">
          {/* الشريط الجانبي */}
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-1">
                إعدادات{" "}
                {activeTab === "design"
                  ? "التصميم"
                  : activeTab === "content"
                  ? "المحتوى"
                  : "النموذج"}
              </h3>
              <p className="text-xs text-gray-500">قم بتخصيص مظهر صفحتك</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* تبويب التصميم */}
              {activeTab === "design" && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">
                        الألوان
                      </h4>
                      <FaPalette className="text-gray-400 text-sm" />
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {COLORS_FREE.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => handleThemeChange(c.value, false)}
                          className={`w-10 h-10 rounded-lg border-2 ${
                            pageData.theme_config.primary === c.value
                              ? "border-blue-500 scale-105 shadow-md"
                              : "border-gray-200"
                          }`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                    {!isPro && (
                      <div className="bg-amber-50 p-2 rounded-lg border border-amber-100 flex justify-between items-center">
                        <span className="text-[10px] text-amber-700 font-bold uppercase">
                          Pro Colors
                        </span>
                        <FaCrown className="text-amber-500" />
                      </div>
                    )}
                    <div className="grid grid-cols-5 gap-3">
                      {COLORS_PRO.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => handleThemeChange(c.value, true)}
                          className={`group relative w-10 h-10 rounded-lg border-2 ${
                            pageData.theme_config.primary === c.value
                              ? "border-blue-500"
                              : "border-gray-200"
                          }`}
                          style={{ backgroundColor: c.value }}
                          disabled={!isPro}
                        >
                          {!isPro && (
                            <FaLock className="absolute inset-0 m-auto text-white/50 text-[10px]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">
                        قوالب التصميم
                      </h4>
                      <FaLayerGroup className="text-gray-400 text-sm" />
                    </div>
                    {TEMPLATES.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleTemplateChange(t)}
                        className={`p-3 rounded-lg border cursor-pointer ${
                          pageData.theme_config.template_id === t.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center font-medium text-sm">
                          <span>
                            {t.icon} {t.name}
                          </span>
                          {t.type === "PRO" && (
                            <FaLock className="text-gray-400" size={10} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* تبويب المحتوى */}
              {activeTab === "content" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      العنوان الرئيسي
                    </label>
                    <textarea
                      name="main_headline"
                      value={pageData.main_headline}
                      onChange={handleChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      الوصف
                    </label>
                    <textarea
                      name="sub_headline"
                      value={pageData.sub_headline}
                      onChange={handleChange}
                      rows="5"
                      className="w-full p-3 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* تبويب النموذج */}
              {activeTab === "form" && (
                <div className="space-y-4">
                  {pageData.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex justify-between mb-2">
                        <input
                          value={q.question_text}
                          onChange={(e) =>
                            handleUpdateQuestion(
                              idx,
                              "question_text",
                              e.target.value
                            )
                          }
                          className="w-full border-b border-gray-100 text-sm font-bold outline-none"
                        />
                        <button
                          onClick={() => handleDeleteQuestion(idx)}
                          className="text-red-400"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                      <select
                        value={q.field_type}
                        onChange={(e) =>
                          handleUpdateQuestion(
                            idx,
                            "field_type",
                            e.target.value
                          )
                        }
                        className="w-full p-2 text-xs bg-gray-50 rounded mt-2"
                      >
                        <option value="TEXT">نص قصير</option>
                        <option value="CHOICE">اختيار من متعدد</option>
                        <option value="IMAGE_VOTE">تصويت بالصور</option>
                      </select>
                    </div>
                  ))}
                  <button
                    onClick={handleAddQuestion}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold text-xs"
                  >
                    + إضافة سؤال
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* منطقة المعاينة (نفس تصميمك) */}
          <main className="flex-1 overflow-auto p-10 flex justify-center bg-gray-100/50">
            <div
              className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden ${
                previewMode === "mobile"
                  ? "w-[360px] rounded-[2.5rem] border-[8px] border-gray-900 h-[640px]"
                  : "w-full max-w-5xl rounded-2xl h-fit min-h-[600px]"
              }`}
            >
              <div
                className="h-full overflow-y-auto no-scrollbar"
                style={{ fontFamily: pageData.theme_config.font_family }}
              >
                <div
                  className={`p-8 text-center ${
                    pageData.theme_config.template_id === "simple"
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                >
                  <div className="text-[10px] font-black uppercase mb-8 tracking-widest">
                    {pageData.theme_config.brand_name}
                  </div>
                  <h1 className="text-3xl font-bold mb-4">
                    {pageData.main_headline}
                  </h1>
                  <p className="opacity-90 mb-8">{pageData.sub_headline}</p>
                  <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold shadow-lg">
                    ابدأ الآن
                  </button>
                </div>
                <div className="p-8">
                  <div className="max-w-md mx-auto space-y-6">
                    {pageData.questions.map((q, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                          {q.question_text}
                        </label>
                        <input
                          disabled
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                          placeholder="..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default BuilderStage;
