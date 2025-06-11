import React from 'react';
import { FlowchartContainer } from '../../components/charts';

export default {
  title: 'Charts/FlowchartContainer',
  component: FlowchartContainer,
  argTypes: {
    initialFlowchart: {
      control: 'text',
      description: '初始流程图内容',
    },
    className: {
      control: 'text',
      description: '自定义CSS类名',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
FlowchartContainer组件 - 流程图容器组件。

提供流程图的创建、编辑和可视化功能，支持多种节点类型和连接方式。
        `,
      },
    },
  },
};

// 基本流程图
export const Basic = (args) => <FlowchartContainer {...args} />;
Basic.args = {
  initialFlowchart: `flowchart TD
    A[开始] --> B{条件判断}
    B -->|是| C[处理1]
    B -->|否| D[处理2]
    C --> E[结束]
    D --> E`,
};
Basic.parameters = {
  docs: {
    description: {
      story: '基本的流程图组件，显示一个简单的流程图。',
    },
  },
};

// 复杂流程图
export const Complex = () => (
  <FlowchartContainer
    initialFlowchart={`flowchart TD
    A[HAL初始化] --> B[GPIO初始化]
    B --> C[UART初始化]
    C --> D[进入主循环]
    D --> E[处理任务]
    E --> D
    
    F[中断处理] --> G[读取按钮状态]
    G --> H[切换LED]
    H --> I[发送串口消息]
    
    style A fill:#f9d6e3,stroke:#333
    style B fill:#e3f2fd,stroke:#333
    style C fill:#fff3e0,stroke:#333
    style D fill:#e8f7e4,stroke:#333
    style F fill:#ffeb3b,stroke:#333`}
  />
);
Complex.parameters = {
  docs: {
    description: {
      story: '复杂的流程图，包含多个节点、样式和分支。',
    },
  },
};

// 空流程图
export const Empty = () => <FlowchartContainer initialFlowchart="" />;
Empty.parameters = {
  docs: {
    description: {
      story: '空的流程图，用户可以从头开始创建。',
    },
  },
};

// 带子图的流程图
export const WithSubgraphs = () => (
  <FlowchartContainer
    initialFlowchart={`flowchart TD
    subgraph 初始化
      A[HAL初始化] --> B[GPIO初始化]
      B --> C[UART初始化]
    end
    
    subgraph 主循环
      D[进入主循环] --> E[处理任务]
      E --> D
    end
    
    subgraph 中断处理
      F[中断处理] --> G[读取按钮状态]
      G --> H[切换LED]
    end
    
    C --> D
    H --> I[发送串口消息]`}
  />
);
WithSubgraphs.parameters = {
  docs: {
    description: {
      story: '带子图的流程图，使用subgraph将相关节点分组。',
    },
  },
};
