import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';
import RoleGuard from './RoleGuard';

// 懒加载页面组件
const LoginPage = React.lazy(() => import('../features/auth/pages/LoginPage'));
// 学生页面
const StudentDashboard = React.lazy(() => import('../features/student/dashboard/pages/StudentDashboard'));
const ClassRankingPage = React.lazy(() => import('../features/student/dashboard/pages/ClassRankingPage'));
const CoursesPage = React.lazy(() => import('../features/student/courses/pages/CoursesPage'));
const CourseDetailPage = React.lazy(() => import('../features/student/courses/pages/CourseDetailPage'));
const CourseStudyPage = React.lazy(() => import('../features/student/courses/pages/CourseStudyPage'));
const ExperimentsPage = React.lazy(() => import('../features/student/experiments/pages/ExperimentsPage'));
const ExperimentDetailPage = React.lazy(() => import('../features/student/experiments/pages/ExperimentDetailPage'));
const ExperimentTestPage = React.lazy(() => import('../features/student/experiments/pages/ExperimentTestPage'));

// 教师页面
const TeacherDashboard = React.lazy(() => import('../features/teacher/dashboard/pages/TeacherDashboard'));
const ClassManagementPage = React.lazy(() => import('../features/teacher/classManagement/pages/ClassManagementPage'));
const ClassDetailPage = React.lazy(() => import('../features/teacher/classManagement/pages/ClassDetailPage'));
const StudentManagementPage = React.lazy(() => import('../features/teacher/classManagement/pages/StudentManagementPage'));
const CourseAnalyticsPage = React.lazy(() => import('../features/teacher/analytics/pages/CourseAnalyticsPage'));
const ExperimentAnalyticsPage = React.lazy(() => import('../features/teacher/analytics/pages/ExperimentAnalyticsPage'));
const StudentProgressPage = React.lazy(() => import('../features/teacher/analytics/pages/StudentProgressPage'));
const StudentDetailPage = React.lazy(() => import('../features/teacher/analytics/pages/StudentDetailPage'));
// 教师课程管理页面
const TeacherCourseManagementPage = React.lazy(() => import('../features/teacher/course/pages/CourseManagementPage'));
const TeacherCourseDetailPage = React.lazy(() => import('../features/teacher/course/pages/CourseDetailPage'));
const CourseSchedulePage = React.lazy(() => import('../features/teacher/course/pages/CourseSchedulePage'));
// 教师实验管理页面
const TeacherExperimentManagementPage = React.lazy(() => import('../features/teacher/experiment/pages/ExperimentManagementPage'));
const TeacherExperimentDetailPage = React.lazy(() => import('../features/teacher/experiment/pages/ExperimentDetailPage'));
// 学生功能页面
const StudentAchievementsPage = React.lazy(() => import('../features/student/pages/AchievementsPage'));
const StudentFavoritesPage = React.lazy(() => import('../features/student/pages/FavoritesPage'));
const StudentLearningHistoryPage = React.lazy(() => import('../features/student/pages/LearningHistoryPage'));
const StudentLearningProgressPage = React.lazy(() => import('../features/student/pages/LearningProgressPage'));
const StudentNotificationPage = React.lazy(() => import('../features/student/pages/StudentNotificationPage'));
const StudentExportPage = React.lazy(() => import('../features/student/pages/StudentExportPage'));
const StudentTestPage = React.lazy(() => import('../features/student/pages/TestPage'));
const TeacherNotificationPage = React.lazy(() => import('../features/teacher/pages/TeacherNotificationPage'));
const TeacherExportPage = React.lazy(() => import('../features/teacher/pages/TeacherExportPage'));
const AdminNotificationPage = React.lazy(() => import('../features/admin/pages/AdminNotificationPage'));
const AdminExportPage = React.lazy(() => import('../features/admin/pages/AdminExportPage'));
const NotificationDemoPage = React.lazy(() => import('../features/notifications/pages/NotificationDemoPage'));
const NotificationNavbarDemo = React.lazy(() => import('../features/notifications/pages/NotificationNavbarDemo'));
const BatchOperationDemo = React.lazy(() => import('../features/notifications/pages/BatchOperationDemo'));
const NotificationTestPage = React.lazy(() => import('../features/notifications/pages/NotificationTestPage'));
const AnalyticsDemo = React.lazy(() => import('../features/admin/analytics/pages/AnalyticsDemo'));
const TeacherAnalyticsDemo = React.lazy(() => import('../features/teacher/analytics/pages/TeacherAnalyticsDemo'));
const StudentHistoryDemo = React.lazy(() => import('../features/student/history/pages/StudentHistoryDemo'));
const SearchBoxDemo = React.lazy(() => import('../features/student/components/SearchBoxDemo'));
const UserDetailPage = React.lazy(() => import('../features/admin/userMgmt/pages/UserDetailPage'));
const UserEditPage = React.lazy(() => import('../features/admin/userMgmt/pages/UserEditPage'));
const AnalyticsPage = React.lazy(() => import('../features/teacher/analytics/pages/AnalyticsPage'));
const AdminDashboard = React.lazy(() => import('../features/admin/dashboard/pages/AdminDashboard'));
const UserManagementPage = React.lazy(() => import('../features/admin/userMgmt/pages/UserManagementPage'));
const UserPermissionAssignmentPage = React.lazy(() => import('../features/admin/userMgmt/pages/UserPermissionAssignmentPage'));
const SystemAnalyticsPage = React.lazy(() => import('../features/admin/analytics/pages/SystemAnalyticsPage'));
// 暂时注释掉有JSX问题的页面
// const SystemManagementPage = React.lazy(() => import('../features/admin/systemMgmt/pages/SystemManagementPage'));
const SystemSettingsPage = React.lazy(() => import('../features/admin/settings/pages/SystemSettingsPage'));
const SystemReportsPage = React.lazy(() => import('../features/admin/reports/pages/SystemReportsPage'));
const CodeGeneratorPage = React.lazy(() => import('../features/tools/codeGenerator/pages/CodeGeneratorPage'));
const ErrorDebuggerPage = React.lazy(() => import('../features/tools/errorDebugger/pages/ErrorDebuggerPage'));
const SerialDebuggerPage = React.lazy(() => import('../features/tools/serialDebugger/pages/SerialDebuggerPage'));
const FlowchartPage = React.lazy(() => import('../features/tools/flowchart/pages/FlowchartPage'));
const UserCenter = React.lazy(() => import('../pages/UserCenter'));
const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));

