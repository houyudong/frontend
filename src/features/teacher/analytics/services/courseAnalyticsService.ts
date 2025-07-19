/**
 * 课程分析数据服务
 * 
 * 提供课程分析相关的API调用和数据处理
 */

import { apiClient } from '../../../../api/apiClient';
import type {
  CourseAnalyticsData,
  CourseAnalyticsResponse,
  CourseAnalyticsQuery,
  CourseInfo,
  StudyTimeAnalytics,
  ScoreAnalytics,
  LearningBehaviorAnalytics,
  ExperimentAnalytics,
  StudentProgress
} from '../types/courseAnalytics';

export class CourseAnalyticsService {
  private static baseUrl = '/api/analytics/courses';

  /**
   * 获取课程分析数据
   */
  static async getCourseAnalytics(query: CourseAnalyticsQuery): Promise<CourseAnalyticsData> {
    const response = await apiClient.get<CourseAnalyticsResponse>(
      `${this.baseUrl}/${query.courseId}`,
      { params: query }
    );
    return response.data;
  }

  /**
   * 获取课程基本信息
   */
  static async getCourseInfo(courseId: string): Promise<CourseInfo> {
    const response = await apiClient.get<{ data: CourseInfo }>(
      `${this.baseUrl}/${courseId}/info`
    );
    return response.data;
  }

  /**
   * 获取学习时长分析
   */
  static async getStudyTimeAnalytics(
    courseId: string,
    startDate?: string,
    endDate?: string
  ): Promise<StudyTimeAnalytics> {
    const response = await apiClient.get<{ data: StudyTimeAnalytics }>(
      `${this.baseUrl}/${courseId}/study-time`,
      { params: { startDate, endDate } }
    );
    return response.data;
  }

  /**
   * 获取成绩分析
   */
  static async getScoreAnalytics(
    courseId: string,
    chapterIds?: string[]
  ): Promise<ScoreAnalytics> {
    const response = await apiClient.get<{ data: ScoreAnalytics }>(
      `${this.baseUrl}/${courseId}/scores`,
      { params: { chapterIds } }
    );
    return response.data;
  }

  /**
   * 获取学习行为分析
   */
  static async getLearningBehaviorAnalytics(
    courseId: string,
    startDate?: string,
    endDate?: string
  ): Promise<LearningBehaviorAnalytics> {
    const response = await apiClient.get<{ data: LearningBehaviorAnalytics }>(
      `${this.baseUrl}/${courseId}/behavior`,
      { params: { startDate, endDate } }
    );
    return response.data;
  }

  /**
   * 获取实验分析
   */
  static async getExperimentAnalytics(courseId: string): Promise<ExperimentAnalytics> {
    const response = await apiClient.get<{ data: ExperimentAnalytics }>(
      `${this.baseUrl}/${courseId}/experiments`
    );
    return response.data;
  }

  /**
   * 获取学生进度
   */
  static async getStudentProgress(
    courseId: string,
    studentIds?: string[]
  ): Promise<StudentProgress[]> {
    const response = await apiClient.get<{ data: StudentProgress[] }>(
      `${this.baseUrl}/${courseId}/progress`,
      { params: { studentIds } }
    );
    return response.data;
  }

  /**
   * 导出分析报告
   */
  static async exportAnalyticsReport(
    courseId: string,
    format: 'pdf' | 'excel' = 'pdf'
  ): Promise<Blob> {
    const response = await apiClient.get(
      `${this.baseUrl}/${courseId}/export`,
      { 
        params: { format },
        responseType: 'blob'
      }
    );
    return response;
  }
}

// 模拟数据生成器（用于开发和测试）
export class MockCourseAnalyticsService {
  /**
   * 生成模拟课程分析数据
   */
  static generateMockData(courseId: string): CourseAnalyticsData {
    return {
      courseInfo: this.generateMockCourseInfo(courseId),
      studyTimeAnalytics: this.generateMockStudyTimeAnalytics(),
      scoreAnalytics: this.generateMockScoreAnalytics(),
      learningBehaviorAnalytics: this.generateMockLearningBehaviorAnalytics(),
      experimentAnalytics: this.generateMockExperimentAnalytics(),
      studentProgress: this.generateMockStudentProgress(),
      lastUpdated: new Date().toISOString()
    };
  }

  private static generateMockCourseInfo(courseId: string): CourseInfo {
    return {
      id: courseId,
      name: 'STM32嵌入式系统开发',
      description: '深入学习STM32微控制器的开发技术',
      totalChapters: 12,
      totalLessons: 48,
      totalExperiments: 15,
      estimatedDuration: 2400, // 40小时
      difficulty: 'intermediate',
      category: '嵌入式开发',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z'
    };
  }

