/**
 * 实验模块入口文件
 * 
 * 参考STMIde的模块导出方式
 * 统一导出实验模块的所有公共接口
 */

// 类型定义
export type {
  ExperimentTemplate,
  UserExperiment,
  ExperimentProgress,
  ExperimentState,
  ExperimentActions,
  ExperimentFilter,
  ExperimentSort,
  ExperimentConfig
} from './types/experiment';

export {
  EXPERIMENT_IDS,
  EXPERIMENT_URL_TO_ID,
  ExperimentCategory,
  ExperimentDifficulty
} from './types/experiment';

// 配置
export {
  experimentConfig,
  API_ENDPOINTS,
  EXPERIMENT_CATEGORIES,
  DIFFICULTY_LEVELS,
  EXPERIMENT_STATUS,
  EXPERIMENTS_CONFIG
} from './config/index';

// 服务
export { experimentService, ExperimentService } from './services/experimentService';

// 状态管理
export { 
  useExperimentStore, 
  useExperiments, 
  useExperiment 
} from './stores/experimentStore';

// 组件
export { default as ExperimentCard } from './components/ExperimentCard';
export { default as ExperimentList } from './components/ExperimentList';

// 页面
export { default as ExperimentsPage } from './pages/ExperimentsPage';
export { default as ExperimentDetailPage } from './pages/ExperimentDetailPage';
export { default as BasicExperimentPage } from './pages/BasicExperimentPage';
export { default as TimerExperimentPage } from './pages/TimerExperimentPage';
export { default as ExperimentProjectPage } from './pages/ExperimentProjectPage';
export { default as GeneralExperimentPage } from './pages/GeneralExperimentPage';

// 路由
export { default as experimentRoutes } from './routes';

// 工具函数
export * from './utils/experimentUtils';
