import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { CodeGeneratorContainer } from '../components';

type PresetType = 'led' | 'button' | 'uart' | 'adc' | 'timer' | null;

/**
 * CodeGeneratorPage - 代码生成器页面
 *
 * 使用CodeGeneratorContainer组件包装代码生成器功能，提供AI辅助代码生成功能。
 * 支持通过URL参数传入预设提示，如LED闪烁、按钮控制、UART通信等常见STM32功能。
 * 可以从其他页面引用，并记录访问来源。
 *
 * @component
 * @example
 * ```tsx
 * <CodeGeneratorPage />
 * ```
 *
 * @returns {JSX.Element} CodeGeneratorPage组件
 */
const CodeGeneratorPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preset = queryParams.get('preset') as PresetType;
  const ref = queryParams.get('ref');

  // 根据URL参数生成初始提示
  const getInitialPrompt = (): string => {
    if (!preset) return '';

    // 根据预设类型生成不同的初始提示
    switch (preset) {
      case 'led':
        return '使用STM32F103和HAL库，编写一个程序控制LED闪烁，频率为1Hz。';
      case 'button':
        return '使用STM32F103和HAL库，编写一个程序读取按钮状态，当按钮按下时点亮LED，松开时熄灭LED。';
      case 'uart':
        return '使用STM32F103和HAL库，配置UART1（PA9/PA10）以115200波特率进行通信，实现简单的命令解析功能。';
      case 'adc':
        return '使用STM32F103和HAL库，配置ADC读取模拟输入，并通过UART输出读取的值。';
      case 'timer':
        return '使用STM32F103和HAL库，配置定时器中断，每500ms触发一次，在中断中切换LED状态。';
      default:
        return '';
    }
  };

  // 获取初始提示
  const initialPrompt = getInitialPrompt();

  // 记录页面访问来源
  useEffect(() => {
    if (ref) {
      console.log('代码生成器访问来源:', ref);
    }
  }, [ref]);

  return (
    <>
      <Helmet>
        <title>AI代码生成器 - 嵌入式编程平台</title>
        <meta name="description" content="使用AI生成STM32嵌入式代码、流程图和解释" />
      </Helmet>

      {/* 内容区域 */}
      <div className="container mx-auto px-4 py-6">
        <CodeGeneratorContainer initialPrompt={initialPrompt} />
      </div>
    </>
  );
};

export default CodeGeneratorPage; 