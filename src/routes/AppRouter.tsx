import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { UserProvider } from '../contexts/UserContext';
import RouteGuard from './RouteGuard';
import routes from './routes';
import Spinner from '../components/ui/Spinner';
import LoginPage from '../pages/auth/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import { MainLayout, WebIDELayout } from '../components/layout';
import HomePage from '../pages/HomePage';

// 布局包装组件
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // WebIDE页面使用WebIDELayout
  if (location.pathname.includes('/webide')) {
    return <WebIDELayout>{children}</WebIDELayout>;
  }

  // 登录页面不使用布局
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  // 其他页面使用MainLayout
  return <MainLayout>{children}</MainLayout>;
};

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" label="页面加载中..." />
      </div>
    }>
      <LayoutWrapper>
        <Routes>
          {/* 根路径直接使用 HomePage 组件 */}
          <Route path="/" element={<RouteGuard auth={true}><HomePage /></RouteGuard>} />
          
          {/* 登录页面 */}
          <Route path="/login" element={<RouteGuard auth={false}><LoginPage /></RouteGuard>} />
          
          {/* 其他路由 */}
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <RouteGuard
                  auth={route.auth}
                  roles={route.roles}
                >
                  <route.component />
                </RouteGuard>
              }
            />
          ))}
          
          {/* 404页面 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </LayoutWrapper>
    </Suspense>
  );
};

export default AppRouter; 