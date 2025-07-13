import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiCode, FiCpu, FiInfo } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface ErrorAnalysis {
  type: string;
  analysis: string;
  solution: string;
  code?: string;
  severity: 'error' | 'warning' | 'info';
  mcuModel: string;
}

interface ErrorDebuggerProps {
  errorCode: string;
  sourceCode?: string;
  mcuModel: string;
  onUpdateSolution?: (solution: ErrorAnalysis) => void;
}

/**
 * ErrorDebugger - 错误调试器组件
 *
 * 分析和解决STM32开发中的编译错误、链接错误和运行时错误。
 * 提供错误分析、解决方案建议和代码修复建议。
 *
 * @component
 * @example
 * ```tsx
 * <ErrorDebugger
 *   errorCode="undefined reference to `HAL_GPIO_TogglePin'"
 *   sourceCode="#include <stm32f1xx_hal.h>\nvoid main() { HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13); }"
 *   mcuModel="STM32F103"
 *   onUpdateSolution={(solution) => console.log(solution)}
 * />
 * ```
 *
 * @param {ErrorDebuggerProps} props - 组件属性
 * @returns {ReactElement} ErrorDebugger组件
 */
const ErrorDebugger: React.FC<ErrorDebuggerProps> = ({ errorCode, sourceCode, mcuModel, onUpdateSolution }) => {
  const [analysis, setAnalysis] = useState<ErrorAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'solution' | 'code'>('analysis');

  // 模拟错误分析
  useEffect(() => {
    if (!errorCode) return;

    // 分析错误类型和原因
    const analyzeError = (): ErrorAnalysis => {
      // 根据错误信息确定错误类型
      let errorType = 'unknown';
      let errorAnalysis = '';
      let errorSolution = '';
      let codeExample = '';
      let errorSeverity: 'error' | 'warning' | 'info' = 'warning';

      // 链接错误：未定义引用
      if (errorCode.includes('undefined reference')) {
        errorType = '链接错误';
        errorSeverity = 'error';
        
        if (errorCode.includes('HAL_')) {
          errorAnalysis = '链接器找不到HAL库函数的定义。这通常是由于缺少HAL库文件或未正确配置链接器设置导致的。';
          errorSolution = '1. 确保已包含正确的HAL库文件\n2. 检查项目设置中是否正确配置了HAL库路径\n3. 确保在Makefile或项目配置中包含了相应的库文件';
          codeExample = `# 在Makefile中添加HAL库
LIBS += -lSTM32F1xx_HAL_Driver

# 或者确保包含HAL库源文件
SRC += $(HAL_DIR)/Src/stm32f1xx_hal_gpio.c
SRC += $(HAL_DIR)/Src/stm32f1xx_hal.c`;
        } else {
          errorAnalysis = '链接器找不到函数或变量的定义。这可能是由于缺少实现文件、库文件或未正确声明函数导致的。';
          errorSolution = '1. 确保函数或变量已在某处定义\n2. 检查函数名称拼写是否正确\n3. 确保包含了所有必要的源文件和库文件';
        }
      }
      // 编译错误：找不到头文件
      else if (errorCode.includes('file not found')) {
        errorType = '编译错误';
        errorSeverity = 'error';
        
        if (errorCode.includes('stm32')) {
          errorAnalysis = '编译器找不到STM32相关的头文件。这通常是由于缺少头文件或未正确配置包含路径导致的。';
          errorSolution = '1. 确保已安装STM32 HAL库\n2. 检查项目设置中是否正确配置了头文件路径\n3. 确保在编译命令中包含了正确的-I选项';
          codeExample = `# 在编译命令中添加包含路径
arm-none-eabi-gcc -I./Drivers/CMSIS/Device/ST/STM32F1xx/Include -I./Drivers/CMSIS/Include -I./Drivers/STM32F1xx_HAL_Driver/Inc`;
        } else {
          errorAnalysis = '编译器找不到指定的头文件。这可能是由于缺少头文件或未正确配置包含路径导致的。';
          errorSolution = '1. 确保头文件存在于项目中\n2. 检查头文件路径是否正确\n3. 确保在编译命令中包含了正确的-I选项';
        }
      }
      // 硬件故障
      else if (errorCode.includes('Hard fault') || errorCode.includes('HardFault')) {
        errorType = '运行时错误';
        errorSeverity = 'error';
        errorAnalysis = '程序运行时发生硬件故障异常。这通常是由于访问无效内存地址、栈溢出或其他严重错误导致的。';
        errorSolution = '1. 检查指针是否正确初始化\n2. 确保不访问无效内存地址\n3. 检查栈大小是否足够\n4. 使用调试器检查故障发生时的寄存器状态';
        codeExample = `// 使用调试器检查硬件故障
// 在调试会话中，查看以下寄存器:
// - PC (程序计数器)
// - LR (链接寄存器)
// - SP (栈指针)
// - CFSR (可配置故障状态寄存器)
// - HFSR (硬件故障状态寄存器)`;
      }
      // 语法错误
      else if (errorCode.includes('expected') || errorCode.includes('syntax error')) {
        errorType = '编译错误';
        errorSeverity = 'warning';
        errorAnalysis = '代码中存在语法错误。这通常是由于缺少分号、括号不匹配或其他语法问题导致的。';
        errorSolution = '1. 检查代码中是否缺少分号\n2. 确保括号、引号等成对出现\n3. 检查变量和函数名称拼写是否正确';
        
        if (sourceCode) {
          // 简单分析源代码中的语法错误
          if (sourceCode.includes('{') && !sourceCode.includes('}')) {
            errorSolution += '\n\n可能缺少右花括号 }';
          } else if (sourceCode.includes('(') && !sourceCode.includes(')')) {
            errorSolution += '\n\n可能缺少右括号 )';
          }
        }
      }
      // 缺少库文件
      else if (errorCode.includes('cannot find -l')) {
        errorType = '链接错误';
        errorSeverity = 'error';
        const libName = errorCode.match(/cannot find -l([a-zA-Z0-9]+)/)?.[1] || '';
        errorAnalysis = `链接器找不到指定的库文件 ${libName}。这通常是由于缺少库文件或未正确配置库路径导致的。`;
        errorSolution = `1. 确保已安装库 ${libName}\n2. 检查项目设置中是否正确配置了库路径\n3. 确保在链接命令中包含了正确的-L选项`;
        codeExample = `# 在链接命令中添加库路径
arm-none-eabi-gcc -L/usr/local/lib -l${libName}`;
      }
      // 栈溢出
      else if (errorCode.includes('Stack overflow')) {
        errorType = '运行时错误';
        errorSeverity = 'error';
        errorAnalysis = '程序运行时发生栈溢出错误。这通常是由于递归太深、局部变量太多或栈大小配置不足导致的。';
        errorSolution = '1. 检查是否存在无限递归\n2. 减少局部变量的大小或数量\n3. 增加栈大小\n4. 考虑使用堆内存代替大型局部数组';
        codeExample = `// 在链接脚本中增加栈大小
/* 修改链接脚本 .ld 文件 */
_Min_Stack_Size = 0x800; /* 增加栈大小，例如从0x400增加到0x800 */

// 或者避免大型局部数组
// 不推荐:
void func() {
  char buffer[10000]; // 大型局部数组可能导致栈溢出
}

// 推荐:
void func() {
  char* buffer = (char*)malloc(10000); // 使用堆内存
  if (buffer) {
    // 使用buffer
    free(buffer); // 记得释放内存
  }
}`;
      }
      // 未知错误
      else {
        errorType = '未知错误';
        errorSeverity = 'info';
        errorAnalysis = '无法确定错误类型。请检查完整的错误信息并尝试手动解决。';
        errorSolution = '1. 检查完整的编译或链接日志\n2. 搜索STM32相关论坛或文档\n3. 确保使用正确的工具链和库版本';
      }

      // 返回分析结果
      return {
        type: errorType,
        analysis: errorAnalysis,
        solution: errorSolution,
        code: codeExample,
        severity: errorSeverity,
        mcuModel: mcuModel
      };
    };

    // 执行分析
    const result = analyzeError();
    setAnalysis(result);

    // 通知父组件
    if (onUpdateSolution) {
      onUpdateSolution(result);
    }
  }, [errorCode, sourceCode, mcuModel, onUpdateSolution]);

  if (!analysis) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500">正在分析错误...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 错误摘要 */}
      <div className={`p-4 ${
        analysis.severity === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
        analysis.severity === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
        'bg-blue-50 border-l-4 border-blue-500'
      }`}>
        <div className="flex items-start">
          {analysis.severity === 'error' ? (
            <FiAlertTriangle className="mr-3 h-5 w-5 text-red-500" />
          ) : analysis.severity === 'warning' ? (
            <FiAlertTriangle className="mr-3 h-5 w-5 text-yellow-500" />
          ) : (
            <FiInfo className="mr-3 h-5 w-5 text-blue-500" />
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{analysis.type}</h3>
            <p className="mt-1 text-sm text-gray-600">{errorCode}</p>
            <p className="mt-2 text-sm text-gray-700">MCU型号: {analysis.mcuModel}</p>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'analysis'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            分析
          </button>
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'solution'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('solution')}
          >
            解决方案
          </button>
          {analysis.code && (
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'code'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('code')}
            >
              代码示例
            </button>
          )}
        </nav>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {activeTab === 'analysis' && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">错误分析</h4>
            <p className="text-gray-700">{analysis.analysis}</p>

            {sourceCode && (
              <div className="mt-6">
                <h5 className="text-md font-medium text-gray-900 mb-2">源代码</h5>
                <SyntaxHighlighter
                  language="c"
                  style={monokai}
                  showLineNumbers={true}
                  customStyle={{ borderRadius: '0.375rem' }}
                >
                  {sourceCode}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        )}

        {activeTab === 'solution' && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">解决方案</h4>
            <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-500">
              <div className="flex">
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <h5 className="text-md font-medium text-gray-900 mb-2">建议步骤</h5>
                  <div className="text-gray-700 whitespace-pre-line">{analysis.solution}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && analysis.code && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">代码示例</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-start">
                <FiCode className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                <div className="flex-1">
                  <h5 className="text-md font-medium text-gray-900 mb-2">参考代码</h5>
                  <SyntaxHighlighter
                    language={analysis.code.includes('#') ? 'bash' : 'c'}
                    style={monokai}
                    showLineNumbers={true}
                    customStyle={{ borderRadius: '0.375rem' }}
                  >
                    {analysis.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center">
          <FiCpu className="h-5 w-5 text-gray-400 mr-2" />
          <p className="text-sm text-gray-500">
            此分析基于常见STM32错误模式。如需更详细的帮助，请参考STM32官方文档或社区论坛。
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorDebugger; 