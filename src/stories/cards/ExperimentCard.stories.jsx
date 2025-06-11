import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ExperimentCard } from '../../components/cards';

export default {
  title: 'Cards/ExperimentCard',
  component: ExperimentCard,
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
ExperimentCard组件 - 用于展示实验项目信息的卡片组件。

显示实验的标题、描述、类型、难度等级、预计时间和标签等信息，并提供链接到实验详情页面。
支持显示"新"和"热门"标签。
        `,
      },
    },
  },
  argTypes: {
    id: { control: 'number', description: '实验ID' },
    title: { control: 'text', description: '实验标题' },
    description: { control: 'text', description: '实验描述' },
    type: { control: 'text', description: '实验类型' },
    imageUrl: { control: 'text', description: '实验图片URL' },
    difficulty: { control: 'select', options: ['初级', '中级', '高级'], description: '实验难度' },
    timeEstimate: { control: 'number', description: '预计完成时间（分钟）' },
    tags: { control: 'array', description: '实验标签' },
    slug: { control: 'text', description: '实验页面路径' },
    isNew: { control: 'boolean', description: '是否为新实验' },
    isPopular: { control: 'boolean', description: '是否为热门实验' },
  },
};

// 基本用法
export const Basic = (args) => <ExperimentCard {...args} />;
Basic.args = {
  id: 1,
  title: 'LED闪烁控制 - 基础GPIO操作',
  description: '学习如何使用GPIO引脚控制LED。本实验涵盖基本的数字输出操作和控制方法。',
  type: 'GPIO实验',
  imageUrl: '/images/experiments/led-blink.jpg',
  difficulty: '初级',
  timeEstimate: 15,
  tags: ['GPIO', '数字输出', 'LED控制'],
  slug: 'gpio/experiments/led-blink',
  isNew: false,
  isPopular: false,
};
Basic.parameters = {
  docs: {
    description: {
      story: '基本的实验卡片，显示实验的标题、描述、类型、难度等级、预计时间和标签等信息。',
    },
  },
};

// 新实验
export const NewExperiment = () => (
  <ExperimentCard
    id={2}
    title='定时器中断控制'
    description='学习配置STM32系列的定时器并处理定时中断，实现精确的时间控制和周期性任务。'
    type='定时中断'
    imageUrl='/images/experiments/timer-interrupt.jpg'
    difficulty='中级'
    timeEstimate={30}
    tags={['定时器', '中断', '精确控制']}
    slug='timer/experiments/basic-timer-interrupt'
    isNew={true}
    isPopular={false}
  />
);
NewExperiment.parameters = {
  docs: {
    description: {
      story: '带有"新"标签的实验卡片，表示这是一个新添加的实验。',
    },
  },
};

// 热门实验
export const PopularExperiment = () => (
  <ExperimentCard
    id={3}
    title='按键输入 - 用户交互'
    description='了解如何通过按钮读取用户输入，并实现消抖技术以确保操作的可靠性。'
    type='GPIO实验'
    imageUrl='/images/experiments/button-input.jpg'
    difficulty='初级'
    timeEstimate={20}
    tags={['GPIO', '数字输入', '中断处理']}
    slug='gpio/experiments/button-input'
    isNew={false}
    isPopular={true}
  />
);
PopularExperiment.parameters = {
  docs: {
    description: {
      story: '带有"热门"标签的实验卡片，表示这是一个受欢迎的实验。',
    },
  },
};

// 新的热门实验
export const NewAndPopularExperiment = () => (
  <ExperimentCard
    id={4}
    title='UART通信实现'
    description='在STM32系列和计算机之间建立串行通信。学习如何通过UART发送和接收数据。'
    type='串口实验'
    imageUrl='/images/experiments/uart-comm.jpg'
    difficulty='中级'
    timeEstimate={30}
    tags={['UART', '串行通信', '数据传输']}
    slug='uart/experiments/basic-uart'
    isNew={true}
    isPopular={true}
  />
);
NewAndPopularExperiment.parameters = {
  docs: {
    description: {
      story: '同时带有"新"和"热门"标签的实验卡片。',
    },
  },
};

// 高级实验
export const AdvancedExperiment = () => (
  <ExperimentCard
    id={5}
    title='DMA内存到外设传输'
    description='学习配置DMA控制器实现高效的数据传输，减轻CPU负担，提高系统性能。'
    type='DMA实验'
    imageUrl='/images/experiments/dma-transfer.jpg'
    difficulty='高级'
    timeEstimate={60}
    tags={['DMA', '数据传输', '性能优化']}
    slug='dma/experiments/memory-transfer'
    isNew={false}
    isPopular={false}
  />
);
AdvancedExperiment.parameters = {
  docs: {
    description: {
      story: '高级难度的实验卡片，通常需要更多的时间和更深入的知识。',
    },
  },
};

// 多标签实验
export const MultiTagExperiment = () => (
  <ExperimentCard
    id={6}
    title='智能环境监控系统'
    description='综合运用多种技术开发一个完整的环境监控系统，包括传感器采集、数据处理与显示。'
    type='综合应用场景'
    imageUrl='/images/experiments/env-monitor.jpg'
    difficulty='高级'
    timeEstimate={120}
    tags={['传感器', '数据处理', '系统集成', 'ADC', 'UART', '显示', '存储']}
    slug='application/env-monitor'
    isNew={false}
    isPopular={false}
  />
);
MultiTagExperiment.parameters = {
  docs: {
    description: {
      story: '带有多个标签的实验卡片，展示了标签的溢出处理。',
    },
  },
};
