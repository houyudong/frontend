import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../../app/providers/AuthProvider';

// 消息接口
interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// AI助手模式
type AssistantMode = 'ask' | 'agent';

/**
 * STMIDEAIAssistant - STMIDE专用AI助手组件
 * 
 * 专为三栏布局设计的AI助手，集成在STMIDE右栏中
 * 移除了全局布局调整逻辑，适配三栏布局
 */
const STMIDEAIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AssistantMode>('ask');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 模拟AI响应
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(userMessage.content, mode, user?.role),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI助手响应失败:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '抱歉，我现在无法回应。请稍后再试。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取AI响应
  const getAIResponse = (input: string, currentMode: AssistantMode, userRole?: string): string => {
    const responses = {
      ask: [
        `关于"${input}"，我来为您解答：\n\n在STM32开发中，这是一个很好的问题。建议您查看相关的实验代码和文档。`,
        `针对您的问题"${input}"：\n\n我建议您先检查GPIO配置，确保引脚设置正确。`,
        `关于"${input}"的问题：\n\n这通常与时钟配置有关，请检查RCC设置。`
      ],
      agent: [
        `我已经分析了您的代码，发现了一些可以优化的地方：\n\n1. 建议使用HAL库函数\n2. 注意中断优先级设置`,
        `基于当前实验进度，我建议：\n\n1. 先完成基础GPIO实验\n2. 然后进行定时器实验`,
        `我注意到您在进行${input}相关的开发，这里有一些最佳实践建议...`
      ]
    };

    const modeResponses = responses[currentMode];
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
  };

  // 清除对话
  const clearMessages = () => {
    setMessages([]);
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* AI助手头部 */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-800">🤖 AI助手</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
              title={isMinimized ? "展开" : "最小化"}
            >
              {isMinimized ? '📈' : '📉'}
            </button>
            <button
              onClick={clearMessages}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
              title="清除对话"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* 模式切换 */}
        {!isMinimized && (
          <div className="flex space-x-1">
            <button
              onClick={() => setMode('ask')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                mode === 'ask'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💬 问答模式
            </button>
            <button
              onClick={() => setMode('agent')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                mode === 'agent'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🤖 智能助手
            </button>
          </div>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-sm">
                  {mode === 'ask' ? '有什么STM32问题吗？' : '我来帮您分析代码！'}
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-2 rounded-lg text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="flex-shrink-0 p-3 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={mode === 'ask' ? '问我任何STM32问题...' : '描述您的代码问题...'}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发送
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default STMIDEAIAssistant;
