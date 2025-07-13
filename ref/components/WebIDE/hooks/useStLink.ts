import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { STLINK_API } from '../constants';

interface StLinkState {
  isConnected: boolean;
  isRunning: boolean;
  isFlashing: boolean;
  isErasing: boolean;
  error: string | null;
  deviceInfo: {
    name: string;
    version: string;
    serialNumber: string;
  } | null;
}

interface UseStLinkReturn extends StLinkState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  flash: (filePath: string) => Promise<void>;
  verify: (filePath: string) => Promise<void>;
  erase: () => Promise<void>;
  reset: () => Promise<void>;
}

/**
 * useStLink - ST-Link调试器Hook
 * 
 * 用于管理ST-Link调试器的连接状态和操作。
 * 
 * @returns {UseStLinkReturn} ST-Link调试器状态和操作方法
 */
const useStLink = (): UseStLinkReturn => {
  const [state, setState] = useState<StLinkState>({
    isConnected: false,
    isRunning: false,
    isFlashing: false,
    isErasing: false,
    error: null,
    deviceInfo: null
  });

  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const response = await axios.post(STLINK_API.CONNECT);
      setState(prev => ({
        ...prev,
        isConnected: true,
        deviceInfo: response.data
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '连接失败'
      }));
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await axios.post(STLINK_API.DISCONNECT);
      setState(prev => ({
        ...prev,
        isConnected: false,
        deviceInfo: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '断开连接失败'
      }));
    }
  }, []);

  const flash = useCallback(async (filePath: string) => {
    try {
      setState(prev => ({ ...prev, error: null, isFlashing: true }));
      await axios.post(STLINK_API.FLASH, { filePath });
      setState(prev => ({ ...prev, isFlashing: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isFlashing: false,
        error: error instanceof Error ? error.message : '烧录失败'
      }));
    }
  }, []);

  const verify = useCallback(async (filePath: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await axios.post(STLINK_API.VERIFY, { filePath });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '验证失败'
      }));
    }
  }, []);

  const erase = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null, isErasing: true }));
      await axios.post(STLINK_API.ERASE);
      setState(prev => ({ ...prev, isErasing: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isErasing: false,
        error: error instanceof Error ? error.message : '擦除失败'
      }));
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await axios.post(STLINK_API.RESET);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '复位失败'
      }));
    }
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axios.get(STLINK_API.STATUS);
        setState(prev => ({
          ...prev,
          isConnected: response.data.isConnected,
          deviceInfo: response.data.deviceInfo
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          deviceInfo: null
        }));
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    flash,
    verify,
    erase,
    reset
  };
};

export default useStLink; 