# Storybook 组件库

这个目录包含了STM32 AI嵌入式编程平台的Storybook组件库。

## 目录结构

```
stories/
├── ui/                  # UI组件
│   ├── Button.stories.jsx
│   ├── Card.stories.jsx
│   └── ...
├── layout/              # 布局组件
│   ├── MainLayout.stories.jsx
│   ├── Sidebar.stories.jsx
│   └── ...
├── cards/               # 卡片组件
│   ├── CourseCard.stories.jsx
│   ├── ExperimentCard.stories.jsx
│   └── ...
├── charts/              # 图表组件
│   ├── MermaidFlowchart.stories.jsx
│   └── ...
├── features/            # 功能组件
│   ├── WebIDEContainer.stories.jsx
│   ├── SerialDebuggerContainer.stories.jsx
│   └── ...
└── Introduction.stories.mdx  # 首页
```

## 运行Storybook

```bash
# 在frontend目录下运行
npm run storybook
```

## 添加新的Story

1. 在相应的目录下创建一个新的`.stories.jsx`文件
2. 导入组件
3. 定义默认导出，包含组件的元数据
4. 定义各种用例

示例：

```jsx
import React from 'react';
import { Button } from '../../components/ui';

export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost'],
    },
    // 其他参数...
  },
};

// 基本按钮
export const Basic = (args) => <Button {...args}>按钮</Button>;
Basic.args = {
  variant: 'primary',
  size: 'md',
  disabled: false,
};

// 其他用例...
```

## 文档化组件

使用MDX格式可以创建更详细的文档：

```jsx
// Button.stories.mdx
import { Meta, Story, Canvas, ArgsTable } from '@storybook/addon-docs';
import { Button } from '../../components/ui';

<Meta title="UI/Button/文档" component={Button} />

# Button 组件

Button 组件用于触发操作或导航的交互式按钮。

## 属性

<ArgsTable of={Button} />

## 示例

### 基本用法

<Canvas>
  <Story id="ui-button--basic" />
</Canvas>

// 其他示例...
```

## 最佳实践

1. 为每个组件创建多个用例，展示不同的配置和用法
2. 使用`argTypes`定义组件的属性和控件
3. 为每个用例添加描述，说明其用途和特点
4. 使用`parameters`添加额外的元数据，如文档描述
5. 对于复杂组件，创建单独的MDX文档
