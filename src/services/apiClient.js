/**
 * API客户端
 *
 * 提供与后端API通信的基础功能，包括请求拦截、响应处理和错误处理
 */

import axios from 'axios';
import { getApiUrl } from '../config';

/**
 * 创建API客户端实例
 * @param {Object} options - 配置选项
 * @returns {Object} - API客户端实例
 */
export const createApiClient = (options = {}) => {
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
  });

  // 请求拦截器
  client.interceptors.request.use(
    (config) => {
      // 从localStorage获取token
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('添加认证令牌到请求头:', token);
      }

      // 开发环境下添加认证绕过头（仅对非登录请求）
      if (process.env.NODE_ENV === 'development' && !config.url.includes('/login')) {
        // 只有在没有token的情况下才添加绕过头
        if (!token) {
          config.headers['X-Bypass-Auth'] = 'true';
          config.headers['X-User-ID'] = '123e4567-e89b-12d3-a456-426614174000';
        }
      }

      // 开发环境下记录请求信息
      if (process.env.NODE_ENV === 'development') {
        console.log(`%c${config.method.toUpperCase()} ${config.url}`, 'color: #0066ff; font-weight: bold;');
        if (config.params) {
          console.log('Params:', config.params);
        }
        if (config.data) {
          console.log('Data:', config.data);
        }
      }

      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  client.interceptors.response.use(
    (response) => {
      // 开发环境下记录响应信息
      if (process.env.NODE_ENV === 'development') {
        console.log(`%cResponse: ${response.status}`, 'color: #00aa00; font-weight: bold;');
        console.log('Data:', response.data);
      }

      return response;
    },
    (error) => {
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
        const errorMessage = error.response.data?.message ||
                            error.response.data?.error ||
                            error.response.data?.detail ||
                            '请求失败';

        error.userMessage = errorMessage;
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('No response received:', error.request);
        error.userMessage = '服务器无响应，请检查网络连接';
      } else {
        // 请求配置出错
        console.error('Request error:', error.message);
        error.userMessage = '请求配置错误';
      }

      return Promise.reject(error);
    }
  );

  /**
   * 发送GET请求
   * @param {string} url - 请求URL
   * @param {Object} params - 请求参数
   * @param {Object} config - 请求配置
   * @returns {Promise} - 响应Promise
   */
  const get = (url, params = {}, config = {}) => {
    return client.get(url, { params, ...config });
  };

  /**
   * 发送POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} config - 请求配置
   * @returns {Promise} - 响应Promise
   */
  const post = (url, data = {}, config = {}) => {
    return client.post(url, data, config);
  };

  /**
   * 发送PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} config - 请求配置
   * @returns {Promise} - 响应Promise
   */
  const put = (url, data = {}, config = {}) => {
    return client.put(url, data, config);
  };

  /**
   * 发送PATCH请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} config - 请求配置
   * @returns {Promise} - 响应Promise
   */
  const patch = (url, data = {}, config = {}) => {
    return client.patch(url, data, config);
  };

  /**
   * 发送DELETE请求
   * @param {string} url - 请求URL
   * @param {Object} config - 请求配置
   * @returns {Promise} - 响应Promise
   */
  const del = (url, config = {}) => {
    return client.delete(url, config);
  };

  /**
   * 上传文件
   * @param {string} url - 请求URL
   * @param {FormData} formData - 表单数据
   * @param {Function} onProgress - 进度回调函数
   * @param {Object} config - 请求配置
   * @returns {Promise} - 响应Promise
   */
  const upload = (url, formData, onProgress, config = {}) => {
    return client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
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
   * @param {string} url - 请求URL
   * @param {Object} params - 请求参数
   * @param {Function} onProgress - 进度回调函数
   * @param {Object} config - 请求配置
   * @returns {Promise} - 响应Promise
   */
  const download = (url, params = {}, onProgress, config = {}) => {
    return client.get(url, {
      params,
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress) {
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
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} callbacks - 回调函数对象
   * @returns {Promise} - 响应Promise
   */
  const stream = async (url, data = {}, callbacks = {}) => {
    const { onStart, onContent, onComplete, onError } = callbacks;

    try {
      if (onStart) onStart();

      const response = await fetch(`${baseURL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '流式请求失败');
      }

      if (!response.body) {
        throw new Error('浏览器不支持ReadableStream');
      }

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullContent = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        if (onContent) onContent(chunk, fullContent);
      }

      if (onComplete) onComplete(fullContent);

      return fullContent;
    } catch (error) {
      console.error('Stream request failed:', error);
      if (onError) onError(error.message);
      throw error;
    }
  };

  // 返回客户端API
  return {
    client,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    download,
    stream,
  };
};

// 创建默认API客户端实例
const apiClient = createApiClient();

export default apiClient;
