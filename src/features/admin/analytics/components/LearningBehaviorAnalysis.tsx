/**
 * 学习行为分析组件
 * 
 * 包含挂科风险模型和教师评估看板
 */

import React, { useState, useEffect } from 'react';

// 挂科风险学生接口
interface RiskStudent {
  id: string;
  name: string;
  studentId: string;
  department: string;
  class: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    homeworkMissing: number;    // 作业未提交次数
    videoProgress: number;      // 视频观看进度
    loginFrequency: number;     // 登录频率
    teacherMark: number;        // 教师标记
  };
  lastActivity: string;
  courses: string[];
}

// 教师评估数据接口
interface TeacherEvaluation {
  teacherId: string;
  teacherName: string;
  department: string;
  courses: string[];
  satisfaction: number;        // 学生满意度
  resourceUsage: number;       // 资源使用率
  interactionRate: number;     // 互动率
  overallScore: number;        // 综合评分
}

const LearningBehaviorAnalysis: React.FC = () => {
  const [riskStudents, setRiskStudents] = useState<RiskStudent[]>([]);
  const [teacherEvaluations, setTeacherEvaluations] = useState<TeacherEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  // 模拟挂科风险学生数据
  const mockRiskStudents: RiskStudent[] = [
    {
      id: '1',
      name: '张三',
      studentId: '20231101',
      department: '计算机学院',
      class: '计算机2023-1班',
      riskScore: 85,
      riskLevel: 'critical',
      factors: {
        homeworkMissing: 8,
        videoProgress: 25,
        loginFrequency: 2,
        teacherMark: 3
      },
      lastActivity: '2024-01-10 09:30:00',
      courses: ['STM32嵌入式开发', 'ARM架构编程']
    },
    {
      id: '2',
      name: '李四',
      studentId: '20231102',
      department: '计算机学院',
      class: '计算机2023-1班',
      riskScore: 72,
      riskLevel: 'high',
      factors: {
        homeworkMissing: 5,
        videoProgress: 45,
        loginFrequency: 8,
        teacherMark: 2
      },
      lastActivity: '2024-01-12 14:20:00',
      courses: ['STM32嵌入式开发']
    },
    {
      id: '3',
      name: '王五',
      studentId: '20231103',
      department: '电子工程学院',
      class: '电子2023-1班',
      riskScore: 68,
      riskLevel: 'medium',
      factors: {
        homeworkMissing: 3,
        videoProgress: 60,
        loginFrequency: 12,
        teacherMark: 1
      },
      lastActivity: '2024-01-13 16:45:00',
      courses: ['数字电路设计']
    }
  ];

  // 模拟教师评估数据
  const mockTeacherEvaluations: TeacherEvaluation[] = [
    {
      teacherId: 'T001',
      teacherName: '刘教授',
      department: '计算机学院',
      courses: ['STM32嵌入式开发基础', 'ARM架构与编程'],
      satisfaction: 4.8,
      resourceUsage: 0.85,
      interactionRate: 0.72,
      overallScore: 4.6
    },
    {
      teacherId: 'T002',
      teacherName: '陈老师',
      department: '计算机学院',
      courses: ['C语言程序设计'],
      satisfaction: 4.2,
      resourceUsage: 0.68,
      interactionRate: 0.45,
      overallScore: 4.1
    },
    {
      teacherId: 'T003',
      teacherName: '张老师',
      department: '电子工程学院',
      courses: ['数字电路设计', '模拟电路分析'],
      satisfaction: 4.5,
      resourceUsage: 0.78,
      interactionRate: 0.63,
      overallScore: 4.4
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRiskStudents(mockRiskStudents);
      setTeacherEvaluations(mockTeacherEvaluations);
      setLoading(false);
    };

    loadData();
  }, []);

  // 计算风险分数
  const calculateRiskScore = (factors: RiskStudent['factors']): number => {
    const weights = {
      homeworkMissing: 0.4,
      videoProgress: 0.3,
      loginFrequency: 0.2,
      teacherMark: 0.1
    };

    // 标准化各项指标（0-100分）
    const normalizedHomework = Math.min(factors.homeworkMissing * 10, 100);
    const normalizedVideo = 100 - factors.videoProgress;
    const normalizedLogin = Math.max(0, 100 - factors.loginFrequency * 5);
    const normalizedTeacher = factors.teacherMark * 25;

    return Math.round(
      normalizedHomework * weights.homeworkMissing +
      normalizedVideo * weights.videoProgress +
      normalizedLogin * weights.loginFrequency +
      normalizedTeacher * weights.teacherMark
    );
  };

  // 获取风险级别颜色
  const getRiskLevelColor = (level: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // 获取风险级别名称
  const getRiskLevelName = (level: string) => {
    const names = {
      low: '低风险',
      medium: '中风险',
      high: '高风险',
      critical: '极高风险'
    };
    return names[level as keyof typeof names] || level;
  };

  // 过滤风险学生
  const filteredRiskStudents = riskStudents.filter(student => {
    const matchesDepartment = selectedDepartment === 'all' || student.department === selectedDepartment;
    const matchesRisk = riskFilter === 'all' || student.riskLevel === riskFilter;
    return matchesDepartment && matchesRisk;
  });

  // 过滤教师评估
  const filteredTeacherEvaluations = teacherEvaluations.filter(teacher => {
    return selectedDepartment === 'all' || teacher.department === selectedDepartment;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载学习行为分析数据...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有院系</option>
              <option value="计算机学院">计算机学院</option>
              <option value="电子工程学院">电子工程学院</option>
              <option value="机械工程学院">机械工程学院</option>
            </select>
            
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有风险级别</option>
              <option value="critical">极高风险</option>
              <option value="high">高风险</option>
              <option value="medium">中风险</option>
              <option value="low">低风险</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            风险学生: {filteredRiskStudents.length} 人 | 教师评估: {filteredTeacherEvaluations.length} 人
          </div>
        </div>
      </div>

      {/* 挂科风险模型 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">挂科风险模型</h2>
              <p className="text-gray-600 mt-1">
                基于作业提交、视频观看、登录频率和教师标记的综合风险评估
              </p>
            </div>
            <div className="text-sm text-gray-500">
              预警阈值: 风险分 ≥ 70
            </div>
          </div>
        </div>

        {/* 风险统计 */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { level: 'critical', count: riskStudents.filter(s => s.riskLevel === 'critical').length, color: 'text-red-600', bg: 'bg-red-50' },
              { level: 'high', count: riskStudents.filter(s => s.riskLevel === 'high').length, color: 'text-orange-600', bg: 'bg-orange-50' },
              { level: 'medium', count: riskStudents.filter(s => s.riskLevel === 'medium').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { level: 'low', count: riskStudents.filter(s => s.riskLevel === 'low').length, color: 'text-green-600', bg: 'bg-green-50' }
            ].map(stat => (
              <div key={stat.level} className={`${stat.bg} rounded-lg p-4`}>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
                <div className="text-sm text-gray-600">{getRiskLevelName(stat.level)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 风险学生列表 */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredRiskStudents.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">当前筛选条件下没有风险学生</p>
              </div>
            ) : (
              filteredRiskStudents.map(student => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <span className="text-sm text-gray-500">({student.studentId})</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(student.riskLevel)}`}>
                          {getRiskLevelName(student.riskLevel)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        {student.department} • {student.class}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">作业未提交:</span>
                          <span className="ml-1 font-medium text-red-600">{student.factors.homeworkMissing}次</span>
                        </div>
                        <div>
                          <span className="text-gray-500">视频进度:</span>
                          <span className="ml-1 font-medium">{student.factors.videoProgress}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">登录频率:</span>
                          <span className="ml-1 font-medium">{student.factors.loginFrequency}次/周</span>
                        </div>
                        <div>
                          <span className="text-gray-500">教师标记:</span>
                          <span className="ml-1 font-medium">{student.factors.teacherMark}次</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{student.riskScore}</div>
                      <div className="text-sm text-gray-500">风险分</div>
                      {student.riskScore >= 70 && (
                        <div className="mt-2">
                          <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                            通知辅导员
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 教师评估看板 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">教师评估看板</h2>
              <p className="text-gray-600 mt-1">
                基于学生满意度、资源使用率和互动率的综合教师评估
              </p>
            </div>
            <div className="text-sm text-gray-500">
              评估维度: 满意度 + 资源使用率 + 互动率
            </div>
          </div>
        </div>

        {/* 评估统计 */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">平均满意度</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {(filteredTeacherEvaluations.reduce((sum, t) => sum + t.satisfaction, 0) / filteredTeacherEvaluations.length || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">平均资源使用率</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {((filteredTeacherEvaluations.reduce((sum, t) => sum + t.resourceUsage, 0) / filteredTeacherEvaluations.length || 0) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">平均互动率</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {((filteredTeacherEvaluations.reduce((sum, t) => sum + t.interactionRate, 0) / filteredTeacherEvaluations.length || 0) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 教师评估列表 */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredTeacherEvaluations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">当前筛选条件下没有教师评估数据</p>
              </div>
            ) : (
              filteredTeacherEvaluations.map(teacher => (
                <div key={teacher.teacherId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{teacher.teacherName}</h3>
                        <span className="text-sm text-gray-500">({teacher.teacherId})</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          teacher.overallScore >= 4.5 ? 'bg-green-100 text-green-800' :
                          teacher.overallScore >= 4.0 ? 'bg-blue-100 text-blue-800' :
                          teacher.overallScore >= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {teacher.overallScore >= 4.5 ? '优秀' :
                           teacher.overallScore >= 4.0 ? '良好' :
                           teacher.overallScore >= 3.5 ? '一般' : '待改进'}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {teacher.department} • 授课: {teacher.courses.join(', ')}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">学生满意度</span>
                            <span className="font-medium">{teacher.satisfaction.toFixed(1)}/5.0</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(teacher.satisfaction / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">资源使用率</span>
                            <span className="font-medium">{(teacher.resourceUsage * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${teacher.resourceUsage * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">互动率</span>
                            <span className="font-medium">{(teacher.interactionRate * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${teacher.interactionRate * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-blue-600">{teacher.overallScore.toFixed(1)}</div>
                      <div className="text-sm text-gray-500">综合评分</div>
                      <div className="mt-2">
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningBehaviorAnalysis;
