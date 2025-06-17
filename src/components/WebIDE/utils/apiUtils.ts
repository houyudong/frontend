import axios, { AxiosError, AxiosResponse } from 'axios';

interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

interface ApiResponseData {
  message?: string;
  [key: string]: unknown;
}

/**
 * 处理API错误
 * @param {unknown} error - 错误对象
 * @returns {ApiError} 处理后的错误信息
 */
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponseData>;
    return {
      message: axiosError.response?.data?.message || axiosError.message,
      code: axiosError.code,
      details: axiosError.response?.data
    };
  }
  return {
    message: error instanceof Error ? error.message : '未知错误',
    details: error
  };
};

/**
 * 创建API请求实例
 * @param {string} baseURL - 基础URL
 * @returns {typeof axios} axios实例
 */
export const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const apiError = handleApiError(error);
      console.error('API请求失败:', apiError);
      return Promise.reject(apiError);
    }
  );

  return client;
};

/**
 * 检查API响应是否成功
 * @param {AxiosResponse} response - API响应
 * @returns {boolean} 是否成功
 */
export const isApiResponseSuccess = (response: AxiosResponse): boolean => {
  return response.status >= 200 && response.status < 300;
};

/**
 * 获取API响应数据
 * @param {AxiosResponse} response - API响应
 * @returns {unknown} 响应数据
 */
export const getApiResponseData = (response: AxiosResponse): unknown => {
  return response.data;
}; 