import React from 'react';
import { ErrorDebuggerContainer } from '../../components';

export default {
  title: 'Features/ErrorDebuggerContainer',
  component: ErrorDebuggerContainer,
  parameters: {
    docs: {
      description: {
        component: `
ErrorDebuggerContainer组件 - 错误调试器容器组件。

提供分析和解决STM32开发中的编译错误、链接错误和运行时错误的功能。
支持错误代码查询、常见问题解决方案和智能错误分析。

在Storybook中，实际的错误分析功能可能无法正常工作，因为它依赖于后端服务。
        `,
      },
    },
    // 禁用控件，因为组件没有可配置的属性
    controls: { disable: true },
  },
};

// 基本用法
export const Basic = () => <ErrorDebuggerContainer />;
Basic.parameters = {
  docs: {
    description: {
      story: '错误调试器的基本用法。在实际应用中，用户可以输入错误信息、源代码和MCU型号，然后获取分析结果。',
    },
  },
};

// 使用说明
export const Usage = () => (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">错误调试器使用说明</h2>
    <ol className="list-decimal pl-5 space-y-2">
      <li>复制STM32项目的编译错误、链接错误或运行时错误日志</li>
      <li>粘贴到错误消息文本框中</li>
      <li>可选择性地粘贴导致错误的源代码</li>
      <li>选择正确的MCU型号</li>
      <li>点击"分析错误"按钮</li>
      <li>查看分析结果和解决方案</li>
    </ol>
    <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
      <p className="font-semibold">支持的错误类型：</p>
      <ul className="list-disc pl-5 mt-1">
        <li><strong>编译错误</strong> - 语法错误、缺少头文件、类型错误等</li>
        <li><strong>链接错误</strong> - 未定义引用、缺少库文件等</li>
        <li><strong>运行时错误</strong> - 硬件故障、栈溢出、看门狗超时等</li>
        <li><strong>硬件错误</strong> - 通信超时、硬件连接问题等</li>
      </ul>
    </div>
  </div>
);
Usage.parameters = {
  docs: {
    description: {
      story: '错误调试器的使用说明，包含基本操作步骤和支持的错误类型。',
    },
  },
};

// 错误示例
export const ErrorExamples = () => (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">典型错误示例</h2>
    <div className="grid grid-cols-1 gap-2">
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="font-medium">链接错误: 未定义引用</div>
        <div className="text-sm text-gray-500 mt-1">链接器找不到函数或变量的定义</div>
        <div className="text-xs font-mono bg-gray-200 p-1 mt-1 rounded">undefined reference to `HAL_GPIO_TogglePin'</div>
      </div>
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="font-medium">编译错误: 找不到头文件</div>
        <div className="text-sm text-gray-500 mt-1">编译器找不到指定的头文件</div>
        <div className="text-xs font-mono bg-gray-200 p-1 mt-1 rounded">error: 'stm32f1xx_hal.h' file not found</div>
      </div>
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="font-medium">运行时错误: 硬件故障</div>
        <div className="text-sm text-gray-500 mt-1">程序运行时发生硬件故障异常</div>
        <div className="text-xs font-mono bg-gray-200 p-1 mt-1 rounded">Hard fault exception occurred at PC = 0x08001234</div>
      </div>
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="font-medium">编译错误: 语法错误</div>
        <div className="text-sm text-gray-500 mt-1">代码中缺少分号或存在其他语法错误</div>
        <div className="text-xs font-mono bg-gray-200 p-1 mt-1 rounded">expected ';' before '}' token</div>
      </div>
    </div>
  </div>
);
ErrorExamples.parameters = {
  docs: {
    description: {
      story: '错误调试器提供的典型错误示例，用户可以点击使用。',
    },
  },
};

// 分析结果
export const AnalysisResult = () => (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">错误分析结果示例</h2>
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">错误类型</h3>
        <p className="mt-1 p-2 bg-gray-50 rounded-md">链接错误: 未定义引用</p>
      </div>
      <div>
        <h3 className="text-lg font-medium">错误分析</h3>
        <p className="mt-1 p-2 bg-gray-50 rounded-md">
          这是一个链接错误，表示链接器找不到函数 `HAL_GPIO_TogglePin` 的定义。这通常是因为缺少HAL库的链接或者没有正确初始化HAL库。
        </p>
      </div>
      <div>
        <h3 className="text-lg font-medium">解决方案</h3>
        <div className="mt-1 p-2 bg-gray-50 rounded-md">
          <ol className="list-decimal pl-5 space-y-1">
            <li>确保在项目中包含了STM32 HAL库</li>
            <li>检查是否在Makefile或项目设置中正确链接了HAL库</li>
            <li>确保在main.c中调用了HAL_Init()函数初始化HAL库</li>
            <li>检查是否包含了正确的头文件: #include "stm32f1xx_hal.h"</li>
          </ol>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium">代码修复建议</h3>
        <pre className="mt-1 p-2 bg-gray-50 rounded-md text-xs font-mono overflow-x-auto">
          {`// 在main.c文件开头添加
#include "stm32f1xx_hal.h"

// 在main函数开始处添加
int main(void) {
  HAL_Init();  // 初始化HAL库
  
  // 其他代码...
}`}
        </pre>
      </div>
    </div>
  </div>
);
AnalysisResult.parameters = {
  docs: {
    description: {
      story: '错误分析结果示例，展示了错误类型、分析、解决方案和代码修复建议。',
    },
  },
};
