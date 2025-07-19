/**
 * 学生进度分析服务
 * 
 * 提供学生学习进度数据分析的API调用和数据处理功能
 */

import {
  StudentProgressDetail,
  ClassProgressAnalytics,
  StudentComparison,
  LearningPathAnalysis,
  ProgressAnalyticsRequest,
  ProgressAnalyticsResponse,
  ProgressFilters,
  StudentInfo,
  LearningStats,
  CourseProgress,
  ExperimentProgress,
  LearningActivity,
  LearningPattern,
  LearningAchievement,
  LearningRecommendation
} from '../types/studentProgress';

// 模拟学生信息数据
const mockStudents: StudentInfo[] = [
  {
    id: 'student_001',
    username: 'zhangsan',
    fullName: '张三',
    email: 'zhangsan@student.edu.cn',
    studentId: '20240001',
    class: '计算机2024-1班',
    enrollmentDate: '2024-09-01',
    status: 'active'
  },
  {
    id: 'student_002',
    username: 'lisi',
    fullName: '李四',
    email: 'lisi@student.edu.cn',
    studentId: '20240002',
    class: '计算机2024-1班',
    enrollmentDate: '2024-09-01',
    status: 'active'
  },
  {
    id: 'student_003',
    username: 'wangwu',
    fullName: '王五',
    email: 'wangwu@student.edu.cn',
    studentId: '20240003',
    class: '计算机2024-1班',
    enrollmentDate: '2024-09-01',
    status: 'active'
  }
];

