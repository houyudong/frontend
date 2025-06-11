/**
 * �γ����Ͷ���
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
 * ʵ�����Ͷ���
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
 * ʵ�鲽�����Ͷ���
 */
export interface ExperimentStep {
  title: string;
  content: string;
  imageUrl?: string;
  code?: string;
}

/**
 * ��Դ�������Ͷ���
 */
export interface ResourceLink {
  title: string;
  url: string;
  type: 'documentation' | 'tutorial' | 'video' | 'example' | 'other';
}

/**
 * ���������������Ͷ���
 */
export interface CodeGenerationRequest {
  mcuModel: string;
  features: string[];
  prompt: string;
}

/**
 * ����������Ӧ���Ͷ���
 */
export interface CodeGenerationResponse {
  code: string;
  language: string;
  explanation: string;
}

/**
 * ʵ�����������
 */
export type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

/**
 * �û����Ͷ���
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
 * �γ�ģ�����Ͷ���
 */
export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  order: number;
}

/**
 * �γ��½����Ͷ���
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
 * ��̳�������Ͷ���
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
 * ��̳�ظ����Ͷ���
 */
export interface ForumReply {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
} 