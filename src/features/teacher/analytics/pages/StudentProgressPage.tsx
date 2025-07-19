/**
 * 学生总体进度分析页面
 * 
 * 展示班级学生的整体学习进度和统计分析
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import { useStudentProgress } from '../hooks/useStudentProgress';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import HeatmapChart from '../components/charts/HeatmapChart';
import AnalyticsFilters from '../components/filters/AnalyticsFilters';
import ExportButton from '../components/export/ExportButton';

const StudentProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId') || 'class_001';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'distribution' | 'activity' | 'ranking' | 'attention'>('overview');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  const {
    classProgress,
    classLoading,
    error,
    fetchClassProgress,
    exportReport,
    exportLoading,
    clearError
  } = useStudentProgress();

  // 加载班级进度数据
  useEffect(() => {
    fetchClassProgress(classId);
  }, [classId, fetchClassProgress]);

  // 处理导出
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    await exportReport('class', classId, format);
  };

  // 处理学生选择
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // 查看学生详情
  const handleViewStudent = (studentId: string) => {
    navigate(`/teacher/analytics/student/${studentId}`);
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
  if (classLoading || !classProgress) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">加载班级进度数据中...</p>
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
              <span className="text-gray-900 font-medium">学生进度</span>
            </li>
          </ol>
        </nav>

        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span>{classProgress.classInfo.name} - 学生进度分析</span>
            </h1>
            <p className="page-subtitle mt-2">
              班级整体学习进度监控与分析
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <ExportButton
              onExport={handleExport}
              loading={exportLoading}
            />
            <button
              onClick={() => navigate('/teacher/analytics')}
              className="btn btn-secondary"
            >
              返回分析
            </button>
          </div>
        </div>

        {/* 班级概览统计 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{classProgress.classInfo.totalStudents}</div>
            <div className="text-sm font-medium text-gray-600">总学生数</div>
            <div className="text-xs text-green-600 mt-1">活跃: {classProgress.classInfo.activeStudents}</div>
          </div>
          
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{classProgress.overallStats.averageProgress.toFixed(1)}%</div>
            <div className="text-sm font-medium text-gray-600">平均进度</div>
          </div>
          
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition-colors">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">{classProgress.overallStats.averageScore.toFixed(1)}</div>
            <div className="text-sm font-medium text-gray-600">平均成绩</div>
          </div>
          
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{classProgress.overallStats.completionRate.toFixed(1)}%</div>
            <div className="text-sm font-medium text-gray-600">完成率</div>
          </div>
          
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-1">{classProgress.overallStats.engagementRate.toFixed(1)}%</div>
            <div className="text-sm font-medium text-gray-600">参与度</div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: '概览分析', icon: '📊' },
              { key: 'distribution', label: '进度分布', icon: '📈' },
              { key: 'activity', label: '活跃度分析', icon: '⚡' },
              { key: 'ranking', label: '学生排名', icon: '🏆' },
              { key: 'attention', label: '重点关注', icon: '⚠️' }
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
              {/* 课程完成情况 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">课程完成情况</h3>
                <div className="space-y-4">
                  {classProgress.courseCompletion.map((course, index) => (
                    <div key={course.courseId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{course.courseName}</h4>
                        <span className="text-sm text-gray-500">
                          {course.completedStudents}/{course.totalStudents} 完成
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>平均进度</span>
                            <span>{course.averageProgress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${course.averageProgress}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">平均分</div>
                          <div className="text-lg font-semibold text-green-600">{course.averageScore.toFixed(1)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 实验完成情况 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">实验完成情况</h3>
                <div className="space-y-4">
                  {classProgress.experimentCompletion.map((experiment, index) => (
                    <div key={experiment.experimentId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{experiment.experimentName}</h4>
                        <span className="text-sm text-gray-500">
                          {experiment.successfulCompletions}/{experiment.totalAttempts} 成功
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-blue-600">{experiment.averageScore.toFixed(1)}</div>
                          <div className="text-xs text-gray-600">平均分</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-green-600">{Math.round(experiment.averageTime)}</div>
                          <div className="text-xs text-gray-600">平均时长(分)</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-purple-600">
                            {((experiment.successfulCompletions / experiment.totalAttempts) * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600">成功率</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'distribution' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 进度分布 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">学习进度分布</h3>
                <PieChart
                  data={{
                    labels: classProgress.progressDistribution.map(item => item.range),
                    datasets: [{
                      data: classProgress.progressDistribution.map(item => item.count),
                      backgroundColor: [
                        '#EF4444',
                        '#F59E0B',
                        '#3B82F6',
                        '#10B981',
                        '#8B5CF6'
                      ]
                    }]
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>

              {/* 成绩分布 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">成绩分布</h3>
                <BarChart
                  data={{
                    labels: classProgress.scoreDistribution.map(item => item.range),
                    datasets: [{
                      label: '学生数量',
                      data: classProgress.scoreDistribution.map(item => item.count),
                      backgroundColor: '#3B82F6'
                    }]
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-8">
              {/* 每日活跃用户 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">每日活跃学生数</h3>
                <LineChart
                  data={{
                    labels: classProgress.activityAnalysis.dailyActiveUsers.map(item => 
                      new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                    ),
                    datasets: [{
                      label: '活跃学生数',
                      data: classProgress.activityAnalysis.dailyActiveUsers.map(item => item.count),
                      borderColor: '#3B82F6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.4
                    }]
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: classProgress.classInfo.totalStudents,
                        ticks: {
                          stepSize: 5
                        }
                      }
                    }
                  }}
                />
              </div>

              {/* 周度参与情况 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">周度学习参与情况</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {classProgress.activityAnalysis.weeklyEngagement.map((week, index) => (
                    <div key={week.week} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{week.week}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">学习时长</span>
                          <span className="font-semibold">{Math.round(week.studyTime / 60)} 小时</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">活动次数</span>
                          <span className="font-semibold">{week.activitiesCount} 次</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">学生排名</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>排名</th>
                      <th>学生姓名</th>
                      <th>综合成绩</th>
                      <th>学习时长</th>
                      <th>完成率</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classProgress.studentRankings.map((student, index) => (
                      <tr key={student.studentId} className="group">
                        <td>
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                              student.rank === 1 ? 'bg-yellow-500' :
                              student.rank === 2 ? 'bg-gray-400' :
                              student.rank === 3 ? 'bg-orange-600' : 'bg-blue-500'
                            }`}>
                              {student.rank}
                            </div>
                            {student.rank <= 3 && (
                              <span className="text-lg">
                                {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : '🥉'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="font-medium text-gray-900">{student.studentName}</div>
                        </td>
                        <td>
                          <span className="font-semibold text-blue-600">{student.overallScore.toFixed(1)}</span>
                        </td>
                        <td>
                          <span className="text-gray-900">{Math.round(student.totalStudyTime / 60)} 小时</span>
                        </td>
                        <td>
                          <span className="font-medium text-green-600">{student.completionRate.toFixed(1)}%</span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleViewStudent(student.studentId)}
                            className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-700 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            查看详情
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'attention' && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">需要重点关注的学生</h3>
              <div className="space-y-4">
                {classProgress.studentsNeedingAttention.map((student, index) => (
                  <div key={student.studentId} className={`border rounded-lg p-4 ${
                    student.priority === 'high' ? 'border-red-200 bg-red-50' :
                    student.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{student.studentName}</h4>
                          <span className={`badge ${
                            student.priority === 'high' ? 'badge-danger' :
                            student.priority === 'medium' ? 'badge-warning' : 'badge-secondary'
                          }`}>
                            {student.priority === 'high' ? '高优先级' :
                             student.priority === 'medium' ? '中优先级' : '低优先级'}
                          </span>
                        </div>
                        <div className="space-y-1 mb-3">
                          {student.issues.map((issue, issueIndex) => (
                            <div key={issueIndex} className="flex items-center space-x-2 text-sm">
                              <span className={`w-2 h-2 rounded-full ${
                                student.priority === 'high' ? 'bg-red-500' :
                                student.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`}></span>
                              <span className="text-gray-700">{issue}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">
                          最后活动: {new Date(student.lastActivity).toLocaleString('zh-CN')}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewStudent(student.studentId)}
                          className="btn btn-sm btn-primary"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentProgressPage;
