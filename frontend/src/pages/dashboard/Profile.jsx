import { useState } from "react";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useUpdateProfile } from "../../features/auth/hooks/useUpdateProfile";
import { getErrorMessage } from "../../utils/errorHelpers";
import {
  FaUserCircle,
  FaCrown,
  FaEnvelope,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();

  // حالات محلية للتحكم في التعديل
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProfile(formData, {
      onSuccess: () => setIsEditing(false),
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* الغلاف السفلي */}
        <div className="h-40 bg-navy relative">
          <div className="absolute -bottom-12 right-10 p-1.5 bg-white rounded-full shadow-lg">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl text-gray-300 border-4 border-white">
              <FaUserCircle />
            </div>
          </div>
        </div>

        <div className="pt-16 pb-10 px-10">
          {/* رأس الصفحة مع زر التعديل */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <h1 className="text-3xl font-black text-navy flex items-center gap-3">
                    {user?.full_name}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-300 hover:text-gold transition-colors text-lg"
                    >
                      <FaEdit />
                    </button>
                  </h1>
                  <p className="text-gray-400 font-medium flex items-center gap-2 mt-2">
                    <FaEnvelope /> {user?.email}
                  </p>
                </>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4 max-w-sm">
                  <Input
                    label="الاسم الكامل"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ full_name: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="bg-navy text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
                    >
                      {isPending ? (
                        "جاري الحفظ..."
                      ) : (
                        <>
                          <FaCheck /> حفظ
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
                    >
                      <FaTimes /> إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* شارة الخطة */}
            <div className="flex items-center gap-3 bg-gold/5 text-navy px-5 py-2.5 rounded-2xl border border-gold/20 shadow-sm">
              <FaCrown className="text-gold animate-bounce" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  الحساب الحالي
                </span>
                <span className="font-black text-sm">
                  {user?.plan_tier === "FREE"
                    ? "الباقة المجانية"
                    : "باقة المحترفين"}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs font-bold">
              {getErrorMessage(error)}
            </div>
          )}

          <hr className="mb-8 border-gray-50" />

          {/* الإعدادات */}
          <div className="grid grid-cols-1 gap-4">
            <div className="group flex justify-between items-center p-5 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gold/20 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-navy shadow-sm">
                  <FaShieldAlt className="text-gray-400 group-hover:text-navy" />
                </div>
                <div>
                  <p className="font-black text-sm text-navy">كلمة المرور</p>
                  <p className="text-[11px] text-gray-400">
                    حافظ على أمان حسابك بتغييرها دورياً
                  </p>
                </div>
              </div>
              <button className="text-xs font-black text-navy bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-navy hover:text-white transition-all">
                تغيير
              </button>
            </div>

            <div className="group flex justify-between items-center p-5 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gold/20 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gold shadow-sm">
                  <FaCrown />
                </div>
                <div>
                  <p className="font-black text-sm text-navy">
                    الاشتراك والترقية
                  </p>
                  <p className="text-[11px] text-gray-400">
                    احصل على ميزات الذكاء الاصطناعي غير المحدودة
                  </p>
                </div>
              </div>
              <button className="text-xs font-black text-white bg-gold px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all">
                ترقية الآن
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-gray-300 font-mono tracking-widest uppercase">
          Unique User ID: {user?.id}
        </p>
      </div>
    </div>
  );
};

// أيقونات إضافية محتاجة استيراد
import { FaShieldAlt } from "react-icons/fa";

export default Profile;
