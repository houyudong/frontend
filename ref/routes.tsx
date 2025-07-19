/**
 * 实验模块路由配置
 * 
 * 参考STMIde的路由管理方式
 * 定义实验相关的路由规则
 */

import { RouteObject } from 'react-router-dom';
import ExperimentsPage from './pages/ExperimentsPage';
import ExperimentDetailPage from './pages/ExperimentDetailPage';

// 实验模块路由配置
export const experimentRoutes: RouteObject[] = [
  {
    path: '/student/experiments',
    element: <ExperimentsPage />,
    index: true
  },
  {
    path: '/student/experiments/:experimentName',
    element: <ExperimentDetailPage />
  }
];

// 导出路由配置
export default experimentRoutes;
