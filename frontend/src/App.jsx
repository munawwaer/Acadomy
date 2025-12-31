import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useOutletContext,
  Outlet,
} from "react-router-dom";

// 1. استبدال السياق القديم بمخزن Zustand
import { useAuthStore } from "./features/auth/store/authStore";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// --- Layouts ---
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

// --- Pages: Auth ---
import Login from "./features/auth/components/LoginForm";
import Register from "./features/auth/components/Register";

// --- بقية الصفحات كما هي في كودك ---
import LandingPageViewer from "./pages/public/LandingPageViewer";
import PublicDashboardHome from "./pages/public/PublicDashboardHome";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProjectsList from "./pages/dashboard/ProjectsList";
import NewProject from "./pages/dashboard/NewProject";
import Profile from "./pages/dashboard/Profile";
import Pricing from "./pages/dashboard/Pricing";
import ProjectWorkspace from "./pages/workspace/ProjectWorkspace";
import AnalysisStage from "./pages/workspace/stages/AnalysisStage";
import StrategyStage from "./pages/workspace/stages/StrategyStage";
import BuilderStage from "./pages/workspace/stages/BuilderStage";
import LeadsStage from "./pages/workspace/stages/LeadsStage";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import AdminNotifications from "./pages/admin/AdminNotifications";

// =========================================
// 1. مكون حماية المسارات (Zustand Version)
// =========================================
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // إذا لم يكن مسجلاً، يتم طرده لصفحة اللوجن
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isRehydrated, setIsRehydrated] = useState(false);

  // =========================================
  // 2. ميزة الـ Auto-Login (Hydration)
  // =========================================
  useEffect(() => {
    const initAuth = async () => {
      // ننتظر Zustand يقرأ التوكن من الـ LocalStorage
      await useAuthStore.persist.rehydrate();
      setIsRehydrated(true);
    };
    initAuth();
  }, []);

  // نمنع ظهور أي صفحة حتى نتأكد من حالة الدخول
  if (!isRehydrated) {
    return <LoadingSpinner message="جاري تجهيز المنصة..." />;
  }

  return (
    <Router>
      <Routes>
        {/* المنطقة العامة */}
        <Route path="/" element={<PublicDashboardHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/p/:slug" element={<LandingPageViewer />} />

        {/* =========================================
             منطقة المستخدم المحمية (User Zone)
            ========================================= */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/new-project" element={<NewProject />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/profile" element={<Profile />} />

          {/* مساحة عمل المشروع المحمية */}
          <Route path="/project/:id" element={<ProjectWorkspace />}>
            <Route index element={<AnalysisConsumer />} />
            <Route path="strategy" element={<StrategyConsumer />} />
            <Route path="builder" element={<BuilderConsumer />} />
            <Route path="leads" element={<LeadsConsumer />} />
          </Route>
        </Route>

        {/* =========================================
             منطقة الأدمن المحمية (Admin Zone)
            ========================================= */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              {/* يمكنك هنا عمل مكون AdminRoute مخصوص لو حبيت تفصل الأدمن */}
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboardHome />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

        {/* صفحة 404 */}
        <Route
          path="*"
          element={
            <div className="p-10 text-center font-bold">
              404 - الصفحة غير موجودة
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

// --- Consumers كما هي في كودك ---
const AnalysisConsumer = () => {
  const { project, onUpdate } = useOutletContext();
  return <AnalysisStage project={project} onUpdate={onUpdate} />;
};

const StrategyConsumer = () => {
  const { project, onUpdate } = useOutletContext();
  return <StrategyStage project={project} onUpdate={onUpdate} />;
};

const BuilderConsumer = () => {
  const { project } = useOutletContext();
  return <BuilderStage project={project} />;
};

const LeadsConsumer = () => {
  const { project } = useOutletContext();
  return <LeadsStage project={project} />;
};

export default App;
