/**
 * 缓存管理器
 * 
 * 管理API响应的缓存，提供缓存读写、失效和预取功能
 */

// 缓存配置接口
interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate: boolean;
}

// 缓存项接口
interface CacheItem<T = any> {
  data: T;
  expiresAt: number;
  createdAt: number;
  config: CacheConfig;
}

// 缓存状态类型
type CacheStatus = 'hit' | 'miss' | 'stale' | 'expired';

// 缓存结果接口
interface CacheResult<T = any> {
  data: T | null;
  status: CacheStatus;
}

// 缓存统计信息接口
interface CacheStats {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  totalSizeBytes: number;
  totalSizeKB: number;
}

// 缓存存储
const cacheStore = new Map<string, CacheItem>();

// 缓存配置
const defaultConfig: CacheConfig = {
  maxAge: 5 * 60 * 1000, // 默认缓存5分钟
  staleWhileRevalidate: true, // 过期后仍返回旧数据，同时在后台刷新
};

/**
 * 生成缓存键
 * @param {string} url - 请求URL
 * @param {Object} params - 请求参数
 * @returns {string} - 缓存键
 */
export const generateCacheKey = (url: string, params: Record<string, any> = {}): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {} as Record<string, any>);

  return `${url}:${JSON.stringify(sortedParams)}`;
};

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {*} data - 缓存数据
 * @param {Object} config - 缓存配置
 */
export const setCache = <T = any>(key: string, data: T, config: Partial<CacheConfig> = {}): void => {
  const cacheConfig = { ...defaultConfig, ...config };
  const expiresAt = Date.now() + cacheConfig.maxAge;

  cacheStore.set(key, {
    data,
    expiresAt,
    createdAt: Date.now(),
    config: cacheConfig,
  });
};

/**
 * 获取缓存
 * @param {string} key - 缓存键
 * @returns {Object} - 缓存数据和状态
 */
export const getCache = <T = any>(key: string): CacheResult<T> => {
  const cache = cacheStore.get(key);

  if (!cache) {
    return { data: null, status: 'miss' };
  }

  const now = Date.now();
  const isExpired = now > cache.expiresAt;

  if (!isExpired) {
    return { data: cache.data, status: 'hit' };
  }

  // 缓存已过期
  if (cache.config.staleWhileRevalidate) {
    return { data: cache.data, status: 'stale' };
  }

  return { data: null, status: 'expired' };
};

/**
 * 删除缓存
 * @param {string} key - 缓存键
 * @returns {boolean} - 是否成功删除
 */
export const removeCache = (key: string): boolean => {
  return cacheStore.delete(key);
};

/**
 * 清除所有缓存
 */
export const clearCache = (): void => {
  cacheStore.clear();
};

/**
 * 清除匹配模式的缓存
 * @param {RegExp|string} pattern - 匹配模式
 */
export const clearCacheByPattern = (pattern: RegExp | string): void => {
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);

  for (const key of cacheStore.keys()) {
    if (regex.test(key)) {
      cacheStore.delete(key);
    }
  }
};

/**
 * 获取缓存统计信息
 * @returns {Object} - 缓存统计信息
 */
export const getCacheStats = (): CacheStats => {
  const now = Date.now();
  let totalSize = 0;
  let validCount = 0;
  let expiredCount = 0;

  for (const [key, cache] of cacheStore.entries()) {
    const isExpired = now > cache.expiresAt;
    
    if (isExpired) {
      expiredCount++;
    } else {
      validCount++;
    }

    // 估算缓存大小（字节）
    const keySize = key.length * 2; // 假设每个字符占2字节
    const dataSize = JSON.stringify(cache.data).length * 2;
    totalSize += keySize + dataSize;
  }

  return {
    totalEntries: cacheStore.size,
    validEntries: validCount,
    expiredEntries: expiredCount,
    totalSizeBytes: totalSize,
    totalSizeKB: Math.round(totalSize / 1024),
  };
};

/**
 * 缓存API响应
 * @param {Function} apiCall - API调用函数
 * @param {string} url - 请求URL
 * @param {Object} params - 请求参数
 * @param {Object} cacheConfig - 缓存配置
 * @returns {Promise<*>} - API响应
 */
export const cacheApiResponse = async <T = any>(
  apiCall: () => Promise<T>,
  url: string,
  params: Record<string, any> = {},
  cacheConfig: Partial<CacheConfig> = {}
): Promise<T> => {
  const cacheKey = generateCacheKey(url, params);
  const { data, status } = getCache<T>(cacheKey);

  // 缓存命中
  if (status === 'hit') {
    return data as T;
  }

  // 缓存过期但可用
  if (status === 'stale') {
    // 在后台刷新缓存
    setTimeout(async () => {
      try {
        const freshData = await apiCall();
        setCache(cacheKey, freshData, cacheConfig);
      } catch (error) {
        console.error('Background cache refresh failed:', error);
      }
    }, 0);

    return data as T;
  }

  // 缓存未命中或已过期
  try {
    const freshData = await apiCall();
    setCache(cacheKey, freshData, cacheConfig);
    return freshData;
  } catch (error) {
    throw error;
  }
};

/**
 * 预取API响应
 * @param {Function} apiCall - API调用函数
 * @param {string} url - 请求URL
 * @param {Object} params - 请求参数
 * @param {Object} cacheConfig - 缓存配置
 * @returns {Promise<void>}
 */
export const prefetchApiResponse = async <T = any>(
  apiCall: () => Promise<T>,
  url: string,
  params: Record<string, any> = {},
  cacheConfig: Partial<CacheConfig> = {}
): Promise<void> => {
  const cacheKey = generateCacheKey(url, params);
  
  try {
    const data = await apiCall();
    setCache(cacheKey, data, cacheConfig);
  } catch (error) {
    console.error('Prefetch failed:', error);
  }
};

export default {
  generateCacheKey,
  setCache,
  getCache,
  removeCache,
  clearCache,
  clearCacheByPattern,
  getCacheStats,
  cacheApiResponse,
  prefetchApiResponse,
}; 