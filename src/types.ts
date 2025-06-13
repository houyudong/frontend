/**
 * 课程类型定义
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: string;
  updatedAt: string;
}

/**
 * 实验类型定义
 */
export interface Experiment {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  thumbnail: string;
  materials: string[];
  objectives: string[];
  steps: ExperimentStep[];
  challenges: string[];
  resourceLinks: ResourceLink[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 实验步骤类型定义
 */
export interface ExperimentStep {
  title: string;
  content: string;
  imageUrl?: string;
  code?: string;
}

/**
 * 资源链接类型定义
 */
export interface ResourceLink {
  title: string;
  url: string;
  type: 'documentation' | 'tutorial' | 'video' | 'example' | 'other';
}

/**
 * 代码生成请求类型定义
 */
export interface CodeGenerationRequest {
  mcuModel: string;
  features: string[];
  prompt: string;
}

/**
 * 代码生成响应类型定义
 */
export interface CodeGenerationResponse {
  code: string;
  language: string;
  explanation: string;
}

/**
 * 实验难度过滤器
 */
export type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

/**
 * 用户类型定义
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  progress: {
    completedExperiments: string[];
    completedCourses: string[];
  };
}

/**
 * 课程模块类型定义
 */
export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  order: number;
}

/**
 * 课程章节类型定义
 */
export interface CourseLesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  videoUrl?: string;
  resources: ResourceLink[];
  quizzes?: any[];
  order: number;
}

/**
 * 论坛帖子类型定义
 */
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  replies: ForumReply[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 论坛回复类型定义
 */
export interface ForumReply {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
} 