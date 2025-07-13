import React, { useState } from 'react';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

// 代码模板接口
interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  parameters: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'select';
    label: string;
    defaultValue?: any;
    options?: string[];
    required?: boolean;
  }[];
}

// 预定义代码模板
const codeTemplates: CodeTemplate[] = [
  {
    id: 'gpio-led',
    name: 'GPIO LED控制',
    description: '生成GPIO控制LED的基础代码',
    category: 'GPIO',
    template: `// GPIO LED控制代码
#include "stm32f1xx_hal.h"

// LED引脚定义
#define LED_PIN GPIO_PIN_{{pin}}
#define LED_PORT GPIO{{port}}

void LED_Init(void) {
    // 使能GPIO时钟
    __HAL_RCC_GPIO{{port}}_CLK_ENABLE();
    
    // 配置GPIO
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = LED_PIN;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(LED_PORT, &GPIO_InitStruct);
}

void LED_{{action}}(void) {
    HAL_GPIO_WritePin(LED_PORT, LED_PIN, {{state}});
}`,
    parameters: [
      { name: 'pin', type: 'select', label: 'LED引脚', options: ['13', '14', '15'], defaultValue: '13', required: true },
      { name: 'port', type: 'select', label: 'GPIO端口', options: ['A', 'B', 'C'], defaultValue: 'C', required: true },
      { name: 'action', type: 'string', label: '函数名称', defaultValue: 'On', required: true },
      { name: 'state', type: 'select', label: 'LED状态', options: ['GPIO_PIN_SET', 'GPIO_PIN_RESET'], defaultValue: 'GPIO_PIN_SET', required: true }
    ]
  },
  {
    id: 'uart-init',
    name: 'UART初始化',
    description: '生成UART串口初始化代码',
    category: 'UART',
    template: `// UART初始化代码
#include "stm32f1xx_hal.h"

UART_HandleTypeDef huart{{instance}};

void UART{{instance}}_Init(void) {
    huart{{instance}}.Instance = USART{{instance}};
    huart{{instance}}.Init.BaudRate = {{baudrate}};
    huart{{instance}}.Init.WordLength = UART_WORDLENGTH_8B;
    huart{{instance}}.Init.StopBits = UART_STOPBITS_1;
    huart{{instance}}.Init.Parity = UART_PARITY_NONE;
    huart{{instance}}.Init.Mode = UART_MODE_TX_RX;
    huart{{instance}}.Init.HwFlowCtl = UART_HWCONTROL_NONE;
    huart{{instance}}.Init.OverSampling = UART_OVERSAMPLING_16;
    
    if (HAL_UART_Init(&huart{{instance}}) != HAL_OK) {
        Error_Handler();
    }
}

void UART{{instance}}_Send(uint8_t *data, uint16_t size) {
    HAL_UART_Transmit(&huart{{instance}}, data, size, HAL_MAX_DELAY);
}`,
    parameters: [
      { name: 'instance', type: 'select', label: 'UART实例', options: ['1', '2', '3'], defaultValue: '1', required: true },
      { name: 'baudrate', type: 'select', label: '波特率', options: ['9600', '115200', '230400'], defaultValue: '115200', required: true }
    ]
  },
  {
    id: 'timer-pwm',
    name: 'Timer PWM输出',
    description: '生成定时器PWM输出代码',
    category: 'Timer',
    template: `// Timer PWM输出代码
#include "stm32f1xx_hal.h"

TIM_HandleTypeDef htim{{instance}};

void TIM{{instance}}_PWM_Init(void) {
    TIM_ClockConfigTypeDef sClockSourceConfig = {0};
    TIM_MasterConfigTypeDef sMasterConfig = {0};
    TIM_OC_InitTypeDef sConfigOC = {0};

    htim{{instance}}.Instance = TIM{{instance}};
    htim{{instance}}.Init.Prescaler = {{prescaler}};
    htim{{instance}}.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim{{instance}}.Init.Period = {{period}};
    htim{{instance}}.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    htim{{instance}}.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_DISABLE;
    
    if (HAL_TIM_Base_Init(&htim{{instance}}) != HAL_OK) {
        Error_Handler();
    }
    
    if (HAL_TIM_PWM_Init(&htim{{instance}}) != HAL_OK) {
        Error_Handler();
    }

    sConfigOC.OCMode = TIM_OCMODE_PWM1;
    sConfigOC.Pulse = {{pulse}};
    sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
    sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
    
    if (HAL_TIM_PWM_ConfigChannel(&htim{{instance}}, &sConfigOC, TIM_CHANNEL_{{channel}}) != HAL_OK) {
        Error_Handler();
    }
}

void TIM{{instance}}_PWM_Start(void) {
    HAL_TIM_PWM_Start(&htim{{instance}}, TIM_CHANNEL_{{channel}});
}`,
    parameters: [
      { name: 'instance', type: 'select', label: 'Timer实例', options: ['1', '2', '3', '4'], defaultValue: '2', required: true },
      { name: 'prescaler', type: 'number', label: '预分频值', defaultValue: 71, required: true },
      { name: 'period', type: 'number', label: '周期值', defaultValue: 999, required: true },
      { name: 'pulse', type: 'number', label: '脉冲值', defaultValue: 500, required: true },
      { name: 'channel', type: 'select', label: 'PWM通道', options: ['1', '2', '3', '4'], defaultValue: '1', required: true }
    ]
  }
];