// 角色专用用户中心页面
const StudentProfilePage = React.lazy(() => import('../features/student/profile/pages/StudentProfilePage'));
const TeacherProfilePage = React.lazy(() => import('../features/teacher/profile/pages/TeacherProfilePage'));
const AdminProfilePage = React.lazy(() => import('../features/admin/profile/pages/AdminProfilePage'));

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
              <Route path="ranking" element={<ClassRankingPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="courses/:courseId/study/:lessonId" element={<CourseStudyPage />} />
              <Route path="experiments" element={<ExperimentsPage />} />
              <Route path="experiments/test" element={<ExperimentTestPage />} />
              <Route path="experiments/:id" element={<ExperimentDetailPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
              {/* 学生功能详情页面 */}
              <Route path="progress" element={<StudentLearningProgressPage />} />
              <Route path="achievements" element={<StudentAchievementsPage />} />
              <Route path="favorites" element={<StudentFavoritesPage />} />
              <Route path="history" element={<StudentLearningHistoryPage />} />
              <Route path="notifications" element={<StudentNotificationPage />} />
              <Route path="export" element={<StudentExportPage />} />
              <Route path="test" element={<StudentTestPage />} />
              <Route path="notification-demo" element={<NotificationDemoPage />} />
              <Route path="notification-navbar-demo" element={<NotificationNavbarDemo />} />
              <Route path="batch-operation-demo" element={<BatchOperationDemo />} />
              <Route path="notification-test" element={<NotificationTestPage />} />
              <Route path="history-demo" element={<StudentHistoryDemo />} />
              <Route path="search-demo" element={<SearchBoxDemo />} />
              <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
            </Routes>
          </RoleGuard>
        } />

        {/* 教师路由 */}
        <Route path="/teacher/*" element={
          <RoleGuard allowedRoles={['teacher']}>
            <Routes>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="courses" element={<TeacherCourseManagementPage />} />
              <Route path="courses/:courseId" element={<TeacherCourseDetailPage />} />
              <Route path="courses/schedule" element={<CourseSchedulePage />} />
              <Route path="experiments" element={<TeacherExperimentManagementPage />} />
              <Route path="experiments/:experimentId" element={<TeacherExperimentDetailPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="analytics-demo" element={<TeacherAnalyticsDemo />} />
              <Route path="analytics/course/:courseId" element={<CourseAnalyticsPage />} />
              <Route path="analytics/experiment/:experimentId" element={<ExperimentAnalyticsPage />} />
              <Route path="analytics/students" element={<StudentProgressPage />} />
              <Route path="analytics/student/:studentId" element={<StudentDetailPage />} />
              <Route path="management/classes" element={<ClassManagementPage />} />
              <Route path="management/classes/:classId" element={<ClassDetailPage />} />
              <Route path="management/students" element={<StudentManagementPage />} />
              <Route path="management" element={<Navigate to="/teacher/management/classes" replace />} />
              <Route path="profile" element={<TeacherProfilePage />} />
              <Route path="notifications" element={<TeacherNotificationPage />} />
              <Route path="export" element={<TeacherExportPage />} />
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
              <Route path="users/:userId" element={<UserDetailPage />} />
              <Route path="users/:userId/edit" element={<UserEditPage />} />
              <Route path="users/:userId/permissions" element={<UserPermissionAssignmentPage />} />
              <Route path="analytics" element={<SystemAnalyticsPage />} />
              <Route path="analytics-demo" element={<AnalyticsDemo />} />
              {/* <Route path="system" element={<SystemManagementPage />} /> */}
              <Route path="settings" element={<SystemSettingsPage />} />
              <Route path="reports" element={<SystemReportsPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
              <Route path="notifications" element={<AdminNotificationPage />} />
              <Route path="export" element={<AdminExportPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </RoleGuard>
        } />

        {/* 用户中心 - 所有角色都可以访问 */}
        <Route path="/user-center" element={
          <RoleGuard allowedRoles={['admin', 'teacher', 'student']}>
            <UserCenter />
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


