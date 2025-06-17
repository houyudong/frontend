import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { STM_SERVICE_URL } from '../constants';

interface ServiceStatus {
  isRunning: boolean;
  version: string;
  lastCheck: string;
  error: string | null;
}

interface UseServiceStatusReturn extends ServiceStatus {
  checkStatus: () => Promise<void>;
  startService: () => Promise<void>;
  stopService: () => Promise<void>;
  restartService: () => Promise<void>;
}

/**
 * useServiceStatus - 服务状态Hook
 * 
 * 用于监控和管理STM32服务状态。
 * 
 * @returns {UseServiceStatusReturn} 服务状态和操作方法
 */
const useServiceStatus = (): UseServiceStatusReturn => {
  const [status, setStatus] = useState<ServiceStatus>({
    isRunning: false,
    version: '',
    lastCheck: '',
    error: null
  });

  const checkStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${STM_SERVICE_URL}/status`);
      setStatus({
        isRunning: response.data.isRunning,
        version: response.data.version,
        lastCheck: new Date().toISOString(),
        error: null
      });
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : '检查服务状态失败'
      }));
    }
  }, []);

  const startService = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, error: null }));
      await axios.post(`${STM_SERVICE_URL}/start`);
      await checkStatus();
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '启动服务失败'
      }));
    }
  }, [checkStatus]);

  const stopService = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, error: null }));
      await axios.post(`${STM_SERVICE_URL}/stop`);
      await checkStatus();
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '停止服务失败'
      }));
    }
  }, [checkStatus]);

  const restartService = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, error: null }));
      await axios.post(`${STM_SERVICE_URL}/restart`);
      await checkStatus();
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '重启服务失败'
      }));
    }
  }, [checkStatus]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return {
    ...status,
    checkStatus,
    startService,
    stopService,
    restartService
  };
};

export default useServiceStatus; 