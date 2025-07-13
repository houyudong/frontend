import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';
import RoleGuard from './RoleGuard';
import { routes } from './routes';

// 懒加载页面组件
const LoginPage = React.lazy(() => import('../features/auth/pages/LoginPage'));
const StudentDashboard = React.lazy(() => import('../features/student/dashboard/pages/StudentDashboard'));
const CoursesPage = React.lazy(() => import('../features/student/courses/pages/CoursesPage'));
const CourseDetailPage = React.lazy(() => import('../features/student/courses/pages/CourseDetailPage'));
const ExperimentsPage = React.lazy(() => import('../features/student/experiments/pages/ExperimentsPage'));
const ExperimentDetailPage = React.lazy(() => import('../features/student/experiments/pages/ExperimentDetailPage'));
const ExperimentTestPage = React.lazy(() => import('../features/student/experiments/pages/ExperimentTestPage'));
const TeacherDashboard = React.lazy(() => import('../features/teacher/dashboard/pages/TeacherDashboard'));
const StudentManagementPage = React.lazy(() => import('../features/teacher/management/pages/StudentManagementPage'));
const AnalyticsPage = React.lazy(() => import('../features/teacher/analytics/pages/AnalyticsPage'));
const AdminDashboard = React.lazy(() => import('../features/admin/dashboard/pages/AdminDashboard'));
const UserManagementPage = React.lazy(() => import('../features/admin/userMgmt/pages/UserManagementPage'));
const SystemSettingsPage = React.lazy(() => import('../features/admin/settings/pages/SystemSettingsPage'));
const SystemReportsPage = React.lazy(() => import('../features/admin/reports/pages/SystemReportsPage'));
const CodeGeneratorPage = React.lazy(() => import('../features/tools/codeGenerator/pages/CodeGeneratorPage'));
const ErrorDebuggerPage = React.lazy(() => import('../features/tools/errorDebugger/pages/ErrorDebuggerPage'));
const SerialDebuggerPage = React.lazy(() => import('../features/tools/serialDebugger/pages/SerialDebuggerPage'));
const FlowchartPage = React.lazy(() => import('../features/tools/flowchart/pages/FlowchartPage'));
const NotFoundPage = React.lazy(() => import('../shared/ui/pages/NotFoundPage'));

// 加载组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="loading-spinner h-12 w-12"></div>
      <p className="text-gray-600 text-sm">页面加载中...</p>
    </div>
  </div>
);

/**
 * AppRouter - 应用路由组件
 * 
 * 基于角色的路由系统，支持权限控制
 * 遵循奥卡姆原则：简洁而完整的路由管理
 */
export const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 如果未认证且不在登录页面，重定向到登录页
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // 如果已认证且在登录页面，重定向到对应角色的仪表板
  if (isAuthenticated && location.pathname === '/login') {
    const roleRoutes = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={roleRoutes[user!.role]} replace />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* 登录页面 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 根路径重定向 */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to={`/${user!.role}/dashboard`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* 学生路由 */}
        <Route path="/student/*" element={
          <RoleGuard allowedRoles={['student']}>
            <Routes>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="experiments" element={<ExperimentsPage />} />
              <Route path="experiments/test" element={<ExperimentTestPage />} />
              <Route path="experiments/:id" element={<ExperimentDetailPage />} />
              <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
            </Routes>
          </RoleGuard>
        } />

        {/* 教师路由 */}
        <Route path="/teacher/*" element={
          <RoleGuard allowedRoles={['teacher']}>
            <Routes>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="management" element={<StudentManagementPage />} />
              <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
            </Routes>
          </RoleGuard>
        } />

        {/* 管理员路由 */}
        <Route path="/admin/*" element={
          <RoleGuard allowedRoles={['admin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="settings" element={<SystemSettingsPage />} />
              <Route path="reports" element={<SystemReportsPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </RoleGuard>
        } />

        {/* 工具路由 - 所有角色都可以访问 */}
        <Route path="/tools/code-generator" element={<CodeGeneratorPage />} />
        <Route path="/tools/error-debugger" element={<ErrorDebuggerPage />} />
        <Route path="/tools/serial-debugger" element={<SerialDebuggerPage />} />
        <Route path="/tools/flowchart" element={<FlowchartPage />} />

        {/* 404页面 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