// 模拟单个学生详细进度数据
const mockStudentProgress: StudentProgressDetail = {
  studentInfo: mockStudents[0],
  
  learningStats: {
    totalStudyTime: 1250,
    totalCourses: 5,
    completedCourses: 3,
    totalExperiments: 12,
    completedExperiments: 8,
    averageScore: 85.6,
    totalQuizzes: 15,
    passedQuizzes: 13,
    forumPosts: 8,
    helpRequests: 3,
    loginDays: 45,
    streakDays: 7
  },
  
  courseProgress: [
    {
      courseId: 'course_001',
      courseName: 'STM32基础入门',
      totalChapters: 10,
      completedChapters: 10,
      progressPercentage: 100,
      currentChapter: '课程已完成',
      lastAccessTime: '2024-01-15T10:30:00Z',
      totalStudyTime: 320,
      averageScore: 92.5,
      status: 'completed'
    },
    {
      courseId: 'course_002',
      courseName: 'STM32中级开发',
      totalChapters: 12,
      completedChapters: 8,
      progressPercentage: 66.7,
      currentChapter: '第9章：UART通信',
      lastAccessTime: '2024-01-14T16:45:00Z',
      totalStudyTime: 280,
      averageScore: 86.2,
      status: 'in_progress'
    },
    {
      courseId: 'course_003',
      courseName: 'STM32高级应用',
      totalChapters: 15,
      completedChapters: 3,
      progressPercentage: 20,
      currentChapter: '第4章：DMA应用',
      lastAccessTime: '2024-01-12T14:20:00Z',
      totalStudyTime: 95,
      averageScore: 78.5,
      status: 'in_progress'
    }
  ],
  
  experimentProgress: [
    {
      experimentId: 'exp_001',
      experimentName: 'LED闪烁控制',
      difficulty: 'beginner',
      status: 'completed',
      score: 95,
      maxScore: 100,
      attempts: 2,
      timeSpent: 65,
      completedAt: '2024-01-10T14:30:00Z',
      lastAttemptAt: '2024-01-10T14:30:00Z'
    },
    {
      experimentId: 'exp_002',
      experimentName: 'PWM调光实验',
      difficulty: 'intermediate',
      status: 'completed',
      score: 88,
      maxScore: 100,
      attempts: 3,
      timeSpent: 95,
      completedAt: '2024-01-12T16:45:00Z',
      lastAttemptAt: '2024-01-12T16:45:00Z'
    },
    {
      experimentId: 'exp_003',
      experimentName: 'UART通信实验',
      difficulty: 'intermediate',
      status: 'in_progress',
      score: 0,
      maxScore: 100,
      attempts: 2,
      timeSpent: 45,
      lastAttemptAt: '2024-01-14T10:15:00Z'
    }
  ],
  
  recentActivities: [
    {
      id: 'activity_001',
      type: 'chapter_complete',
      title: '完成第8章学习',
      description: '完成了STM32中级开发课程第8章的学习',
      timestamp: '2024-01-14T16:45:00Z',
      duration: 45,
      score: 88
    },
    {
      id: 'activity_002',
      type: 'experiment_start',
      title: '开始UART通信实验',
      description: '开始进行UART通信实验的第2次尝试',
      timestamp: '2024-01-14T10:15:00Z',
      duration: 30
    },
    {
      id: 'activity_003',
      type: 'quiz_attempt',
      title: '完成第8章测验',
      description: '完成了第8章的课后测验',
      timestamp: '2024-01-14T17:20:00Z',
      duration: 15,
      score: 92
    }
  ],
  
  learningPattern: {
    timePattern: {
      preferredHours: [14, 15, 16, 19, 20],
      weekdayActivity: [85, 90, 88, 92, 87, 45, 35],
      weekendActivity: [65, 70],
      sessionDuration: 45,
      sessionFrequency: 5
    },
    learningHabits: {
      studyConsistency: 85,
      procrastinationTendency: 25,
      helpSeekingBehavior: 60,
      selfDirectedLearning: 80,
      collaborationLevel: 70
    },
    contentPreferences: {
      theoreticalVsPractical: 20,
      difficultyPreference: 'medium',
      learningSpeed: 'medium',
      preferredFormats: ['视频教程', '实验操作', '代码示例']
    }
  },
  
  achievements: [
    {
      id: 'achievement_001',
      title: '初学者',
      description: '完成第一个实验',
      icon: '🎯',
      category: 'progress',
      earnedAt: '2024-01-10T14:30:00Z',
      level: 'bronze',
      points: 100
    },
    {
      id: 'achievement_002',
      title: '坚持学习',
      description: '连续学习7天',
      icon: '🔥',
      category: 'consistency',
      earnedAt: '2024-01-14T23:59:00Z',
      level: 'silver',
      points: 200
    }
  ],
  
  recommendations: [
    {
      type: 'course',
      priority: 'high',
      title: '继续UART通信学习',
      description: '建议完成当前的UART通信实验，这是后续学习的重要基础',
      actionItems: [
        '复习UART基础理论',
        '查看实验指导文档',
        '寻求教师帮助'
      ],
      expectedBenefit: '掌握串口通信技能，为后续项目打基础',
      estimatedTime: 120,
      difficulty: 'medium'
    },
    {
      type: 'study_habit',
      priority: 'medium',
      title: '优化学习时间安排',
      description: '建议在下午2-4点的高效时段安排重要学习内容',
      actionItems: [
        '制定学习计划',
        '设置学习提醒',
        '避免在低效时段学习'
      ],
      expectedBenefit: '提高学习效率，减少学习时间',
      estimatedTime: 30,
      difficulty: 'easy'
    }
  ],
  
  classRanking: {
    overall: 8,
    totalStudents: 45,
    percentile: 82.2
  },
  
  progressTrends: [
    { date: '2024-01-08', studyTime: 60, score: 85, activitiesCount: 3 },
    { date: '2024-01-09', studyTime: 75, score: 88, activitiesCount: 4 },
    { date: '2024-01-10', studyTime: 90, score: 92, activitiesCount: 5 },
    { date: '2024-01-11', studyTime: 45, score: 86, activitiesCount: 2 },
    { date: '2024-01-12', studyTime: 80, score: 89, activitiesCount: 4 },
    { date: '2024-01-13', studyTime: 55, score: 84, activitiesCount: 3 },
    { date: '2024-01-14', studyTime: 70, score: 90, activitiesCount: 4 }
  ],
  
  strengths: ['实验操作能力强', '学习态度积极', '代码理解能力好'],
  weaknesses: ['理论知识薄弱', '调试技巧不足', '时间管理需改进'],
  
  goals: [
    {
      id: 'goal_001',
      title: '完成STM32中级课程',
      description: '在本月底前完成STM32中级开发课程的所有章节',
      targetDate: '2024-01-31',
      progress: 66.7,
      status: 'active'
    },
    {
      id: 'goal_002',
      title: '掌握UART通信',
      description: '完成UART通信实验并获得85分以上',
      targetDate: '2024-01-20',
      progress: 30,
      status: 'active'
    }
  ]
};

