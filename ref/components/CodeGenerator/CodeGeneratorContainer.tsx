import React, { useState, useEffect } from 'react';
import { FiInfo, FiX } from 'react-icons/fi';
import CodeGenerator from './CodeGenerator';

interface CodeGeneratorContainerProps {
  initialPrompt?: string;
}

/**
 * CodeGeneratorContainer - 代码生成器容器组件
 *
 * 包装代码生成器组件，提供使用指南和布局。
 * 支持通过initialPrompt属性传入初始提示，用于预设生成任务。
 * 提供使用指南对话框，帮助用户了解如何编写有效的提示和使用代码生成器。
 *
 * @component
 * @example
 * ```tsx
 * // 基本用法
 * <CodeGeneratorContainer />
 *
 * // 带初始提示
 * <CodeGeneratorContainer initialPrompt="使用STM32F103和HAL库，编写一个程序控制LED闪烁，频率为1Hz。" />
 * ```
 *
 * @param {CodeGeneratorContainerProps} props - 组件属性
 * @param {string} [props.initialPrompt=""] - 初始提示文本
 * @returns {ReactElement} CodeGeneratorContainer组件
 */
const CodeGeneratorContainer: React.FC<CodeGeneratorContainerProps> = ({ initialPrompt = '' }) => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // 监听自定义事件，显示使用指南
  useEffect(() => {
    const handleShowGuide = () => {
      setShowGuide(true);
    };

    window.addEventListener('codegen-show-guide', handleShowGuide);

    return () => {
      window.removeEventListener('codegen-show-guide', handleShowGuide);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 代码生成器组件 */}
      <CodeGenerator initialPrompt={initialPrompt} />

      {/* 使用指南对话框 */}
      {showGuide && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiInfo className="mr-2 text-blue-500" />
                  代码生成器使用帮助
                </h2>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4">
                <p className="mb-4 text-sm text-gray-700">
                  AI代码生成器可以根据你的自然语言描述生成STM32嵌入式代码。以下是一些使用技巧：
                </p>

                <h4 className="font-medium text-blue-700 mb-2 text-sm">如何编写有效的提示</h4>
                <ul className="list-disc pl-5 text-sm text-gray-700 mb-4">
                  <li>尽可能详细地描述你想要实现的功能</li>
                  <li>指定硬件细节，如使用的芯片型号、引脚连接等</li>
                  <li>说明你希望使用的库或框架（如HAL库、LL库等）</li>
                  <li>提供具体的参数，如时间间隔、通信速率等</li>
                </ul>

                <h4 className="font-medium text-blue-700 mb-2 text-sm">提示示例</h4>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4 text-sm">
                  <p className="text-gray-700">
                    使用STM32H7和HAL库，编写一个程序控制连接到PE3的LED每500毫秒闪烁一次。
                  </p>
                </div>

                <h4 className="font-medium text-blue-700 mb-2 text-sm">提示模板</h4>
                <p className="text-sm text-gray-700 mb-2">
                  页面左下方提供了常用的提示模板，点击即可快速使用。
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowGuide(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
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

export default CodeGeneratorContainer; 