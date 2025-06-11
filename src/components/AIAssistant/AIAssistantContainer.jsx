import React, { useState, useEffect } from 'react';
import { FaRobot, FaRegLightbulb, FaPaperPlane, FaCode, FaClipboard, FaCheckCircle, FaPlay } from 'react-icons/fa';

/**
 * AI助手组件
 * 
 * 提供智能对话和代码生成功能
 * 
 * @component
 */
function AIAssistantContainer({ 
  context, 
  type = 'general', 
  thoughtQuestion, 
  challengeData = null, 
  hideContextTip = false,
  mode = 'conversation',
  initialPromptSelector = null
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [experimentResults, setExperimentResults] = useState('');
  const [showResultsForm, setShowResultsForm] = useState(false);

  // 初始化加载思考题或挑战指导
  useEffect(() => {
    const initialMessages = [];
    
    if (type === 'challenge' && challengeData) {
      if (mode === 'codeGenerator') {
        initialMessages.push({
          sender: 'assistant',
          content: '代码生成器已就绪。请选择一个挑战任务或描述您需要的代码，我将为您生成相应的代码模板。',
          timestamp: new Date().toISOString()
        });
      } else {
        initialMessages.push({
          sender: 'assistant',
          content: `我是您的智能助手，将帮助您完成挑战任务。您可以通过自然语言描述您的想法，我会帮您生成相应的代码。${!hideContextTip ? '\n\n提示: 输入 "use context7" 可以获取最新的STM32文档和编程指南' : ''}`,
          timestamp: new Date().toISOString()
        });
      }
    } else if (type === 'thought' && thoughtQuestion) {
      initialMessages.push({
        sender: 'assistant',
        content: `👋 思考题：${thoughtQuestion}\n\n您可以开始讨论这个问题。${!hideContextTip ? '提示: 输入 "use context7" 可以获取最新的STM32文档和编程指南' : ''}`,
        timestamp: new Date().toISOString()
      });
    } else {
      initialMessages.push({
        sender: 'assistant',
        content: `您好！我是STM32嵌入式AI助手。您可以询问我关于这个实验的任何问题，或者获取相关的代码帮助。${!hideContextTip ? '\n\n提示: 输入 "use context7" 可以获取最新的STM32文档和编程指南' : ''}`,
        timestamp: new Date().toISOString()
      });
    }
    
    setMessages(initialMessages);
  }, [type, challengeData, thoughtQuestion, hideContextTip, mode]);

  // 处理初始提示内容
  useEffect(() => {
    if (mode === 'codeGenerator' && initialPromptSelector) {
      // 设置监听器以捕获文本区域变化
      const promptElement = document.querySelector(initialPromptSelector);
      if (promptElement) {
        const handlePromptChange = () => {
          setNewMessage(promptElement.value);
        };
        
        promptElement.addEventListener('input', handlePromptChange);
        // 如果已有内容，设置初始值
        if (promptElement.value) {
          setNewMessage(promptElement.value);
        }
        
        return () => {
          promptElement.removeEventListener('input', handlePromptChange);
        };
      }
    }
  }, [mode, initialPromptSelector]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // 添加用户消息到消息列表
    const userMessage = {
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // 这里会调用后端API，发送用户消息和当前上下文
      // 演示代码，实际实现需要连接到后端
      const response = await mockApiCall(newMessage, context, type, challengeData, mode);
      
      const assistantMessage = {
        sender: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // 如果有生成的代码，更新代码区域
      if (response.code) {
        setGeneratedCode(response.code);
        setShowResultsForm(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        sender: 'assistant',
        content: '抱歉，处理您的请求时出现了错误。请稍后再试。',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 模拟API调用，实际项目中需要替换为真实的API调用
  const mockApiCall = async (message, context, type, challengeData, mode) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      text: `我已收到您的消息："${message}"。这是一个模拟响应，实际项目中会连接到后端API。`,
      code: message.toLowerCase().includes('代码') ? 
        `// 这是一个示例代码\nvoid setup() {\n  // 初始化代码\n}\n\nvoid loop() {\n  // 主循环代码\n}` : 
        null
    };
  };

  // 复制生成的代码
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // 提交实验结果
  const handleSubmitResults = (e) => {
    e.preventDefault();
    // 实际项目中会将结果发送到后端
    console.log('提交实验结果:', experimentResults);
    
    // 添加反馈消息
    setMessages(prev => [
      ...prev, 
      {
        sender: 'assistant',
        content: '感谢您提交实验结果！我已记录您的反馈，这将帮助我们改进AI助手。',
        timestamp: new Date().toISOString()
      }
    ]);
    
    setShowResultsForm(false);
    setExperimentResults('');
  };

  return (
    <div className="ai-assistant-container bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="assistant-header bg-primary-600 text-white p-3 flex items-center">
        <FaRobot className="text-xl mr-2" />
        <h3 className="font-medium">AI助手</h3>
      </div>
      
      <div className="messages-container p-4 h-80 overflow-y-auto">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message mb-4 ${msg.sender === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className={`message-bubble p-3 rounded-lg ${
              msg.sender === 'user' 
                ? 'bg-primary-100 ml-auto' 
                : 'bg-gray-100'
            }`}>
              <div className="message-content whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="assistant-message mb-4">
            <div className="message-bubble p-3 rounded-lg bg-gray-100">
              <div className="flex items-center">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="ml-2 text-gray-500">AI助手正在思考...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {generatedCode && (
        <div className="code-container p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium flex items-center">
              <FaCode className="mr-2 text-primary-600" />
              生成的代码
            </h4>
            <button 
              onClick={handleCopyCode}
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
            >
              {codeCopied ? (
                <>
                  <FaCheckCircle className="mr-1" />
                  已复制
                </>
              ) : (
                <>
                  <FaClipboard className="mr-1" />
                  复制代码
                </>
              )}
            </button>
          </div>
          <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
            <code>{generatedCode}</code>
          </pre>
          
          {showResultsForm && (
            <form onSubmit={handleSubmitResults} className="mt-4">
              <h4 className="font-medium mb-2 flex items-center">
                <FaRegLightbulb className="mr-2 text-yellow-500" />
                实验反馈
              </h4>
              <textarea
                value={experimentResults}
                onChange={(e) => setExperimentResults(e.target.value)}
                placeholder="请描述代码运行结果或提供反馈..."
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              ></textarea>
              <button
                type="submit"
                className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center justify-center"
              >
                <FaPlay className="mr-2" />
                提交反馈
              </button>
            </form>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="input-container p-3 border-t border-gray-200 flex">
        <textarea
          value={newMessage}
          onChange={handleInputChange}
          placeholder="输入您的问题或描述您需要的代码..."
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          rows="2"
        ></textarea>
        <button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className="bg-primary-600 text-white px-4 rounded-r-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default AIAssistantContainer;
