import React, { useState } from 'react';
import MainLayout from '../../../../pages/layout/MainLayout';

// 错误类型接口
interface ErrorPattern {
  id: string;
  category: string;
  pattern: string;
  description: string;
  commonCauses: string[];
  solutions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// 调试结果接口
interface DebugResult {
  matchedErrors: ErrorPattern[];
  suggestions: string[];
  codeAnalysis: {
    linesAnalyzed: number;
    potentialIssues: number;
    confidence: number;
  };
}

// 预定义错误模式
const errorPatterns: ErrorPattern[] = [
  {
    id: 'hard-fault',
    category: '系统错误',
    pattern: 'HardFault_Handler|Hard fault|hard fault',
    description: '硬件错误异常',
    commonCauses: [
      '访问无效内存地址',
      '栈溢出',
      '未初始化的指针',
      '数组越界访问',
      '中断向量表错误'
    ],
    solutions: [
      '检查指针是否正确初始化',
      '验证数组访问边界',
      '增加栈空间大小',
      '检查中断向量表配置',
      '使用调试器查看错误地址'
    ],
    severity: 'critical'
  },
  {
    id: 'gpio-config',
    category: 'GPIO错误',
    pattern: 'GPIO.*not.*configured|GPIO.*initialization.*failed',
    description: 'GPIO配置错误',
    commonCauses: [
      'GPIO时钟未使能',
      'GPIO模式配置错误',
      '引脚复用冲突',
      '上拉下拉配置错误'
    ],
    solutions: [
      '确保GPIO时钟已使能：__HAL_RCC_GPIOx_CLK_ENABLE()',
      '检查GPIO_InitTypeDef配置',
      '验证引脚复用设置',
      '确认上拉下拉配置正确'
    ],
    severity: 'medium'
  },
  {
    id: 'uart-timeout',
    category: 'UART错误',
    pattern: 'UART.*timeout|HAL_UART_Transmit.*timeout',
    description: 'UART通信超时',
    commonCauses: [
      '波特率配置错误',
      'UART未正确初始化',
      '硬件连接问题',
      '时钟配置错误'
    ],
    solutions: [
      '检查波特率设置是否匹配',
      '验证UART初始化代码',
      '检查硬件连接和引脚配置',
      '确认系统时钟配置正确'
    ],
    severity: 'high'
  },
  {
    id: 'timer-overflow',
    category: 'Timer错误',
    pattern: 'Timer.*overflow|TIM.*overflow',
    description: '定时器溢出错误',
    commonCauses: [
      '定时器周期设置过小',
      '预分频值配置错误',
      '中断处理时间过长',
      '定时器未正确启动'
    ],
    solutions: [
      '增加定时器周期值',
      '调整预分频器设置',
      '优化中断服务程序',
      '检查定时器启动代码'
    ],
    severity: 'medium'
  },
  {
    id: 'memory-leak',
    category: '内存错误',
    pattern: 'malloc.*failed|memory.*leak|heap.*overflow',
    description: '内存泄漏或堆溢出',
    commonCauses: [
      '动态内存分配失败',
      '内存泄漏',
      '堆空间不足',
      'free()函数未调用'
    ],
    solutions: [
      '检查malloc/free配对使用',
      '增加堆空间大小',
      '使用静态内存分配',
      '检查内存使用情况'
    ],
    severity: 'high'
  }
];

/**
 * ErrorDebuggerPage - 错误调试器页面
 * 
 * 智能错误诊断工具，帮助分析和解决STM32开发中的常见问题
 */
const ErrorDebuggerPage: React.FC = () => {
  const [errorCode, setErrorCode] = useState<string>('');
  const [errorLog, setErrorLog] = useState<string>('');
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 获取所有分类
  const categories = Array.from(new Set(errorPatterns.map(p => p.category)));

  // 分析错误
  const analyzeError = async () => {
    setAnalyzing(true);
    
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const combinedText = `${errorCode}\n${errorLog}`.toLowerCase();
    const matchedErrors: ErrorPattern[] = [];
    
    // 匹配错误模式
    errorPatterns.forEach(pattern => {
      const regex = new RegExp(pattern.pattern, 'i');
      if (regex.test(combinedText)) {
        matchedErrors.push(pattern);
      }
    });
    
    // 生成建议
    const suggestions: string[] = [];
    if (matchedErrors.length === 0) {
      suggestions.push('未检测到已知错误模式，建议：');
      suggestions.push('1. 检查编译错误信息');
      suggestions.push('2. 使用调试器单步执行');
      suggestions.push('3. 添加调试输出语句');
      suggestions.push('4. 检查硬件连接');
    } else {
      suggestions.push('基于错误分析的建议：');
      matchedErrors.forEach((error, index) => {
        suggestions.push(`${index + 1}. ${error.description}：`);
        error.solutions.slice(0, 2).forEach(solution => {
          suggestions.push(`   - ${solution}`);
        });
      });
    }
    
    const result: DebugResult = {
      matchedErrors,
      suggestions,
      codeAnalysis: {
        linesAnalyzed: errorCode.split('\n').length + errorLog.split('\n').length,
        potentialIssues: matchedErrors.length,
        confidence: matchedErrors.length > 0 ? 85 : 45
      }
    };
    
    setDebugResult(result);
    setAnalyzing(false);
  };

  // 获取严重程度颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取严重程度文本
  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      case 'critical': return '严重';
      default: return '未知';
    }
  };

  // 清除分析结果
  const clearAnalysis = () => {
    setErrorCode('');
    setErrorLog('');
    setDebugResult(null);
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">错误调试器</h1>
          <p className="text-gray-600">智能错误诊断工具，帮助快速定位和解决STM32开发中的常见问题</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：错误输入 */}
          <div className="space-y-6">
            {/* 错误代码输入 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">错误代码</h3>
                <p className="text-sm text-gray-600 mt-1">粘贴出现问题的代码片段</p>
              </div>
              <div className="p-4">
                <textarea
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="在此粘贴出现问题的代码..."
                  value={errorCode}
                  onChange={(e) => setErrorCode(e.target.value)}
                />
              </div>
            </div>

            {/* 错误日志输入 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">错误日志</h3>
                <p className="text-sm text-gray-600 mt-1">粘贴编译器或调试器的错误信息</p>
              </div>
              <div className="p-4">
                <textarea
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="在此粘贴错误日志或异常信息..."
                  value={errorLog}
                  onChange={(e) => setErrorLog(e.target.value)}
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-4">
              <button
                onClick={analyzeError}
                disabled={analyzing || (!errorCode.trim() && !errorLog.trim())}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <div className="loading-spinner h-4 w-4"></div>
                    <span>分析中...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    <span>开始分析</span>
                  </>
                )}
              </button>
              <button
                onClick={clearAnalysis}
                className="btn-secondary"
              >
                🗑️ 清除
              </button>
            </div>
          </div>

          {/* 右侧：分析结果 */}
          <div className="space-y-6">
            {debugResult ? (
              <>
                {/* 分析概览 */}
                <div className="card">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">分析概览</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{debugResult.codeAnalysis.linesAnalyzed}</div>
                        <div className="text-sm text-gray-600">分析行数</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{debugResult.codeAnalysis.potentialIssues}</div>
                        <div className="text-sm text-gray-600">潜在问题</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{debugResult.codeAnalysis.confidence}%</div>
                        <div className="text-sm text-gray-600">置信度</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 检测到的错误 */}
                {debugResult.matchedErrors.length > 0 && (
                  <div className="card">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">检测到的错误</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        {debugResult.matchedErrors.map((error, index) => (
                          <div key={error.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{error.description}</h4>
                                <p className="text-sm text-gray-600">{error.category}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(error.severity)}`}>
                                {getSeverityText(error.severity)}
                              </span>
                            </div>
                            
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">常见原因：</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {error.commonCauses.slice(0, 3).map((cause, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    {cause}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-2">解决方案：</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {error.solutions.slice(0, 3).map((solution, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    {solution}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 调试建议 */}
                <div className="card">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">调试建议</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {debugResult.suggestions.map((suggestion, index) => (
                        <div key={index} className="text-sm text-gray-700">
                          {suggestion.startsWith('   ') ? (
                            <div className="ml-4 text-gray-600">{suggestion.trim()}</div>
                          ) : (
                            <div className={suggestion.includes('：') ? 'font-medium' : ''}>{suggestion}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card">
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">智能错误分析</h3>
                  <p className="text-gray-600 mb-4">
                    输入错误代码和日志信息，AI将帮助您快速定位问题
                  </p>
                  <div className="text-sm text-gray-500">
                    支持分析：硬件错误、GPIO配置、UART通信、定时器、内存等问题
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 常见错误模式参考 */}
        <div className="mt-8 card">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">常见错误模式参考</h3>
              <select
                className="text-sm border border-gray-300 rounded px-2 py-1"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">全部分类</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {errorPatterns
                .filter(pattern => selectedCategory === 'all' || pattern.category === selectedCategory)
                .map((pattern) => (
                <div key={pattern.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{pattern.description}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(pattern.severity)}`}>
                      {getSeverityText(pattern.severity)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{pattern.category}</p>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium mb-1">常见原因：</div>
                    <ul className="space-y-1">
                      {pattern.commonCauses.slice(0, 2).map((cause, i) => (
                        <li key={i} className="text-gray-600">• {cause}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ErrorDebuggerPage;
