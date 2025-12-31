
const ProjectSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 h-full animate-pulse">
      {/* 1. العنوان والحالة */}
      <div className="flex justify-between items-start mb-4">
        <div className="h-5 w-1/2 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-12 bg-gray-100 rounded-md"></div>
      </div>

      {/* 2. الوصف */}
      <div className="space-y-2 mb-6">
        <div className="h-3 w-full bg-gray-100 rounded"></div>
        <div className="h-3 w-4/5 bg-gray-100 rounded"></div>
      </div>

      {/* 3. شريط التقدم */}
      <div className="mb-6">
        <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gray-200 h-full w-1/3"></div>
        </div>
      </div>

      {/* 4. التذييل */}
      <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50">
        <div className="h-7 w-16 bg-gray-100 rounded-md"></div>
        <div className="flex gap-3">
          <div className="h-4 w-8 bg-gray-100 rounded"></div>
          <div className="h-4 w-8 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
