import { useState } from 'react';

// 调试控制台相关逻辑
const useDebugConsole = () => {
  const [debugOutput, setDebugOutput] = useState('');

  // 添加输出到调试面板
  const appendToDebugOutput = (text) => {
    setDebugOutput(prev => prev + text + '\n');
  };

  // 清除调试输出
  const clearDebugOutput = () => {
    setDebugOutput('');
  };

  return {
    debugOutput,
    setDebugOutput,
    appendToDebugOutput,
    clearDebugOutput
  };
};

export default useDebugConsole;
