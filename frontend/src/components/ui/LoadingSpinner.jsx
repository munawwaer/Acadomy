// src/components/ui/LoadingSpinner.jsx
const LoadingSpinner = ({ message = "جاري تحميل البيانات..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full h-64">
      <div className="relative">
        {/* الدائرة الخلفية الثابتة */}
        <div className="w-16 h-16 border-4 border-navy/10 rounded-full"></div>

        {/* الجزء المتحرك (الذهبي) */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

        {/* نقطة المركز الوامضة */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-navy rounded-full animate-pulse"></div>
      </div>

      {/* نص التحميل الأنيق */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="text-navy font-black text-sm tracking-wide animate-pulse">
          {message}
        </p>
        <div className="h-1 w-12 bg-gold/30 rounded-full overflow-hidden">
          <div className="h-full bg-gold w-1/2 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
