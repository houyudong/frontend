/**
 * 导航配置
 *
 * 用于生成侧边栏菜单和面包屑导航
 */

import {
  FiHome,
  FiBook,
  FiCode,
  FiTerminal,
  FiBriefcase,
  FiCpu,
  FiActivity,
  FiDatabase,
  FiServer,
  FiPieChart,
  FiLayers,
  FiGrid,
  FiTool,
  FiAlertTriangle,
  FiGitBranch,
  FiPenTool,
  FiUsers,
  FiUser,
  FiSettings,
  FiLock
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { FaFlask } from 'react-icons/fa';

/**
 * 图标映射
 */
export const iconMap: Record<string, IconType> = {
  home: FiHome,
  book: FiBook,
  beaker: FaFlask,
  code: FiCode,
  terminal: FiTerminal,
  briefcase: FiBriefcase,
  cpu: FiCpu,
  activity: FiActivity,
  database: FiDatabase,
  server: FiServer,
  chart: FiPieChart,
  layers: FiLayers,
  grid: FiGrid,
  tool: FiTool,
  alert: FiAlertTriangle,
  git: FiGitBranch,
  diagram: FiPenTool,
  users: FiUsers,
  user: FiUser,
  settings: FiSettings,
  lock: FiLock
};

/**
 * 导航项类型定义
 */
export interface NavItem {
  id: string;
  title: string;
  path?: string;
  icon: string;
  roles?: string[];
  children?: NavItem[];
  divider?: boolean;
  order?: number;
}

/**
 * 主导航配置
 */
const navigation: NavItem[] = [
  {
    id: 'home',
    title: '首页',
    path: '/',
    icon: 'home',
    order: 10
  },
  {
    id: 'courses',
    title: '课程',
    path: '/courses',
    icon: 'book',
    order: 20
  },
  {
    id: 'experiments',
    title: '实验',
    path: '/experiments',
    icon: 'beaker',
    order: 30,
    children: [
      {
        id: 'gpio-experiments',
        title: 'GPIO实验',
        path: '/experiments/gpio',
        icon: 'cpu'
      },
      {
        id: 'timer-interrupt-experiments',
        title: '定时器中断实验',
        path: '/experiments/timer-interrupt',
        icon: 'activity'
      },
      {
        id: 'uart-experiments',
        title: '串口通信实验',
        path: '/experiments/uart',
        icon: 'terminal'
      },
      {
        id: 'adc-experiments',
        title: 'ADC实验',
        path: '/experiments/adc',
        icon: 'activity'
      },
      {
        id: 'dac-experiments',
        title: 'DAC实验',
        path: '/experiments/dac',
        icon: 'activity'
      },
      {
        id: 'dma-experiments',
        title: 'DMA实验',
        path: '/experiments/dma',
        icon: 'database'
      }
    ]
  },
  {
    id: 'tools',
    title: '工具',
    icon: 'tool',
    order: 40,
    children: [
      {
        id: 'webide',
        title: 'WebIDE',
        path: '/webide',
        icon: 'code'
      },
      {
        id: 'code-generator',
        title: '代码生成器',
        path: '/code-generator',
        icon: 'git'
      },
      // 已删除流程图生成导航项
      {
        id: 'web-serial',
        title: '串口调试',
        path: '/web-serial',
        icon: 'terminal'
      },
      {
        id: 'error-debugger',
        title: '错误调试',
        path: '/error-debugger',
        icon: 'alert'
      }
    ]
  },
  {
    id: 'teacher',
    title: '教师功能',
    icon: 'users',
    order: 50,
    roles: ['teacher', 'admin'],
    children: [
      {
        id: 'teacher-dashboard',
        title: '教师仪表板',
        path: '/dashboard',
        icon: 'chart'
      }
    ]
  },
  // 已删除 UI组件 导航项
  {
    id: 'user',
    title: '用户',
    icon: 'user',
    order: 70,
    children: [
      {
        id: 'profile',
        title: '个人资料',
        path: '/profile',
        icon: 'user'
      },
      {
        id: 'settings',
        title: '设置',
        path: '/settings',
        icon: 'settings'
      },
      {
        id: 'change-password',
        title: '修改密码',
        path: '/change-password',
        icon: 'lock'
      }
    ]
  }
];

/**
 * 获取用户可访问的导航项
 *
 * @param role - 用户角色
 * @returns 过滤后的导航项
 */
export const getAccessibleNavigation = (role: string): NavItem[] => {
  // 过滤顶级导航项
  const filteredNav = navigation
    .filter(item => !item.roles || item.roles.includes(role))
    .map(item => {
      // 如果有子项，过滤子导航项
      if (item.children) {
        const filteredChildren = item.children.filter(
          child => !child.roles || child.roles.includes(role)
        );

        // 如果过滤后没有子项，返回null（后面会过滤掉）
        if (filteredChildren.length === 0) {
          return null;
        }

        // 返回带有过滤后子项的导航项
        return {
          ...item,
          children: filteredChildren
        };
      }

      // 没有子项，直接返回
      return item;
    })
    .filter((item): item is NavItem => item !== null) // 过滤掉null项
    .sort((a, b) => (a.order || 100) - (b.order || 100)); // 按order排序

  return filteredNav;
};

export default navigation; 