import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import axios from "axios"; // نستخدم axios مباشرة أو الـ client تبعك
import { useNavigate } from "react-router-dom";

const GoogleLoginBtn = () => {
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // 1. حصلنا على التوكن من جوجل (Access Token)
        console.log("Google Token:", tokenResponse.access_token);

        // 2. نرسله للباك اند الخاص بنا ليتحقق منه ويسجل الدخول
        // ملاحظة: هذا الرابط سنبنيه في الخطوة التالية في جانغو
        const res = await axios.post(
          "http://127.0.0.1:8000/api/v1/core/auth/google/",
          {
            access_token: tokenResponse.access_token,
          }
        );

        // 3. نجاح! الباك اند رد علينا ببيانات المستخدم والتوكن الخاص بنظامنا
        console.log("Login Success:", res.data);

        // هنا احفظ التوكن في الـ LocalStorage او الـ Context كما تفعل في اللوجن العادي
        localStorage.setItem("token", res.data.access_token);

        // توجيه للداشبورد
        navigate("/dashboard");
      } catch (err) {
        console.error("Google Login Failed:", err);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  return (
    <button
      onClick={() => googleLogin()}
      type="button" // مهم عشان ما يعمل submit لل فورم
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-bold py-3 px-4 rounded-xl transition shadow-sm mt-4"
    >
      <FaGoogle className="text-red-500" />
      الدخول باستخدام جوجل
    </button>
  );
};

export default GoogleLoginBtn;