// 模拟班级整体进度数据
const mockClassProgress: ClassProgressAnalytics = {
  classInfo: {
    id: 'class_001',
    name: '计算机2024-1班',
    totalStudents: 45,
    activeStudents: 42,
    teacher: '王老师'
  },
  
  overallStats: {
    averageProgress: 68.5,
    averageScore: 82.3,
    totalStudyTime: 28500,
    completionRate: 76.8,
    engagementRate: 93.3
  },
  
  progressDistribution: [
    { range: '0-20%', count: 3, percentage: 6.7, students: ['student_040', 'student_041', 'student_042'] },
    { range: '20-40%', count: 5, percentage: 11.1, students: ['student_035', 'student_036', 'student_037', 'student_038', 'student_039'] },
    { range: '40-60%', count: 12, percentage: 26.7, students: [] },
    { range: '60-80%', count: 18, percentage: 40.0, students: [] },
    { range: '80-100%', count: 7, percentage: 15.6, students: ['student_001', 'student_002', 'student_003'] }
  ],
  
  scoreDistribution: [
    { range: '90-100分', count: 8, percentage: 17.8 },
    { range: '80-89分', count: 22, percentage: 48.9 },
    { range: '70-79分', count: 12, percentage: 26.7 },
    { range: '60-69分', count: 3, percentage: 6.7 },
    { range: '0-59分', count: 0, percentage: 0 }
  ],
  
  activityAnalysis: {
    dailyActiveUsers: [
      { date: '2024-01-08', count: 38 },
      { date: '2024-01-09', count: 42 },
      { date: '2024-01-10', count: 40 },
      { date: '2024-01-11', count: 35 },
      { date: '2024-01-12', count: 39 },
      { date: '2024-01-13', count: 28 },
      { date: '2024-01-14', count: 41 }
    ],
    weeklyEngagement: [
      { week: '2024-W01', studyTime: 6800, activitiesCount: 285 },
      { week: '2024-W02', studyTime: 7200, activitiesCount: 312 }
    ]
  },
  
  courseCompletion: [
    {
      courseId: 'course_001',
      courseName: 'STM32基础入门',
      totalStudents: 45,
      completedStudents: 38,
      averageProgress: 92.5,
      averageScore: 86.2
    },
    {
      courseId: 'course_002',
      courseName: 'STM32中级开发',
      totalStudents: 45,
      completedStudents: 15,
      averageProgress: 58.3,
      averageScore: 81.7
    }
  ],
  
  experimentCompletion: [
    {
      experimentId: 'exp_001',
      experimentName: 'LED闪烁控制',
      totalAttempts: 89,
      successfulCompletions: 38,
      averageScore: 84.5,
      averageTime: 72
    },
    {
      experimentId: 'exp_002',
      experimentName: 'PWM调光实验',
      totalAttempts: 67,
      successfulCompletions: 28,
      averageScore: 79.8,
      averageTime: 95
    }
  ],
  
  studentRankings: [
    {
      studentId: 'student_001',
      studentName: '张三',
      overallScore: 92.5,
      totalStudyTime: 1250,
      completionRate: 85.6,
      rank: 1
    },
    {
      studentId: 'student_002',
      studentName: '李四',
      overallScore: 89.2,
      totalStudyTime: 1180,
      completionRate: 82.3,
      rank: 2
    }
  ],
  
  studentsNeedingAttention: [
    {
      studentId: 'student_040',
      studentName: '赵六',
      issues: ['学习进度缓慢', '长时间未登录', '实验完成率低'],
      priority: 'high',
      lastActivity: '2024-01-08T10:30:00Z'
    },
    {
      studentId: 'student_041',
      studentName: '钱七',
      issues: ['成绩下降', '求助频繁'],
      priority: 'medium',
      lastActivity: '2024-01-13T14:20:00Z'
    }
  ]
};

/**
 * 获取单个学生详细进度
 */
