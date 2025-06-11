import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import RouteGuard from './RouteGuard';
import routes from './routes';

/**
 * 加载中组件
 */
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

/**
 * AppRoutes - 应用路由组件
 *
 * 渲染应用的所有路由，并使用Suspense处理懒加载
 *
 * @component
 * @example
 * ```jsx
 * <BrowserRouter>
 *   <AppRoutes />
 * </BrowserRouter>
 * ```
 *
 * @deprecated 请使用 AppRouter 组件代替
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {routes.map((route, index) => {
          const { path, component: Component, auth = true, roles = [], exact } = route;

          return (
            <Route
              key={index}
              path={path}
              exact={exact}
              element={
                <RouteGuard auth={auth} roles={roles}>
                  <Component />
                </RouteGuard>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
