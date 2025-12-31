import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePublicProjects } from "../../features/projects/hooks/useProjects";
import {
  FaSearch,
  FaArrowLeft,
  FaRocket,
  FaLightbulb,
  FaChartLine,
  FaBars,
  FaTimes,
  FaStar,
} from "react-icons/fa";

const PublicDashboardHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. جلب البيانات الحقيقية
  const { data: projects = [], isLoading } = usePublicProjects();

  // 2. تصفية البيانات (Logic يبقى كما هو لكن على بيانات حقيقية)
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" ||
        project.target_sector === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, projects]);

  return (
    <div
      dir="rtl"
      className="font-sans text-navy bg-gray-50 min-h-screen flex flex-col"
    >
      {/* ======================= 1. الهيدر (نفس تصميمك) ======================= */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-navy text-gold rounded-lg flex items-center justify-center font-black text-xl">
              A
            </div>
            <span className="text-xl font-bold text-navy hidden md:block">
              أكاديمية تأهيل الأفكار
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            <Link to="/" className="text-navy hover:text-gold transition">
              الرئيسية
            </Link>
            <a href="#projects" className="hover:text-navy transition">
              تصفح المشاريع
            </a>
            <a href="#services" className="hover:text-navy transition">
              خدماتنا
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-navy font-bold hover:text-gold transition text-sm"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/new-project"
              className="px-6 py-2.5 bg-navy text-white rounded-lg font-bold text-sm hover:bg-navy-light transition shadow-lg shadow-navy/20"
            >
              ابدأ مشروعك
            </Link>
          </div>

          <button
            className="md:hidden text-navy p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      {/* ======================= 2. قسم الهيرو (نفس تصميمك) ======================= */}
      <section className="relative bg-navy text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            حول فكرتك إلى <span className="text-gold">واقع ملموس</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
            المنصة المتكاملة لرواد الأعمال: من تحليل الفكرة، بناء الاستراتيجية،
            وحتى دراسة السوق والمنافسين.
          </p>

          <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
              <FaSearch className="text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="ابحث عن فكرة، مشروع، أو قطاع..."
                className="w-full bg-transparent py-4 outline-none text-navy placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-gold text-navy font-black px-8 py-4 md:py-0 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2">
              بحث <FaArrowLeft className="rotate-180" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================= 3. قسم تصفح المشاريع ======================= */}
      <section id="projects" className="py-16 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-navy mb-2 flex items-center gap-3">
              <FaRocket className="text-gold" /> أحدث المشاريع الملهمة
            </h2>
            <p className="text-gray-500 font-medium">
              استكشف الأفكار الريادية التي يتم بناؤها الآن داخل الأكاديمية
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {["ALL", "التقنية", "العقارات", "المطاعم"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-black transition-all border ${
                  selectedCategory === cat
                    ? "bg-navy text-white border-navy shadow-lg"
                    : "bg-white text-gray-400 border-gray-100 hover:border-navy"
                }`}
              >
                {cat === "ALL" ? "الكل" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* عرض حالة التحميل أو البيانات */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">
                  لا توجد نتائج تطابق بحثك حالياً
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* باقي الأقسام (Services, Footer) تبقى كما هي بالظبط */}
      <section
        id="services"
        className="bg-white py-20 border-t border-gray-100"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-navy mb-4">
              لماذا تختار منصتنا؟
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">
              نوفر لك الأدوات التي يحتاجها كل رائد أعمال لتحويل فكرته إلى مشروع
              ناجح، مدعومة بالذكاء الاصطناعي.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<FaLightbulb />}
              title="تحليل عميق للفكرة"
              desc="خوارزميات ذكية تقيم نقاط القوة والضعف في فكرتك وتعطيك تقريراً شاملاً."
            />
            <ServiceCard
              icon={<FaChartLine />}
              title="دراسة السوق"
              desc="بيانات حقيقية عن المنافسين وحجم السوق المستهدف لمشروعك."
            />
            <ServiceCard
              icon={<FaRocket />}
              title="خطة تنفيذية"
              desc="نحول الاستراتيجيات إلى مهام يومية وخطوات عملية قابلة للتطبيق."
            />
          </div>
        </div>
      </section>

      <footer className="bg-navy text-white py-16 border-t border-white/10 mt-auto">
        {/* كود الفوتر الخاص بك */}
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-gold font-black text-2xl mb-4">
            أكاديمية تأهيل الأفكار
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-10">
            المنصة الأولى عربياً لدعم رواد الأعمال في مراحل التأسيس الأولى
            باستخدام أحدث التقنيات.
          </p>
          <div className="flex justify-center gap-6 text-sm font-bold text-gray-500">
            <Link to="/" className="hover:text-gold">
              الرئيسية
            </Link>
            <Link to="/projects" className="hover:text-gold">
              تصفح المشاريع
            </Link>
            <Link to="/login" className="hover:text-gold">
              دخول الأعضاء
            </Link>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-gray-600 text-xs">
            © 2025 جميع الحقوق محفوظة لـ Idea Academy.
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- المكونات الفرعية (معدلة لتقبل البيانات الحقيقية) ---

const ProjectCard = ({ project }) => (
  <Link
    to={`/p/${project.landing_page_slug || project.id}`}
    className="block group h-full"
  >
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
      <div className="h-44 bg-gradient-to-br from-navy to-navy-light relative p-6">
        <span className="bg-gold text-navy text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
          {project.target_sector}
        </span>
        <div className="absolute bottom-4 right-6 text-white/20 font-black text-6xl select-none uppercase truncate w-full">
          {project.target_sector}
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-black text-navy group-hover:text-gold transition-colors line-clamp-1">
            {project.title}
          </h3>
          <div className="flex items-center gap-1 text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-xl">
            <FaStar className="text-gold" /> {project.leads_count || 0}
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
          {project.description || "لا يوجد وصف متاح لهذا المشروع حالياً."}
        </p>
        <div className="mt-auto flex justify-between items-center pt-6 border-t border-gray-50">
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>{" "}
            {project.stage_display}
          </span>
          <span className="text-[10px] text-navy font-black bg-gold/10 px-3 py-1.5 rounded-lg group-hover:bg-navy group-hover:text-white transition-all">
            مشاهدة التفاصيل
          </span>
        </div>
      </div>
    </div>
  </Link>
);

const ServiceCard = ({ icon, title, desc }) => (
  <div className="bg-gray-50 p-10 rounded-3xl hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100 text-center group">
    <div className="w-20 h-20 bg-white text-navy rounded-2xl flex items-center justify-center text-3xl mx-auto mb-8 shadow-xl shadow-navy/5 group-hover:bg-navy group-hover:text-gold transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-black text-navy mb-4">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

export default PublicDashboardHome;
