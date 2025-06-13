import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

interface NavigateOptions {
  replace?: boolean;
  state?: any;
}

interface QueryParams {
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * 路由钩子
 * 
 * 提供路由相关功能的自定义钩子
 * 
 * @returns 路由相关功能
 */
const useRouting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  /**
   * 导航到指定路径
   * @param path - 目标路径
   * @param options - 导航选项
   */
  const navigateTo = useCallback((path: string, options: NavigateOptions = {}) => {
    const { replace = false, state } = options;
    navigate(path, { replace, state });
  }, [navigate]);
  
  /**
   * 返回上一页
   */
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  
  /**
   * 前进到下一页
   */
  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);
  
  /**
   * 刷新当前页面
   */
  const refreshPage = useCallback(() => {
    navigate(0);
  }, [navigate]);
  
  /**
   * 设置页面标题
   * @param title - 页面标题
   */
  const setPageTitle = useCallback((title: string) => {
    document.title = title ? `${title} - STM32 AI嵌入式教学平台` : 'STM32 AI嵌入式教学平台';
  }, []);
  
  /**
   * 获取查询参数
   * @returns 查询参数对象
   */
  const getQueryParams = useCallback(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);
  
  /**
   * 获取指定查询参数的值
   * @param name - 参数名
   * @returns 参数值
   */
  const getQueryParam = useCallback((name: string): string | null => {
    return getQueryParams().get(name);
  }, [getQueryParams]);
  
  /**
   * 导航到带查询参数的路径
   * @param path - 基础路径
   * @param params - 查询参数对象
   * @param options - 导航选项
   */
  const navigateWithParams = useCallback((path: string, params: QueryParams = {}, options: NavigateOptions = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;
    
    navigateTo(fullPath, options);
  }, [navigateTo]);
  
  /**
   * 更新查询参数并导航
   * @param params - 要更新的查询参数
   * @param options - 导航选项
   */
  const updateQueryParams = useCallback((params: QueryParams = {}, options: NavigateOptions = {}) => {
    const currentParams = getQueryParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        currentParams.delete(key);
      } else {
        currentParams.set(key, String(value));
      }
    });
    
    const queryString = currentParams.toString();
    const fullPath = queryString 
      ? `${location.pathname}?${queryString}` 
      : location.pathname;
    
    navigateTo(fullPath, options);
  }, [getQueryParams, location.pathname, navigateTo]);
  
  // 当路径变化时自动滚动到页面顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return {
    navigateTo,
    goBack,
    goForward,
    refreshPage,
    setPageTitle,
    getQueryParams,
    getQueryParam,
    navigateWithParams,
    updateQueryParams,
    location,
    params
  };
};

export default useRouting; 