import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiCpu, FiCode, FiClipboard, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import { generateCode, generateCodeStream } from '../../services/index';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from '../common/Mermaid';

interface CodeGeneratorProps {
  initialPrompt?: string;
}

interface Template {
  title: string;
  prompt: string;
}

interface StreamCallbacks {
  onStart: () => void;
  onContent: (content: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

/**
 * CodeGenerator - 代码生成器组件
 *
 * 提供AI辅助代码生成功能，支持STM32嵌入式代码生成、流程图生成和代码解释。
 * 支持通过initialPrompt属性传入初始提示，用于预设生成任务。
 *
 * @component
 * @example
 * ```tsx
 * // 基本用法
 * <CodeGenerator />
 *
 * // 带初始提示
 * <CodeGenerator initialPrompt="使用STM32F103和HAL库，编写一个程序控制LED闪烁，频率为1Hz。" />
 * ```
 *
 * @param {CodeGeneratorProps} props - 组件属性
 * @param {string} [props.initialPrompt=""] - 初始提示文本
 * @returns {ReactElement} CodeGenerator组件
 */
const CodeGenerator: React.FC<CodeGeneratorProps> = ({ initialPrompt = '' }) => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [flowchart, setFlowchart] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'code' | 'explanation' | 'flowchart'>('code');
  const [codeCopied, setCodeCopied] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  // 预设模板
  const templates: Template[] = [
    {
      title: 'LED闪烁',
      prompt: '使用STM32F103和HAL库，编写一个程序控制LED闪烁，频率为1Hz。'
    },
    {
      title: '按钮控制LED',
      prompt: '使用STM32F103和HAL库，编写一个程序读取按钮状态，当按钮按下时点亮LED，松开时熄灭LED。'
    },
    {
      title: 'UART通信',
      prompt: '使用STM32F103和HAL库，配置UART1（PA9/PA10）以115200波特率进行通信，实现简单的命令解析功能。'
    },
    {
      title: 'ADC读取',
      prompt: '使用STM32F103和HAL库，配置ADC读取模拟输入，并通过UART输出读取的值。'
    },
    {
      title: '定时器中断',
      prompt: '使用STM32F103和HAL库，配置定时器中断，每500ms触发一次，在中断中切换LED状态。'
    }
  ];

  // 初始化时设置初始提示
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  // 生成代码
  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCode('');
    setExplanation('');
    setFlowchart('');

    try {
      // 使用流式API生成代码
      await generateCodeStream(
        prompt,
        (data: any) => {
          // 解析内容
          try {
            if (data.code) setGeneratedCode(data.code);
            if (data.explanation) setExplanation(data.explanation);
            if (data.flowchart) setFlowchart(data.flowchart);
          } catch (e) {
            // 如果不是JSON，则假设是代码内容
            setGeneratedCode(prev => prev + data);
          }
        }
      );
      setIsGenerating(false);
    } catch (err) {
      console.error('代码生成错误:', err);
      setError(`生成失败: ${err instanceof Error ? err.message : '未知错误'}`);
      setIsGenerating(false);
    }
  };

  // 复制生成的代码
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // 使用模板
  const handleUseTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    setShowTemplates(false);
    // 聚焦到输入框
    if (promptInputRef.current) {
      promptInputRef.current.focus();
    }
  };

  // 显示使用指南
  const handleShowGuide = () => {
    // 触发自定义事件，让父组件显示使用指南
    window.dispatchEvent(new CustomEvent('codegen-show-guide'));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 左侧 - 输入区域 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">输入你的需求描述</h2>

          <div className="mb-4">
            <textarea
              ref={promptInputRef}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={6}
              placeholder="例如: 编写一个STM32H7程序，控制一个LED以1Hz的频率闪烁，使用HAL库。"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="flex justify-end mt-1">
              <button
                className="text-gray-500 text-sm hover:text-gray-700"
                onClick={handleShowGuide}
              >
                <FiInfo className="inline mr-1" />
                帮助
              </button>
            </div>
          </div>

          <button
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            onClick={handleGenerateCode}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                生成中...
              </>
            ) : (
              <>
                生成代码
              </>
            )}
          </button>

          {error && (
            <div className="mt-2 text-red-500 text-sm flex items-center">
              <FiX className="mr-1" />
              {error}
            </div>
          )}
        </div>

        {/* 提示模板 */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">提示模板</h3>
          <ul className="space-y-2">
            {templates.map((template, index) => (
              <li key={index}>
                <button
                  className="w-full text-left p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => handleUseTemplate(template.prompt)}
                >
                  <span className="font-medium text-gray-800">{template.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 右侧 - 结果区域 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 h-full flex flex-col justify-center items-center">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500">正在生成代码...</p>
            </div>
          ) : generatedCode ? (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">生成的代码</h3>
                <button
                  onClick={handleCopyCode}
                  className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                  disabled={!generatedCode}
                >
                  {codeCopied ? (
                    <>
                      <FiCheckCircle className="mr-1" />
                      已复制
                    </>
                  ) : (
                    <>
                      <FiClipboard className="mr-1" />
                      复制代码
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-800 rounded-md overflow-hidden">
                <SyntaxHighlighter
                  language="c"
                  style={monokai}
                  showLineNumbers={true}
                  wrapLines={true}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {generatedCode}
                </SyntaxHighlighter>
              </div>

              {explanation && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">代码解释</h3>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {explanation}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {flowchart && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">流程图</h3>
                  <Mermaid chart={flowchart} />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <FiCode className="mx-auto h-12 w-12 mb-4" />
              <p>输入你的需求，AI将为你生成相应的代码</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator; 