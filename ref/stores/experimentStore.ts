/**
 * 实验状态管理
 * 
 * 参考STMIde的Zustand状态管理方式
 * 统一管理实验相关的状态和操作
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  ExperimentTemplate, 
  UserExperiment, 
  ExperimentProgress,
  ExperimentState,
  ExperimentActions,
  ExperimentFilter,
  ExperimentSort
} from '../types/experiment';
import { experimentService } from '../services/experimentService';

// 合并状态和操作的接口
interface ExperimentStore extends ExperimentState, ExperimentActions {
  // 扩展状态
  filters: ExperimentFilter;
  sort: ExperimentSort;
  
  // 扩展操作
  setFilters: (filters: Partial<ExperimentFilter>) => void;
  setSort: (sort: ExperimentSort) => void;
  getFilteredTemplates: () => ExperimentTemplate[];
  
  // 缓存管理
  refreshData: () => Promise<void>;
  clearCache: () => void;
}

/**
 * 实验状态管理Store
 */
export const useExperimentStore = create<ExperimentStore>()(
  devtools(
    (set, get) => ({
      // 初始状态
      templates: [],
      userExperiments: [],
      currentExperiment: undefined,
      currentProgress: undefined,
      loading: false,
      error: undefined,
      filters: {},
      sort: { field: 'order_index', direction: 'asc' },

      // 模板管理操作
      loadTemplates: async () => {
        set({ loading: true, error: undefined });
        
        try {
          const templates = await experimentService.getExperimentTemplates();
          set({ templates, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '加载实验模板失败';
          set({ error: errorMessage, loading: false });
        }
      },

      getTemplate: async (id: string) => {
        const { templates } = get();
        
        // 先从本地状态查找
        const localTemplate = templates.find(t => t.id === id);
        if (localTemplate) {
          return localTemplate;
        }

        // 从服务器获取
        try {
          const template = await experimentService.getExperimentTemplate(id);
          if (template) {
            // 更新本地状态
            set(state => ({
              templates: [...state.templates.filter(t => t.id !== id), template]
            }));
          }
          return template;
        } catch (error) {
          console.error('获取实验模板失败:', error);
          return null;
        }
      },

      // 用户实验管理操作
      loadUserExperiments: async (userId: string) => {
        set({ loading: true, error: undefined });
        
        try {
          const userExperiments = await experimentService.getUserExperiments(userId);
          set({ userExperiments, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '加载用户实验失败';
          set({ error: errorMessage, loading: false });
        }
      },

      startExperiment: async (userId: string, templateId: string) => {
        set({ loading: true, error: undefined });
        
        try {
          const result = await experimentService.startExperiment(userId, templateId);
          
          // 重新加载用户实验列表
          await get().loadUserExperiments(userId);
          
          set({ loading: false });
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '开始实验失败';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      deleteExperiment: async (userId: string, experimentId: number) => {
        set({ loading: true, error: undefined });
        
        try {
          await experimentService.deleteExperiment(userId, experimentId);
          
          // 从本地状态移除
          set(state => ({
            userExperiments: state.userExperiments.filter(e => e.id !== experimentId),
            loading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '删除实验失败';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      // 进度管理操作
      updateProgress: async (userId: string, experimentId: string, progress: number) => {
        // TODO: 实现进度更新API调用
        set(state => ({
          userExperiments: state.userExperiments.map(e => 
            e.experiment_id === experimentId 
              ? { ...e, progress, status: progress >= 100 ? 'completed' : 'in_progress' }
              : e
          )
        }));
      },

      completeExperiment: async (userId: string, experimentId: string) => {
        // TODO: 实现实验完成API调用
        set(state => ({
          userExperiments: state.userExperiments.map(e => 
            e.experiment_id === experimentId 
              ? { ...e, status: 'completed', progress: 100 }
              : e
          )
        }));
      },

      // 状态管理操作
      setCurrentExperiment: (experiment: ExperimentTemplate) => {
        set({ currentExperiment: experiment });
      },

      clearError: () => {
        set({ error: undefined });
      },

      // 过滤和排序操作
      setFilters: (filters: Partial<ExperimentFilter>) => {
        set(state => ({
          filters: { ...state.filters, ...filters }
        }));
      },

      setSort: (sort: ExperimentSort) => {
        set({ sort });
      },

      getFilteredTemplates: () => {
        const { templates, filters, sort } = get();
        
        let filtered = [...templates];

        // 应用过滤器
        if (filters.category) {
          filtered = filtered.filter(t => t.category === filters.category);
        }

        if (filters.difficulty) {
          filtered = filtered.filter(t => t.difficulty === filters.difficulty);
        }

        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(search) ||
            t.description?.toLowerCase().includes(search) ||
            t.project_name?.toLowerCase().includes(search)
          );
        }

        // 应用排序
        filtered.sort((a, b) => {
          const aValue = a[sort.field] || 0;
          const bValue = b[sort.field] || 0;
          
          if (sort.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        return filtered;
      },

      // 缓存管理操作
      refreshData: async () => {
        experimentService.clearCache();
        await get().loadTemplates();
      },

      clearCache: () => {
        experimentService.clearCache();
        set({
          templates: [],
          userExperiments: [],
          currentExperiment: undefined,
          currentProgress: undefined,
          error: undefined
        });
      }
    }),
    {
      name: 'experiment-store',
      partialize: (state) => ({
        // 只持久化部分状态，避免缓存过期数据
        filters: state.filters,
        sort: state.sort
      })
    }
  )
);

// 导出便捷的Hook
export const useExperiments = () => {
  const store = useExperimentStore();
  
  return {
    // 状态
    templates: store.templates,
    userExperiments: store.userExperiments,
    currentExperiment: store.currentExperiment,
    loading: store.loading,
    error: store.error,
    filters: store.filters,
    sort: store.sort,
    
    // 操作
    loadTemplates: store.loadTemplates,
    loadUserExperiments: store.loadUserExperiments,
    startExperiment: store.startExperiment,
    deleteExperiment: store.deleteExperiment,
    setCurrentExperiment: store.setCurrentExperiment,
    setFilters: store.setFilters,
    setSort: store.setSort,
    getFilteredTemplates: store.getFilteredTemplates,
    clearError: store.clearError,
    refreshData: store.refreshData
  };
};

// 导出用于获取单个实验的Hook
export const useExperiment = (id?: string) => {
  const { templates, getTemplate } = useExperimentStore();
  
  const experiment = id ? templates.find(t => t.id === id) : undefined;
  
  return {
    experiment,
    getTemplate,
    loading: useExperimentStore(state => state.loading),
    error: useExperimentStore(state => state.error)
  };
};
