/**
 * 实验分析数据类型定义
 * 
 * 定义实验分析相关的数据结构和接口
 */

// 实验基本信息
export interface ExperimentInfo {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // 预估完成时间（分钟）
  maxScore: number;
  createdAt: string;
  updatedAt: string;
}

// 实验完成记录
export interface ExperimentRecord {
  id: string;
  studentId: string;
  studentName: string;
  experimentId: string;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'failed' | 'timeout';
  score: number;
  timeSpent: number; // 实际花费时间（分钟）
  attempts: number; // 尝试次数
  errors: ExperimentError[];
  codeSubmissions: CodeSubmission[];
}

// 实验错误记录
export interface ExperimentError {
  id: string;
  type: 'compile_error' | 'runtime_error' | 'logic_error' | 'timeout_error';
  message: string;
  line?: number;
  column?: number;
  timestamp: string;
  resolved: boolean;
}

// 代码提交记录
export interface CodeSubmission {
  id: string;
  code: string;
  timestamp: string;
  compileSuccess: boolean;
  testResults: TestResult[];
}

// 测试结果
export interface TestResult {
  testCase: string;
  expected: string;
  actual: string;
  passed: boolean;
  executionTime: number;
}

// 实验统计分析
export interface ExperimentAnalytics {
  experimentInfo: ExperimentInfo;
  
  // 基础统计
  totalAttempts: number;
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
  averageScore: number;
  averageTime: number;
  
  // 难度分析
  difficultyMetrics: {
    averageAttempts: number;
    timeoutRate: number;
    errorRate: number;
    helpRequestCount: number;
  };
  
  // 时间分析
  timeDistribution: {
    range: string; // "0-30", "30-60", "60-120", "120+"
    count: number;
    percentage: number;
  }[];
  
  // 成绩分析
  scoreDistribution: {
    range: string; // "90-100", "80-89", "70-79", "60-69", "0-59"
    count: number;
    percentage: number;
  }[];
  
  // 错误分析
  errorAnalysis: {
    type: string;
    count: number;
    percentage: number;
    commonMessages: string[];
  }[];
  
  // 学习路径分析
  learningPath: {
    step: number;
    description: string;
    completionRate: number;
    averageTime: number;
    commonIssues: string[];
  }[];
  
  // 代码质量分析
  codeQuality: {
    averageLines: number;
    complexityScore: number;
    bestPracticesScore: number;
    commonPatterns: string[];
  };
  
  // 时间趋势
  timeTrends: {
    date: string;
    attempts: number;
    completions: number;
    averageScore: number;
    averageTime: number;
  }[];
}

// 实验对比分析
export interface ExperimentComparison {
  experiments: ExperimentInfo[];
  metrics: {
    experimentId: string;
    completionRate: number;
    averageScore: number;
    averageTime: number;
    difficultyRating: number;
    studentSatisfaction: number;
  }[];
}

// 学生实验表现
export interface StudentExperimentPerformance {
  studentId: string;
  studentName: string;
  experiments: {
    experimentId: string;
    experimentName: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
    score: number;
    timeSpent: number;
    attempts: number;
    completedAt?: string;
    rank: number; // 在班级中的排名
  }[];
  
  // 学生总体表现
  overallPerformance: {
    totalExperiments: number;
    completedExperiments: number;
    averageScore: number;
    totalTimeSpent: number;
    averageAttempts: number;
    strongAreas: string[];
    improvementAreas: string[];
  };
}

// 实验筛选条件
export interface ExperimentFilters {
  experimentIds?: string[];
  studentIds?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
  status?: ('in_progress' | 'completed' | 'failed' | 'timeout')[];
  scoreRange?: {
    min: number;
    max: number;
  };
  timeRange?: {
    min: number; // 分钟
    max: number; // 分钟
  };
}

// 实验分析请求参数
export interface ExperimentAnalyticsRequest {
  experimentId?: string;
  filters?: ExperimentFilters;
  groupBy?: 'day' | 'week' | 'month';
  includeDetails?: boolean;
}

// 实验分析响应
export interface ExperimentAnalyticsResponse {
  success: boolean;
  data: ExperimentAnalytics;
  message?: string;
  timestamp: string;
}

// 批量实验分析
export interface BatchExperimentAnalytics {
  experiments: ExperimentAnalytics[];
  summary: {
    totalExperiments: number;
    totalStudents: number;
    overallCompletionRate: number;
    overallAverageScore: number;
    mostDifficultExperiment: string;
    easiestExperiment: string;
    mostPopularExperiment: string;
  };
  trends: {
    date: string;
    totalAttempts: number;
    totalCompletions: number;
    averageScore: number;
  }[];
}

// 实验改进建议
export interface ExperimentImprovementSuggestions {
  experimentId: string;
  suggestions: {
    category: 'difficulty' | 'content' | 'instructions' | 'time_limit' | 'test_cases';
    priority: 'high' | 'medium' | 'low';
    description: string;
    expectedImpact: string;
    implementationEffort: 'easy' | 'medium' | 'hard';
  }[];
  
  // 基于数据的洞察
  insights: {
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    data: any;
  }[];
}
