/**
 * 学习进度相关类型定义
 */

export interface LearningProgress {
  id: string;
  type: 'course' | 'experiment';
  itemId: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  instructor?: string;
  startedAt: string;
  lastAccessedAt: string;
  estimatedCompletion?: string;
  overallProgress: number; // 0-100
  completedItems: number;
  totalItems: number;
  timeSpent: number; // 分钟
  estimatedTimeRemaining: number; // 分钟
  chapters?: ChapterProgress[];
}

export interface ChapterProgress {
  id: string;
  title: string;
  description: string;
  order: number;
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed';
  timeSpent: number; // 分钟
  lastAccessedAt?: string;
  videos?: VideoProgress[];
  assignments?: AssignmentProgress[];
}

export interface VideoProgress {
  id: string;
  title: string;
  duration: number; // 秒
  watchedDuration: number; // 秒
  completed: boolean;
  lastWatchedAt?: string;
}

export interface AssignmentProgress {
  id: string;
  title: string;
  type: 'quiz' | 'coding' | 'essay';
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  score?: number;
  maxScore?: number;
  submittedAt?: string;
  gradedAt?: string;
}

export interface ExperimentProgress {
  id: string;
  type: 'experiment';
  itemId: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // 分钟
  startedAt: string;
  lastAccessedAt: string;
  overallProgress: number; // 0-100
  currentStep: number;
  totalSteps: number;
  timeSpent: number; // 分钟
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  score?: number;
  maxScore?: number;
  steps?: ExperimentStep[];
}

export interface ExperimentStep {
  id: string;
  title: string;
  description: string;
  order: number;
  status: 'not_started' | 'in_progress' | 'completed';
  timeSpent: number; // 分钟
  instructions?: string;
  codeTemplate?: string;
  expectedOutput?: string;
  userCode?: string;
  testResults?: TestResult[];
}

export interface TestResult {
  id: string;
  testName: string;
  passed: boolean;
  expectedOutput: string;
  actualOutput: string;
  errorMessage?: string;
}

export interface ProgressStats {
  totalCourses: number;
  completedCourses: number;
  totalExperiments: number;
  completedExperiments: number;
  totalTimeSpent: number; // 分钟
  averageProgress: number; // 0-100
  streakDays: number;
  lastActiveDate: string;
}

export interface ProgressFilter {
  search?: string;
  category?: string;
  status?: 'all' | 'not_started' | 'in_progress' | 'completed';
  difficulty?: 'all' | 'beginner' | 'intermediate' | 'advanced';
  sortBy?: 'name' | 'progress' | 'lastAccessed' | 'startDate';
  sortOrder?: 'asc' | 'desc';
}

export interface ProgressSummary {
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  notStartedItems: number;
  totalTimeSpent: number;
  averageScore?: number;
  completionRate: number; // 0-100
}
