import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HomeCourseCard } from '../../components/cards';

export default {
  title: 'Cards/HomeCourseCard',
  component: HomeCourseCard,
  decorators: [
    (Story) => (
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
  argTypes: {
    course: {
      description: '课程信息对象',
      control: 'object',
    },
  },
};

// 基本用法
export const Basic = (args) => <HomeCourseCard {...args} />;
Basic.args = {
  course: {
    id: 'intro',
    title: 'STM32H7简介与基础',
    description: '了解STM32H7系列微控制器的特性、架构和开发环境搭建。',
    image: '/images/courses/stm32h7-intro.jpg',
  },
};
Basic.parameters = {
  docs: {
    description: {
      story: '基本的首页课程卡片，显示课程的标题、描述和图片。',
    },
  },
};

// 多个卡片
export const MultipleCards = () => (
  <div className="grid grid-cols-1 gap-4">
    <HomeCourseCard
      course={{
        id: 'intro',
        title: 'STM32H7简介与基础',
        description: '了解STM32H7系列微控制器的特性、架构和开发环境搭建。',
        image: '/images/courses/stm32h7-intro.jpg',
      }}
    />
    <HomeCourseCard
      course={{
        id: 'gpio',
        title: 'GPIO编程与LED控制',
        description: '学习配置和控制STM32H7的GPIO引脚，实现LED闪烁等基础操作。',
        image: '/images/courses/gpio-led.jpg',
      }}
    />
    <HomeCourseCard
      course={{
        id: 'freertos',
        title: 'FreeRTOS基础',
        description: '在STM32H7上使用FreeRTOS实时操作系统，学习任务创建和通信。',
        image: '/images/courses/freertos.jpg',
      }}
    />
  </div>
);
MultipleCards.parameters = {
  docs: {
    description: {
      story: '展示多个首页课程卡片，用于在首页的特色课程部分。',
    },
  },
};

// 长标题和描述
export const LongTitleAndDescription = () => (
  <HomeCourseCard
    course={{
      id: 'long-title',
      title: '这是一个非常长的课程标题，用于测试卡片组件如何处理长标题文本',
      description: '这是一个非常长的描述，用于测试卡片组件如何处理长文本。STM32系列微控制器是基于ARM Cortex-M内核的32位微控制器，由意法半导体（STMicroelectronics）开发和生产。',
      image: '/images/courses/long-title.jpg',
    }}
  />
);
LongTitleAndDescription.parameters = {
  docs: {
    description: {
      story: '测试卡片组件如何处理长标题和长描述文本，通常会截断并显示省略号。',
    },
  },
};

// 图片加载错误
export const ImageError = () => (
  <HomeCourseCard
    course={{
      id: 'image-error',
      title: '图片加载错误',
      description: '测试卡片组件如何处理图片加载错误的情况。',
      image: '/non-existent-image.jpg',
    }}
  />
);
ImageError.parameters = {
  docs: {
    description: {
      story: '测试卡片组件如何处理图片加载错误的情况，通常会显示一个占位符。',
    },
  },
};

// 无图片
export const NoImage = () => (
  <HomeCourseCard
    course={{
      id: 'no-image',
      title: '无图片课程',
      description: '这个课程没有提供图片，测试卡片组件如何处理缺少图片的情况。',
    }}
  />
);
NoImage.parameters = {
  docs: {
    description: {
      story: '测试卡片组件如何处理缺少图片的情况，通常会显示一个占位符。',
    },
  },
};
