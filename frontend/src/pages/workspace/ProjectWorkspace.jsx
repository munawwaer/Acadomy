import { useParams, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useProject } from "../../features/projects/hooks/useProjects";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  FaChartPie,
  FaBrain,
  FaPaintBrush,
  FaUsers,
  FaArrowRight,
  FaExternalLinkAlt,
  FaLock,
} from "react-icons/fa";

const ProjectWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. جلب البيانات باستخدام الهوك الاحترافي
  const { data: project, isLoading, error, refetch } = useProject(id);

  if (isLoading) return <LoadingSpinner message="جاري تجهيز مساحة العمل..." />;

  if (error || !project) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#f8f9fc]">
      {/* --- شريط التبويبات العلوي (Workspace Header) --- */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 h-16 flex-shrink-0 z-20">
        {/* اليمين: العنوان والرجوع */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/projects")}
            className="text-gray-400 hover:text-navy hover:bg-gray-50 p-2.5 rounded-xl transition-all"
          >
            <FaArrowRight size={16} />
          </button>

          <div className="flex flex-col border-r border-gray-100 pr-4">
            <h1 className="text-sm font-black text-navy truncate max-w-[200px]">
              {project.title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-tighter ${getStatusColor(
                  project.stage
                )}`}
              >
                {project.stage_display}
              </span>
            </div>
          </div>
        </div>

        {/* الأوسط: التبويبات الذكية */}
        <div className="flex items-center h-full gap-2">
          <WorkspaceTab to="" icon={<FaChartPie />} label="التحليل" />
          <WorkspaceTab
            to="strategy"
            icon={<FaBrain />}
            label="الاستراتيجية"
            // disabled={project.stage === "IDEA"}
          />
          <WorkspaceTab
            to="builder"
            icon={<FaPaintBrush />}
            label="البناء"
            // disabled={
            //   !["STRATEGY_SET", "LANDING_PAGE", "PUBLISHED"].includes(
            //     project.stage
            //   )
            // }
          />
          <WorkspaceTab
            to="leads"
            icon={<FaUsers />}
            label="النتائج"
            // disabled={!project.landing_page_slug}
          />
        </div>

        {/* اليسار: المعاينة */}
        <div className="flex items-center gap-3">
          {project.landing_page_slug && (
            <a
              href={`/p/${project.landing_page_slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[11px] font-black text-white bg-navy hover:bg-navy-light px-4 py-2 rounded-xl transition-all shadow-lg shadow-navy/10"
            >
              معاينة الصفحة <FaExternalLinkAlt size={10} />
            </a>
          )}
        </div>
      </div>

      {/* --- منطقة المحتوى (Dynamic Outlet) --- */}
      <main className="flex-1 overflow-y-auto bg-[#f8f9fc] p-6">
        <div className="max-w-6xl mx-auto h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* نمرر المشروع وحدث التحديث للمكونات الأبناء */}
          <Outlet context={{ project, onUpdate: refetch }} />
        </div>
      </main>
    </div>
  );
};

// مكون التبويب المحسن (UI)
const WorkspaceTab = ({ to, icon, label, disabled }) => (
  <NavLink
    to={to}
    end={to === ""}
    className={({ isActive }) => `
      relative h-full flex items-center gap-2 px-6 transition-all duration-300 text-xs font-black border-b-4
      ${
        disabled
          ? "text-gray-300 cursor-not-allowed border-transparent grayscale opacity-50"
          : isActive
          ? "border-gold text-navy bg-gold/5"
          : "border-transparent text-gray-400 hover:text-navy hover:bg-gray-50"
      }
    `}
  >
    <span>{icon}</span>
    <span className="whitespace-nowrap uppercase tracking-wider">{label}</span>
    {disabled && (
      <FaLock size={8} className="absolute top-2 left-2 opacity-50" />
    )}
  </NavLink>
);

const getStatusColor = (stage) => {
  switch (stage) {
    case "PUBLISHED":
      return "bg-green-50 text-green-600 border-green-100";
    case "IDEA":
      return "bg-gray-100 text-gray-500 border-gray-200";
    default:
      return "bg-blue-50 text-blue-600 border-blue-100";
  }
};

export default ProjectWorkspace;
