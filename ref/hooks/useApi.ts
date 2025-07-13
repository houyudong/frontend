/**
 * API钩子
 * 
 * 提供React组件使用的API钩子，用于数据获取、修改和缓存
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient, { ApiClient } from '../services/apiClient';
import { AxiosResponse, AxiosError } from 'axios';

interface ApiOptions<T = any, P = any, D = any> {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  initialData?: T;
  initialLoading?: boolean;
  autoFetch?: boolean;
  params?: P;
  data?: D;
  onSuccess?: (data: T, response: AxiosResponse<T>) => void;
  onError?: (error: AxiosError) => void;
  transformResponse?: (data: any) => T;
}

interface ApiResult<T = any> {
  loading: boolean;
  error: AxiosError | null;
  data: T | null;
  execute: (customParams?: any, customData?: any) => Promise<T>;
  reset: () => void;
}

interface UploadOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError) => void;
}

interface UploadResult {
  progress: number;
  uploading: boolean;
  error: AxiosError | null;
  response: any;
  upload: (formData: FormData) => Promise<any>;
  reset: () => void;
}

/**
 * 使用API请求的钩子
 * @param {ApiOptions} options - 配置选项
 * @returns {ApiResult} - API请求状态和函数
 */
export const useApi = <T = any, P = any, D = any>(options: ApiOptions<T, P, D> = {}): ApiResult<T> => {
  const {
    url,
    method = 'GET',
    initialData = null,
    initialLoading = false,
    autoFetch = false,
    params = {},
    data = {},
    onSuccess,
    onError,
    transformResponse,
  } = options;

  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<AxiosError | null>(null);
  const [response, setResponse] = useState<T | null>(initialData);
  const isMounted = useRef<boolean>(true);

  // 确保组件卸载后不更新状态
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 执行请求的函数
  const execute = useCallback(async (customParams = {}, customData = {}) => {
    try {
      setLoading(true);
      setError(null);

      // 合并参数和数据
      const mergedParams = { ...params, ...customParams };
      const mergedData = { ...data, ...customData };

      // 根据方法选择请求函数
      let apiMethod;
      switch (method.toUpperCase()) {
        case 'GET':
          apiMethod = () => (apiClient as ApiClient).get<T>(url!, { params: mergedParams });
          break;
        case 'POST':
          apiMethod = () => (apiClient as ApiClient).post<T>(url!, mergedData);
          break;
        case 'PUT':
          apiMethod = () => (apiClient as ApiClient).put<T>(url!, mergedData);
          break;
        case 'PATCH':
          apiMethod = () => (apiClient as ApiClient).patch<T>(url!, mergedData);
          break;
        case 'DELETE':
          apiMethod = () => (apiClient as ApiClient).delete<T>(url!, { data: mergedData });
          break;
        default:
          throw new Error(`不支持的HTTP方法: ${method}`);
      }

      // 执行请求
      const result = await apiMethod();

      // 转换响应
      const transformedData = transformResponse
        ? transformResponse(result.data)
        : result.data;

      // 更新状态
      if (isMounted.current) {
        setResponse(transformedData);
        setLoading(false);
      }

      // 调用成功回调
      if (onSuccess) {
        onSuccess(transformedData, result);
      }

      return transformedData;
    } catch (err) {
      const error = err as AxiosError;
      // 更新错误状态
      if (isMounted.current) {
        setError(error);
        setLoading(false);
      }

      // 调用错误回调
      if (onError) {
        onError(error);
      }

      throw error;
    }
  }, [url, method, params, data, onSuccess, onError, transformResponse]);

  // 自动执行请求
  useEffect(() => {
    if (autoFetch && url) {
      execute();
    }
  }, [autoFetch, url, execute]);

  // 重置状态
  const reset = useCallback(() => {
    setResponse(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return {
    loading,
    error,
    data: response,
    execute,
    reset,
  };
};

/**
 * 使用GET请求的钩子
 * @param {string} url - 请求URL
 * @param {ApiOptions} options - 配置选项
 * @returns {ApiResult} - API请求状态和函数
 */
export const useGet = <T = any, P = any>(url: string, options: ApiOptions<T, P> = {}) => {
  return useApi<T, P>({
    url,
    method: 'GET',
    autoFetch: true,
    ...options,
  });
};

/**
 * 使用POST请求的钩子
 * @param {string} url - 请求URL
 * @param {ApiOptions} options - 配置选项
 * @returns {ApiResult} - API请求状态和函数
 */
export const usePost = <T = any, D = any>(url: string, options: ApiOptions<T, any, D> = {}) => {
  return useApi<T, any, D>({
    url,
    method: 'POST',
    ...options,
  });
};

/**
 * 使用PUT请求的钩子
 * @param {string} url - 请求URL
 * @param {ApiOptions} options - 配置选项
 * @returns {ApiResult} - API请求状态和函数
 */
export const usePut = <T = any, D = any>(url: string, options: ApiOptions<T, any, D> = {}) => {
  return useApi<T, any, D>({
    url,
    method: 'PUT',
    ...options,
  });
};

/**
 * 使用PATCH请求的钩子
 * @param {string} url - 请求URL
 * @param {ApiOptions} options - 配置选项
 * @returns {ApiResult} - API请求状态和函数
 */
export const usePatch = <T = any, D = any>(url: string, options: ApiOptions<T, any, D> = {}) => {
  return useApi<T, any, D>({
    url,
    method: 'PATCH',
    ...options,
  });
};

/**
 * 使用DELETE请求的钩子
 * @param {string} url - 请求URL
 * @param {ApiOptions} options - 配置选项
 * @returns {ApiResult} - API请求状态和函数
 */
export const useDelete = <T = any, D = any>(url: string, options: ApiOptions<T, any, D> = {}) => {
  return useApi<T, any, D>({
    url,
    method: 'DELETE',
    ...options,
  });
};

/**
 * 使用上传文件的钩子
 * @param {string} url - 请求URL
 * @param {UploadOptions} options - 配置选项
 * @returns {UploadResult} - 上传状态和函数
 */
export const useUpload = (url: string, options: UploadOptions = {}): UploadResult => {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [response, setResponse] = useState<any>(null);

  // 上传文件
  const upload = useCallback(async (formData: FormData) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const result = await (apiClient as ApiClient).upload(url, formData, (percent: number) => {
        setProgress(percent);
      });

      setResponse(result.data);
      setUploading(false);

      if (options.onSuccess) {
        options.onSuccess(result.data);
      }

      return result.data;
    } catch (err) {
      const error = err as AxiosError;
      setError(error);
      setUploading(false);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [url, options]);

  // 重置状态
  const reset = useCallback(() => {
    setProgress(0);
    setUploading(false);
    setError(null);
    setResponse(null);
  }, []);

  return {
    progress,
    uploading,
    error,
    response,
    upload,
    reset,
  };
};

/**
 * 使用下载文件的钩子
 * @param {string} url - 请求URL
 * @param {UploadOptions} options - 配置选项
 * @returns {UploadResult} - 下载状态和函数
 */
export const useDownload = (url: string, options: UploadOptions = {}): UploadResult => {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [response, setResponse] = useState<any>(null);

  // 下载文件
  const download = useCallback(async (params = {}) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const result = await (apiClient as ApiClient).download(url, params, (percent: number) => {
        setProgress(percent);
      });

      setResponse(result.data);
      setUploading(false);

      if (options.onSuccess) {
        options.onSuccess(result.data);
      }

      return result.data;
    } catch (err) {
      const error = err as AxiosError;
      setError(error);
      setUploading(false);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    }
  }, [url, options]);

  // 重置状态
  const reset = useCallback(() => {
    setProgress(0);
    setUploading(false);
    setError(null);
    setResponse(null);
  }, []);

  return {
    progress,
    uploading,
    error,
    response,
    upload: download,
    reset,
  };
};

export default useApi; 