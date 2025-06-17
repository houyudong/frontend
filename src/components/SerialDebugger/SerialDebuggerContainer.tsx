import React, { useState, useEffect } from 'react';
import {
  FiInfo,
  FiX,
  FiCpu,
  FiTerminal,
  FiCode,
  FiSend,
  FiHelpCircle
} from 'react-icons/fi';

interface CommandTemplate {
  name: string;
  command: string;
  description: string;
}

interface STM32Command {
  name: string;
  syntax: string;
  description: string;
}

// 命令模板示例
const COMMAND_TEMPLATES: CommandTemplate[] = [
  { name: '获取固件版本', command: 'version', description: '获取设备固件版本信息' },
  { name: '读取系统状态', command: 'status', description: '读取系统当前状态' },
  { name: '切换LED', command: 'led toggle', description: '切换LED状态' },
  { name: '读取GPIO状态', command: 'gpio read PE1', description: '读取PE1引脚状态' },
  { name: '设置GPIO输出', command: 'gpio write PE1 1', description: '设置PE1引脚为高电平' },
  { name: '重置设备', command: 'reset', description: '重置设备' },
  { name: '帮助', command: 'help', description: '显示帮助信息' },
  { name: '读取ADC', command: 'adc read 1', description: '读取ADC通道1的值' },
  { name: '设置PWM', command: 'pwm set 1 50', description: '设置PWM通道1占空比为50%' },
  { name: '读取温度', command: 'temp read', description: '读取内部温度传感器' }
];

// 常见STM32串口命令
const STM32_COMMANDS: STM32Command[] = [
  { name: 'HAL_GPIO_TogglePin', syntax: 'HAL_GPIO_TogglePin(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin)', description: '切换GPIO引脚状态' },
  { name: 'HAL_GPIO_ReadPin', syntax: 'HAL_GPIO_ReadPin(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin)', description: '读取GPIO引脚状态' },
  { name: 'HAL_GPIO_WritePin', syntax: 'HAL_GPIO_WritePin(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin, GPIO_PinState PinState)', description: '设置GPIO引脚状态' },
  { name: 'HAL_UART_Transmit', syntax: 'HAL_UART_Transmit(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size, uint32_t Timeout)', description: '通过UART发送数据' },
  { name: 'HAL_UART_Receive', syntax: 'HAL_UART_Receive(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size, uint32_t Timeout)', description: '通过UART接收数据' }
];

type TabType = 'templates' | 'reference';

/**
 * SerialDebuggerContainer - 串口调试器容器组件
 *
 * 包装串口调试器组件，提供命令模板和使用指南。
 * 支持文本和十六进制数据格式，提供常用命令模板和API参考。
 *
 * @component
 * @example
 * ```tsx
 * <SerialDebuggerContainer />
 * ```
 *
 * @returns {ReactElement} SerialDebuggerContainer组件
 */
