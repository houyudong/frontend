import React from 'react';
import { Card, Button } from '../../components/ui';

export default {
  title: 'UI/Card',
  component: Card,
  argTypes: {
    className: {
      control: 'text',
      description: '自定义CSS类名',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'flat', 'bordered'],
      description: '卡片变体样式',
    },
    interactive: {
      control: 'boolean',
      description: '是否启用交互式效果',
    },
    onClick: {
      action: 'clicked',
      description: '点击卡片时的回调函数',
    },
    children: {
      control: 'text',
      description: '卡片内容',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Card组件 - 用于展示内容的容器组件。

可以包含标题、内容和操作。支持多种变体和交互式效果。
        `,
      },
    },
  },
  subcomponents: {
    'Card.Header': Card.Header,
    'Card.Body': Card.Body,
    'Card.Footer': Card.Footer,
    'Card.Title': Card.Title,
    'Card.Subtitle': Card.Subtitle,
    'Card.Image': Card.Image,
  },
};

// 基本卡片
export const Basic = (args) => (
  <Card {...args}>
    <Card.Body>基本卡片内容</Card.Body>
  </Card>
);
Basic.args = {
  variant: 'default',
  interactive: false,
};
Basic.parameters = {
  docs: {
    description: {
      story: '最简单的卡片组件，只包含一个Card.Body。',
    },
  },
};

// 完整卡片
export const Complete = () => (
  <Card>
    <Card.Header>
      <Card.Title>卡片标题</Card.Title>
      <Card.Subtitle>卡片副标题</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      这是卡片的主要内容区域。您可以在这里放置任何内容，包括文本、图像、表格等。
    </Card.Body>
    <Card.Footer>
      <Button variant="primary">确认</Button>
      <Button variant="outline" className="ml-2">取消</Button>
    </Card.Footer>
  </Card>
);
Complete.parameters = {
  docs: {
    description: {
      story: '完整的卡片组件，包含标题、副标题、内容和底部操作按钮。',
    },
  },
};

// 不同变体
export const Variants = () => (
  <div className="grid grid-cols-2 gap-4">
    <Card variant="default">
      <Card.Body>默认卡片</Card.Body>
    </Card>
    <Card variant="elevated">
      <Card.Body>带阴影的卡片</Card.Body>
    </Card>
    <Card variant="flat">
      <Card.Body>扁平卡片</Card.Body>
    </Card>
    <Card variant="bordered">
      <Card.Body>带边框的卡片</Card.Body>
    </Card>
  </div>
);
Variants.parameters = {
  docs: {
    description: {
      story: '展示所有可用的卡片变体样式。',
    },
  },
};

// 交互式卡片
export const Interactive = () => (
  <Card interactive onClick={() => alert('卡片被点击了！')}>
    <Card.Body>
      <p>这是一个交互式卡片，点击我试试！</p>
    </Card.Body>
  </Card>
);
Interactive.parameters = {
  docs: {
    description: {
      story: '交互式卡片，鼠标悬停时有反馈效果，可以点击。',
    },
  },
};

// 带图片的卡片
export const WithImage = () => (
  <Card>
    <Card.Image 
      src="https://via.placeholder.com/800x400" 
      alt="示例图片" 
    />
    <Card.Body>
      <Card.Title>带图片的卡片</Card.Title>
      <p className="mt-2">卡片可以包含图片，图片可以放在顶部、左侧或右侧。</p>
    </Card.Body>
  </Card>
);
WithImage.parameters = {
  docs: {
    description: {
      story: '带有图片的卡片，图片位于卡片顶部。',
    },
  },
};

// 卡片布局
export const Layout = () => (
  <div className="grid grid-cols-3 gap-4">
    <Card>
      <Card.Image 
        src="https://via.placeholder.com/400x200" 
        alt="示例图片" 
      />
      <Card.Body>
        <Card.Title>顶部图片</Card.Title>
        <p className="mt-2">图片位于卡片顶部。</p>
      </Card.Body>
    </Card>
    <Card>
      <Card.Image 
        src="https://via.placeholder.com/200x400" 
        alt="示例图片"
        position="left"
      />
      <Card.Body>
        <Card.Title>左侧图片</Card.Title>
        <p className="mt-2">图片位于卡片左侧。</p>
      </Card.Body>
    </Card>
    <Card>
      <Card.Image 
        src="https://via.placeholder.com/200x400" 
        alt="示例图片"
        position="right"
      />
      <Card.Body>
        <Card.Title>右侧图片</Card.Title>
        <p className="mt-2">图片位于卡片右侧。</p>
      </Card.Body>
    </Card>
  </div>
);
Layout.parameters = {
  docs: {
    description: {
      story: '展示不同的卡片布局，包括顶部图片、左侧图片和右侧图片。',
    },
  },
};
