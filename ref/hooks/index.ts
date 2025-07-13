/**
 * 钩子索引文件
 * 
 * 导出所有自定义钩子，方便统一导入
 */

// API钩子
export { 
  default as useApi,
  useGet,
  usePost,
  usePut,
  usePatch,
  useDelete,
  useUpload,
  useDownload
} from './useApi';

// 其他钩子可以在这里添加 