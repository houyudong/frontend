/**
 * 实验分析服务
 * 
 * 提供实验数据分析的API调用和数据处理功能
 */

import {
  ExperimentAnalytics,
  ExperimentAnalyticsRequest,
  ExperimentAnalyticsResponse,
  BatchExperimentAnalytics,
  StudentExperimentPerformance,
  ExperimentComparison,
  ExperimentFilters,
  ExperimentImprovementSuggestions
} from '../types/experimentAnalytics';

// 模拟实验分析数据
const mockExperimentAnalytics: ExperimentAnalytics = {
  experimentInfo: {
    id: 'exp_001',
    name: 'LED闪烁控制实验',
    description: '学习GPIO控制，实现LED灯的闪烁效果',
    difficulty: 'beginner',
    estimatedTime: 60,
    maxScore: 100,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  
  totalAttempts: 156,
  totalStudents: 45,
  completedStudents: 38,
  completionRate: 84.4,
  averageScore: 82.5,
  averageTime: 75,
  
  difficultyMetrics: {
    averageAttempts: 2.3,
    timeoutRate: 8.9,
    errorRate: 15.6,
    helpRequestCount: 23
  },
  
  timeDistribution: [
    { range: '0-30分钟', count: 8, percentage: 21.1 },
    { range: '30-60分钟', count: 15, percentage: 39.5 },
    { range: '60-120分钟', count: 12, percentage: 31.6 },
    { range: '120分钟以上', count: 3, percentage: 7.9 }
  ],
  
  scoreDistribution: [
    { range: '90-100分', count: 12, percentage: 31.6 },
    { range: '80-89分', count: 15, percentage: 39.5 },
    { range: '70-79分', count: 8, percentage: 21.1 },
    { range: '60-69分', count: 2, percentage: 5.3 },
    { range: '0-59分', count: 1, percentage: 2.6 }
  ],
  
  errorAnalysis: [
    {
      type: '编译错误',
      count: 45,
      percentage: 45.0,
      commonMessages: [
        '缺少分号',
        '变量未声明',
        '函数名拼写错误'
      ]
    },
    {
      type: '逻辑错误',
      count: 32,
      percentage: 32.0,
      commonMessages: [
        'GPIO引脚配置错误',
        '延时时间设置不当',
        '循环逻辑错误'
      ]
    },
    {
      type: '运行时错误',
      count: 23,
      percentage: 23.0,
      commonMessages: [
        '硬件连接问题',
        '电源供应不足',
        '引脚冲突'
      ]
    }
  ],
  
  learningPath: [
    {
      step: 1,
      description: '理解GPIO基础概念',
      completionRate: 95.6,
      averageTime: 15,
      commonIssues: ['概念理解不清', '文档阅读不仔细']
    },
    {
      step: 2,
      description: '配置GPIO引脚',
      completionRate: 88.9,
      averageTime: 20,
      commonIssues: ['引脚选择错误', '模式配置不当']
    },
    {
      step: 3,
      description: '编写控制代码',
      completionRate: 82.2,
      averageTime: 25,
      commonIssues: ['语法错误', '逻辑不清晰']
    },
    {
      step: 4,
      description: '调试和优化',
      completionRate: 75.6,
      averageTime: 15,
      commonIssues: ['调试技巧不足', '问题定位困难']
    }
  ],
  
  codeQuality: {
    averageLines: 45,
    complexityScore: 3.2,
    bestPracticesScore: 78.5,
    commonPatterns: [
      '使用HAL库函数',
      '合理的延时控制',
      '清晰的变量命名',
      '适当的注释'
    ]
  },
  
  timeTrends: [
    { date: '2024-01-08', attempts: 12, completions: 10, averageScore: 85.2, averageTime: 68 },
    { date: '2024-01-09', attempts: 15, completions: 13, averageScore: 82.1, averageTime: 72 },
    { date: '2024-01-10', attempts: 18, completions: 15, averageScore: 79.8, averageTime: 78 },
    { date: '2024-01-11', attempts: 21, completions: 18, averageScore: 83.5, averageTime: 75 },
    { date: '2024-01-12', attempts: 16, completions: 14, averageScore: 86.2, averageTime: 70 },
    { date: '2024-01-13', attempts: 14, completions: 12, averageScore: 84.8, averageTime: 73 },
    { date: '2024-01-14', attempts: 19, completions: 16, averageScore: 81.9, averageTime: 76 }
  ]
};

// 模拟批量实验分析数据
const mockBatchAnalytics: BatchExperimentAnalytics = {
  experiments: [mockExperimentAnalytics],
  summary: {
    totalExperiments: 8,
    totalStudents: 45,
    overallCompletionRate: 78.5,
    overallAverageScore: 81.2,
    mostDifficultExperiment: 'UART通信实验',
    easiestExperiment: 'LED闪烁控制实验',
    mostPopularExperiment: 'PWM调光实验'
  },
  trends: [
    { date: '2024-01-08', totalAttempts: 45, totalCompletions: 38, averageScore: 82.1 },
    { date: '2024-01-09', totalAttempts: 52, totalCompletions: 44, averageScore: 80.5 },
    { date: '2024-01-10', totalAttempts: 48, totalCompletions: 41, averageScore: 83.2 },
    { date: '2024-01-11', totalAttempts: 56, totalCompletions: 47, averageScore: 81.8 },
    { date: '2024-01-12', totalAttempts: 43, totalCompletions: 39, averageScore: 84.1 },
    { date: '2024-01-13', totalAttempts: 39, totalCompletions: 35, averageScore: 82.7 },
    { date: '2024-01-14', totalAttempts: 51, totalCompletions: 43, averageScore: 80.9 }
  ]
};

/**
 * 获取单个实验的分析数据
 */
export const getExperimentAnalytics = async (
  request: ExperimentAnalyticsRequest
): Promise<ExperimentAnalyticsResponse> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // 这里应该调用实际的API
    // const response = await apiClient.post('/api/teacher/analytics/experiment', request);
    
    return {
      success: true,
      data: mockExperimentAnalytics,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('获取实验分析数据失败:', error);
    return {
      success: false,
      data: mockExperimentAnalytics,
      message: '获取数据失败，请重试',
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * 获取批量实验分析数据
 */
export const getBatchExperimentAnalytics = async (
  filters?: ExperimentFilters
): Promise<BatchExperimentAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // const response = await apiClient.post('/api/teacher/analytics/experiments/batch', { filters });
    return mockBatchAnalytics;
  } catch (error) {
    console.error('获取批量实验分析数据失败:', error);
    throw new Error('获取数据失败，请重试');
  }
};

/**
 * 获取学生实验表现数据
 */
export const getStudentExperimentPerformance = async (
  studentId: string
): Promise<StudentExperimentPerformance> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const mockPerformance: StudentExperimentPerformance = {
    studentId,
    studentName: '张三',
    experiments: [
      {
        experimentId: 'exp_001',
        experimentName: 'LED闪烁控制实验',
        status: 'completed',
        score: 95,
        timeSpent: 65,
        attempts: 2,
        completedAt: '2024-01-10T14:30:00Z',
        rank: 3
      },
      {
        experimentId: 'exp_002',
        experimentName: 'PWM调光实验',
        status: 'completed',
        score: 88,
        timeSpent: 85,
        attempts: 3,
        completedAt: '2024-01-12T16:45:00Z',
        rank: 8
      },
      {
        experimentId: 'exp_003',
        experimentName: 'UART通信实验',
        status: 'in_progress',
        score: 0,
        timeSpent: 45,
        attempts: 2,
        rank: 0
      }
    ],
    overallPerformance: {
      totalExperiments: 8,
      completedExperiments: 6,
      averageScore: 86.5,
      totalTimeSpent: 420,
      averageAttempts: 2.3,
      strongAreas: ['GPIO控制', 'PWM应用', '基础编程'],
      improvementAreas: ['通信协议', '中断处理', '调试技巧']
    }
  };
  
  return mockPerformance;
};

