import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { HomeCourseCard } from '../../components/cards';

const meta: Meta<typeof HomeCourseCard> = {
  title: 'Cards/HomeCourseCard',
  component: HomeCourseCard,
  decorators: [
    (Story: React.ComponentType) => (
      <BrowserRouter>
        <div className="max-w-sm">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
HomeCourseCard组件 - 用于在首页展示课程信息的卡片组件。

显示课程的标题、描述和图片，并提供链接到课程详情页面。
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HomeCourseCard>;

// 基本用法
export const Basic: Story = {
  args: {
    id: 'intro',
    title: 'STM32H7简介与基础',
    description: '了解STM32H7系列微控制器的特性、架构和开发环境搭建。',
    instructor: '张老师',
    duration: '2小时',
    students: 128,
    image: '/images/courses/stm32h7-intro.jpg',
  },
  parameters: {
    docs: {
      description: {
        story: '基本的首页课程卡片，显示课程的标题、描述和图片。',
      },
    },
  },
};

// 多个卡片
export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4">
      <HomeCourseCard
        id="intro"
        title="STM32H7简介与基础"
        description="了解STM32H7系列微控制器的特性、架构和开发环境搭建。"
        instructor="张老师"
        duration="2小时"
        students={128}
        image="/images/courses/stm32h7-intro.jpg"
      />
      <HomeCourseCard
        id="gpio"
        title="GPIO编程与LED控制"
        description="学习配置和控制STM32H7的GPIO引脚，实现LED闪烁等基础操作。"
        instructor="李老师"
        duration="3小时"
        students={95}
        image="/images/courses/gpio-led.jpg"
      />
      <HomeCourseCard
        id="freertos"
        title="FreeRTOS基础"
        description="在STM32H7上使用FreeRTOS实时操作系统，学习任务创建和通信。"
        instructor="王老师"
        duration="4小时"
        students={76}
        image="/images/courses/freertos.jpg"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示多个首页课程卡片，用于在首页的特色课程部分。',
      },
    },
  },
};

// 长标题和描述
export const LongTitleAndDescription: Story = {
  render: () => (
    <HomeCourseCard
      id="long-title"
      title="这是一个非常长的课程标题，用于测试卡片组件如何处理长标题文本"
      description="这是一个非常长的描述，用于测试卡片组件如何处理长文本。STM32系列微控制器是基于ARM Cortex-M内核的32位微控制器，由意法半导体（STMicroelectronics）开发和生产。"
      instructor="张老师"
      duration="2小时"
      students={128}
      image="/images/courses/long-title.jpg"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: '测试卡片组件如何处理长标题和长描述文本，通常会截断并显示省略号。',
      },
    },
  },
};

// 图片加载错误
export const ImageError: Story = {
  render: () => (
    <HomeCourseCard
      id="image-error"
      title="图片加载错误"
      description="测试卡片组件如何处理图片加载错误的情况。"
      instructor="张老师"
      duration="2小时"
      students={128}
      image="/non-existent-image.jpg"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: '测试卡片组件如何处理图片加载错误的情况，通常会显示一个占位符。',
      },
    },
  },
}; 