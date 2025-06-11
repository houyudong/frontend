import React, { useState, useEffect } from 'react';
import {
  FiInfo,
  FiX,
  FiAlertTriangle,
  FiSearch,
  FiRefreshCw,
  FiTrash2,
  FiCpu,
  FiCode
} from 'react-icons/fi';
import ErrorDebugger from './ErrorDebugger';

// 典型错误示例
const ERROR_EXAMPLES = [
  {
    name: '链接错误: 未定义引用',
    error: "undefined reference to `HAL_GPIO_TogglePin'",
    description: '链接器找不到函数或变量的定义'
  },
  {
    name: '编译错误: 找不到头文件',
    error: "error: 'stm32f1xx_hal.h' file not found",
    description: '编译器找不到指定的头文件'
  },
  {
    name: '运行时错误: 硬件故障',
    error: "Hard fault exception occurred at PC = 0x08001234",
    description: '程序运行时发生硬件故障异常'
  },
  {
    name: '编译错误: 语法错误',
    error: "expected ';' before '}' token",
    description: '代码中缺少分号或存在其他语法错误'
  },
  {
    name: '链接错误: 缺少库文件',
    error: "cannot find -lm",
    description: '链接器找不到指定的库文件'
  },
  {
    name: '运行时错误: 栈溢出',
    error: "Stack overflow detected, PC = 0x08002345",
    description: '程序运行时发生栈溢出错误'
  }
];

// MCU型号列表
const MCU_MODELS = [
  'STM32F103',
  'STM32F407',
  'STM32F429',
  'STM32H743',
  'STM32L476',
  'STM32G474'
];

/**
 * ErrorDebuggerContainer - 错误调试器容器组件
 *
 * 包装错误调试器组件，提供输入表单和使用指南。
 * 支持分析和解决STM32开发中的编译错误、链接错误和运行时错误。
 * 提供典型错误示例、错误分析和解决方案建议。
 *
 * @component
 * @example
 * ```jsx
 * <ErrorDebuggerContainer />
 * ```
 *
 * @returns {ReactElement} ErrorDebuggerContainer组件
 */
