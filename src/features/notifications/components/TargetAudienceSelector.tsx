/**
 * 目标受众选择组件
 * 
 * 支持选择班级、院系、特定学生等目标受众
 */

import React, { useState, useEffect } from 'react';

interface Department {
  id: string;
  name: string;
  classes: Class[];
}

interface Class {
  id: string;
  name: string;
  departmentId: string;
  studentCount: number;
  students: Student[];
}

interface Student {
  id: string;
  name: string;
  studentId: string;
  classId: string;
  departmentId: string;
  email: string;
  avatar?: string;
}

interface TargetAudienceData {
  targetType: 'all_students' | 'departments' | 'classes' | 'specific_students';
  departmentIds?: string[];
  classIds?: string[];
  studentIds?: string[];
}

interface TargetAudienceSelectorProps {
  userRole: 'teacher' | 'admin';
  value: TargetAudienceData;
  onChange: (data: TargetAudienceData) => void;
}

const TargetAudienceSelector: React.FC<TargetAudienceSelectorProps> = ({
  userRole,
  value,
  onChange
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());

  // 模拟加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟院系、班级和学生数据
        const mockDepartments: Department[] = [
          {
            id: 'dept_001',
            name: '计算机科学与技术学院',
            classes: [
              {
                id: 'class_001',
                name: '嵌入式开发班',
                departmentId: 'dept_001',
                studentCount: 32,
                students: [
                  { id: 'stu_001', name: '张三', studentId: '2021001', classId: 'class_001', departmentId: 'dept_001', email: 'zhangsan@example.com' },
                  { id: 'stu_002', name: '李四', studentId: '2021002', classId: 'class_001', departmentId: 'dept_001', email: 'lisi@example.com' },
                  { id: 'stu_003', name: '王五', studentId: '2021003', classId: 'class_001', departmentId: 'dept_001', email: 'wangwu@example.com' }
                ]
              },
              {
                id: 'class_002',
                name: 'ARM架构班',
                departmentId: 'dept_001',
                studentCount: 28,
                students: [
                  { id: 'stu_004', name: '赵六', studentId: '2021004', classId: 'class_002', departmentId: 'dept_001', email: 'zhaoliu@example.com' },
                  { id: 'stu_005', name: '钱七', studentId: '2021005', classId: 'class_002', departmentId: 'dept_001', email: 'qianqi@example.com' }
                ]
              }
            ]
          },
          {
            id: 'dept_002',
            name: '电子信息工程学院',
            classes: [
              {
                id: 'class_003',
                name: '物联网开发班',
                departmentId: 'dept_002',
                studentCount: 30,
                students: [
                  { id: 'stu_006', name: '孙八', studentId: '2021006', classId: 'class_003', departmentId: 'dept_002', email: 'sunba@example.com' },
                  { id: 'stu_007', name: '周九', studentId: '2021007', classId: 'class_003', departmentId: 'dept_002', email: 'zhoujiu@example.com' }
                ]
              }
            ]
          }
        ];

        setDepartments(mockDepartments);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 获取目标类型选项
  const getTargetTypeOptions = () => {
    const options = [
      { value: 'classes', label: '按班级选择', description: '选择特定的班级发送通知' },
      { value: 'specific_students', label: '指定学生', description: '选择特定的学生发送通知' }
    ];

    if (userRole === 'admin') {
      options.unshift(
        { value: 'all_students', label: '所有学生', description: '发送给平台所有学生用户' },
        { value: 'departments', label: '按院系选择', description: '选择特定的院系发送通知' }
      );
    }

    return options;
  };

  // 切换院系展开状态
  const toggleDepartment = (departmentId: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  // 切换班级展开状态
  const toggleClass = (classId: string) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId);
    } else {
      newExpanded.add(classId);
    }
    setExpandedClasses(newExpanded);
  };

  // 处理院系选择
  const handleDepartmentSelect = (departmentId: string, checked: boolean) => {
    const currentIds = value.departmentIds || [];
    const newIds = checked
      ? [...currentIds, departmentId]
      : currentIds.filter(id => id !== departmentId);
    
    onChange({
      ...value,
      departmentIds: newIds.length > 0 ? newIds : undefined
    });
  };

  // 处理班级选择
  const handleClassSelect = (classId: string, checked: boolean) => {
    const currentIds = value.classIds || [];
    const newIds = checked
      ? [...currentIds, classId]
      : currentIds.filter(id => id !== classId);
    
    onChange({
      ...value,
      classIds: newIds.length > 0 ? newIds : undefined
    });
  };

  // 处理学生选择
  const handleStudentSelect = (studentId: string, checked: boolean) => {
    const currentIds = value.studentIds || [];
    const newIds = checked
      ? [...currentIds, studentId]
      : currentIds.filter(id => id !== studentId);
    
    onChange({
      ...value,
      studentIds: newIds.length > 0 ? newIds : undefined
    });
  };

  // 获取所有学生（用于搜索）
  const getAllStudents = (): Student[] => {
    return departments.flatMap(dept => 
      dept.classes.flatMap(cls => cls.students)
    );
  };

  // 筛选学生
  const getFilteredStudents = (): Student[] => {
    const allStudents = getAllStudents();
    if (!searchTerm) return allStudents;
    
    return allStudents.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 获取选中的统计信息
  const getSelectionStats = () => {
    let totalStudents = 0;
    
    if (value.targetType === 'all_students') {
      totalStudents = getAllStudents().length;
    } else if (value.targetType === 'departments' && value.departmentIds) {
      totalStudents = departments
        .filter(dept => value.departmentIds!.includes(dept.id))
        .reduce((sum, dept) => sum + dept.classes.reduce((classSum, cls) => classSum + cls.studentCount, 0), 0);
    } else if (value.targetType === 'classes' && value.classIds) {
      totalStudents = departments
        .flatMap(dept => dept.classes)
        .filter(cls => value.classIds!.includes(cls.id))
        .reduce((sum, cls) => sum + cls.studentCount, 0);
    } else if (value.targetType === 'specific_students' && value.studentIds) {
      totalStudents = value.studentIds.length;
    }

    return { totalStudents };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载数据中...</span>
      </div>
    );
  }

  const stats = getSelectionStats();

  return (
    <div className="space-y-6">
      {/* 目标类型选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          发送对象类型
        </label>
        <div className="space-y-3">
          {getTargetTypeOptions().map(option => (
            <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="targetType"
                value={option.value}
                checked={value.targetType === option.value}
                onChange={(e) => onChange({ 
                  targetType: e.target.value as any,
                  departmentIds: undefined,
                  classIds: undefined,
                  studentIds: undefined
                })}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 选择统计 */}
      {stats.totalStudents > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-800">
              已选择 {stats.totalStudents} 名学生接收通知
            </span>
          </div>
        </div>
      )}

      {/* 院系选择 */}
      {value.targetType === 'departments' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择院系
          </label>
          <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
            {departments.map(department => (
              <div key={department.id} className="border-b border-gray-100 last:border-b-0">
                <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value.departmentIds?.includes(department.id) || false}
                    onChange={(e) => handleDepartmentSelect(department.id, e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{department.name}</div>
                    <div className="text-sm text-gray-600">
                      {department.classes.length} 个班级，
                      {department.classes.reduce((sum, cls) => sum + cls.studentCount, 0)} 名学生
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 班级选择 */}
      {value.targetType === 'classes' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择班级
          </label>
          <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
            {departments.map(department => (
              <div key={department.id} className="border-b border-gray-100 last:border-b-0">
                <div
                  onClick={() => toggleDepartment(department.id)}
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-900">{department.name}</span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      expandedDepartments.has(department.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expandedDepartments.has(department.id) && (
                  <div className="bg-white">
                    {department.classes.map(cls => (
                      <label key={cls.id} className="flex items-center space-x-3 p-3 pl-6 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value.classIds?.includes(cls.id) || false}
                          onChange={(e) => handleClassSelect(cls.id, e.target.checked)}
                          className="text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{cls.name}</div>
                          <div className="text-sm text-gray-600">{cls.studentCount} 名学生</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 学生选择 */}
      {value.targetType === 'specific_students' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择学生
          </label>

          {/* 学生搜索 */}
          <div className="mb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索学生姓名、学号或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 学生列表 */}
          <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
            {departments.map(department => (
              <div key={department.id} className="border-b border-gray-100 last:border-b-0">
                <div
                  onClick={() => toggleDepartment(department.id)}
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-900">{department.name}</span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      expandedDepartments.has(department.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expandedDepartments.has(department.id) && (
                  <div className="bg-white">
                    {department.classes.map(cls => (
                      <div key={cls.id}>
                        <div
                          onClick={() => toggleClass(cls.id)}
                          className="flex items-center justify-between p-2 pl-6 bg-gray-25 cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm font-medium text-gray-800">{cls.name}</span>
                          <svg
                            className={`w-3 h-3 text-gray-400 transition-transform ${
                              expandedClasses.has(cls.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        {expandedClasses.has(cls.id) && (
                          <div className="bg-white">
                            {cls.students
                              .filter(student =>
                                !searchTerm ||
                                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                student.studentId.includes(searchTerm) ||
                                student.email.toLowerCase().includes(searchTerm.toLowerCase())
                              )
                              .map(student => (
                                <label key={student.id} className="flex items-center space-x-3 p-2 pl-12 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={value.studentIds?.includes(student.id) || false}
                                    onChange={(e) => handleStudentSelect(student.id, e.target.checked)}
                                    className="text-blue-600 focus:ring-blue-500 rounded"
                                  />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                    <div className="text-xs text-gray-600">
                                      学号: {student.studentId} | {student.email}
                                    </div>
                                  </div>
                                </label>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetAudienceSelector;
