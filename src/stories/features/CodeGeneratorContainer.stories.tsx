import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CodeGeneratorContainer } from '../../components';

const meta: Meta<typeof CodeGeneratorContainer> = {
  title: 'Features/CodeGeneratorContainer',
  component: CodeGeneratorContainer,
  argTypes: {
    initialPrompt: {
      control: 'text',
      description: '初始提示文本',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
CodeGeneratorContainer组件 - 代码生成器容器组件。

提供AI辅助代码生成功能，支持STM32嵌入式代码生成、流程图生成和代码解释。
支持通过initialPrompt属性传入初始提示，用于预设生成任务。

在Storybook中，实际的代码生成功能可能无法正常工作，因为它依赖于后端服务。
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeGeneratorContainer>;

// 基本用法
export const Basic: Story = {
  args: {
    initialPrompt: '',
  },
  parameters: {
    docs: {
      description: {
        story: '代码生成器的基本用法。在实际应用中，用户可以输入自然语言描述，AI将生成相应的代码、流程图和解释。',
      },
    },
  },
};

// 带初始提示
export const WithInitialPrompt: Story = {
  render: () => (
    <CodeGeneratorContainer initialPrompt="使用STM32F103和HAL库，编写一个程序控制LED闪烁，频率为1Hz。" />
  ),
  parameters: {
    docs: {
      description: {
        story: '带初始提示的代码生成器，可以预设生成任务。',
      },
    },
  },
};

// 使用说明
export const Usage: Story = {
  render: () => (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">代码生成器使用说明</h2>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">编写有效的提示</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>尽可能详细地描述你想要实现的功能</li>
          <li>指定硬件细节，如使用的芯片型号、引脚连接等</li>
          <li>说明你希望使用的库或框架（如HAL库、LL库等）</li>
          <li>提供具体的参数，如时间间隔、通信速率等</li>
          <li>如果有特殊要求，请明确说明</li>
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">提示示例</h3>
        <div className="p-3 bg-gray-50 rounded-md text-sm">
          使用STM32F103C8T6和HAL库，编写一个程序控制连接到PB5的LED每500毫秒闪烁一次，
          并通过UART1（PA9/PA10，波特率115200）每次LED状态变化时发送当前状态。
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">生成结果</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>代码</strong> - 生成的C语言代码，可以复制到你的项目中</li>
          <li><strong>流程图</strong> - 代码的可视化流程图，帮助理解程序逻辑</li>
          <li><strong>代码解释</strong> - 详细解释代码的工作原理和关键部分</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '代码生成器的使用说明，包含如何编写有效的提示、提示示例和生成结果说明。',
      },
    },
  },
};

// 预设模板
export const Templates: Story = {
  render: () => (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">预设模板</h2>
      <div className="grid grid-cols-1 gap-3">
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">LED闪烁</h3>
          <p className="text-sm text-gray-600 mt-1">使用STM32F103和HAL库，编写一个程序控制LED闪烁，频率为1Hz。</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">按钮控制LED</h3>
          <p className="text-sm text-gray-600 mt-1">使用STM32F103和HAL库，编写一个程序读取按钮状态，当按钮按下时点亮LED，松开时熄灭LED。</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">UART通信</h3>
          <p className="text-sm text-gray-600 mt-1">使用STM32F103和HAL库，配置UART1（PA9/PA10）以115200波特率进行通信，实现简单的命令解析功能。</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">ADC读取</h3>
          <p className="text-sm text-gray-600 mt-1">使用STM32F103和HAL库，配置ADC读取模拟输入，并通过UART输出读取的值。</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">定时器中断</h3>
          <p className="text-sm text-gray-600 mt-1">使用STM32F103和HAL库，配置定时器中断，每500ms触发一次，在中断中切换LED状态。</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '代码生成器提供的预设模板，用户可以选择使用。',
      },
    },
  },
}; 