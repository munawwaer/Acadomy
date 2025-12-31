import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister"; // الهوك الجديد
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
const Register = () => {
  const navigate = useNavigate();

  // استدعاء "المدير" المسؤول عن التسجيل
  const { mutate: registerAction, isPending, error: apiError } = useRegister();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    // 1. التحقق المحلي (Front-end Validation)
    if (formData.password !== formData.password_confirm) {
      setValidationError("كلمات المرور غير متطابقة");
      return;
    }

    // 2. إرسال البيانات للمدير
    registerAction(formData, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  // دمج أخطاء السيرفر وأخطاء التحقق المحلي في متغير واحد للعرض
  const displayError =
    validationError || apiError?.response?.data?.message || apiError?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy text-white px-4 py-10">
      <div className="w-full max-w-md bg-navy-dark p-8 rounded-2xl shadow-2xl border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold mb-2">إنشاء حساب جديد</h1>
          <p className="text-gray-400">ابدأ رحلة مشروعك الريادي معنا</p>
        </div>

        {displayError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="الاسم الكامل"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="كلمة المرور"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            label="تأكيد كلمة المرور"
            type="password"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
          />

          <div className="mt-6">
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري التسجيل..." : "إنشاء الحساب"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          لديك حساب بالفعل؟{" "}
          <Link
            to="/login"
            className="text-gold cursor-pointer hover:underline"
          >
            سجل دخولك هنا
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
