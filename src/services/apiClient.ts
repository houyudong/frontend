/**
 * API客户端
 *
 * 提供与后端API通信的基础功能，包括请求拦截、响应处理和错误处理
 */

import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosProgressEvent
} from 'axios';
import { getApiUrl } from '../config';

// 类型定义
interface ApiClientOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

interface StreamCallbacks {
  onStart?: () => void;
  onContent?: (content: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

interface ApiClient extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'patch' | 'delete'> {
  get: <T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  upload: <T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  download: <T = any>(url: string, params?: Record<string, any>, onProgress?: (progress: number) => void, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  stream: (url: string, data?: any, callbacks?: StreamCallbacks) => Promise<void>;
}

/**
 * 创建API客户端实例
 * @param options - 配置选项
 * @returns API客户端实例
 */
export const createApiClient = (options: ApiClientOptions = {}): ApiClient => {
  const {
    baseURL = getApiUrl(),
    timeout = 30000,
    headers = {},
    withCredentials = true,
  } = options;

  // 创建axios实例
  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    withCredentials,
  }) as unknown as ApiClient;

  // 请求拦截器
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 从localStorage获取token
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('添加认证令牌到请求头:', token);
      }

      // 开发环境下添加认证绕过头（仅对非登录请求）
      if (process.env.NODE_ENV === 'development' && !config.url?.includes('/login')) {
        // 只有在没有token的情况下才添加绕过头
        if (!token && config.headers) {
          config.headers['X-Bypass-Auth'] = 'true';
          config.headers['X-User-ID'] = '123e4567-e89b-12d3-a456-426614174000';
        }
      }

      // 开发环境下记录请求信息
      if (process.env.NODE_ENV === 'development') {
        console.log(`%c${config.method?.toUpperCase()} ${config.url}`, 'color: #0066ff; font-weight: bold;');
        if (config.params) {
          console.log('Params:', config.params);
        }
        if (config.data) {
          console.log('Data:', config.data);
        }
      }

      return config;
    },
    (error: AxiosError) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // 开发环境下记录响应信息
      if (process.env.NODE_ENV === 'development') {
        console.log(`%cResponse: ${response.status}`, 'color: #00aa00; font-weight: bold;');
        console.log('Data:', response.data);
      }

      return response;
    },
    (error: AxiosError) => {
      // 处理错误响应
      if (error.response) {
        // 服务器返回错误状态码
        console.error(`Error ${error.response.status}: ${error.response.statusText}`);

        // 处理401错误（未授权）
        if (error.response.status === 401) {
          // 清除token并重定向到登录页
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');

          // 如果不是登录页面，则重定向到登录页
          if (window.location.pathname !== '/login') {
            // 保存当前路径，用于登录后重定向
            sessionStorage.setItem('redirectPath', window.location.pathname);
            window.location.href = '/login';
          }
        }

        // 处理403错误（禁止访问）
        if (error.response.status === 403) {
          console.error('Access forbidden');
        }

        // 处理404错误（资源不存在）
        if (error.response.status === 404) {
          console.error('Resource not found');
        }

        // 处理500错误（服务器错误）
        if (error.response.status >= 500) {
          console.error('Server error');
        }

        // 提取错误消息
        const errorData = error.response.data as Record<string, any>;
        const errorMessage = errorData?.message ||
                            errorData?.error ||
                            errorData?.detail ||
                            '请求失败';

        (error as any).userMessage = errorMessage;
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('No response received:', error.request);
        (error as any).userMessage = '服务器无响应，请检查网络连接';
      } else {
        // 请求配置出错
        console.error('Request error:', error.message);
        (error as any).userMessage = '请求配置错误';
      }

      return Promise.reject(error);
    }
  );

  /**
   * 发送GET请求
   * @param url - 请求URL
   * @param params - 请求参数
   * @param config - 请求配置
   * @returns 响应Promise
   */
  client.get = <T = any>(url: string, params: Record<string, any> = {}, config: AxiosRequestConfig = {}) => {
    return client.get<T>(url, { params, ...config });
  };

  /**
   * 发送POST请求
   * @param url - 请求URL
   * @param data - 请求数据
   * @param config - 请求配置
   * @returns 响应Promise
   */
  client.post = <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}) => {
    return client.post<T>(url, data, config);
  };

  /**
   * 发送PUT请求
   * @param url - 请求URL
   * @param data - 请求数据
   * @param config - 请求配置
   * @returns 响应Promise
   */
  client.put = <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}) => {
    return client.put<T>(url, data, config);
  };

  /**
   * 发送PATCH请求
   * @param url - 请求URL
   * @param data - 请求数据
   * @param config - 请求配置
   * @returns 响应Promise
   */
  client.patch = <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}) => {
    return client.patch<T>(url, data, config);
  };

  /**
   * 发送DELETE请求
   * @param url - 请求URL
   * @param config - 请求配置
   * @returns 响应Promise
   */
  client.delete = <T = any>(url: string, config: AxiosRequestConfig = {}) => {
    return client.delete<T>(url, config);
  };

  /**
   * 上传文件
   * @param url - 请求URL
   * @param formData - 表单数据
   * @param onProgress - 进度回调函数
   * @param config - 请求配置
   * @returns 响应Promise
   */
  client.upload = <T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void, config: AxiosRequestConfig = {}) => {
    return client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
      ...config,
    });
  };

  /**
   * 下载文件
   * @param url - 请求URL
   * @param params - 请求参数
   * @param onProgress - 进度回调函数
   * @param config - 请求配置
   * @returns 响应Promise
   */
  client.download = <T = any>(url: string, params: Record<string, any> = {}, onProgress?: (progress: number) => void, config: AxiosRequestConfig = {}) => {
    return client.get<T>(url, {
      params,
      responseType: 'blob',
      onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
      ...config,
    });
  };

  /**
   * 发送流式请求
   * @param url - 请求URL
   * @param data - 请求数据
   * @param callbacks - 回调函数对象
   * @returns Promise
   */
  client.stream = async (url: string, data: any = {}, callbacks: StreamCallbacks = {}) => {
    const { onStart, onContent, onComplete, onError } = callbacks;

    try {
      onStart?.();

      const response = await client.post(url, data, {
        responseType: 'stream',
      });

      const reader = response.data.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const content = decoder.decode(value);
        onContent?.(content);
      }

      onComplete?.();
    } catch (error) {
      onError?.(error as Error);
      throw error;
    }
  };

  return client;
};

// 创建默认API客户端实例
const apiClient = createApiClient();

export default apiClient; 