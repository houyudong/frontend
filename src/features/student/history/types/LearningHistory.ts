/**
 * 学习历史相关类型定义
 */

export interface LearningHistoryItem {
  id: string;
  type: 'course' | 'experiment' | 'assignment' | 'quiz' | 'discussion';
  itemId: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  action: LearningAction;
  timestamp: string;
  duration: number; // 分钟
  progress?: number; // 0-100
  score?: number;
  maxScore?: number;
  metadata?: Record<string, any>;
}

export type LearningAction = 
  | 'started'
  | 'continued'
  | 'completed'
  | 'paused'
  | 'submitted'
  | 'graded'
  | 'chapter_completed'
  | 'video_watched'
  | 'experiment_started'
  | 'experiment_completed'
  | 'assignment_submitted'
  | 'quiz_completed'
  | 'discussion_participated';

export interface LearningStats {
  totalStudyTime: number; // 总学习时长（分钟）
  totalActivities: number; // 总活动数
  coursesCompleted: number; // 完成的课程数
  experimentsCompleted: number; // 完成的实验数
  assignmentsSubmitted: number; // 提交的作业数
  averageScore: number; // 平均分数
  streakDays: number; // 连续学习天数
  mostActiveHour: number; // 最活跃的小时（0-23）
  weeklyProgress: DailyProgress[]; // 周进度数据
  monthlyProgress?: MonthlyProgress[]; // 月进度数据
  yearlyProgress?: YearlyProgress[]; // 年进度数据
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  minutes: number; // 学习时长（分钟）
  activities: number; // 活动数量
  coursesStudied?: number;
  experimentsCompleted?: number;
  assignmentsSubmitted?: number;
  averageScore?: number;
}

export interface MonthlyProgress {
  month: string; // YYYY-MM
  totalMinutes: number;
  totalActivities: number;
  coursesCompleted: number;
  experimentsCompleted: number;
  assignmentsSubmitted: number;
  averageScore: number;
}

export interface YearlyProgress {
  year: number;
  totalMinutes: number;
  totalActivities: number;
  coursesCompleted: number;
  experimentsCompleted: number;
  assignmentsSubmitted: number;
  averageScore: number;
}

export interface ActivitySummary {
  date: string;
  totalTime: number; // 分钟
  activities: number;
  coursesStudied: number;
  experimentsCompleted: number;
  assignmentsSubmitted: number;
  averageScore: number;
  topCategories?: string[];
  achievements?: string[];
}

export interface LearningPattern {
  userId: string;
  preferredStudyHours: number[]; // 偏好的学习时间段
  averageSessionDuration: number; // 平均学习时长（分钟）
  mostActiveWeekdays: number[]; // 最活跃的星期几（0-6）
  learningVelocity: number; // 学习速度（活动数/小时）
  consistencyScore: number; // 学习一致性评分（0-100）
  focusAreas: string[]; // 主要学习领域
  improvementAreas: string[]; // 需要改进的领域
}

export interface StudySession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // 分钟
  activities: LearningHistoryItem[];
  totalScore?: number;
  averageScore?: number;
  focusLevel?: number; // 专注度评分（0-100）
  breaks: SessionBreak[];
}

export interface SessionBreak {
  startTime: string;
  endTime: string;
  duration: number; // 分钟
  type: 'short' | 'long' | 'meal' | 'other';
}

export interface LearningGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: 'minutes' | 'activities' | 'courses' | 'experiments' | 'assignments';
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface LearningInsight {
  id: string;
  type: 'achievement' | 'improvement' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  data: Record<string, any>;
  importance: 'low' | 'medium' | 'high';
  actionable: boolean;
  createdAt: string;
}

export interface HistoryFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  types?: LearningHistoryItem['type'][];
  actions?: LearningAction[];
  categories?: string[];
  minScore?: number;
  maxScore?: number;
  minDuration?: number;
  maxDuration?: number;
  search?: string;
  sortBy?: 'timestamp' | 'duration' | 'score' | 'progress';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface HistoryExport {
  format: 'json' | 'csv' | 'pdf';
  dateRange: {
    start: string;
    end: string;
  };
  includeStats: boolean;
  includeCharts: boolean;
  includeDetails: boolean;
}

// 学习分析报告
export interface LearningReport {
  id: string;
  userId: string;
  period: {
    start: string;
    end: string;
  };
  summary: LearningStats;
  patterns: LearningPattern;
  goals: LearningGoal[];
  insights: LearningInsight[];
  recommendations: string[];
  generatedAt: string;
}