const ErrorDebuggerContainer = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [mcuModel, setMcuModel] = useState(MCU_MODELS[0]);
  const [showDebugger, setShowDebugger] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamProgress, setStreamProgress] = useState(0);

  // 监听自定义事件，显示使用指南
  useEffect(() => {
    const handleShowGuide = () => {
      setShowGuide(true);
    };

    window.addEventListener('debugger-show-guide', handleShowGuide);

    return () => {
      window.removeEventListener('debugger-show-guide', handleShowGuide);
    };
  }, []);

  // 提交错误进行分析
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!errorMessage.trim()) {
      alert('请输入错误信息');
      return;
    }

    setIsAnalyzing(true);
    setStreamProgress(0);

    // 模拟进度条
    const interval = setInterval(() => {
      setStreamProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    // 完成分析
    setTimeout(() => {
      clearInterval(interval);
      setStreamProgress(100);
      setShowDebugger(true);
      setIsAnalyzing(false);
    }, 1000);
  };

  // 处理错误示例选择
  const handleExampleSelect = (example) => {
    setErrorMessage(example.error);
  };

  // 处理MCU型号变更
  const handleMcuModelChange = (e) => {
    setMcuModel(e.target.value);
  };

  // 处理解决方案更新
  const handleSolutionUpdate = (solution) => {
    setLastAnalysis(solution);
  };

  // 重置表单
  const handleReset = () => {
    if (window.confirm('确定要清除所有内容吗？')) {
      setErrorMessage('');
      setSourceCode('');
      setShowDebugger(false);
      setLastAnalysis(null);
    }
  };

  return (
    <div className="error-debugger-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧输入区域 */}
        <div className="space-y-6">
          {/* 输入表单 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FiAlertTriangle className="mr-2 text-amber-500" />
                  错误分析
                </h2>
                <button
                  onClick={() => setShowGuide(true)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  title="查看使用指南"
                >
                  <FiInfo className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="errorMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    错误信息
                  </label>
                  <textarea
                    id="errorMessage"
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    value={errorMessage}
                    onChange={(e) => setErrorMessage(e.target.value)}
                    placeholder="粘贴编译错误、链接错误或运行时错误信息..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="sourceCode" className="block text-sm font-medium text-gray-700 mb-1">
                    源代码（可选）
                  </label>
                  <textarea
                    id="sourceCode"
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    placeholder="粘贴导致错误的源代码（可选）..."
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="mcuModel" className="block text-sm font-medium text-gray-700 mb-1">
                    MCU型号
                  </label>
                  <select
                    id="mcuModel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={mcuModel}
                    onChange={handleMcuModelChange}
                  >
                    {MCU_MODELS.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-2 ${
                      isAnalyzing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700'
                    } text-white rounded-md shadow-sm flex items-center justify-center`}
                    disabled={isAnalyzing || !errorMessage.trim()}
                  >
                    {isAnalyzing ? (
                      <>
                        <FiRefreshCw className="animate-spin mr-2" />
                        分析中...
                      </>
                    ) : (
                      <>
                        <FiSearch className="mr-2" />
                        分析错误
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow-sm"
                    onClick={handleReset}
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {/* 进度条 */}
                {isAnalyzing && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${streamProgress}%` }}
                    ></div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* 典型错误示例 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiCode className="mr-2 text-primary-500" />
                典型错误示例
              </h3>

              <div className="space-y-2">
                {ERROR_EXAMPLES.map((example, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                    onClick={() => handleExampleSelect(example)}
                  >
                    <div className="font-medium text-gray-900">{example.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{example.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 历史分析记录 */}
          {lastAnalysis && !showDebugger && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">最近分析</h3>

                <div className="mb-2">
                  <span className="font-medium">错误类型:</span> {lastAnalysis.type}
                </div>

                <div className="mb-2">
                  <span className="font-medium">分析:</span>
                  <p className="mt-1 text-gray-700">{lastAnalysis.analysis}</p>
                </div>

                {lastAnalysis.solution && (
                  <div className="mb-2">
                    <span className="font-medium">解决方案:</span>
                    <p className="mt-1 text-gray-700">{lastAnalysis.solution}</p>
                  </div>
                )}

                <button
                  className="mt-4 px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700"
                  onClick={() => setShowDebugger(true)}
                >
                  查看详细分析
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 右侧分析结果 */}
        <div className="space-y-6">
          {/* 错误分析器组件 */}
          {showDebugger && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">错误分析结果</h2>
              <ErrorDebugger
                errorCode={errorMessage}
                sourceCode={sourceCode}
                mcuModel={mcuModel}
                onUpdateSolution={handleSolutionUpdate}
              />
            </div>
          )}

          {/* 当没有调试器和分析时显示空白状态 */}
          {!showDebugger && !lastAnalysis && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 min-h-[350px] flex items-center justify-center">
              <div>
                <FiCpu className="mx-auto h-16 w-16 text-gray-300" />
                <p className="mt-4">输入错误信息，然后点击"分析错误"开始分析</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 使用指南对话框 */}
      {showGuide && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FiInfo className="mr-2 text-blue-500" />
                  错误调试器使用指南
                </h2>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4">
                <p className="mb-4 text-gray-700">
                  错误调试器可以帮助你分析和解决STM32开发中遇到的各种错误，包括编译错误、链接错误和运行时错误。
                </p>

                <h4 className="font-semibold text-blue-800 mb-2">使用方法</h4>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>复制STM32项目的编译错误、链接错误或运行时错误日志</li>
                  <li>粘贴到错误消息文本框中</li>
                  <li>可选择性地粘贴导致错误的源代码</li>
                  <li>选择正确的MCU型号</li>
                  <li>点击"分析错误"按钮</li>
                  <li>查看分析结果和解决方案</li>
                </ul>

                <h4 className="font-semibold text-blue-800 mb-2">支持的错误类型</h4>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li><strong>编译错误</strong> - 语法错误、缺少头文件、类型错误等</li>
                  <li><strong>链接错误</strong> - 未定义引用、缺少库文件等</li>
                  <li><strong>运行时错误</strong> - 硬件故障、栈溢出、看门狗超时等</li>
                  <li><strong>硬件错误</strong> - 通信超时、硬件连接问题等</li>
                </ul>

                <h4 className="font-semibold text-blue-800 mb-2">AI辅助分析</h4>
                <p className="text-gray-700 mb-2">
                  错误调试器使用AI技术分析错误并提供解决方案，包括：
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>详细的错误原因分析</li>
                  <li>针对性的解决方案建议</li>
                  <li>代码修复建议（如果提供了源代码）</li>
                </ul>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowGuide(false)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDebuggerContainer;
