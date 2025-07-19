# 班级管理功能模块

## 📋 功能概述

本模块为STM32 AI嵌入式学习平台新增了完整的班级管理功能，包括班级的增删改查和学生的增删改查功能。该模块严格按照项目的Feature-Driven Architecture架构设计，确保代码的可维护性和扩展性。

## 🎯 主要功能

### 班级管理
- ✅ **班级列表**: 支持分页、搜索、排序和筛选
- ✅ **创建班级**: 完整的班级信息录入，包括课程表设置
- ✅ **编辑班级**: 修改班级基本信息和状态
- ✅ **删除班级**: 安全删除（有学生的班级不能删除）
- ✅ **班级详情**: 查看完整的班级信息
- ✅ **状态管理**: 活跃、不活跃、已归档状态切换

### 学生管理
- ✅ **学生列表**: 支持分页、搜索、排序和筛选
- ✅ **添加学生**: 完整的学生信息录入
- ✅ **编辑学生**: 修改学生基本信息
- ✅ **删除学生**: 安全删除学生记录
- ✅ **学生详情**: 查看完整的学生信息和学习统计
- ✅ **批量操作**: 支持批量激活、停用、暂停、毕业、删除
- ✅ **状态管理**: 活跃、不活跃、暂停、已毕业状态管理

## 🏗️ 架构设计

### 目录结构
```
src/features/teacher/classManagement/
├── types/                    # 类型定义
│   └── index.ts             # 完整的TypeScript类型定义
├── services/                # API服务层
│   ├── classService.ts      # 班级相关API
│   └── studentService.ts    # 学生相关API
├── hooks/                   # 自定义Hooks
│   ├── useClassManagement.ts    # 班级管理Hook
│   └── useStudentManagement.ts  # 学生管理Hook
├── components/              # 组件层
│   ├── common/             # 通用组件
│   │   ├── DataTable.tsx   # 通用数据表格
│   │   ├── SearchFilter.tsx # 搜索过滤组件
│   │   └── Modal.tsx       # 通用模态框
│   ├── class/              # 班级相关组件
│   │   ├── ClassTable.tsx  # 班级表格
│   │   └── ClassForm.tsx   # 班级表单
│   └── student/            # 学生相关组件
│       ├── StudentTable.tsx # 学生表格
│       └── StudentForm.tsx  # 学生表单
├── pages/                  # 页面组件
│   ├── ClassManagementPage.tsx    # 班级管理页面
│   └── StudentManagementPage.tsx  # 学生管理页面
└── utils/                  # 工具函数
    └── index.ts            # 通用工具函数
```

### 设计原则

1. **Feature-Driven Architecture**: 每个功能模块自包含，包含完整的types、services、hooks、components、pages
2. **分层架构**: 清晰的分层设计，表现层 → 业务层 → 数据层 → 基础层
3. **组件化设计**: 高度可复用的组件，支持配置化使用
4. **TypeScript类型安全**: 完整的类型定义，确保类型安全
5. **统一UI风格**: 遵循项目现有的UI设计规范

## 🔧 技术实现

### 核心技术栈
- **React 18**: 函数式组件 + Hooks
- **TypeScript**: 完整的类型安全
- **Tailwind CSS**: 原子化CSS样式
- **自定义Hooks**: 业务逻辑封装
- **统一API客户端**: 基于项目现有的apiClient

### 关键特性
- **响应式设计**: 支持移动端和桌面端
- **实时搜索**: 防抖搜索，提升用户体验
- **分页支持**: 高效的数据分页加载
- **表单验证**: 完整的前端表单验证
- **错误处理**: 统一的错误处理机制
- **加载状态**: 友好的加载状态提示

## 🚀 使用指南

### 访问路径
- **班级管理**: `/teacher/management/classes`
- **学生管理**: `/teacher/management/students`

### 权限要求
- 需要教师角色权限才能访问

### 主要操作流程

