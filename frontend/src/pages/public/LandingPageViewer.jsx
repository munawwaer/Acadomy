import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  usePublicLandingPage,
  useSubmitLead,
} from "../../features/builder/hooks/useBuilder";
import { getErrorMessage } from "../../utils/errorHelpers";
import { FaCheckCircle, FaArrowLeft, FaTimes, FaStar } from "react-icons/fa";

const LandingPageViewer = () => {
  const { slug } = useParams();

  // 1. جلب البيانات بالمنطق الجديد (يتضمن تتبع الزيارة آلياً)
  const {
    data: pageData,
    isLoading,
    error: fetchError,
  } = usePublicLandingPage(slug);

  // 2. هوك إرسال البيانات
  const {
    mutate: submitLead,
    isPending: submitting,
    isSuccess,
    error: submitError,
  } = useSubmitLead();

  const [leadEmail, setLeadEmail] = useState("");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [answers, setAnswers] = useState({});

  const handleInitialClick = (e) => {
    e.preventDefault();
    if (!leadEmail) return;

    const hasQuestions = pageData.questions && pageData.questions.length > 0;
    if (hasQuestions) {
      setShowQuestionModal(true);
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = () => {
    submitLead(
      {
        landing_page: pageData.id,
        name: "مؤيد جديد",
        email: leadEmail,
        answers_data: answers,
      },
      {
        onSuccess: () => setShowQuestionModal(false),
      }
    );
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // حالات التحميل والخطأ
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-gray-400">
        جاري التحميل...
      </div>
    );
  if (fetchError || !pageData)
    return (
      <div className="text-center mt-20 font-bold text-red-500">
        عذراً، الصفحة غير موجودة
      </div>
    );

  const primaryColor = pageData.theme_config?.primary || "#2563EB";
  const fontFamily = pageData.theme_config?.font_family || "Tajawal";

  return (
    <div
      className="min-h-screen bg-white text-gray-800"
      style={{ fontFamily }}
      dir="rtl"
    >
      {/* === Hero Section (نفس تصميمك بالظبط) === */}
      <header
        className="relative pt-24 pb-32 px-4 text-center text-white overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {pageData.main_headline}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
            {pageData.sub_headline}
          </p>

          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-2 md:p-3 max-w-lg mx-auto">
            {isSuccess ? (
              <div className="py-4 text-green-600 font-bold flex items-center justify-center gap-2 animate-fade-in">
                <FaCheckCircle size={24} /> شكراً لك! تم تسجيل اهتمامك بنجاح.
              </div>
            ) : (
              <form
                onSubmit={handleInitialClick}
                className="flex flex-col md:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="أدخل بريدك الإلكتروني لدعم الفكرة..."
                  className="flex-1 p-4 bg-gray-50 border-none outline-none rounded-xl focus:ring-2 focus:ring-blue-100 text-gray-700"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 md:py-0 font-bold text-white rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? "جاري الإرسال..." : "أنا مهتم!"}
                </button>
              </form>
            )}
          </div>
          {submitError && (
            <p className="text-red-200 mt-4 text-sm">
              {getErrorMessage(submitError)}
            </p>
          )}
        </div>
      </header>

      {/* === Features Section (نفس تصميمك بالظبط) === */}
      {pageData.features_list?.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            {pageData.features_list.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-4 text-blue-600">
                  <FaStar />
                </div>
                <h3 className="font-bold text-xl mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* === نافذة الأسئلة (Modal) (نفس تصميمك بالظبط) === */}
      {showQuestionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-right"
          dir="rtl"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">رأيك يهمنا!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  أجب على هذه الأسئلة البسيطة لتساعدنا.
                </p>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {pageData.questions?.map((q) => (
                <div key={q.id}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {q.question_text}
                  </label>
                  {q.field_type === "TEXT" && (
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                  )}
                  {q.field_type === "CHOICE" && (
                    <div className="space-y-2">
                      {q.options?.map((opt, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg border border-transparent hover:border-gray-200 transition"
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            value={opt}
                            onChange={(e) =>
                              handleAnswerChange(q.id, e.target.value)
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.field_type === "IMAGE_VOTE" && (
                    <div className="grid grid-cols-2 gap-3">
                      {["image_a", "image_b"].map((imgKey) => (
                        <div
                          key={imgKey}
                          onClick={() => handleAnswerChange(q.id, imgKey)}
                          className={`relative cursor-pointer border-2 rounded-xl overflow-hidden transition ${
                            answers[q.id] === imgKey
                              ? "border-blue-500 ring-2 ring-blue-100"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={q[imgKey]}
                            className="w-full h-24 object-cover"
                            alt={imgKey}
                          />
                          {answers[q.id] === imgKey && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <FaCheckCircle className="text-white text-2xl" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowQuestionModal(false)}
                className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-200 rounded-xl transition text-sm"
              >
                إلغاء
              </button>
              <button
                onClick={executeSubmit}
                disabled={submitting}
                className="px-8 py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                {submitting ? "جاري الإرسال..." : "تأكيد وإرسال"}{" "}
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageViewer;
