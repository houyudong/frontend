/**
 * 路由工具函数
 * 
 * 提供路由相关的实用函数
 */

import routes from './routes';
import navigation, { getAccessibleNavigation } from './navigation';

/**
 * 根据路径获取路由配置
 * 
 * @param {string} path - 路由路径
 * @returns {Object|null} 路由配置对象，如果未找到则返回null
 */
export const getRouteByPath = (path) => {
  return routes.find(route => route.path === path) || null;
};

/**
 * 根据路径获取页面标题
 * 
 * @param {string} path - 路由路径
 * @returns {string} 页面标题，如果未找到则返回默认标题
 */
export const getPageTitle = (path) => {
  const route = getRouteByPath(path);
  return route ? route.title : '嵌入式AI教学平台';
};

/**
 * 获取面包屑导航数据
 * 
 * @param {string} path - 当前路径
 * @returns {Array} 面包屑导航数据
 */
export const getBreadcrumbs = (path) => {
  // 如果是首页，返回空数组
  if (path === '/') {
    return [];
  }
  
  const breadcrumbs = [];
  
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
          title: route.title,
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
 * @param {string} path - 路径
 * @returns {Object|null} 导航项，如果未找到则返回null
 */
const findNavItemByPath = (path) => {
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
 * @param {string} role - 用户角色
 * @returns {Array} 用户可访问的路由列表
 */
export const getAccessibleRoutes = (role) => {
  return routes.filter(route => {
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
 * @param {string} role - 用户角色
 * @returns {Array} 用户可访问的侧边栏菜单
 */
export const getSidebarMenu = (role) => {
  return getAccessibleNavigation(role);
};

export default {
  getRouteByPath,
  getPageTitle,
  getBreadcrumbs,
  getAccessibleRoutes,
  getSidebarMenu
};