#### 班级管理流程
1. 进入班级管理页面
2. 可以搜索、筛选班级
3. 点击"创建班级"添加新班级
4. 填写班级信息（名称、学期、学年等）
5. 可选择添加课程表
6. 保存后班级创建成功

#### 学生管理流程
1. 进入学生管理页面
2. 可以搜索、筛选学生
3. 点击"添加学生"添加新学生
4. 填写学生信息（姓名、学号、邮箱等）
5. 选择所属班级
6. 保存后学生添加成功

## 📊 数据模型

### 班级数据模型
```typescript
interface Class {
  id: string;
  name: string;
  description?: string;
  teacherId: string;
  teacherName: string;
  status: 'active' | 'inactive' | 'archived';
  studentCount: number;
  maxStudents?: number;
  createdAt: string;
  updatedAt: string;
  semester: string;
  academicYear: string;
  subject?: string;
  room?: string;
  schedule?: ClassSchedule[];
}
```

### 学生数据模型
```typescript
interface Student {
  id: string;
  username: string;
  email: string;
  fullName: string;
  studentId: string;
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
  classId: string;
  className: string;
  enrollmentDate: string;
  lastLogin?: string;
  coursesCompleted: number;
  experimentsCompleted: number;
  totalStudyTime: number;
  averageScore: number;
  // ... 其他字段
}
```

## 🔄 API接口

### 班级管理API
- `GET /api/classes` - 获取班级列表
- `POST /api/classes` - 创建班级
- `PUT /api/classes/:id` - 更新班级
- `DELETE /api/classes/:id` - 删除班级
- `GET /api/classes/:id` - 获取班级详情

### 学生管理API
- `GET /api/students` - 获取学生列表
- `POST /api/students` - 创建学生
- `PUT /api/students/:id` - 更新学生
- `DELETE /api/students/:id` - 删除学生
- `POST /api/students/batch` - 批量操作学生

## 🎨 UI组件

### 通用组件
- **DataTable**: 支持排序、分页、选择的数据表格
- **SearchFilter**: 搜索和过滤组件
- **Modal**: 通用模态框组件

### 业务组件
- **ClassTable**: 班级列表表格
- **ClassForm**: 班级表单
- **StudentTable**: 学生列表表格
- **StudentForm**: 学生表单

## 🔧 开发规范

### 代码规范
- 遵循项目现有的ESLint规则
- 使用TypeScript严格模式
- 组件采用函数式组件 + Hooks
- 样式使用Tailwind CSS

### 命名规范
- 组件名使用PascalCase
- 文件名使用PascalCase
- 变量和函数使用camelCase
- 常量使用UPPER_SNAKE_CASE

### 提交规范
- 遵循项目的Git提交规范
- 每个功能点单独提交
- 提交信息清晰描述变更内容

## 🚀 部署说明

该功能模块已完全集成到现有项目中，无需额外的部署步骤。构建和部署流程与主项目保持一致。

## 📝 更新日志

### v1.1.0 (2025-01-14) - 优化版本
- ✅ 删除旧的学生管理代码，避免代码冗余
- ✅ 优化路由跳转逻辑，提升用户体验
- ✅ 完善面包屑导航和页面导航
- ✅ 优化侧边栏子菜单显示逻辑
- ✅ 增强UI显示效果和样式一致性
- ✅ 添加快速操作按钮和功能提示
- ✅ 完善错误处理和用户反馈

### v1.0.0 (2025-01-14)
- ✅ 完成班级管理CRUD功能
- ✅ 完成学生管理CRUD功能
- ✅ 集成到路由和导航系统
- ✅ 完成UI组件开发
- ✅ 完成API服务封装
- ✅ 完成类型定义
- ✅ 完成工具函数开发

## 🔮 未来规划

- [ ] 添加班级统计图表
- [ ] 支持学生批量导入/导出
- [ ] 添加班级公告功能
- [ ] 支持学生分组管理
- [ ] 添加班级课程表可视化
- [ ] 支持学生学习进度跟踪

---

**开发者**: STM32 AI平台开发团队  
**最后更新**: 2025-01-14
