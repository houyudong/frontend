import React from 'react';
import { SerialDebuggerContainer } from '../../components';

export default {
  title: 'Features/SerialDebuggerContainer',
  component: SerialDebuggerContainer,
  parameters: {
    docs: {
      description: {
        component: `
SerialDebuggerContainer组件 - 串口调试器容器组件。

提供通过Web Serial API与STM32设备进行通信的功能，支持文本和十六进制数据格式。
包含命令模板、API参考和设备信息等辅助功能。

注意：由于Web Serial API的限制，此组件只能在支持的浏览器中使用，且需要用户授权。
在Storybook中，实际的串口通信功能可能无法正常工作。
        `,
      },
    },
    // 禁用控件，因为组件没有可配置的属性
    controls: { disable: true },
  },
};

// 基本用法
export const Basic = () => <SerialDebuggerContainer />;
Basic.parameters = {
  docs: {
    description: {
      story: '串口调试器的基本用法。在实际应用中，用户可以选择设备、设置波特率、发送和接收数据。',
    },
  },
};

// 使用说明
export const Usage = () => (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">串口调试器使用说明</h2>
    <ol className="list-decimal pl-5 space-y-2">
      <li>点击"选择设备"按钮，从弹出的对话框中选择要连接的串口设备</li>
      <li>选择适当的波特率（默认115200）</li>
      <li>点击"连接"按钮建立串口连接</li>
      <li>在命令输入框中输入命令，按回车键或点击"发送"按钮发送</li>
      <li>接收到的数据将显示在控制台输出区域</li>
      <li>可以切换文本模式和十六进制模式</li>
      <li>右侧面板提供了常用命令模板和API参考</li>
    </ol>
    <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
      <p className="font-semibold">注意：</p>
      <ul className="list-disc pl-5 mt-1">
        <li>Web Serial API仅在支持的浏览器中可用（Chrome 89+、Edge 89+等）</li>
        <li>首次连接设备时需要用户授权</li>
        <li>如果设备突然断开，串口调试器会自动检测并更新状态</li>
      </ul>
    </div>
  </div>
);
Usage.parameters = {
  docs: {
    description: {
      story: '串口调试器的使用说明，包含基本操作步骤和注意事项。',
    },
  },
};

// 命令模板
export const CommandTemplates = () => (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">常用命令模板</h2>
    <div className="grid grid-cols-1 gap-2">
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="font-medium">获取固件版本</div>
        <div className="text-sm text-gray-500 mt-1">获取设备固件版本信息</div>
        <div className="text-xs font-mono bg-gray-200 p-1 mt-1 rounded">version</div>
      </div>
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="font-medium">读取系统状态</div>
        <div className="text-sm text-gray-500 mt-1">读取系统当前状态</div>
        <div className="text-xs font-mono bg-gray-200 p-1 mt-1 rounded">status</div>
      </div>
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="font-medium">切换LED</div>
        <div className="text-sm text-gray-500 mt-1">切换LED状态</div>
        <div className="text-xs font-mono bg-gray-200 p-1 mt-1 rounded">led toggle</div>
      </div>
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="font-medium">读取GPIO状态</div>
        <div className="text-sm text-gray-500 mt-1">读取PE1引脚状态</div>
        <div className="text-xs font-mono bg-gray-200 p-1 mt-1 rounded">gpio read PE1</div>
      </div>
    </div>
  </div>
);
CommandTemplates.parameters = {
  docs: {
    description: {
      story: '串口调试器提供的常用命令模板，用户可以点击使用。',
    },
  },
};
