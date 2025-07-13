import { useState, useCallback } from 'react';

interface UseDebugConsoleReturn {
  debugOutput: string;
  appendToDebugOutput: (message: string) => void;
  clearDebugOutput: () => void;
}

/**
 * useDebugConsole - 调试控制台Hook
 * 
 * 用于管理调试输出信息。
 * 
 * @returns {UseDebugConsoleReturn} 调试控制台状态和操作方法
 */
const useDebugConsole = (): UseDebugConsoleReturn => {
  const [debugOutput, setDebugOutput] = useState<string>('');

  const appendToDebugOutput = useCallback((message: string) => {
    setDebugOutput(prev => {
      const timestamp = new Date().toLocaleTimeString();
      return `${prev}[${timestamp}] ${message}\n`;
    });
  }, []);

  const clearDebugOutput = useCallback(() => {
    setDebugOutput('');
  }, []);

  return {
    debugOutput,
    appendToDebugOutput,
    clearDebugOutput
  };
};

export default useDebugConsole; 