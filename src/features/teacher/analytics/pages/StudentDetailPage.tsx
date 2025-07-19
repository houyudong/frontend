/**
 * 单个学生详细分析页面
 *
 * 展示单个学生的完整学习数据分析和个性化建议
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import { useStudentProgress } from '../hooks/useStudentProgress';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import RadarChart from '../components/charts/RadarChart';
import ExportButton from '../components/export/ExportButton';

const StudentDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'performance' | 'behavior' | 'recommendations'>('overview');

  const {
    studentProgress,
    studentLoading,
    error,
    fetchStudentProgress,
    exportReport,
    exportLoading,
    clearError
  } = useStudentProgress();

  // 加载学生数据
  useEffect(() => {
    if (studentId) {
      fetchStudentProgress(studentId, true);
    }
  }, [studentId, fetchStudentProgress]);

  // 处理导出
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (studentId) {
      await exportReport('student', studentId, format);
    }
  };

  // 错误处理
  if (error) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">加载失败</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={clearError}
              className="btn btn-primary"
            >
              重试
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 加载状态
  if (studentLoading || !studentProgress) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">加载学生数据中...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container">
        {/* 面包屑导航 */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 text-sm">
            <li>
              <button
                onClick={() => navigate('/teacher/analytics')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                数据分析
              </button>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <button
                onClick={() => navigate('/teacher/analytics/students')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                学生进度
              </button>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="text-gray-900 font-medium">学生详情</span>
            </li>
          </ol>
        </nav>

        {/* 学生信息头部 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {studentProgress.studentInfo.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{studentProgress.studentInfo.fullName}</h1>
                <p className="text-blue-100">学号: {studentProgress.studentInfo.studentId}</p>
                <p className="text-blue-100">班级: {studentProgress.studentInfo.class}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">#{studentProgress.classRanking.overall}</div>
              <div className="text-blue-100">班级排名</div>
              <div className="text-sm text-blue-200">前 {studentProgress.classRanking.percentile.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* 关键指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {((studentProgress.learningStats.completedCourses / studentProgress.learningStats.totalCourses) * 100).toFixed(1)}%
            </div>
            <div className="text-sm font-medium text-gray-600">课程完成率</div>
            <div className="text-xs text-gray-500 mt-1">
              {studentProgress.learningStats.completedCourses}/{studentProgress.learningStats.totalCourses} 门课程
            </div>
          </div>

          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{studentProgress.learningStats.averageScore.toFixed(1)}</div>
            <div className="text-sm font-medium text-gray-600">平均成绩</div>
          </div>

          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{Math.round(studentProgress.learningStats.totalStudyTime / 60)}</div>
            <div className="text-sm font-medium text-gray-600">学习时长(小时)</div>
          </div>

          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{studentProgress.learningStats.streakDays}</div>
            <div className="text-sm font-medium text-gray-600">连续学习天数</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end space-x-3 mb-8">
          <ExportButton
            onExport={handleExport}
            loading={exportLoading}
          />
          <button
            onClick={() => navigate('/teacher/analytics/students')}
            className="btn btn-secondary"
          >
            返回列表
          </button>
        </div>

        {/* 标签页导航 */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: '学习概览', icon: '📊' },
              { key: 'progress', label: '课程进度', icon: '📚' },
              { key: 'performance', label: '实验表现', icon: '🧪' },
              { key: 'behavior', label: '学习行为', icon: '📈' },
              { key: 'recommendations', label: '个性化建议', icon: '💡' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 标签页内容 */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 学习趋势 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">学习趋势</h3>
                <LineChart
                  data={{
                    labels: studentProgress.progressTrends.map(item =>
                      new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                    ),
                    datasets: [
                      {
                        label: '学习时长(分钟)',
                        data: studentProgress.progressTrends.map(item => item.studyTime),
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        yAxisID: 'y'
                      },
                      {
                        label: '成绩',
                        data: studentProgress.progressTrends.map(item => item.score),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        yAxisID: 'y1'
                      }
                    ]
                  }}
                  options={{
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                          display: true,
                          text: '学习时长(分钟)'
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: '成绩'
                        },
                        grid: {
                          drawOnChartArea: false,
                        },
                      }
                    }
                  }}
                />
              </div>

              {/* 学习习惯雷达图 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">学习习惯分析</h3>
                <RadarChart
                  data={{
                    labels: ['学习一致性', '自主学习', '协作水平', '求助行为', '时间管理'],
                    datasets: [{
                      label: '学习习惯评分',
                      data: [
                        studentProgress.learningPattern.learningHabits.studyConsistency,
                        studentProgress.learningPattern.learningHabits.selfDirectedLearning,
                        studentProgress.learningPattern.learningHabits.collaborationLevel,
                        studentProgress.learningPattern.learningHabits.helpSeekingBehavior,
                        100 - studentProgress.learningPattern.learningHabits.procrastinationTendency
                      ],
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      borderColor: '#3B82F6',
                      pointBackgroundColor: '#3B82F6'
                    }]
                  }}
                  options={{
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </div>

              {/* 最近活动 */}
              <div className="card lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">最近学习活动</h3>
                <div className="space-y-4">
                  {studentProgress.recentActivities.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'chapter_complete' ? 'bg-green-100 text-green-600' :
                        activity.type === 'experiment_start' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'quiz_attempt' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.type === 'chapter_complete' ? '📚' :
                         activity.type === 'experiment_start' ? '🧪' :
                         activity.type === 'quiz_attempt' ? '📝' : '📋'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{new Date(activity.timestamp).toLocaleString('zh-CN')}</span>
                          {activity.duration && <span>耗时: {activity.duration} 分钟</span>}
                          {activity.score && <span className="text-green-600">得分: {activity.score}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* 课程进度详情 */}
              {studentProgress.courseProgress.map((course, index) => (
                <div key={course.courseId} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{course.courseName}</h3>
                    <span className={`badge ${
                      course.status === 'completed' ? 'badge-success' :
                      course.status === 'in_progress' ? 'badge-primary' :
                      course.status === 'paused' ? 'badge-warning' : 'badge-secondary'
                    }`}>
                      {course.status === 'completed' ? '已完成' :
                       course.status === 'in_progress' ? '进行中' :
                       course.status === 'paused' ? '暂停' : '未开始'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{course.progressPercentage.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">完成进度</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{course.averageScore.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">平均成绩</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{Math.round(course.totalStudyTime / 60)}</div>
                      <div className="text-sm text-gray-600">学习时长(小时)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{course.completedChapters}/{course.totalChapters}</div>
                      <div className="text-sm text-gray-600">完成章节</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>学习进度</span>
                      <span>{course.progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${course.progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>当前章节: {course.currentChapter}</span>
                      <span>最后学习: {new Date(course.lastAccessTime).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* 实验表现概览 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="card card-compact text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {((studentProgress.learningStats.completedExperiments / studentProgress.learningStats.totalExperiments) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">实验完成率</div>
                </div>
                <div className="card card-compact text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {studentProgress.learningStats.averageAttempts.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">平均尝试次数</div>
                </div>
                <div className="card card-compact text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {((studentProgress.learningStats.passedQuizzes / studentProgress.learningStats.totalQuizzes) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">测验通过率</div>
                </div>
              </div>

              {/* 实验详细表现 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">实验完成情况</h3>
                <div className="space-y-4">
                  {studentProgress.experimentProgress.map((experiment, index) => (
                    <div key={experiment.experimentId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{experiment.experimentName}</h4>
                          <span className={`badge ${
                            experiment.difficulty === 'beginner' ? 'badge-success' :
                            experiment.difficulty === 'intermediate' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {experiment.difficulty === 'beginner' ? '初级' :
                             experiment.difficulty === 'intermediate' ? '中级' : '高级'}
                          </span>
                        </div>
                        <span className={`badge ${
                          experiment.status === 'completed' ? 'badge-success' :
                          experiment.status === 'in_progress' ? 'badge-primary' :
                          experiment.status === 'failed' ? 'badge-danger' : 'badge-secondary'
                        }`}>
                          {experiment.status === 'completed' ? '已完成' :
                           experiment.status === 'in_progress' ? '进行中' :
                           experiment.status === 'failed' ? '失败' : '未开始'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-blue-600">{experiment.score}/{experiment.maxScore}</div>
                          <div className="text-xs text-gray-600">得分</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-green-600">{experiment.attempts}</div>
                          <div className="text-xs text-gray-600">尝试次数</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-purple-600">{experiment.timeSpent}</div>
                          <div className="text-xs text-gray-600">耗时(分钟)</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-orange-600">
                            {experiment.completedAt ?
                              new Date(experiment.completedAt).toLocaleDateString('zh-CN') :
                              '未完成'
                            }
                          </div>
                          <div className="text-xs text-gray-600">完成时间</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-8">
              {/* 学习时间模式 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">学习时间模式</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">偏好学习时间</h4>
                    <BarChart
                      data={{
                        labels: ['8-10时', '10-12时', '14-16时', '16-18时', '19-21时', '21-23时'],
                        datasets: [{
                          label: '活跃度',
                          data: [30, 45, 85, 90, 95, 60],
                          backgroundColor: '#3B82F6'
                        }]
                      }}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                              display: true,
                              text: '活跃度 (%)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">周度学习分布</h4>
                    <BarChart
                      data={{
                        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                        datasets: [{
                          label: '学习时长(分钟)',
                          data: studentProgress.learningPattern.timePattern.weekdayActivity.concat(
                            studentProgress.learningPattern.timePattern.weekendActivity
                          ),
                          backgroundColor: '#10B981'
                        }]
                      }}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: '学习时长 (分钟)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 学习偏好分析 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">学习偏好分析</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {studentProgress.learningPattern.contentPreferences.theoreticalVsPractical > 0 ? '实践型' : '理论型'}
                    </div>
                    <div className="text-sm text-gray-600">学习类型偏好</div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.abs(studentProgress.learningPattern.contentPreferences.theoreticalVsPractical)}%`,
                          marginLeft: studentProgress.learningPattern.contentPreferences.theoreticalVsPractical < 0 ? '0' : 'auto'
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {studentProgress.learningPattern.contentPreferences.difficultyPreference === 'easy' ? '简单' :
                       studentProgress.learningPattern.contentPreferences.difficultyPreference === 'medium' ? '中等' : '困难'}
                    </div>
                    <div className="text-sm text-gray-600">难度偏好</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {studentProgress.learningPattern.contentPreferences.learningSpeed === 'slow' ? '慢速' :
                       studentProgress.learningPattern.contentPreferences.learningSpeed === 'medium' ? '中速' : '快速'}
                    </div>
                    <div className="text-sm text-gray-600">学习速度</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">偏好学习格式</h4>
                  <div className="flex flex-wrap gap-2">
                    {studentProgress.learningPattern.contentPreferences.preferredFormats.map((format, index) => (
                      <span key={index} className="badge badge-secondary">{format}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-8">
              {/* 学习建议 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">个性化学习建议</h3>
                <div className="space-y-4">
                  {studentProgress.recommendations.map((recommendation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`badge ${
                              recommendation.priority === 'high' ? 'badge-danger' :
                              recommendation.priority === 'medium' ? 'badge-warning' : 'badge-secondary'
                            }`}>
                              {recommendation.priority === 'high' ? '高优先级' :
                               recommendation.priority === 'medium' ? '中优先级' : '低优先级'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {recommendation.type === 'course' ? '课程建议' :
                               recommendation.type === 'experiment' ? '实验建议' :
                               recommendation.type === 'study_habit' ? '学习习惯' : '技能提升'}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">{recommendation.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>

                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-700">行动建议:</span>
                              <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                                {recommendation.actionItems.map((item, itemIndex) => (
                                  <li key={itemIndex}>{item}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-gray-600">
                                预期效果: <span className="text-green-600">{recommendation.expectedBenefit}</span>
                              </span>
                              <span className="text-gray-600">
                                预计时间: <span className="text-blue-600">{recommendation.estimatedTime} 分钟</span>
                              </span>
                              <span className="text-gray-600">
                                难度: <span className={`${
                                  recommendation.difficulty === 'easy' ? 'text-green-600' :
                                  recommendation.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {recommendation.difficulty === 'easy' ? '简单' :
                                   recommendation.difficulty === 'medium' ? '中等' : '困难'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 学习目标 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">学习目标</h3>
                <div className="space-y-4">
                  {studentProgress.goals.map((goal, index) => (
                    <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{goal.title}</h4>
                        <span className={`badge ${
                          goal.status === 'completed' ? 'badge-success' :
                          goal.status === 'overdue' ? 'badge-danger' : 'badge-primary'
                        }`}>
                          {goal.status === 'completed' ? '已完成' :
                           goal.status === 'overdue' ? '已逾期' : '进行中'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>完成进度</span>
                          <span>{goal.progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              goal.status === 'completed' ? 'bg-green-500' :
                              goal.status === 'overdue' ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>目标日期: {new Date(goal.targetDate).toLocaleDateString('zh-CN')}</span>
                          <span>
                            {goal.status === 'overdue' ? '已逾期' :
                             `还有 ${Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} 天`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 优势和改进点 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">学习优势</h3>
                  <div className="space-y-2">
                    {studentProgress.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">改进建议</h3>
                  <div className="space-y-2">
                    {studentProgress.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-orange-500">!</span>
                        <span className="text-gray-700">{weakness}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDetailPage;