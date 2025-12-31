// src/utils/errorHelpers.js

export const getErrorMessage = (error) => {
  // 1. إذا لم يكن هناك رد من السيرفر أصلاً (مشكلة إنترنت مثلاً)
  if (!error?.response) {
    return "لا يوجد اتصال بالخادم، تأكد من تشغيل الباك آند أو اتصالك بالإنترنت.";
  }

  const serverErrors = error.response.data;

  // 2. إذا أرسل الباك آند "رسالة" واضحة باسم 'message' أو 'detail'
  if (serverErrors.message) return serverErrors.message;
  if (serverErrors.detail) return serverErrors.detail;

  // 3. إذا كان الخطأ خاص بـ Django Rest Framework (مثل non_field_errors)
  if (serverErrors.non_field_errors) {
    return serverErrors.non_field_errors[0];
  }

  // 4. إذا كان الخطأ متعلق بحقل معين (مثل الإيميل موجود مسبقاً)
  // نأخذ أول مفتاح خطأ ونعرض رسالته
  const errorKeys = Object.keys(serverErrors);
  if (errorKeys.length > 0) {
    const firstError = serverErrors[errorKeys[0]];
    // إذا كان الخطأ عبارة عن مصفوفة نأخذ أول عنصر، وإلا نأخذه كما هو
    return Array.isArray(firstError) ? firstError[0] : firstError;
  }

  // 5. إذا فشل كل ما سبق، نرجع نصاً افتراضياً
  return "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.";
};
