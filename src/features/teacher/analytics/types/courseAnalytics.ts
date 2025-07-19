/**
 * 课程分析数据类型定义
 * 
 * 定义课程详细分析所需的各种数据结构
 */

// 基础课程信息
export interface CourseInfo {
  id: string;
  name: string;
  description?: string;
  totalChapters: number;
  totalLessons: number;
  totalExperiments: number;
  estimatedDuration: number; // 预计学习时长（分钟）
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  createdAt: string;
  updatedAt: string;
}

// 章节信息
export interface ChapterInfo {
  id: string;
  name: string;
  order: number;
  lessons: LessonInfo[];
  estimatedDuration: number;
}

// 课时信息
export interface LessonInfo {
  id: string;
  name: string;
  type: 'video' | 'text' | 'experiment' | 'quiz';
  order: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 学生学习进度
export interface StudentProgress {
  studentId: string;
  studentName: string;
  enrollmentDate: string;
  lastAccessDate?: string;
  totalStudyTime: number; // 总学习时长（分钟）
  completedChapters: number;
  completedLessons: number;
  completedExperiments: number;
  overallProgress: number; // 整体进度百分比
  averageScore: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'dropped';
  chapterProgress: ChapterProgress[];
}

// 章节学习进度
export interface ChapterProgress {
  chapterId: string;
  chapterName: string;
  startDate?: string;
  completionDate?: string;
  studyTime: number;
  progress: number; // 章节完成百分比
  averageScore: number;
  lessonProgress: LessonProgress[];
}

// 课时学习进度
export interface LessonProgress {
  lessonId: string;
  lessonName: string;
  startDate?: string;
  completionDate?: string;
  studyTime: number;
  attempts: number;
  bestScore: number;
  lastScore: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

// 学习时长统计
export interface StudyTimeAnalytics {
  totalStudyTime: number;
  averageStudyTime: number;
  dailyStudyTime: DailyStudyTime[];
  weeklyStudyTime: WeeklyStudyTime[];
  monthlyStudyTime: MonthlyStudyTime[];
  chapterStudyTime: ChapterStudyTime[];
  studentStudyTime: StudentStudyTime[];
}

// 每日学习时长
export interface DailyStudyTime {
  date: string;
  totalTime: number;
  activeStudents: number;
  completedLessons: number;
}

// 每周学习时长
export interface WeeklyStudyTime {
  week: string; // YYYY-WW格式
  totalTime: number;
  activeStudents: number;
  averageTime: number;
}

// 每月学习时长
export interface MonthlyStudyTime {
  month: string; // YYYY-MM格式
  totalTime: number;
  activeStudents: number;
  averageTime: number;
}

// 章节学习时长
export interface ChapterStudyTime {
  chapterId: string;
  chapterName: string;
  totalTime: number;
  averageTime: number;
  completionRate: number;
}

// 学生学习时长
export interface StudentStudyTime {
  studentId: string;
  studentName: string;
  totalTime: number;
  averageSessionTime: number;
  sessionsCount: number;
  lastActiveDate: string;
}

// 成绩分析
export interface ScoreAnalytics {
  overallStats: ScoreStats;
  chapterStats: ChapterScoreStats[];
  studentStats: StudentScoreStats[];
  scoreDistribution: ScoreDistribution[];
  trendAnalysis: ScoreTrend[];
}

// 成绩统计
export interface ScoreStats {
  averageScore: number;
  medianScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number; // 及格率
  excellentRate: number; // 优秀率（90分以上）
  standardDeviation: number; // 标准差
}

// 章节成绩统计
export interface ChapterScoreStats {
  chapterId: string;
  chapterName: string;
  averageScore: number;
  passRate: number;
  difficulty: number; // 难度系数
  completionTime: number; // 平均完成时间
}

// 学生成绩统计
export interface StudentScoreStats {
  studentId: string;
  studentName: string;
  averageScore: number;
  bestScore: number;
  improvementRate: number; // 进步率
  consistencyScore: number; // 稳定性评分
}

// 成绩分布
export interface ScoreDistribution {
  range: string; // 如 "90-100", "80-89"
  count: number;
  percentage: number;
}

// 成绩趋势
export interface ScoreTrend {
  period: string; // 时间周期
  averageScore: number;
  passRate: number;
  studentCount: number;
}

// 学习行为分析
export interface LearningBehaviorAnalytics {
  accessPatterns: AccessPattern[];
  sessionAnalytics: SessionAnalytics;
  engagementMetrics: EngagementMetrics;
  dropoutAnalysis: DropoutAnalysis;
}

// 访问模式
export interface AccessPattern {
  hour: number; // 0-23小时
  dayOfWeek: number; // 0-6，0为周日
  accessCount: number;
  averageSessionTime: number;
}

// 会话分析
export interface SessionAnalytics {
  averageSessionDuration: number;
  totalSessions: number;
  bounceRate: number; // 跳出率
  returnRate: number; // 回访率
  sessionDistribution: SessionDistribution[];
}

// 会话时长分布
export interface SessionDistribution {
  durationRange: string; // 如 "0-5min", "5-15min"
  count: number;
  percentage: number;
}

// 参与度指标
export interface EngagementMetrics {
  averageEngagementScore: number; // 综合参与度评分
  videoWatchRate: number; // 视频观看完成率
  exerciseCompletionRate: number; // 练习完成率
  forumParticipationRate: number; // 论坛参与率
  questionAskingRate: number; // 提问率
}

// 流失分析
export interface DropoutAnalysis {
  overallDropoutRate: number;
  chapterDropoutRates: ChapterDropoutRate[];
  dropoutReasons: DropoutReason[];
  riskStudents: RiskStudent[];
}

// 章节流失率
export interface ChapterDropoutRate {
  chapterId: string;
  chapterName: string;
  dropoutRate: number;
  criticalPoint: boolean; // 是否为关键流失点
}

// 流失原因
export interface DropoutReason {
  reason: string;
  count: number;
  percentage: number;
}

// 风险学生
export interface RiskStudent {
  studentId: string;
  studentName: string;
  riskScore: number; // 风险评分 0-100
  riskFactors: string[];
  lastActiveDate: string;
}

// 实验分析
export interface ExperimentAnalytics {
  overallStats: ExperimentStats;
  experimentDetails: ExperimentDetail[];
  errorAnalysis: ErrorAnalysis[];
  performanceMetrics: ExperimentPerformance[];
}

// 实验统计
export interface ExperimentStats {
  totalExperiments: number;
  completedExperiments: number;
  averageCompletionTime: number;
  successRate: number;
  retryRate: number;
}

// 实验详情
export interface ExperimentDetail {
  experimentId: string;
  experimentName: string;
  attemptCount: number;
  successCount: number;
  averageTime: number;
  difficulty: number;
  commonErrors: string[];
}

// 错误分析
export interface ErrorAnalysis {
  errorType: string;
  errorMessage: string;
  frequency: number;
  affectedStudents: number;
  averageResolutionTime: number;
}

// 实验性能指标
export interface ExperimentPerformance {
  experimentId: string;
  experimentName: string;
  averageScore: number;
  completionRate: number;
  timeEfficiency: number; // 时间效率
  codeQuality: number; // 代码质量评分
}

// 综合课程分析数据
export interface CourseAnalyticsData {
  courseInfo: CourseInfo;
  studyTimeAnalytics: StudyTimeAnalytics;
  scoreAnalytics: ScoreAnalytics;
  learningBehaviorAnalytics: LearningBehaviorAnalytics;
  experimentAnalytics: ExperimentAnalytics;
  studentProgress: StudentProgress[];
  lastUpdated: string;
}

// API响应类型
export interface CourseAnalyticsResponse {
  success: boolean;
  data: CourseAnalyticsData;
  message?: string;
}

// 查询参数
export interface CourseAnalyticsQuery {
  courseId: string;
  startDate?: string;
  endDate?: string;
  studentIds?: string[];
  chapterIds?: string[];
  includeDropped?: boolean;
}
