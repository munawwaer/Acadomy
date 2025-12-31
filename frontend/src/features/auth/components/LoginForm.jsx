import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // أضفنا Link
import { useLogin } from "../hooks/useLogin";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { FaSignInAlt, FaExclamationTriangle } from "react-icons/fa"; // أيقونات جمالية
import GoogleLoginBtn from "./GoogleLoginBtn";
const Login = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // تحديد وجهة العودة (إذا جاء من صفحة محمية نعيده إليها، وإلا نذهب للداشبورد)
  const from = "/dashboard";

  const [formData, setFormData] = useState({ email: "", password: "" });

  const { mutate: loginAction, isPending, error } = useLogin();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // البيانات هنا (formData) هي Object
    // سيتم تحويلها لـ JSON تلقائياً بواسطة Axios في الـ Hook
    const payload = {
      username: formData.email, // نضع قيمة الإيميل داخل حقل اليوزرنيم
      password: formData.password,
    };
    loginAction(payload, {
      onSuccess: () => {
        // التوجيه مع replace لمنع العودة لصفحة الدخول بالزر الخلفي

        navigate(from, { replace: true });
      },
    });
  };

  // دالة مساعدة لاستخراج نص الخطأ
  const getErrorMessage = () => {
    if (!error) return null;
    // دعم صيغ مختلفة للأخطاء قد تأتي من الباك اند
    return (
      error.response?.data?.detail || // خطأ عام (مثل JWT)
      error.response?.data?.message || // خطأ مخصص
      error.response?.data?.non_field_errors?.[0] || // أخطاء Django
      "فشل تسجيل الدخول، تأكد من البيانات واتصال الإنترنت"
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy text-white px-4 relative overflow-hidden">
      {/* خلفية جمالية خفيفة */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-900 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-navy-dark/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/10 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            مرحباً بعودتك 👋
          </h1>
          <p className="text-gray-400 text-sm">
            أدخل بياناتك للمتابعة إلى مساحة العمل
          </p>
        </div>

        {/* عرض رسائل الخطأ */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 animate-fade-in">
            <FaExclamationTriangle className="text-red-500 shrink-0" />
            <span>{getErrorMessage()}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="البريد الإلكتروني"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email" // 👈 مهم جداً للمتصفح
            required
          />

          <div>
            <Input
              label="كلمة المرور"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password" // 👈 مهم جداً للمتصفح
              required
            />
            {/* رابط نسيت كلمة المرور (اختياري) */}
            <div className="text-left mt-2">
              <Link
                to="/forgot-password"
                className="text-xs text-gray-400 hover:text-gold transition"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full justify-center py-3 shadow-lg shadow-gold/20"
            >
              {isPending ? (
                "جاري التحقق..."
              ) : (
                <span className="flex items-center gap-2">
                  دخول للمنصة <FaSignInAlt />
                </span>
              )}
            </Button>
          </div>

          {/* الروابط السفلية */}
          <div className="mt-6 text-center text-sm text-gray-400 border-t border-white/10 pt-6">
            ليس لديك حساب بعد؟{" "}
            <Link
              to="/register"
              className="text-gold font-bold hover:underline hover:text-yellow-400 transition"
            >
              أنشئ حساباً جديداً
            </Link>
          </div>
        </form>
        <div className="mt-4">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">أو</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <GoogleLoginBtn />
        </div>
      </div>
    </div>
  );
};

export default Login;