/**
 * CodeGeneratorPage - 代码生成器页面
 * 
 * AI辅助的STM32代码生成工具
 * 支持多种常用功能模块的代码模板生成
 */
const CodeGeneratorPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate | null>(null);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 获取所有分类
  const categories = Array.from(new Set(codeTemplates.map(t => t.category)));

  // 过滤模板
  const filteredTemplates = selectedCategory === 'all' 
    ? codeTemplates 
    : codeTemplates.filter(t => t.category === selectedCategory);

  // 选择模板
  const handleTemplateSelect = (template: CodeTemplate) => {
    setSelectedTemplate(template);
    // 初始化参数默认值
    const defaultParams: Record<string, any> = {};
    template.parameters.forEach(param => {
      defaultParams[param.name] = param.defaultValue || '';
    });
    setParameters(defaultParams);
    setGeneratedCode('');
  };

  // 更新参数
  const handleParameterChange = (paramName: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  // 生成代码
  const generateCode = () => {
    if (!selectedTemplate) return;

    let code = selectedTemplate.template;
    
    // 替换模板中的参数
    Object.entries(parameters).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      code = code.replace(regex, value.toString());
    });

    setGeneratedCode(code);
  };

  // 复制代码
  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('代码已复制到剪贴板！');
  };

  // 下载代码
  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.id || 'generated'}.c`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">代码生成器</h1>
          <p className="text-gray-600">AI辅助的STM32代码生成工具，快速生成常用功能模块代码</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：模板选择 */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">代码模板</h3>
                <div className="mt-2">
                  <select
                    className="input-primary"
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
                <div className="space-y-3">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                      <div className="text-xs text-blue-600 mt-1">{template.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 中间：参数配置 */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">参数配置</h3>
              </div>
              <div className="p-4">
                {selectedTemplate ? (
                  <div className="space-y-4">
                    {selectedTemplate.parameters.map((param) => (
                      <div key={param.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {param.label}
                          {param.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {param.type === 'select' ? (
                          <select
                            className="input-primary"
                            value={parameters[param.name] || ''}
                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                          >
                            {param.options?.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : param.type === 'boolean' ? (
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={parameters[param.name] || false}
                            onChange={(e) => handleParameterChange(param.name, e.target.checked)}
                          />
                        ) : (
                          <input
                            type={param.type === 'number' ? 'number' : 'text'}
                            className="input-primary"
                            value={parameters[param.name] || ''}
                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                    <button
                      onClick={generateCode}
                      className="btn-primary w-full"
                    >
                      🚀 生成代码
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔧</div>
                    <p className="text-gray-600">请选择一个代码模板开始配置</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：生成的代码 */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">生成的代码</h3>
                  {generatedCode && (
                    <div className="flex space-x-2">
                      <button
                        onClick={copyCode}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        📋 复制
                      </button>
                      <button
                        onClick={downloadCode}
                        className="text-sm text-green-600 hover:text-green-800"
                      >
                        💾 下载
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                {generatedCode ? (
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{generatedCode}</code>
                  </pre>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💻</div>
                    <p className="text-gray-600">配置参数后点击生成代码</p>
                  </div>
                )}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">1️⃣</div>
                <h4 className="font-medium text-gray-900 mb-1">选择模板</h4>
                <p className="text-sm text-gray-600">从左侧选择需要的代码模板</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">2️⃣</div>
                <h4 className="font-medium text-gray-900 mb-1">配置参数</h4>
                <p className="text-sm text-gray-600">在中间区域配置相关参数</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">3️⃣</div>
                <h4 className="font-medium text-gray-900 mb-1">生成代码</h4>
                <p className="text-sm text-gray-600">点击生成按钮获取定制代码</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CodeGeneratorPage;
