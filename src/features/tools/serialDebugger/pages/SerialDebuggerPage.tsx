import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '../../../../pages/layout/MainLayout';

// 串口消息接口
interface SerialMessage {
  id: string;
  timestamp: Date;
  direction: 'sent' | 'received';
  data: string;
  type: 'text' | 'hex' | 'binary';
}

// 串口配置接口
interface SerialConfig {
  baudRate: number;
  dataBits: 8 | 7 | 6 | 5;
  stopBits: 1 | 2;
  parity: 'none' | 'even' | 'odd';
  flowControl: 'none' | 'hardware' | 'software';
}

// 预定义波特率
const baudRates = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];

// 预定义测试命令
const testCommands = [
  { name: 'AT测试', command: 'AT\r\n', description: '基本AT命令测试' },
  { name: '获取版本', command: 'AT+VERSION?\r\n', description: '查询固件版本' },
  { name: 'LED开', command: 'LED_ON\r\n', description: '打开LED' },
  { name: 'LED关', command: 'LED_OFF\r\n', description: '关闭LED' },
  { name: '读取ADC', command: 'READ_ADC\r\n', description: '读取ADC值' },
  { name: '系统重启', command: 'RESET\r\n', description: '重启系统' }
];

/**
 * SerialDebuggerPage - 串口调试器页面
 * 
 * 模拟串口通信调试工具，支持多种数据格式和自动化测试
 */
