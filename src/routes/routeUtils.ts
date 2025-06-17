/**
 * 路由工具函数
 * 
 * 提供路由相关的实用函数
 */

import routes from './routes';
import { RouteConfig } from './routes';
import navigation, { getAccessibleNavigation, NavItem } from './navigation';

interface Breadcrumb {
  title: string;
  path: string;
}

/**
 * 根据路径获取路由配置
 * 
 * @param path - 路由路径
 * @returns 路由配置对象，如果未找到则返回null
 */
export const getRouteByPath = (path: string): RouteConfig | null => {
  return routes.find((route: RouteConfig) => route.path === path) || null;
};

/**
 * 根据路径获取页面标题
 * 
 * @param path - 路由路径
 * @returns 页面标题，如果未找到则返回默认标题
 */
export const getPageTitle = (path: string): string => {
  const route = getRouteByPath(path);
  return route?.title || '嵌入式AI教学平台';
};

/**
 * 获取面包屑导航数据
 * 
 * @param path - 当前路径
 * @returns 面包屑导航数据
 */
export const getBreadcrumbs = (path: string): Breadcrumb[] => {
  // 如果是首页，返回空数组
  if (path === '/') {
    return [];
  }
  
  const breadcrumbs: Breadcrumb[] = [];
  
  // 添加首页
  breadcrumbs.push({
    title: '首页',
    path: '/'
  });
  
  // 分割路径
  const pathSegments = path.split('/').filter(Boolean);
  
  // 构建面包屑
  let currentPath = '';
  
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`;
    
    // 查找对应的导航项
    const navItem = findNavItemByPath(currentPath);
    
    if (navItem) {
      breadcrumbs.push({
        title: navItem.title,
        path: currentPath
      });
    } else {
      // 如果在导航中找不到，尝试在路由中查找
      const route = getRouteByPath(currentPath);
      
      if (route) {
        breadcrumbs.push({
          title: route.title || '',
          path: currentPath
        });
      }
    }
  }
  
  return breadcrumbs;
};

/**
 * 在导航配置中查找指定路径的导航项
 * 
 * @param path - 路径
 * @returns 导航项，如果未找到则返回null
 */
const findNavItemByPath = (path: string): NavItem | null => {
  // 在顶级导航中查找
  for (const item of navigation) {
    if (item.path === path) {
      return item;
    }
    
    // 在子导航中查找
    if (item.children) {
      const childItem = item.children.find(child => child.path === path);
      if (childItem) {
        return childItem;
      }
    }
  }
  
  return null;
};

/**
 * 获取用户可访问的路由
 * 
 * @param role - 用户角色
 * @returns 用户可访问的路由列表
 */
export const getAccessibleRoutes = (role: string): RouteConfig[] => {
  return routes.filter((route: RouteConfig) => {
    // 如果路由不需要认证，所有用户都可访问
    if (route.auth === false) {
      return true;
    }
    
    // 如果路由有角色限制，检查用户角色是否有权限
    if (route.roles && route.roles.length > 0) {
      return route.roles.includes(role);
    }
    
    // 默认情况下，认证用户可访问
    return true;
  });
};

/**
 * 获取用户可访问的侧边栏菜单
 * 
 * @param role - 用户角色
 * @returns 用户可访问的侧边栏菜单
 */
export const getSidebarMenu = (role: string): NavItem[] => {
  return getAccessibleNavigation(role);
};

export default {
  getRouteByPath,
  getPageTitle,
  getBreadcrumbs,
  getAccessibleRoutes,
  getSidebarMenu
}; 