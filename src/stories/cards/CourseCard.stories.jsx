import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CourseCard } from '../../components/cards';

export default {
  title: 'Cards/CourseCard',
  component: CourseCard,
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
CourseCard组件 - 用于展示课程信息的卡片组件。

显示课程的标题、描述、难度等级、时长等信息，并提供链接到课程详情页面。
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
export const Basic = (args) => <CourseCard {...args} />;
Basic.args = {
  course: {
    id: 'stm32-intro',
    title: 'STM32系列简介',
    description: '了解STM32系列微控制器的架构、特性和应用场景。本课程将介绍STM32系列的核心特点、性能优势以及与其他MCU的比较。',
    level: 'beginner',
    difficulty: '入门级',
    duration: '2小时',
    image_url: '/images/courses/stm32-intro.jpg',
  },
};
Basic.parameters = {
  docs: {
    description: {
      story: '基本的课程卡片，显示课程的标题、描述、难度等级和时长。',
    },
  },
};

// 不同难度等级
export const DifficultyLevels = () => (
  <div className="grid grid-cols-1 gap-4">
    <CourseCard
      course={{
        id: 'beginner-course',
        title: '入门级课程',
        description: '适合初学者的基础课程，无需任何前置知识。',
        level: 'beginner',
        difficulty: '入门级',
        duration: '2小时',
        image_url: '/images/courses/beginner.jpg',
      }}
    />
    <CourseCard
      course={{
        id: 'intermediate-course',
        title: '中级课程',
        description: '需要一定基础知识的进阶课程，适合有一些经验的学习者。',
        level: 'intermediate',
        difficulty: '中级',
        duration: '4小时',
        image_url: '/images/courses/intermediate.jpg',
      }}
    />
    <CourseCard
      course={{
        id: 'advanced-course',
        title: '高级课程',
        description: '深入探讨复杂主题的高级课程，适合有丰富经验的开发者。',
        level: 'advanced',
        difficulty: '高级',
        duration: '6小时',
        image_url: '/images/courses/advanced.jpg',
      }}
    />
  </div>
);
DifficultyLevels.parameters = {
  docs: {
    description: {
      story: '展示不同难度等级的课程卡片，包括入门级、中级和高级。',
    },
  },
};

// 长描述
export const LongDescription = () => (
  <CourseCard
    course={{
      id: 'long-description',
      title: '带有长描述的课程',
      description: '这是一个非常长的描述，用于测试卡片组件如何处理长文本。STM32系列微控制器是基于ARM Cortex-M内核的32位微控制器，由意法半导体（STMicroelectronics）开发和生产。STM32系列提供了广泛的产品线，从低成本、低功耗的STM32F0系列到高性能的STM32H7系列，覆盖了各种应用场景。本课程将深入介绍STM32系列的架构、特性、外设和应用，帮助您全面了解这一强大的微控制器平台。',
      level: 'intermediate',
      difficulty: '中级',
      duration: '4小时',
      image_url: '/images/courses/long-description.jpg',
    }}
  />
);
LongDescription.parameters = {
  docs: {
    description: {
      story: '测试卡片组件如何处理长描述文本，通常会截断并显示省略号。',
    },
  },
};

// 无图片
export const NoImage = () => (
  <CourseCard
    course={{
      id: 'no-image',
      title: '无图片课程',
      description: '这个课程没有提供图片，测试卡片组件如何处理缺少图片的情况。',
      level: 'beginner',
      difficulty: '入门级',
      duration: '2小时',
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
