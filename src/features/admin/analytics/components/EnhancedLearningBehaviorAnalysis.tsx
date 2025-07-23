/**
 * 增强版学习行为分析组件
 * 
 * 美化的挂科风险模型和教师评估看板，增加更多图表展示
 */

import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, PieChart, DonutChart, RadarChart } from '../../../../components/charts/ChartComponents';

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
    homeworkMissing: number;
    videoProgress: number;
    loginFrequency: number;
    teacherMark: number;
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
  satisfaction: number;
  resourceUsage: number;
  interactionRate: number;
  overallScore: number;
}

const EnhancedLearningBehaviorAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [riskStudents, setRiskStudents] = useState<RiskStudent[]>([]);
  const [teacherEvaluations, setTeacherEvaluations] = useState<TeacherEvaluation[]>([]);

  // 模拟数据
  const mockRiskData = {
    riskDistribution: [
      { label: '低风险', value: 45, color: '#10B981' },
      { label: '中风险', value: 25, color: '#F59E0B' },
      { label: '高风险', value: 18, color: '#EF4444' },
      { label: '极高风险', value: 12, color: '#DC2626' }
    ],
    riskTrend: [
      { label: '1月', value: 15 },
      { label: '2月', value: 18 },
      { label: '3月', value: 12 },
      { label: '4月', value: 20 },
      { label: '5月', value: 16 }
    ],
    riskFactors: [
      { label: '作业未提交', value: 85 },
      { label: '视频观看进度', value: 72 },
      { label: '登录频率', value: 68 },
      { label: '教师标记', value: 45 },
      { label: '互动参与', value: 58 }
    ],
    departmentRisk: [
      { label: '电子信息', value: 15, color: '#3B82F6' },
      { label: '计算机', value: 12, color: '#10B981' },
      { label: '自动化', value: 8, color: '#F59E0B' },
      { label: '通信工程', value: 6, color: '#EF4444' }
    ]
  };

  const mockTeacherData = {
    satisfactionTrend: [
      { label: '1月', value: 4.2 },
      { label: '2月', value: 4.3 },
      { label: '3月', value: 4.5 },
      { label: '4月', value: 4.4 },
      { label: '5月', value: 4.6 }
    ],
    performanceDistribution: [
      { label: '优秀', value: 12, color: '#10B981' },
      { label: '良好', value: 18, color: '#3B82F6' },
      { label: '一般', value: 8, color: '#F59E0B' },
      { label: '需改进', value: 3, color: '#EF4444' }
    ],
    teachingMetrics: [
      { label: '教学质量', value: 88 },
      { label: '学生满意度', value: 85 },
      { label: '资源利用率', value: 78 },
      { label: '互动参与度', value: 82 },
      { label: '创新程度', value: 75 }
    ]
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
    };
    loadData();
  }, [selectedDepartment]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">加载学习行为分析数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 挂科风险分析 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 标题区域 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">挂科风险分析</h2>
                <p className="text-gray-600 mt-1">基于多维度数据的学生挂科风险预测模型</p>
              </div>
            </div>
            
            {/* 院系筛选 */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全部院系</option>
              <option value="electronic">电子信息</option>
              <option value="computer">计算机</option>
              <option value="automation">自动化</option>
              <option value="communication">通信工程</option>
            </select>
          </div>
        </div>

        {/* 风险统计图表 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* 风险分布饼图 */}
            <div className="lg:col-span-1">
              <PieChart 
                data={mockRiskData.riskDistribution}
                title="风险等级分布"
                size={200}
              />
            </div>

            {/* 风险趋势图 */}
            <div className="lg:col-span-1">
              <LineChart 
                data={mockRiskData.riskTrend}
                title="高风险学生趋势"
                color="#EF4444"
                height={200}
              />
            </div>

            {/* 风险因子雷达图 */}
            <div className="lg:col-span-1">
              <RadarChart 
                data={mockRiskData.riskFactors}
                title="风险因子分析"
                size={200}
                maxValue={100}
              />
            </div>

            {/* 院系风险分布 */}
            <div className="lg:col-span-1">
              <BarChart 
                data={mockRiskData.departmentRisk}
                title="院系风险分布"
                height={200}
              />
            </div>
          </div>

          {/* 风险学生列表 */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">高风险学生列表</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: '张三', id: '2021001', risk: 85, level: 'critical', department: '电子信息' },
                { name: '李四', id: '2021002', risk: 78, level: 'high', department: '计算机' },
                { name: '王五', id: '2021003', risk: 72, level: 'high', department: '自动化' },
                { name: '赵六', id: '2021004', risk: 68, level: 'medium', department: '通信工程' },
                { name: '钱七', id: '2021005', risk: 65, level: 'medium', department: '电子信息' },
                { name: '孙八', id: '2021006', risk: 62, level: 'medium', department: '计算机' }
              ].map((student, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.level === 'critical' ? 'bg-red-100 text-red-700' :
                      student.level === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {student.risk}分
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">学号: {student.id}</div>
                  <div className="text-sm text-gray-600">{student.department}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 教师评估看板 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 标题区域 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">教师评估看板</h2>
              <p className="text-gray-600 mt-1">基于多维度数据的教师教学效果评估</p>
            </div>
          </div>
        </div>

        {/* 教师评估图表 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 满意度趋势 */}
            <div>
              <LineChart 
                data={mockTeacherData.satisfactionTrend}
                title="教师满意度趋势"
                color="#10B981"
                height={200}
              />
            </div>

            {/* 绩效分布 */}
            <div>
              <DonutChart 
                data={mockTeacherData.performanceDistribution}
                title="教师绩效分布"
                size={200}
                centerText="41"
              />
            </div>

            {/* 教学指标雷达图 */}
            <div>
              <RadarChart 
                data={mockTeacherData.teachingMetrics}
                title="教学综合指标"
                size={200}
                maxValue={100}
              />
            </div>
          </div>

          {/* 优秀教师榜单 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">优秀教师榜单</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: '李教授', department: '电子信息', score: 95, courses: 3, students: 120 },
                { name: '王老师', department: '计算机', score: 92, courses: 2, students: 85 },
                { name: '张副教授', department: '自动化', score: 90, courses: 4, students: 150 },
                { name: '刘老师', department: '通信工程', score: 88, courses: 2, students: 95 },
                { name: '陈教授', department: '电子信息', score: 87, courses: 3, students: 110 },
                { name: '赵老师', department: '计算机', score: 85, courses: 2, students: 75 }
              ].map((teacher, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{teacher.name}</div>
                    <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {teacher.score}分
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{teacher.department}</div>
                  <div className="text-xs text-gray-500">
                    {teacher.courses}门课程 · {teacher.students}名学生
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLearningBehaviorAnalysis;
