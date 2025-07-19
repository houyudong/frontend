/**
 * 学生进度分析数据类型定义
 * 
 * 定义学生学习进度相关的数据结构和接口
 */

// 学生基本信息
export interface StudentInfo {
  id: string;
  username: string;
  fullName: string;
  email: string;
  studentId: string;
  class: string;
  enrollmentDate: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
}

// 课程进度信息
export interface CourseProgress {
  courseId: string;
  courseName: string;
  totalChapters: number;
  completedChapters: number;
  progressPercentage: number;
  currentChapter: string;
  lastAccessTime: string;
  totalStudyTime: number; // 分钟
  averageScore: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
}

// 实验进度信息
export interface ExperimentProgress {
  experimentId: string;
  experimentName: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  score: number;
  maxScore: number;
  attempts: number;
  timeSpent: number; // 分钟
  completedAt?: string;
  lastAttemptAt: string;
}

// 学习活动记录
export interface LearningActivity {
  id: string;
  type: 'course_access' | 'chapter_complete' | 'experiment_start' | 'experiment_complete' | 'quiz_attempt' | 'forum_post';
  title: string;
  description: string;
  timestamp: string;
  duration?: number; // 分钟
  score?: number;
  metadata?: Record<string, any>;
}

// 学习统计数据
export interface LearningStats {
  totalStudyTime: number; // 总学习时间（分钟）
  totalCourses: number;
  completedCourses: number;
  totalExperiments: number;
  completedExperiments: number;
  averageScore: number;
  totalQuizzes: number;
  passedQuizzes: number;
  forumPosts: number;
  helpRequests: number;
  loginDays: number; // 登录天数
  streakDays: number; // 连续学习天数
}

// 学习行为模式
export interface LearningPattern {
  // 时间模式
  timePattern: {
    preferredHours: number[]; // 偏好学习时间（小时）
    weekdayActivity: number[]; // 工作日活跃度
    weekendActivity: number[]; // 周末活跃度
    sessionDuration: number; // 平均会话时长（分钟）
    sessionFrequency: number; // 每周会话次数
  };
  
  // 学习习惯
  learningHabits: {
    studyConsistency: number; // 学习一致性评分 (0-100)
    procrastinationTendency: number; // 拖延倾向 (0-100)
    helpSeekingBehavior: number; // 求助行为频率 (0-100)
    selfDirectedLearning: number; // 自主学习能力 (0-100)
    collaborationLevel: number; // 协作水平 (0-100)
  };
  
  // 内容偏好
  contentPreferences: {
    theoreticalVsPractical: number; // 理论vs实践偏好 (-100到100)
    difficultyPreference: 'easy' | 'medium' | 'hard';
    learningSpeed: 'slow' | 'medium' | 'fast';
    preferredFormats: string[]; // 偏好的学习格式
  };
}

// 学习成就
export interface LearningAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'performance' | 'consistency' | 'collaboration' | 'innovation';
  earnedAt: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
}

// 学习建议
export interface LearningRecommendation {
  type: 'course' | 'experiment' | 'study_habit' | 'skill_improvement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  expectedBenefit: string;
  estimatedTime: number; // 分钟
  difficulty: 'easy' | 'medium' | 'hard';
}

// 单个学生完整进度
export interface StudentProgressDetail {
  studentInfo: StudentInfo;
  learningStats: LearningStats;
  courseProgress: CourseProgress[];
  experimentProgress: ExperimentProgress[];
  recentActivities: LearningActivity[];
  learningPattern: LearningPattern;
  achievements: LearningAchievement[];
  recommendations: LearningRecommendation[];
  
  // 排名信息
  classRanking: {
    overall: number;
    totalStudents: number;
    percentile: number;
  };
  
  // 趋势数据
  progressTrends: {
    date: string;
    studyTime: number;
    score: number;
    activitiesCount: number;
  }[];
  
  // 强项和弱项
  strengths: string[];
  weaknesses: string[];
  
  // 学习目标
  goals: {
    id: string;
    title: string;
    description: string;
    targetDate: string;
    progress: number;
    status: 'active' | 'completed' | 'overdue';
  }[];
}

// 班级整体进度分析
export interface ClassProgressAnalytics {
  classInfo: {
    id: string;
    name: string;
    totalStudents: number;
    activeStudents: number;
    teacher: string;
  };
  
  // 整体统计
  overallStats: {
    averageProgress: number;
    averageScore: number;
    totalStudyTime: number;
    completionRate: number;
    engagementRate: number;
  };
  
  // 进度分布
  progressDistribution: {
    range: string; // "0-20%", "20-40%", etc.
    count: number;
    percentage: number;
    students: string[]; // 学生ID列表
  }[];
  
  // 成绩分布
  scoreDistribution: {
    range: string; // "90-100", "80-89", etc.
    count: number;
    percentage: number;
  }[];
  
  // 活跃度分析
  activityAnalysis: {
    dailyActiveUsers: {
      date: string;
      count: number;
    }[];
    weeklyEngagement: {
      week: string;
      studyTime: number;
      activitiesCount: number;
    }[];
  };
  
  // 课程完成情况
  courseCompletion: {
    courseId: string;
    courseName: string;
    totalStudents: number;
    completedStudents: number;
    averageProgress: number;
    averageScore: number;
  }[];
  
  // 实验完成情况
  experimentCompletion: {
    experimentId: string;
    experimentName: string;
    totalAttempts: number;
    successfulCompletions: number;
    averageScore: number;
    averageTime: number;
  }[];
  
  // 学生排名
  studentRankings: {
    studentId: string;
    studentName: string;
    overallScore: number;
    totalStudyTime: number;
    completionRate: number;
    rank: number;
  }[];
  
  // 需要关注的学生
  studentsNeedingAttention: {
    studentId: string;
    studentName: string;
    issues: string[];
    priority: 'high' | 'medium' | 'low';
    lastActivity: string;
  }[];
}

// 学习路径分析
export interface LearningPathAnalysis {
  pathId: string;
  pathName: string;
  totalSteps: number;
  
  // 每个步骤的完成情况
  stepCompletion: {
    stepId: string;
    stepName: string;
    completionRate: number;
    averageTime: number;
    dropoffRate: number;
    commonIssues: string[];
  }[];
  
  // 学习路径效果
  pathEffectiveness: {
    overallCompletionRate: number;
    averageCompletionTime: number;
    studentSatisfaction: number;
    knowledgeRetention: number;
  };
  
  // 优化建议
  optimizationSuggestions: {
    stepId: string;
    suggestion: string;
    expectedImprovement: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

// 进度筛选条件
export interface ProgressFilters {
  studentIds?: string[];
  classIds?: string[];
  courseIds?: string[];
  experimentIds?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  progressRange?: {
    min: number;
    max: number;
  };
  scoreRange?: {
    min: number;
    max: number;
  };
  status?: ('active' | 'inactive' | 'at_risk' | 'excellent')[];
  activityLevel?: ('low' | 'medium' | 'high')[];
}

// 进度分析请求参数
export interface ProgressAnalyticsRequest {
  type: 'individual' | 'class' | 'comparison';
  studentId?: string;
  classId?: string;
  studentIds?: string[];
  filters?: ProgressFilters;
  includeDetails?: boolean;
  includeTrends?: boolean;
  includeRecommendations?: boolean;
}

// 进度分析响应
export interface ProgressAnalyticsResponse {
  success: boolean;
  data: StudentProgressDetail | ClassProgressAnalytics | StudentProgressDetail[];
  message?: string;
  timestamp: string;
}

// 学生对比分析
export interface StudentComparison {
  students: StudentInfo[];
  comparisonMetrics: {
    studentId: string;
    overallProgress: number;
    averageScore: number;
    totalStudyTime: number;
    completionRate: number;
    activityLevel: number;
    rank: number;
  }[];

  // 详细对比
  detailedComparison: {
    courses: {
      courseId: string;
      courseName: string;
      studentProgress: {
        studentId: string;
        progress: number;
        score: number;
        timeSpent: number;
      }[];
    }[];
    experiments: {
      experimentId: string;
      experimentName: string;
      studentResults: {
        studentId: string;
        status: string;
        score: number;
        attempts: number;
        timeSpent: number;
      }[];
    }[];
  };
}