export const getStudentProgress = async (
  studentId: string,
  includeDetails = true
): Promise<StudentProgressDetail> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // 这里应该调用实际的API
    // const response = await apiClient.get(`/api/teacher/analytics/student/${studentId}`, {
    //   params: { includeDetails }
    // });
    
    return {
      ...mockStudentProgress,
      studentInfo: { ...mockStudentProgress.studentInfo, id: studentId }
    };
  } catch (error) {
    console.error('获取学生进度失败:', error);
    throw new Error('获取学生进度失败，请重试');
  }
};

/**
 * 获取班级整体进度分析
 */
export const getClassProgress = async (
  classId: string,
  filters?: ProgressFilters
): Promise<ClassProgressAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // const response = await apiClient.post(`/api/teacher/analytics/class/${classId}`, { filters });
    return mockClassProgress;
  } catch (error) {
    console.error('获取班级进度失败:', error);
    throw new Error('获取班级进度失败，请重试');
  }
};

/**
 * 获取学生对比分析
 */
export const getStudentComparison = async (
  studentIds: string[]
): Promise<StudentComparison> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const mockComparison: StudentComparison = {
    students: mockStudents.slice(0, studentIds.length),
    comparisonMetrics: studentIds.map((id, index) => ({
      studentId: id,
      overallProgress: 85 - index * 5,
      averageScore: 88 - index * 3,
      totalStudyTime: 1200 - index * 100,
      completionRate: 80 - index * 5,
      activityLevel: 90 - index * 8,
      rank: index + 1
    })),
    detailedComparison: {
      courses: [
        {
          courseId: 'course_001',
          courseName: 'STM32基础入门',
          studentProgress: studentIds.map((id, index) => ({
            studentId: id,
            progress: 100 - index * 10,
            score: 92 - index * 3,
            timeSpent: 320 - index * 20
          }))
        }
      ],
      experiments: [
        {
          experimentId: 'exp_001',
          experimentName: 'LED闪烁控制',
          studentResults: studentIds.map((id, index) => ({
            studentId: id,
            status: index === 0 ? 'completed' : 'in_progress',
            score: 95 - index * 5,
            attempts: 2 + index,
            timeSpent: 65 + index * 10
          }))
        }
      ]
    }
  };
  
  return mockComparison;
};

/**
 * 获取学习路径分析
 */
export const getLearningPathAnalysis = async (
  pathId: string
): Promise<LearningPathAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const mockPathAnalysis: LearningPathAnalysis = {
    pathId,
    pathName: 'STM32完整学习路径',
    totalSteps: 5,
    stepCompletion: [
      {
        stepId: 'step_001',
        stepName: '基础理论学习',
        completionRate: 95.6,
        averageTime: 180,
        dropoffRate: 4.4,
        commonIssues: ['概念理解困难', '理论与实践脱节']
      },
      {
        stepId: 'step_002',
        stepName: '基础实验操作',
        completionRate: 88.9,
        averageTime: 240,
        dropoffRate: 11.1,
        commonIssues: ['硬件连接错误', '代码调试困难']
      },
      {
        stepId: 'step_003',
        stepName: '中级项目开发',
        completionRate: 76.7,
        averageTime: 360,
        dropoffRate: 23.3,
        commonIssues: ['项目复杂度高', '时间管理困难']
      }
    ],
    pathEffectiveness: {
      overallCompletionRate: 68.5,
      averageCompletionTime: 2400,
      studentSatisfaction: 4.2,
      knowledgeRetention: 85.3
    },
    optimizationSuggestions: [
      {
        stepId: 'step_002',
        suggestion: '增加硬件连接指导视频',
        expectedImprovement: '减少连接错误，提高完成率10%',
        priority: 'high'
      },
      {
        stepId: 'step_003',
        suggestion: '将大项目拆分为小任务',
        expectedImprovement: '降低难度感知，提高完成率15%',
        priority: 'high'
      }
    ]
  };
  
  return mockPathAnalysis;
};

/**
 * 导出学生进度报告
 */
export const exportProgressReport = async (
  type: 'student' | 'class',
  id: string,
  format: 'pdf' | 'excel' | 'csv'
): Promise<Blob> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const content = `学生进度报告 - ${type}:${id}\n导出格式: ${format}\n导出时间: ${new Date().toLocaleString()}`;
  return new Blob([content], { type: 'text/plain' });
};
