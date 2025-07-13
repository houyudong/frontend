/**
 * 路由模块索引
 *
 * 导出所有路由相关的组件和函数
 */

// 路由组件
export { default as AppRouter } from './AppRouter';
export { default as RouteGuard } from './RouteGuard';

// 已废弃的路由组件 - 保留导出以保持向后兼容
/**
 * @deprecated 请使用 AppRouter 组件代替
 */
export { default as AppRoutes } from './AppRoutes';

// 路由配置
export { default as routes } from './routes';
export { default as navigation } from './navigation';
export { getAccessibleNavigation } from './navigation';

// 路由工具函数
export {
  getRouteByPath,
  getPageTitle,
  getBreadcrumbs,
  getAccessibleRoutes,
  getSidebarMenu
} from './routeUtils';

// 路由钩子
export { default as useRouting } from './useRouting';

// 默认导出AppRouter组件
export { default } from './AppRouter'; 