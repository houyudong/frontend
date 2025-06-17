import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/ui';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost'],
      description: '按钮变体样式',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      description: '按钮尺寸',
    },
    disabled: { 
      control: 'boolean',
      description: '是否禁用按钮',
    },
    onClick: { 
      action: 'clicked',
      description: '点击按钮时的回调函数',
    },
    className: {
      control: 'text',
      description: '自定义CSS类名',
    },
    children: {
      control: 'text',
      description: '按钮内容',
    },
    to: {
      control: 'text',
      description: '路由链接地址，如果提供，按钮将渲染为Link组件',
    },
    href: {
      control: 'text',
      description: '外部链接地址，如果提供，按钮将渲染为a标签',
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: '按钮类型',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Button组件 - 提供各种样式和尺寸的按钮。

可以作为普通按钮、路由链接或外部链接使用。支持多种变体、尺寸和状态。
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// 基本按钮
export const Basic: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    children: '按钮',
  },
  parameters: {
    docs: {
      description: {
        story: '基本的按钮组件，可以通过控件调整各种属性。',
      },
    },
  },
};

// 不同变体
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary">主要</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="success">成功</Button>
      <Button variant="danger">危险</Button>
      <Button variant="warning">警告</Button>
      <Button variant="info">信息</Button>
      <Button variant="outline">轮廓</Button>
      <Button variant="ghost">幽灵</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有可用的按钮变体样式。',
      },
    },
  },
};

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="xs">超小</Button>
      <Button size="sm">小</Button>
      <Button size="md">中</Button>
      <Button size="lg">大</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有可用的按钮尺寸。',
      },
    },
  },
};

// 禁用状态
export const Disabled: Story = {
  render: () => (
    <Button disabled>禁用按钮</Button>
  ),
  parameters: {
    docs: {
      description: {
        story: '禁用状态的按钮，不响应点击事件。',
      },
    },
  },
};

// 带图标的按钮
export const WithIcon: Story = {
  render: () => (
    <Button>
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      带图标的按钮
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: '在按钮中添加图标，增强视觉效果和可用性。',
      },
    },
  },
};

// 链接按钮
export const AsLink: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button to="/example">路由链接</Button>
      <Button href="https://example.com" target="_blank">外部链接</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '按钮可以作为路由链接或外部链接使用。',
      },
    },
  },
}; 