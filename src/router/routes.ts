import { UserRole } from '../app/providers/AuthProvider';

// 路由配置接口
export interface RouteConfig {
  path: string;
  name: string;
  roles: UserRole[];
  icon?: string;
  children?: RouteConfig[];
}

/**
 * 路由配置
 * 
 * 基于角色的路由配置，支持嵌套路由
 * 遵循奥卡姆原则：清晰的路由结构
 */
export const routes: RouteConfig[] = [
  {
    path: '/student',
    name: '学生中心',
    roles: ['student'],
    icon: '🎓',
    children: [
      {
        path: '/student/dashboard',
        name: '学习仪表板',
        roles: ['student'],
        icon: '📊'
      },
      {
        path: '/student/experiments',
        name: '实验中心',
        roles: ['student'],
        icon: '🧪'
      },
      {
        path: '/student/courses',
        name: '课程学习',
        roles: ['student'],
        icon: '📚'
      }
    ]
  },
  {
    path: '/teacher',
    name: '教师中心',
    roles: ['teacher'],
    icon: '👨‍🏫',
    children: [
      {
        path: '/teacher/dashboard',
        name: '教学仪表板',
        roles: ['teacher'],
        icon: '📊'
      },
      {
        path: '/teacher/analytics',
        name: '数据分析',
        roles: ['teacher'],
        icon: '📈'
      },
      {
        path: '/teacher/management',
        name: '班级管理',
        roles: ['teacher'],
        icon: '👥'
      }
    ]
  },
  {
    path: '/admin',
    name: '管理中心',
    roles: ['admin'],
    icon: '👨‍💼',
    children: [
      {
        path: '/admin/dashboard',
        name: '管理仪表板',
        roles: ['admin'],
        icon: '📊'
      },
      {
        path: '/admin/users',
        name: '用户管理',
        roles: ['admin'],
        icon: '👥'
      },
      {
        path: '/admin/system',
        name: '系统管理',
        roles: ['admin'],
        icon: '⚙️'
      }
    ]
  }
];

/**
 * 根据用户角色获取可访问的路由
 */
export const getRoutesByRole = (role: UserRole): RouteConfig[] => {
  return routes.filter(route => route.roles.includes(role));
};

/**
 * 获取用户角色的默认路由
 */
export const getDefaultRoute = (role: UserRole): string => {
  const roleRoutes = {
    student: '/student/dashboard',
    teacher: '/teacher/dashboard',
    admin: '/admin/dashboard'
  };
  return roleRoutes[role];
};
