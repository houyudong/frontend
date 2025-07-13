import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { WebIDEContainer } from '../../components';

const meta: Meta<typeof WebIDEContainer> = {
  title: 'Features/WebIDEContainer',
  component: WebIDEContainer,
  parameters: {
    docs: {
      description: {
        component: `
WebIDEContainer组件 - Web集成开发环境容器组件。

提供完整的STM32程序开发环境，包括代码编辑、编译、烧录和调试功能。
集成了文件浏览器、代码编辑器、构建面板、调试控制台和文档面板等功能。
支持连接ST-Link调试器，烧录程序到STM32开发板。

在Storybook中，实际的编译和烧录功能可能无法正常工作，因为它们依赖于后端服务。
        `,
      },
    },
    // 禁用控件，因为组件没有可配置的属性
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof WebIDEContainer>;

// 基本用法
export const Basic: Story = {
  render: () => <WebIDEContainer />,
  parameters: {
    docs: {
      description: {
        story: 'WebIDE的基本用法。在实际应用中，用户可以编辑、编译和烧录STM32程序。',
      },
    },
  },
};

// 使用说明
export const Usage: Story = {
  render: () => (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">WebIDE使用说明</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">基本功能</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>代码编辑：支持C/C++语法高亮、代码补全和错误提示</li>
            <li>文件管理：创建、编辑、删除和重命名文件和目录</li>
            <li>编译构建：一键编译STM32项目，显示编译错误和警告</li>
            <li>程序烧录：连接ST-Link调试器，将编译好的程序烧录到开发板</li>
            <li>调试功能：支持断点、单步执行、变量查看等调试功能</li>
            <li>串口监视：查看串口输出，与开发板进行通信</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">界面布局</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>左侧面板</strong>：文件浏览器，显示项目文件结构</li>
            <li><strong>中央区域</strong>：代码编辑器，用于编辑源代码</li>
            <li><strong>右侧面板</strong>：文档和帮助面板，显示API参考和示例</li>
            <li><strong>底部面板</strong>：输出控制台，显示编译输出、调试信息和串口数据</li>
            <li><strong>顶部工具栏</strong>：常用操作按钮，如编译、烧录、调试等</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">快捷键</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 rounded-md">
              <span className="font-mono text-sm bg-gray-200 px-1 rounded">Ctrl+S</span>
              <span className="ml-2">保存文件</span>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <span className="font-mono text-sm bg-gray-200 px-1 rounded">F7</span>
              <span className="ml-2">编译项目</span>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <span className="font-mono text-sm bg-gray-200 px-1 rounded">F5</span>
              <span className="ml-2">开始调试</span>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <span className="font-mono text-sm bg-gray-200 px-1 rounded">F8</span>
              <span className="ml-2">烧录程序</span>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <span className="font-mono text-sm bg-gray-200 px-1 rounded">Ctrl+F</span>
              <span className="ml-2">查找</span>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <span className="font-mono text-sm bg-gray-200 px-1 rounded">Ctrl+H</span>
              <span className="ml-2">替换</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'WebIDE的使用说明，包含基本功能、界面布局和快捷键。',
      },
    },
  },
};

// 项目模板
export const Templates: Story = {
  render: () => (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">项目模板</h2>
      <div className="grid grid-cols-1 gap-3">
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">空白项目</h3>
          <p className="text-sm text-gray-600 mt-1">基本的STM32项目结构，包含最小的初始化代码。</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">LED闪烁</h3>
          <p className="text-sm text-gray-600 mt-1">控制LED闪烁的示例项目，适合初学者入门。</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">串口通信</h3>
          <p className="text-sm text-gray-600 mt-1">通过UART与计算机通信的示例项目。</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">ADC采集</h3>
          <p className="text-sm text-gray-600 mt-1">使用ADC读取模拟信号的示例项目。</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">定时器中断</h3>
          <p className="text-sm text-gray-600 mt-1">使用定时器中断实现精确定时的示例项目。</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'WebIDE提供的项目模板，用户可以选择使用。',
      },
    },
  },
}; 