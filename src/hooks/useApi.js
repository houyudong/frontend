/**
 * API钩子
 * 
 * 提供React组件使用的API钩子，用于数据获取、修改和缓存
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../services/apiClient';

/**
 * 使用API请求的钩子
 * @param {Object} options - 配置选项
 * @returns {Object} - API请求状态和函数
 */
export const useApi = (options = {}) => {
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

  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(initialData);
  const isMounted = useRef(true);

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
          apiMethod = () => apiClient.get(url, mergedParams);
          break;
        case 'POST':
          apiMethod = () => apiClient.post(url, mergedData);
          break;
        case 'PUT':
          apiMethod = () => apiClient.put(url, mergedData);
          break;
        case 'PATCH':
          apiMethod = () => apiClient.patch(url, mergedData);
          break;
        case 'DELETE':
          apiMethod = () => apiClient.delete(url, { data: mergedData });
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
      // 更新错误状态
      if (isMounted.current) {
        setError(err);
        setLoading(false);
      }

      // 调用错误回调
      if (onError) {
        onError(err);
      }

      throw err;
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
 * @param {Object} options - 配置选项
 * @returns {Object} - API请求状态和函数
 */
export const useGet = (url, options = {}) => {
  return useApi({
    url,
    method: 'GET',
    autoFetch: true,
    ...options,
  });
};

/**
 * 使用POST请求的钩子
 * @param {string} url - 请求URL
 * @param {Object} options - 配置选项
 * @returns {Object} - API请求状态和函数
 */
export const usePost = (url, options = {}) => {
  return useApi({
    url,
    method: 'POST',
    ...options,
  });
};

/**
 * 使用PUT请求的钩子
 * @param {string} url - 请求URL
 * @param {Object} options - 配置选项
 * @returns {Object} - API请求状态和函数
 */
export const usePut = (url, options = {}) => {
  return useApi({
    url,
    method: 'PUT',
    ...options,
  });
};

/**
 * 使用PATCH请求的钩子
 * @param {string} url - 请求URL
 * @param {Object} options - 配置选项
 * @returns {Object} - API请求状态和函数
 */
export const usePatch = (url, options = {}) => {
  return useApi({
    url,
    method: 'PATCH',
    ...options,
  });
};

/**
 * 使用DELETE请求的钩子
 * @param {string} url - 请求URL
 * @param {Object} options - 配置选项
 * @returns {Object} - API请求状态和函数
 */
export const useDelete = (url, options = {}) => {
  return useApi({
    url,
    method: 'DELETE',
    ...options,
  });
};

/**
 * 使用上传文件的钩子
 * @param {string} url - 请求URL
 * @param {Object} options - 配置选项
 * @returns {Object} - 上传状态和函数
 */
export const useUpload = (url, options = {}) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // 上传文件
  const upload = useCallback(async (formData) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const result = await apiClient.upload(url, formData, (percent) => {
        setProgress(percent);
      });

      setResponse(result.data);
      setUploading(false);

      if (options.onSuccess) {
        options.onSuccess(result.data);
      }

      return result.data;
    } catch (err) {
      setError(err);
      setUploading(false);

      if (options.onError) {
        options.onError(err);
      }

      throw err;
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
    data: response,
    upload,
    reset,
  };
};

/**
 * 使用下载文件的钩子
 * @param {string} url - 请求URL
 * @param {Object} options - 配置选项
 * @returns {Object} - 下载状态和函数
 */
export const useDownload = (url, options = {}) => {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  // 下载文件
  const download = useCallback(async (params = {}, filename) => {
    try {
      setDownloading(true);
      setError(null);
      setProgress(0);

      const result = await apiClient.download(url, params, (percent) => {
        setProgress(percent);
      });

      // 创建下载链接
      const blob = new Blob([result.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      link.remove();

      setDownloading(false);

      if (options.onSuccess) {
        options.onSuccess();
      }

      return true;
    } catch (err) {
      setError(err);
      setDownloading(false);

      if (options.onError) {
        options.onError(err);
      }

      throw err;
    }
  }, [url, options]);

  // 重置状态
  const reset = useCallback(() => {
    setProgress(0);
    setDownloading(false);
    setError(null);
  }, []);

  return {
    progress,
    downloading,
    error,
    download,
    reset,
  };
};

export default useApi;
