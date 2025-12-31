import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEye,
  FaUserFriends,
  FaChevronLeft,
  FaRocket,
} from "react-icons/fa";
import { useProjects } from "../../features/projects/hooks/useProjects";
import ProjectSkeleton from "../../features/projects/components/ProjectSkeleton";
const ProjectsList = () => {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        {/* رأس الصفحة (ثابت ليعطي إحساساً بالاستقرار) */}
        <div className="h-10 w-48 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>

        {/* عرض 8 بطاقات هيكلية كمثال أثناء التحميل */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, index) => (
            <ProjectSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  const calculateProgress = (signups) => {
    const target = 40; // الهدف
    return Math.min(((signups || 0) / target) * 100, 100);
  };

  if (error)
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
    </div>;

  return (
    // أضفنا p-8 لإبعاد المحتوى عن الحواف
    <div className="animate-fade-in p-6 md:p-8">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy flex items-center gap-2">
            <FaRocket className="text-gold" /> مشاريعي
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            نظرة عامة على تقدم أفكارك
          </p>
        </div>
        <Link
          to="/new-project"
          className="bg-gold hover:bg-yellow-500 text-navy-dark text-sm font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg"
        >
          <FaPlus size={12} /> مشروع جديد
        </Link>
      </div>

      {/* المحتوى */}
      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">ابدأ رحلتك</h3>
          <p className="text-gray-500 mb-6 text-xs">أنشئ مشروعك الأول الآن</p>
          <Link
            to="/new-project"
            className="text-white bg-navy hover:bg-navy-dark px-5 py-2.5 rounded-lg text-sm font-bold shadow-md"
          >
            إنشاء مشروع
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {projects.map((project) => {
            const views = project.landing_page?.views_count || 0;
            const leads = project.landing_page?.current_signups || 0;
            const progress = calculateProgress(leads);

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4 flex flex-col h-full group relative"
              >
                {/* 1. العنوان والحالة */}
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="text-base font-bold text-navy group-hover:text-gold transition-colors line-clamp-1"
                    title={project.title}
                  >
                    {project.title}
                  </h3>
                  <StatusBadge
                    stage={project.stage}
                    label={project.stage_display}
                  />
                </div>

                {/* 2. الوصف المختصر */}
                <p className="text-gray-400 text-[11px] mb-4 line-clamp-2 leading-relaxed h-8">
                  {project.raw_description || "لا يوجد وصف."}
                </p>

                {/* 3. شريط التقدم الصغير */}
                <div className="mb-4">
                  <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* 4. التذييل: زر الدخول + الأيقونات */}
                <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50">
                  {/* زر الدخول */}
                  <Link
                    to={`/project/${project.id}`}
                    className="text-xs font-bold text-navy bg-blue-50 hover:bg-navy hover:text-white px-3 py-1.5 rounded-md transition flex items-center gap-1"
                  >
                    فتح <FaChevronLeft size={8} />
                  </Link>

                  {/* الإحصائيات (أيقونات فقط) */}
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <div
                      className="flex items-center gap-1 text-gray-400"
                      title="عدد الزوار"
                    >
                      <FaEye className="text-gray-300" />
                      <span>{views}</span>
                    </div>
                    <div
                      className="flex items-center gap-1 text-green-600"
                      title="عدد المهتمين"
                    >
                      <FaUserFriends className="text-green-500" />
                      <span>{leads}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// شارة الحالة (صغيرة)
const StatusBadge = ({ stage, label }) => {
  let colors = "bg-gray-100 text-gray-500";
  if (stage === "PUBLISHED")
    colors = "bg-green-50 text-green-600 border border-green-100";
  if (stage === "STRATEGY_SET")
    colors = "bg-blue-50 text-blue-600 border border-blue-100";
  if (stage === "LANDING_PAGE")
    colors = "bg-purple-50 text-purple-600 border border-purple-100";

  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors}`}>
      {label || stage}
    </span>
  );
};

export default ProjectsList;
