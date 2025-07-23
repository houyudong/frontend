/**
 * 导出功能类型定义
 */

export interface ExportRequest {
  id: string;
  type: ExportType;
  format: ExportFormat;
  title: string;
  description?: string;
  userId: string;
  userRole: 'student' | 'teacher' | 'admin';
  filters: ExportFilters;
  options: ExportOptions;
  status: ExportStatus;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  fileSize?: number;
  errorMessage?: string;
}

export type ExportType = 
  // 学生导出类型
  | 'student_learning_report'      // 学习报告
  | 'student_progress_report'      // 进度报告
  | 'student_achievement_report'   // 成就报告
  | 'student_grade_report'         // 成绩报告
  | 'student_activity_log'         // 活动日志
  | 'student_certificate'          // 学习证书
  
  // 教师导出类型
  | 'teacher_class_report'         // 班级报告
  | 'teacher_student_analysis'     // 学生分析
  | 'teacher_course_statistics'    // 课程统计
  | 'teacher_grade_summary'        // 成绩汇总
  | 'teacher_attendance_report'    // 出勤报告
  | 'teacher_assignment_analysis'  // 作业分析
  
  // 管理员导出类型
  | 'admin_system_report'          // 系统报告
  | 'admin_user_statistics'        // 用户统计
  | 'admin_course_analytics'       // 课程分析
  | 'admin_performance_metrics'    // 性能指标
  | 'admin_audit_log'              // 审计日志
  | 'admin_financial_report';      // 财务报告

export type ExportFormat = 
  | 'pdf'      // PDF文档
  | 'excel'    // Excel表格
  | 'csv'      // CSV文件
  | 'json'     // JSON数据
  | 'word'     // Word文档
  | 'html'     // HTML网页
  | 'zip';     // 压缩包

export type ExportStatus = 
  | 'pending'    // 等待中
  | 'processing' // 处理中
  | 'completed'  // 已完成
  | 'failed'     // 失败
  | 'expired';   // 已过期

export interface ExportFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  courseIds?: string[];
  classIds?: string[];
  studentIds?: string[];
  teacherIds?: string[];
  categories?: string[];
  types?: string[];
  status?: string[];
  minScore?: number;
  maxScore?: number;
  customFilters?: Record<string, any>;
}

export interface ExportOptions {
  includeCharts: boolean;
  includeImages: boolean;
  includeDetails: boolean;
  includeSummary: boolean;
  includeComments: boolean;
  includeMetadata: boolean;
  language: 'zh-CN' | 'en-US';
  template?: string;
  customOptions?: Record<string, any>;
}

// 学生导出数据结构
export interface StudentExportData {
  // 基本信息
  studentInfo: {
    id: string;
    name: string;
    email: string;
    studentId: string;
    class: string;
    enrollmentDate: string;
    avatar?: string;
  };
  
  // 学习进度
  learningProgress: {
    totalCourses: number;
    completedCourses: number;
    totalExperiments: number;
    completedExperiments: number;
    totalStudyTime: number; // 分钟
    averageScore: number;
    progressByMonth: MonthlyProgress[];
  };
  
  // 成就数据
  achievements: {
    total: number;
    unlocked: number;
    totalPoints: number;
    recentAchievements: Achievement[];
    categoryStats: CategoryStats[];
  };
  
  // 成绩数据
  grades: {
    courses: CourseGrade[];
    experiments: ExperimentGrade[];
    assignments: AssignmentGrade[];
    overall: {
      gpa: number;
      rank: number;
      totalStudents: number;
    };
  };
  
  // 活动日志
  activities: ActivityRecord[];
  
  // 学习分析
  analytics: {
    studyPatterns: StudyPattern[];
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
}

// 教师导出数据结构
export interface TeacherExportData {
  // 基本信息
  teacherInfo: {
    id: string;
    name: string;
    email: string;
    department: string;
    title: string;
    courses: string[];
    classes: string[];
  };
  
  // 班级统计
  classStatistics: {
    totalStudents: number;
    activeStudents: number;
    averageGrade: number;
    completionRate: number;
    attendanceRate: number;
    classPerformance: ClassPerformance[];
  };
  
  // 课程分析
  courseAnalytics: {
    enrollmentTrends: EnrollmentTrend[];
    completionRates: CompletionRate[];
    difficultyAnalysis: DifficultyAnalysis[];
    studentFeedback: FeedbackSummary[];
  };
  
  // 学生分析
  studentAnalysis: {
    topPerformers: StudentSummary[];
    strugglingStudents: StudentSummary[];
    improvementTrends: ImprovementTrend[];
    engagementMetrics: EngagementMetric[];
  };
  
  // 作业分析
  assignmentAnalysis: {
    submissionRates: SubmissionRate[];
    gradeDistribution: GradeDistribution[];
    commonMistakes: CommonMistake[];
    timeAnalysis: TimeAnalysis[];
  };
}

// 管理员导出数据结构
export interface AdminExportData {
  // 系统概览
  systemOverview: {
    totalUsers: number;
    totalCourses: number;
    totalClasses: number;
    systemUptime: number;
    storageUsage: number;
    activeUsers: number;
  };
  
  // 用户统计
  userStatistics: {
    studentStats: UserStats;
    teacherStats: UserStats;
    adminStats: UserStats;
    registrationTrends: RegistrationTrend[];
    activityTrends: ActivityTrend[];
  };
  
  // 课程分析
  courseAnalytics: {
    popularCourses: PopularCourse[];
    completionRates: CourseCompletionRate[];
    difficultyRatings: DifficultyRating[];
    resourceUsage: ResourceUsage[];
  };
  
  // 性能指标
  performanceMetrics: {
    responseTime: number;
    errorRate: number;
    throughput: number;
    availability: number;
    userSatisfaction: number;
  };
  
  // 财务数据
  financialData?: {
    revenue: number;
    costs: number;
    profit: number;
    subscriptions: SubscriptionData[];
    payments: PaymentData[];
  };
}

// 辅助类型定义
export interface MonthlyProgress {
  month: string;
  coursesCompleted: number;
  experimentsCompleted: number;
  studyTime: number;
  averageScore: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt: string;
}

export interface CategoryStats {
  category: string;
  total: number;
  unlocked: number;
  points: number;
}

export interface CourseGrade {
  courseId: string;
  courseName: string;
  grade: number;
  maxGrade: number;
  completedAt: string;
  rank: number;
}

export interface ExperimentGrade {
  experimentId: string;
  experimentName: string;
  score: number;
  maxScore: number;
  attempts: number;
  completedAt: string;
}

export interface AssignmentGrade {
  assignmentId: string;
  assignmentName: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  gradedAt: string;
}

export interface ActivityRecord {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface StudyPattern {
  pattern: string;
  frequency: number;
  effectiveness: number;
  recommendation: string;
}

export interface ExportTemplate {
  id: string;
  name: string;
  type: ExportType;
  format: ExportFormat;
  description: string;
  template: string;
  variables: TemplateVariable[];
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface ExportHistory {
  id: string;
  userId: string;
  type: ExportType;
  format: ExportFormat;
  status: ExportStatus;
  createdAt: string;
  completedAt?: string;
  downloadCount: number;
  lastDownloadAt?: string;
  fileSize?: number;
  expiresAt?: string;
}
