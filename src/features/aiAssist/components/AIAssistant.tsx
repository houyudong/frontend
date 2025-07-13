import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  aiAssistService,
  type DeepThinkResponse,
  type ThinkingSession,
  type ExampleQuestion
} from '../services/aiAssistService';

// 消息类型定义
interface Message {
  id: string;
  type: 'user' | 'assistant' | 'thinking';
  content: string;
  timestamp: Date;
  thinkingData?: {
    session: ThinkingSession;
    stages: DeepThinkResponse[];
    progress: number;
  };
}

// AI助手模式
type AssistantMode = 'ask' | 'agent';

// 生成唯一ID的工具函数
const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// 消息气泡组件
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.type === 'user';
  const isThinking = message.type === 'thinking';

  if (isThinking) {
    return (
      <div className="w-full max-w-[95%] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            {message.thinkingData?.session.isActive ? (
              <>
                <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-6 h-6 border-3 border-blue-200 rounded-full"></div>
              </>
            ) : (
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-800">
              {message.thinkingData?.session.isActive ? '🧠 深度思考中...' : '✅ 深度思考完成'}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {message.thinkingData?.session.isActive
                ? '正在从多个角度分析您的问题'
                : `分析完成，共${message.thinkingData?.stages.length || 0}个阶段`
              }
            </div>
          </div>
        </div>

        {message.thinkingData && (
          <div className="space-y-3">
            {/* 当前思考内容 */}
            <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-blue-700 font-medium mb-1">💭 当前思考：</div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {message.content.replace('🧠 ', '')}
              </div>
            </div>

            {/* 进度条 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-blue-600">
                <span>分析进度</span>
                <span>{message.thinkingData.progress}%</span>
              </div>
              <div className="flex-1 bg-blue-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(message.thinkingData.progress, 3)}%` }}
                ></div>
              </div>
            </div>

            {/* 思考阶段历史 */}
            {message.thinkingData.stages.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-blue-700 flex items-center gap-2">
                  <span>🧠 思考历程：</span>
                  <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {message.thinkingData.stages.length} 个阶段
                  </span>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {message.thinkingData.stages.map((stage, index) => (
                    <div key={index} className="text-xs bg-white/60 rounded-lg p-2 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium text-blue-800">
                          {stage.type === 'thinking' ? '🧠 思考' : '📋 阶段'}
                        </span>
                        {stage.stage && (
                          <span className="text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded text-xs">
                            {stage.stage}
                          </span>
                        )}
                      </div>
                      {stage.thinking && (
                        <div className="text-blue-700 ml-6 text-xs">{stage.thinking}</div>
                      )}
                      {stage.content && (
                        <div className="text-gray-600 ml-6 text-xs mt-1 leading-relaxed">
                          {stage.content.length > 100 ? stage.content.substring(0, 100) + '...' : stage.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 状态指示器 */}
            {message.thinkingData.session.isActive && (
              <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>深度分析进行中...</span>
                </div>
                <div className="text-xs text-blue-500">
                  耗时: {Math.floor((Date.now() - message.thinkingData.session.startTime) / 1000)}s
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
      <div
        className={`p-4 rounded-2xl text-sm shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-md'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
        }`}
      >
        <div className="leading-relaxed">
          {isUser ? (
            // 用户消息：简单文本显示
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            // AI回复：支持Markdown和代码高亮
            <Markdown
              components={{
                code(props) {
                  const { children, className } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter
                      PreTag="div"
                      language={match[1]}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: '0.5rem 0',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className={`${className} bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono`}
                    >
                      {children}
                    </code>
                  );
                },
                pre(props) {
                  return <div className="overflow-x-auto">{props.children}</div>;
                },
                p(props) {
                  return <p {...props} className="mb-2 last:mb-0" />;
                },
                h1(props) {
                  return <h1 {...props} className="text-lg font-bold mb-2 text-gray-900" />;
                },
                h2(props) {
                  return <h2 {...props} className="text-base font-semibold mb-2 text-gray-900" />;
                },
                h3(props) {
                  return <h3 {...props} className="text-sm font-medium mb-1 text-gray-900" />;
                },
                ul(props) {
                  return <ul {...props} className="list-disc list-inside mb-2 space-y-1" />;
                },
                ol(props) {
                  return <ol {...props} className="list-decimal list-inside mb-2 space-y-1" />;
                },
                li(props) {
                  return <li {...props} className="text-sm" />;
                },
                blockquote(props) {
                  return (
                    <blockquote
                      {...props}
                      className="border-l-4 border-blue-300 pl-4 py-2 my-2 bg-blue-50 text-gray-700 italic"
                    />
                  );
                },
                strong(props) {
                  return <strong {...props} className="font-semibold text-gray-900" />;
                },
                em(props) {
                  return <em {...props} className="italic text-gray-700" />;
                }
              }}
            >
              {message.content}
            </Markdown>
          )}
        </div>
        <div className={`text-xs mt-2 ${
          isUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * AIAssistant - AI助手组件
 * 
 * 支持两种模式：
 * - ask: 默认模式，普通流式对话
 * - agent: 深度思考模式，基于deep-research的多角度分析
 */
const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  
  // 核心状态
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode>('ask');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentThinkingMessage, setCurrentThinkingMessage] = useState<Message | null>(null);
  const [exampleQuestions, setExampleQuestions] = useState<ExampleQuestion[]>([]);

  // 引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 加载示例问题
  useEffect(() => {
    const loadExampleQuestions = async () => {
      try {
        const questions = await aiAssistService.getExampleQuestions(
          'ai_assistant', // pageContext
          user?.role || 'student',
          'beginner', // userLevel
          4 // limit
        );
        setExampleQuestions(questions);
      } catch (error) {
        console.error('Failed to load example questions:', error);
      }
    };

    loadExampleQuestions();
  }, [user?.role]);

  // 获取角色相关的欢迎消息
  const getWelcomeMessage = (): string => {
    const roleMessages = {
      student: '你好！我是你的学习助手，可以帮助你解答STM32学习中的问题，提供编程指导和实验建议。',
      teacher: '你好！我是你的教学助手，可以帮助你分析学生学习情况，提供教学建议和课程优化方案。',
      admin: '你好！我是你的管理助手，可以帮助你进行系统管理，数据分析和平台优化建议。'
    };
    return roleMessages[user?.role || 'student'];
  };



  // 统一的消息发送入口
  const sendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: generateUniqueId('user'),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const question = inputValue.trim();
    setInputValue('');
    setIsProcessing(true);

    try {
      if (mode === 'agent') {
        await handleDeepThinking(question);
      } else {
        await handleStreamChat(question);
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : '处理请求时出现错误');
    } finally {
      setIsProcessing(false);
    }
  };

  // 处理深度思考
  const handleDeepThinking = async (question: string): Promise<void> => {
    const thinkingMessage: Message = {
      id: generateUniqueId('thinking'),
      type: 'thinking',
      content: '🧠 正在启动深度思考...',
      timestamp: new Date(),
      thinkingData: {
        session: {
          question,
          startTime: Date.now(),
          totalStages: 0,
          completedStages: 0,
          isActive: true
        },
        stages: [],
        progress: 0
      }
    };

    setMessages(prev => [...prev, thinkingMessage]);
    setCurrentThinkingMessage(thinkingMessage);

    await aiAssistService.startDeepThinking(
      question,
      user?.role || 'student',
      'ai_assistant',
      {
        depth: 2,
        breadth: 3,
        concurrency: 2,
        onThinking: updateThinkingProgress,
        onStage: updateThinkingStage,
        onError: handleError,
        onComplete: completeThinking
      }
    );
  };

  // 处理流式聊天
  const handleStreamChat = async (question: string): Promise<void> => {
    const assistantMessage: Message = {
      id: generateUniqueId('assistant'),
      type: 'assistant',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      await aiAssistService.askQuestionStream(
        question,
        user?.role || 'student',
        'ai_assistant',
        (chunk: string) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessage.id
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        }
      );
    } catch (error) {
      console.error('Stream chat error:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, content: '抱歉，回答时出现了错误，请重试。' }
            : msg
        )
      );
    }
  };

  // 更新思考进度 (修复状态同步问题)
  const updateThinkingProgress = (response: DeepThinkResponse): void => {
    console.log('🧠 Thinking progress received:', response); // 调试日志

    setMessages(prev => {
      // 查找最新的思考消息
      const thinkingMessage = prev.find(msg => msg.type === 'thinking' && msg.thinkingData?.session.isActive);

      if (!thinkingMessage) {
        console.warn('No active thinking message found');
        return prev;
      }

      return prev.map(msg => {
        if (msg.id === thinkingMessage.id && msg.thinkingData) {
          return {
            ...msg,
            content: `🧠 ${response.thinking || '正在深度思考...'}`,
            thinkingData: {
              ...msg.thinkingData,
              progress: response.progress || 0
            }
          };
        }
        return msg;
      });
    });
  };

  // 更新思考阶段 (修复状态同步问题)
  const updateThinkingStage = (response: DeepThinkResponse): void => {
    console.log('📋 Stage update received:', response); // 调试日志

    setMessages(prev => {
      // 查找最新的思考消息
      const thinkingMessage = prev.find(msg => msg.type === 'thinking' && msg.thinkingData?.session.isActive);

      if (!thinkingMessage) {
        console.warn('No active thinking message found for stage update');
        return prev;
      }

      return prev.map(msg => {
        if (msg.id === thinkingMessage.id && msg.thinkingData) {
          const updatedStages = [...msg.thinkingData.stages, response];
          return {
            ...msg,
            content: `🧠 深度思考进行中... (${updatedStages.length} 个分析完成)`,
            thinkingData: {
              ...msg.thinkingData,
              stages: updatedStages,
              progress: response.progress || 0
            }
          };
        }
        return msg;
      });
    });
  };

  // 完成思考 (修复状态同步问题)
  const completeThinking = (session: ThinkingSession): void => {
    console.log('🎯 Deep thinking completed:', session); // 调试日志

    setMessages(prev => {
      // 查找活跃的思考消息
      const thinkingMessage = prev.find(msg => msg.type === 'thinking' && msg.thinkingData?.session.isActive);

      if (!thinkingMessage || !thinkingMessage.thinkingData) {
        console.warn('No active thinking message found for completion');
        return prev;
      }

      // 更新思考消息为完成状态
      const updatedMessages = prev.map(msg => {
        if (msg.id === thinkingMessage.id && msg.thinkingData) {
          return {
            ...msg,
            thinkingData: {
              ...msg.thinkingData,
              session: {
                ...msg.thinkingData.session,
                isActive: false
              },
              progress: 100
            }
          };
        }
        return msg;
      });

      // 生成最终结果消息
      const stages = thinkingMessage.thinkingData.stages;
      const finalContent = generateFinalResult(session.question, stages);

      const finalMessage: Message = {
        id: generateUniqueId('assistant'),
        type: 'assistant',
        content: finalContent,
        timestamp: new Date()
      };

      return [...updatedMessages, finalMessage];
    });

    setCurrentThinkingMessage(null);
  };

  // 生成最终结果
  const generateFinalResult = (question: string, stages: DeepThinkResponse[]): string => {
    let result = `# 🎯 深度思考结果\n\n**问题：** ${question}\n\n`;
    result += `**分析深度：** ${stages.length} 个研究方向\n\n`;
    
    stages.forEach((stage, index) => {
      if (stage.content) {
        result += `## 📋 分析 ${index + 1}\n${stage.content}\n\n`;
      }
    });
    
    result += `## 💡 综合建议\n基于多角度深度分析，建议采用模块化设计方法，注重代码可维护性和系统稳定性。`;
    
    return result;
  };

  // 处理错误
  const handleError = (error: string): void => {
    setCurrentThinkingMessage(null);
    
    const errorMessage: Message = {
      id: generateUniqueId('assistant'),
      type: 'assistant',
      content: `❌ ${error}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, errorMessage]);
  };

  // 使用示例问题
  const useExampleQuestion = (question: string): void => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  // 清空对话
  const clearChat = (): void => {
    setMessages([]);
    setCurrentThinkingMessage(null);
  };

  // 停止处理
  const stopProcessing = (): void => {
    aiAssistService.stopThinking();
    setIsProcessing(false);
    setCurrentThinkingMessage(null);
  };

  return (
    <>
      {/* AI助手按钮 */}
      {!isOpen && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            title="AI助手"
          >
            <span className="text-lg">🤖</span>
          </button>
        </div>
      )}

      {/* AI助手面板 */}
      {isOpen && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-semibold text-gray-900">AI助手</h3>
                <p className="text-xs text-gray-600">
                  {user?.role === 'student' ? '学习助手' : 
                   user?.role === 'teacher' ? '教学助手' : '管理助手'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
          </div>



          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center">
                <div className="text-4xl mb-4">👋</div>
                <p className="text-gray-600 text-sm mb-4">{getWelcomeMessage()}</p>
                
                <div className="text-left">
                  <p className="text-xs text-gray-500 mb-2">试试这些问题：</p>
                  <div className="space-y-2">
                    {exampleQuestions.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => useExampleQuestion(item.question)}
                        className="block w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-gray-700"
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <MessageBubble message={message} />
                  </div>
                ))}
                
                {isProcessing && !currentThinkingMessage && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-3 h-3 bg-blue-300 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {mode === 'agent' ? 'AI正在准备深度思考...' : 'AI正在思考回答...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* 输入区域 */}
          <div className="border-t border-gray-200 p-4">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-gray-500 hover:text-gray-700 mb-2"
              >
                🗑️ 清空对话
              </button>
            )}
            
            {/* 简化的模式提示 - 遵循奥卡姆原则 */}
            {mode === 'agent' && (
              <div className="text-xs text-blue-600 mb-3 p-2 bg-blue-50 rounded-lg">
                🧠 深度思考模式已启用
              </div>
            )}
            
            {/* 工具栏 */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center space-x-2">
                {/* 深度思考开关 */}
                <button
                  onClick={() => setMode(mode === 'ask' ? 'agent' : 'ask')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    mode === 'agent' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  title={mode === 'agent' ? '深度思考模式' : '快速问答模式'}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                      mode === 'agent' ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs text-gray-600">
                  {mode === 'agent' ? '深度思考' : '快速问答'}
                </span>
              </div>

              {/* 工具按钮 */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                  title="清空对话"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 输入区域 */}
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={isProcessing ? "正在处理中..." : mode === 'agent' ? "描述您想深度分析的问题..." : "输入您的问题..."}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  disabled={isProcessing}
                />
              </div>

              {/* 发送按钮 */}
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  !inputValue.trim() || isProcessing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : mode === 'agent'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                title={mode === 'agent' ? '开始深度思考' : '发送消息'}
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* 停止按钮 */}
            {isProcessing && (
              <button
                onClick={stopProcessing}
                className="mt-2 text-xs text-red-600 hover:text-red-800"
              >
                🛑 停止处理
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