/**
 * 获取实验对比分析
 */
export const getExperimentComparison = async (
  experimentIds: string[]
): Promise<ExperimentComparison> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const mockComparison: ExperimentComparison = {
    experiments: [
      {
        id: 'exp_001',
        name: 'LED闪烁控制实验',
        description: '学习GPIO控制',
        difficulty: 'beginner',
        estimatedTime: 60,
        maxScore: 100,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: 'exp_002',
        name: 'PWM调光实验',
        description: '学习PWM控制',
        difficulty: 'intermediate',
        estimatedTime: 90,
        maxScore: 100,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      }
    ],
    metrics: [
      {
        experimentId: 'exp_001',
        completionRate: 84.4,
        averageScore: 82.5,
        averageTime: 75,
        difficultyRating: 3.2,
        studentSatisfaction: 4.3
      },
      {
        experimentId: 'exp_002',
        completionRate: 76.8,
        averageScore: 78.9,
        averageTime: 105,
        difficultyRating: 4.1,
        studentSatisfaction: 4.1
      }
    ]
  };
  
  return mockComparison;
};

/**
 * 获取实验改进建议
 */
export const getExperimentImprovementSuggestions = async (
  experimentId: string
): Promise<ExperimentImprovementSuggestions> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockSuggestions: ExperimentImprovementSuggestions = {
    experimentId,
    suggestions: [
      {
        category: 'instructions',
        priority: 'high',
        description: '增加更详细的GPIO配置说明',
        expectedImpact: '减少配置错误，提高完成率15%',
        implementationEffort: 'easy'
      },
      {
        category: 'difficulty',
        priority: 'medium',
        description: '添加中间检查点',
        expectedImpact: '帮助学生分步完成，降低挫败感',
        implementationEffort: 'medium'
      },
      {
        category: 'content',
        priority: 'medium',
        description: '提供更多代码示例',
        expectedImpact: '提高代码质量，减少语法错误',
        implementationEffort: 'easy'
      }
    ],
    insights: [
      {
        type: 'positive',
        title: '完成率表现良好',
        description: '84.4%的完成率超过平均水平',
        data: { completionRate: 84.4, average: 78.5 }
      },
      {
        type: 'negative',
        title: '编译错误较多',
        description: '45%的错误为编译错误，需要加强语法指导',
        data: { compileErrorRate: 45.0 }
      },
      {
        type: 'neutral',
        title: '时间分布合理',
        description: '大部分学生能在预期时间内完成',
        data: { averageTime: 75, estimatedTime: 60 }
      }
    ]
  };
  
  return mockSuggestions;
};

/**
 * 导出实验分析报告
 */
export const exportExperimentReport = async (
  experimentId: string,
  format: 'pdf' | 'excel' | 'csv'
): Promise<Blob> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 模拟文件生成
  const content = `实验分析报告 - ${experimentId}\n导出格式: ${format}\n导出时间: ${new Date().toLocaleString()}`;
  return new Blob([content], { type: 'text/plain' });
};
