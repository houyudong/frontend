import { useState, useCallback } from 'react';
import axios from 'axios';
import { COMPILER_API } from '../constants';

interface CompilerSettings {
  optimization: 'O0' | 'O1' | 'O2' | 'O3';
  debug: boolean;
  warnings: boolean;
  mcu: string;
}

interface CompilerOutput {
  success: boolean;
  output: string;
  errors: string[];
  warnings: string[];
  hexFile?: string;
}

interface UseCompilerReturn {
  settings: CompilerSettings;
  output: CompilerOutput | null;
  isCompiling: boolean;
  error: string | null;
  updateSettings: (settings: Partial<CompilerSettings>) => void;
  compile: (files: string[]) => Promise<void>;
  resetOutput: () => void;
}

/**
 * useCompiler - 编译器Hook
 * 
 * 用于管理编译设置和执行编译操作。
 * 
 * @returns {UseCompilerReturn} 编译器状态和操作方法
 */
const useCompiler = (): UseCompilerReturn => {
  const [settings, setSettings] = useState<CompilerSettings>({
    optimization: 'O0',
    debug: true,
    warnings: true,
    mcu: 'STM32F103C8T6'
  });

  const [output, setOutput] = useState<CompilerOutput | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = useCallback((newSettings: Partial<CompilerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const compile = useCallback(async (files: string[]) => {
    try {
      setIsCompiling(true);
      setError(null);
      setOutput(null);

      const response = await axios.post(COMPILER_API.COMPILE, {
        files,
        settings
      });

      setOutput(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '编译失败');
    } finally {
      setIsCompiling(false);
    }
  }, [settings]);

  const resetOutput = useCallback(() => {
    setOutput(null);
    setError(null);
  }, []);

  return {
    settings,
    output,
    isCompiling,
    error,
    updateSettings,
    compile,
    resetOutput
  };
};

export default useCompiler; 