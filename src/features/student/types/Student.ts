/**
 * 学生相关类型定义
 */

// 成就徽章类型
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'progress' | 'social' | 'special';
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  requirements: string[];
  unlockedAt?: string;
  isUnlocked: boolean;
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  createdAt: string;
}

// 收藏项目类型
export interface FavoriteItem {
  id: string;
  type: 'course' | 'experiment' | 'material' | 'video' | 'document';
  itemId: string;
  title: string;
  description: string;
  thumbnail?: string;
  author: string;
  category: string;
  tags: string[];
  addedAt: string;
  lastAccessedAt?: string;
  accessCount: number;
  rating?: number;
  duration?: number; // 对于视频/课程，单位：分钟
  size?: number; // 对于文件，单位：字节
  url?: string;
  metadata?: {
    courseCode?: string;
    experimentCode?: string;
    fileType?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    language?: string;
  };
}

// 学习历史记录
export interface LearningHistory {
  id: string;
  type: 'course' | 'experiment' | 'video' | 'document' | 'quiz' | 'assignment';
  itemId: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  action: 'started' | 'completed' | 'paused' | 'resumed' | 'submitted' | 'reviewed';
  timestamp: string;
  duration: number; // 学习时长，单位：分钟
  progress: number; // 进度百分比
  score?: number; // 得分（如果适用）
  maxScore?: number; // 满分（如果适用）
  metadata?: {
    chapterTitle?: string;
    experimentStep?: string;
    submissionId?: string;
    attempts?: number;
    timeSpent?: number;
    difficulty?: string;
  };
}

// 学习进度
export interface LearningProgress {
  id: string;
  type: 'course' | 'experiment' | 'specialization';
  itemId: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  instructor: string;
  startedAt: string;
  lastAccessedAt: string;
  estimatedCompletion?: string;
  
  // 进度信息
  overallProgress: number; // 总体进度百分比
  completedItems: number;
  totalItems: number;
  timeSpent: number; // 已花费时间，单位：分钟
  estimatedTimeRemaining: number; // 预计剩余时间，单位：分钟
  
  // 详细进度
  chapters?: ChapterProgress[];
  experiments?: ExperimentProgress[];
  assignments?: AssignmentProgress[];
  
  // 成绩信息
  currentGrade?: number;
  averageScore?: number;
  completedAssignments: number;
  totalAssignments: number;
  
  // 状态
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'failed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

// 章节进度
export interface ChapterProgress {
  id: string;
  title: string;
  description: string;
  order: number;
  progress: number; // 进度百分比
  status: 'not_started' | 'in_progress' | 'completed';
  timeSpent: number; // 花费时间，单位：分钟
  lastAccessedAt?: string;
  videos?: {
    id: string;
    title: string;
    duration: number;
    watched: boolean;
    watchTime: number;
  }[];
  materials?: {
    id: string;
    title: string;
    type: string;
    downloaded: boolean;
    viewedAt?: string;
  }[];
}

// 实验进度
export interface ExperimentProgress {
  id: string;
  title: string;
  description: string;
  code: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'submitted' | 'graded';
  timeSpent: number;
  startedAt?: string;
  submittedAt?: string;
  gradedAt?: string;
  score?: number;
  maxScore?: number;
  feedback?: string;
  steps?: {
    id: string;
    title: string;
    completed: boolean;
    timeSpent: number;
  }[];
}

// 作业进度
export interface AssignmentProgress {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'essay' | 'project' | 'presentation';
  progress: number;
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'returned';
  dueDate: string;
  submittedAt?: string;
  gradedAt?: string;
  score?: number;
  maxScore?: number;
  attempts: number;
  maxAttempts: number;
  timeSpent: number;
  feedback?: string;
}

// 学习统计
export interface LearningStats {
  totalTimeSpent: number; // 总学习时间，单位：分钟
  coursesEnrolled: number; // 已注册课程数
  coursesCompleted: number; // 已完成课程数
  experimentsCompleted: number; // 已完成实验数
  averageScore: number; // 平均分数
  achievementsUnlocked: number; // 已解锁成就数
  favoriteItems: number; // 收藏项目数
  streakDays: number; // 连续学习天数
  totalPoints: number; // 总积分
  currentLevel: number; // 当前等级
  nextLevelPoints: number; // 下一等级所需积分
}

// 筛选条件
export interface FilterOptions {
  search: string;
  category: string;
  type: string;
  status: string;
  dateRange: {
    start?: string;
    end?: string;
  };
  sortBy: 'date' | 'name' | 'progress' | 'score';
  sortOrder: 'asc' | 'desc';
}

// 成就类别信息
export interface AchievementCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalAchievements: number;
  unlockedAchievements: number;
}

// 学习目标
export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: number;
  current: number;
  unit: 'minutes' | 'courses' | 'experiments' | 'points';
  deadline: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  createdAt: string;
  completedAt?: string;
}

// 学习建议
export interface LearningRecommendation {
  id: string;
  type: 'course' | 'experiment' | 'skill' | 'review';
  title: string;
  description: string;
  thumbnail?: string;
  reason: string;
  confidence: number; // 推荐置信度 0-100
  estimatedTime: number; // 预计学习时间，单位：分钟
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  itemId?: string; // 关联的课程/实验ID
  createdAt: string;
}