  private static generateMockStudyTimeAnalytics(): StudyTimeAnalytics {
    // 生成过去30天的数据
    const dailyData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        totalTime: Math.floor(Math.random() * 300) + 100,
        activeStudents: Math.floor(Math.random() * 20) + 10,
        completedLessons: Math.floor(Math.random() * 5) + 1
      };
    });

    // 生成章节学习时长数据
    const chapterData = Array.from({ length: 12 }, (_, i) => ({
      chapterId: `chapter-${i + 1}`,
      chapterName: `第${i + 1}章`,
      totalTime: Math.floor(Math.random() * 500) + 200,
      averageTime: Math.floor(Math.random() * 50) + 20,
      completionRate: Math.random() * 0.3 + 0.7
    }));

    return {
      totalStudyTime: 15600,
      averageStudyTime: 520,
      dailyStudyTime: dailyData,
      weeklyStudyTime: [],
      monthlyStudyTime: [],
      chapterStudyTime: chapterData,
      studentStudyTime: []
    };
  }

  private static generateMockScoreAnalytics(): ScoreAnalytics {
    return {
      overallStats: {
        averageScore: 82.5,
        medianScore: 85,
        highestScore: 98,
        lowestScore: 45,
        passRate: 0.85,
        excellentRate: 0.35,
        standardDeviation: 12.8
      },
      chapterStats: Array.from({ length: 12 }, (_, i) => ({
        chapterId: `chapter-${i + 1}`,
        chapterName: `第${i + 1}章`,
        averageScore: Math.floor(Math.random() * 20) + 75,
        passRate: Math.random() * 0.2 + 0.8,
        difficulty: Math.random() * 0.4 + 0.3,
        completionTime: Math.floor(Math.random() * 30) + 45
      })),
      studentStats: [],
      scoreDistribution: [
        { range: '90-100', count: 12, percentage: 35.3 },
        { range: '80-89', count: 15, percentage: 44.1 },
        { range: '70-79', count: 5, percentage: 14.7 },
        { range: '60-69', count: 2, percentage: 5.9 }
      ],
      trendAnalysis: []
    };
  }

  private static generateMockLearningBehaviorAnalytics(): LearningBehaviorAnalytics {
    return {
      accessPatterns: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        dayOfWeek: 1,
        accessCount: Math.floor(Math.random() * 50) + 10,
        averageSessionTime: Math.floor(Math.random() * 30) + 15
      })),
      sessionAnalytics: {
        averageSessionDuration: 45,
        totalSessions: 1250,
        bounceRate: 0.15,
        returnRate: 0.78,
        sessionDistribution: [
          { durationRange: '0-5min', count: 125, percentage: 10 },
          { durationRange: '5-15min', count: 250, percentage: 20 },
          { durationRange: '15-30min', count: 375, percentage: 30 },
          { durationRange: '30-60min', count: 375, percentage: 30 },
          { durationRange: '60min+', count: 125, percentage: 10 }
        ]
      },
      engagementMetrics: {
        averageEngagementScore: 78,
        videoWatchRate: 0.85,
        exerciseCompletionRate: 0.72,
        forumParticipationRate: 0.45,
        questionAskingRate: 0.28
      },
      dropoutAnalysis: {
        overallDropoutRate: 0.15,
        chapterDropoutRates: [],
        dropoutReasons: [],
        riskStudents: []
      }
    };
  }

  private static generateMockExperimentAnalytics(): ExperimentAnalytics {
    return {
      overallStats: {
        totalExperiments: 15,
        completedExperiments: 12,
        averageCompletionTime: 65,
        successRate: 0.78,
        retryRate: 0.35
      },
      experimentDetails: Array.from({ length: 15 }, (_, i) => ({
        experimentId: `exp-${i + 1}`,
        experimentName: `实验${i + 1}`,
        attemptCount: Math.floor(Math.random() * 50) + 20,
        successCount: Math.floor(Math.random() * 40) + 15,
        averageTime: Math.floor(Math.random() * 30) + 45,
        difficulty: Math.random() * 0.4 + 0.3,
        commonErrors: ['编译错误', '逻辑错误', '配置错误']
      })),
      errorAnalysis: [],
      performanceMetrics: []
    };
  }

  private static generateMockStudentProgress(): StudentProgress[] {
    return Array.from({ length: 30 }, (_, i) => ({
      studentId: `student-${i + 1}`,
      studentName: `学生${i + 1}`,
      enrollmentDate: '2024-09-01T00:00:00Z',
      lastAccessDate: new Date().toISOString(),
      totalStudyTime: Math.floor(Math.random() * 1000) + 200,
      completedChapters: Math.floor(Math.random() * 12) + 1,
      completedLessons: Math.floor(Math.random() * 48) + 5,
      completedExperiments: Math.floor(Math.random() * 15) + 2,
      overallProgress: Math.random() * 0.5 + 0.3,
      averageScore: Math.floor(Math.random() * 30) + 65,
      status: ['in_progress', 'completed', 'not_started'][Math.floor(Math.random() * 3)] as any,
      chapterProgress: []
    }));
  }
}