const SerialDebuggerContainer: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('templates');

  // 监听自定义事件，显示使用指南
  useEffect(() => {
    const handleShowGuide = () => {
      setShowGuide(true);
    };

    window.addEventListener('serial-show-guide', handleShowGuide);

    return () => {
      window.removeEventListener('serial-show-guide', handleShowGuide);
    };
  }, []);

  // 处理错误
  const handleError = (errorMessage: string): void => {
    setError(errorMessage);

    // 5秒后自动清除错误
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  return (
    <div className="serial-debugger-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧面板 - 串口调试器 */}
        <div className="lg:col-span-2">
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-start">
              <FiInfo className="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">错误</p>
                <p>{error}</p>
              </div>
              <button
                className="ml-auto text-red-500 hover:text-red-700"
                onClick={() => setError(null)}
              >
                <FiX />
              </button>
            </div>
          )}

          {/* 串口调试器组件 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiTerminal className="mr-2 text-primary-500" />
                串口调试器
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                请注意：EnhancedSerialDebugger组件已被移除，这里需要实现新的串口调试器组件
              </p>
            </div>
          </div>
        </div>

        {/* 右侧面板 - 命令模板和帮助 */}
        <div className="space-y-6">
          {/* 命令模板和参考 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiCode className="mr-2 text-primary-500" />
                  命令参考
                </h2>
                <button
                  onClick={() => setShowGuide(true)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  title="查看使用指南"
                >
                  <FiHelpCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 标签页切换 */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === 'templates'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('templates')}
                >
                  命令模板
                </button>
                <button
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === 'reference'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('reference')}
                >
                  API参考
                </button>
              </nav>
            </div>

            {/* 命令模板内容 */}
            {activeTab === 'templates' && (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">
                  点击命令模板可以快速使用常用命令
                </p>
                <div className="space-y-2">
                  {COMMAND_TEMPLATES.map((template, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                      onClick={() => {
                        // 创建自定义事件，传递命令
                        const event = new CustomEvent('serial-command-template', {
                          detail: { command: template.command }
                        });
                        window.dispatchEvent(event);
                      }}
                    >
                      <div className="font-medium text-gray-900 flex items-center">
                        <FiTerminal className="mr-2 text-primary-500" />
                        {template.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{template.description}</div>
                      <div className="text-xs font-mono bg-gray-200 p-1 mt-1 rounded">
                        {template.command}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API参考内容 */}
            {activeTab === 'reference' && (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">
                  STM32 HAL库常用串口相关函数
                </p>
                <div className="space-y-3">
                  {STM32_COMMANDS.map((cmd, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <div className="font-medium text-gray-900">{cmd.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{cmd.description}</div>
                      <div className="text-xs font-mono bg-gray-200 p-1 mt-1 rounded overflow-x-auto">
                        {cmd.syntax}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 设备信息卡片 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiCpu className="mr-2 text-primary-500" />
                设备信息
              </h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">
                常见STM32设备USB VID/PID参考
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="font-medium text-gray-900">ST-LINK/V2</div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                    <div className="text-gray-500">VID:</div>
                    <div className="font-mono">0x0483</div>
                    <div className="text-gray-500">PID:</div>
                    <div className="font-mono">0x3748</div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="font-medium text-gray-900">ST-LINK/V2-1</div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                    <div className="text-gray-500">VID:</div>
                    <div className="font-mono">0x0483</div>
                    <div className="text-gray-500">PID:</div>
                    <div className="font-mono">0x374B</div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="font-medium text-gray-900">STM32 Virtual COM Port</div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                    <div className="text-gray-500">VID:</div>
                    <div className="font-mono">0x0483</div>
                    <div className="text-gray-500">PID:</div>
                    <div className="font-mono">0x5740</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  串口调试器使用指南
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
                  串口调试器可以帮助你直接在浏览器中与STM32设备进行通信，无需安装额外的串口工具。
                </p>

                <h4 className="font-semibold text-blue-800 mb-2">基本操作</h4>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>点击"选择设备"按钮，从弹出的对话框中选择要连接的串口设备</li>
                  <li>选择适当的波特率（默认115200）</li>
                  <li>点击"连接"按钮建立串口连接</li>
                  <li>在命令输入框中输入命令，按回车键或点击"发送"按钮发送</li>
                  <li>接收到的数据将显示在控制台输出区域</li>
                </ul>

                <h4 className="font-semibold text-blue-800 mb-2">数据格式</h4>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li><strong>文本模式</strong>：直接发送和接收文本数据</li>
                  <li><strong>十六进制模式</strong>：以十六进制格式发送和接收数据，适用于二进制通信</li>
                </ul>

                <h4 className="font-semibold text-blue-800 mb-2">控制台功能</h4>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>清空控制台：清除所有显示的消息</li>
                  <li>复制内容：将控制台内容复制到剪贴板</li>
                  <li>保存到文件：将控制台内容保存为文本文件</li>
                  <li>自动滚动：启用/禁用控制台自动滚动到最新消息</li>
                </ul>

                <h4 className="font-semibold text-blue-800 mb-2">命令模板</h4>
                <p className="text-gray-700 mb-2">
                  右侧面板提供了常用命令模板，点击即可使用。你也可以参考API文档了解更多STM32 HAL库函数。
                </p>

                <h4 className="font-semibold text-blue-800 mb-2">注意事项</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>Web Serial API仅在支持的浏览器中可用（Chrome 89+、Edge 89+等）</li>
                  <li>首次连接设备时需要用户授权</li>
                  <li>如果设备突然断开，串口调试器会自动检测并更新状态</li>
                  <li>十六进制模式下，输入格式应为空格分隔的十六进制值（例如：01 02 03 FF）</li>
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

export default SerialDebuggerContainer; 