const SerialDebuggerPage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SerialMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [config, setConfig] = useState<SerialConfig>({
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    flowControl: 'none'
  });
  const [displayFormat, setDisplayFormat] = useState<'text' | 'hex' | 'mixed'>('text');
  const [autoScroll, setAutoScroll] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // 模拟连接/断开
  const toggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      addMessage('系统', '串口连接已断开', 'received');
    } else {
      setIsConnected(true);
      addMessage('系统', `串口连接成功 - ${config.baudRate} bps`, 'received');
      // 模拟设备响应
      setTimeout(() => {
        addMessage('设备', 'STM32 Ready\r\n', 'received');
      }, 500);
    }
  };

  // 添加消息
  const addMessage = (source: string, data: string, direction: 'sent' | 'received') => {
    const message: SerialMessage = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date(),
      direction,
      data: direction === 'sent' ? data : `[${source}] ${data}`,
      type: 'text'
    };
    setMessages(prev => [...prev, message]);
  };

  // 发送消息
  const sendMessage = () => {
    if (!isConnected || !inputMessage.trim()) return;

    addMessage('用户', inputMessage, 'sent');
    
    // 模拟设备响应
    setTimeout(() => {
      simulateDeviceResponse(inputMessage);
    }, 200 + Math.random() * 800);

    setInputMessage('');
  };

  // 模拟设备响应
  const simulateDeviceResponse = (command: string) => {
    const cmd = command.trim().toUpperCase();
    
    if (cmd.includes('AT')) {
      addMessage('设备', 'OK\r\n', 'received');
    } else if (cmd.includes('VERSION')) {
      addMessage('设备', 'STM32F103 v1.2.3\r\n', 'received');
    } else if (cmd.includes('LED_ON')) {
      addMessage('设备', 'LED ON\r\n', 'received');
    } else if (cmd.includes('LED_OFF')) {
      addMessage('设备', 'LED OFF\r\n', 'received');
    } else if (cmd.includes('READ_ADC')) {
      const adcValue = Math.floor(Math.random() * 4096);
      addMessage('设备', `ADC: ${adcValue}\r\n`, 'received');
    } else if (cmd.includes('RESET')) {
      addMessage('设备', 'Resetting...\r\n', 'received');
      setTimeout(() => {
        addMessage('设备', 'STM32 Ready\r\n', 'received');
      }, 1000);
    } else {
      addMessage('设备', 'Unknown command\r\n', 'received');
    }
  };

  // 发送测试命令
  const sendTestCommand = (command: string) => {
    if (!isConnected) return;
    setInputMessage(command);
    setTimeout(() => sendMessage(), 100);
  };

  // 清除消息
  const clearMessages = () => {
    setMessages([]);
  };

  // 导出日志
  const exportLog = () => {
    const logContent = messages.map(msg => {
      const timestamp = showTimestamp ? `[${msg.timestamp.toLocaleTimeString()}] ` : '';
      const direction = msg.direction === 'sent' ? '>> ' : '<< ';
      return `${timestamp}${direction}${msg.data}`;
    }).join('\n');

    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serial_log_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 格式化显示数据
  const formatMessage = (message: SerialMessage) => {
    if (displayFormat === 'hex') {
      return message.data.split('').map(char => 
        char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()
      ).join(' ');
    }
    return message.data;
  };

  // 获取消息样式
  const getMessageStyle = (direction: 'sent' | 'received') => {
    return direction === 'sent' 
      ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-900'
      : 'bg-green-50 border-l-4 border-green-500 text-green-900';
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">串口调试器</h1>
          <p className="text-gray-600">模拟串口通信调试工具，支持多种数据格式和自动化测试</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 连接状态 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">连接状态</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">状态</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isConnected ? '已连接' : '未连接'}
                  </span>
                </div>
                <button
                  onClick={toggleConnection}
                  className={`w-full py-2 px-4 rounded-lg font-medium ${
                    isConnected 
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isConnected ? '断开连接' : '连接串口'}
                </button>
              </div>
            </div>

            {/* 串口配置 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">串口配置</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">波特率</label>
                  <select
                    className="input-primary"
                    value={config.baudRate}
                    onChange={(e) => setConfig(prev => ({ ...prev, baudRate: Number(e.target.value) }))}
                    disabled={isConnected}
                  >
                    {baudRates.map(rate => (
                      <option key={rate} value={rate}>{rate}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">数据位</label>
                  <select
                    className="input-primary"
                    value={config.dataBits}
                    onChange={(e) => setConfig(prev => ({ ...prev, dataBits: Number(e.target.value) as any }))}
                    disabled={isConnected}
                  >
                    <option value={8}>8</option>
                    <option value={7}>7</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">停止位</label>
                  <select
                    className="input-primary"
                    value={config.stopBits}
                    onChange={(e) => setConfig(prev => ({ ...prev, stopBits: Number(e.target.value) as any }))}
                    disabled={isConnected}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">校验位</label>
                  <select
                    className="input-primary"
                    value={config.parity}
                    onChange={(e) => setConfig(prev => ({ ...prev, parity: e.target.value as any }))}
                    disabled={isConnected}
                  >
                    <option value="none">无</option>
                    <option value="even">偶校验</option>
                    <option value="odd">奇校验</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 快速测试命令 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">测试命令</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {testCommands.map((cmd, index) => (
                    <button
                      key={index}
                      onClick={() => sendTestCommand(cmd.command)}
                      disabled={!isConnected}
                      className="w-full text-left p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={cmd.description}
                    >
                      {cmd.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：通信区域 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 消息显示区域 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">通信日志</h3>
                  <div className="flex items-center space-x-4">
                    <select
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                      value={displayFormat}
                      onChange={(e) => setDisplayFormat(e.target.value as any)}
                    >
                      <option value="text">文本</option>
                      <option value="hex">十六进制</option>
                      <option value="mixed">混合</option>
                    </select>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={showTimestamp}
                        onChange={(e) => setShowTimestamp(e.target.checked)}
                        className="mr-1"
                      />
                      时间戳
                    </label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={autoScroll}
                        onChange={(e) => setAutoScroll(e.target.checked)}
                        className="mr-1"
                      />
                      自动滚动
                    </label>
                    <button
                      onClick={clearMessages}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      清除
                    </button>
                    <button
                      onClick={exportLog}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      导出
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 font-mono text-sm">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-4">📡</div>
                      <p>暂无通信数据</p>
                      <p className="text-xs mt-2">连接串口后开始通信</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-2 rounded ${getMessageStyle(message.direction)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {showTimestamp && (
                                <span className="text-xs opacity-75 mr-2">
                                  [{message.timestamp.toLocaleTimeString()}]
                                </span>
                              )}
                              <span className="text-xs font-semibold mr-2">
                                {message.direction === 'sent' ? '>>' : '<<'}
                              </span>
                              <span className="whitespace-pre-wrap">
                                {formatMessage(message)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 消息输入区域 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">发送消息</h3>
              </div>
              <div className="p-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    className="flex-1 input-primary"
                    placeholder="输入要发送的消息..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={!isConnected}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!isConnected || !inputMessage.trim()}
                    className="btn-primary"
                  >
                    发送
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  提示：使用 \r\n 表示回车换行，\t 表示制表符
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 card">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">使用说明</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🔧 配置串口</h4>
                <p className="text-gray-600">设置波特率、数据位、停止位等参数，然后点击连接</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">💬 发送消息</h4>
                <p className="text-gray-600">在输入框中输入消息，支持转义字符如\r\n</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🧪 快速测试</h4>
                <p className="text-gray-600">使用预定义的测试命令快速验证设备功能</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SerialDebuggerPage;
