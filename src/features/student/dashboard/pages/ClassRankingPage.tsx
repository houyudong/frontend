import React, { useState } from 'react';
import { useAuth } from '../../../../app/providers/AuthProvider';
import MainLayout from '../../../../pages/layout/MainLayout';

// 排行榜类型定义
interface RankingStudent {
  id: number;
  rank: number;
  name: string;
  avatar: string;
  totalScore: number;
  courseProgress: number;
  experimentProgress: number;
  studyHours: number;
  completedCourses: number;
  completedExperiments: number;
  averageScore: number;
  lastActiveTime: string;
  isCurrentUser: boolean;
}

// 排序类型
type SortType = 'totalScore' | 'courseProgress' | 'experimentProgress' | 'studyHours';

/**
 * ClassRankingPage - 班级排行榜页面
 * 
 * 展示班级学生的详细学习排名和统计信息
 */
const ClassRankingPage: React.FC = () => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<SortType>('totalScore');

  // 模拟班级完整排行榜数据
  const fullRanking: RankingStudent[] = [
    {
      id: 1, rank: 1, name: '张小明', avatar: '👨‍🎓',
      totalScore: 95, courseProgress: 85, experimentProgress: 90, studyHours: 45,
      completedCourses: 10, completedExperiments: 12, averageScore: 92,
      lastActiveTime: '2小时前', isCurrentUser: false
    },
    {
      id: 2, rank: 2, name: '李小红', avatar: '👩‍🎓',
      totalScore: 92, courseProgress: 88, experimentProgress: 85, studyHours: 42,
      completedCourses: 11, completedExperiments: 10, averageScore: 89,
      lastActiveTime: '1小时前', isCurrentUser: false
    },
    {
      id: 3, rank: 3, name: user?.displayName || user?.username || '我', avatar: '👤',
      totalScore: 88, courseProgress: 75, experimentProgress: 80, studyHours: 38,
      completedCourses: 9, completedExperiments: 9, averageScore: 85,
      lastActiveTime: '刚刚', isCurrentUser: true
    },
    {
      id: 4, rank: 4, name: '王小强', avatar: '👨‍🎓',
      totalScore: 85, courseProgress: 70, experimentProgress: 78, studyHours: 35,
      completedCourses: 8, completedExperiments: 8, averageScore: 82,
      lastActiveTime: '30分钟前', isCurrentUser: false
    },
    {
      id: 5, rank: 5, name: '刘小美', avatar: '👩‍🎓',
      totalScore: 82, courseProgress: 68, experimentProgress: 75, studyHours: 32,
      completedCourses: 8, completedExperiments: 7, averageScore: 80,
      lastActiveTime: '1天前', isCurrentUser: false
    },
    {
      id: 6, rank: 6, name: '陈小华', avatar: '👨‍🎓',
      totalScore: 79, courseProgress: 65, experimentProgress: 72, studyHours: 30,
      completedCourses: 7, completedExperiments: 7, averageScore: 78,
      lastActiveTime: '2天前', isCurrentUser: false
    },
    {
      id: 7, rank: 7, name: '赵小芳', avatar: '👩‍🎓',
      totalScore: 76, courseProgress: 62, experimentProgress: 70, studyHours: 28,
      completedCourses: 7, completedExperiments: 6, averageScore: 75,
      lastActiveTime: '3天前', isCurrentUser: false
    },
    {
      id: 8, rank: 8, name: '孙小军', avatar: '👨‍🎓',
      totalScore: 73, courseProgress: 58, experimentProgress: 68, studyHours: 25,
      completedCourses: 6, completedExperiments: 6, averageScore: 72,
      lastActiveTime: '1周前', isCurrentUser: false
    }
  ];

  // 获取排序后的数据
  const getSortedRanking = () => {
    return [...fullRanking].sort((a, b) => {
      switch (sortBy) {
        case 'courseProgress':
          return b.courseProgress - a.courseProgress;
        case 'experimentProgress':
          return b.experimentProgress - a.experimentProgress;
        case 'studyHours':
          return b.studyHours - a.studyHours;
        default:
          return b.totalScore - a.totalScore;
      }
    });
  };

  // 获取排名图标
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank.toString();
  };

  // 获取排名颜色
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-100';
    if (rank === 2) return 'text-gray-600 bg-gray-100';
    if (rank === 3) return 'text-orange-600 bg-orange-100';
    return 'text-gray-500 bg-gray-50';
  };

  const sortedRanking = getSortedRanking();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">班级排行榜</h1>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>软件工程1班 · 共{fullRanking.length}名学生</span>
          </div>
        </div>

        {/* 排序选项 */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">排序方式</h3>
            <div className="flex space-x-2">
              {[
                { key: 'totalScore', label: '总分' },
                { key: 'courseProgress', label: '课程进度' },
                { key: 'experimentProgress', label: '实验进度' },
                { key: 'studyHours', label: '学习时长' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key as SortType)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    sortBy === option.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 前三名展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sortedRanking.slice(0, 3).map((student, index) => (
            <div
              key={student.id}
              className={`card text-center ${
                student.isCurrentUser ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="text-4xl mb-2">{getRankIcon(index + 1)}</div>
              <div className="text-2xl mb-1">{student.avatar}</div>
              <h3 className={`font-semibold mb-2 ${
                student.isCurrentUser ? 'text-blue-900' : 'text-gray-900'
              }`}>
                {student.name}
                {student.isCurrentUser && <span className="text-sm text-blue-600 ml-1">(我)</span>}
              </h3>
              <div className="text-2xl font-bold text-gray-900 mb-2">{student.totalScore}</div>
              <div className="text-sm text-gray-500 mb-3">总分</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="font-medium text-gray-900">{student.courseProgress}%</div>
                  <div className="text-gray-500">课程</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{student.experimentProgress}%</div>
                  <div className="text-gray-500">实验</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 完整排行榜 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">完整排行榜</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">排名</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">学生</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">总分</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">课程进度</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">实验进度</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">学习时长</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">平均分</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">最后活跃</th>
                </tr>
              </thead>
              <tbody>
                {sortedRanking.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`border-b border-gray-100 ${
                      student.isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          index < 3 ? getRankColor(index + 1) : 'text-gray-500'
                        }`}>
                          {index < 3 ? getRankIcon(index + 1) : index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">{student.avatar}</span>
                        </div>
                        <div>
                          <div className={`font-medium ${
                            student.isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {student.name}
                            {student.isCurrentUser && (
                              <span className="ml-1 text-xs text-blue-600">(我)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold text-lg ${
                        student.isCurrentUser ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {student.totalScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${student.courseProgress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{student.courseProgress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${student.experimentProgress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{student.experimentProgress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium">{student.studyHours}h</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium">{student.averageScore}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-gray-500">{student.lastActiveTime}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClassRankingPage;
