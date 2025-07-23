/**
 * 课程排表页面
 * 
 * 提供课程时间表的管理功能
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import ScheduleGrid from '../components/ScheduleGrid';
import AddScheduleModal from '../components/AddScheduleModal';
import { CourseSchedule, TimeSlot, Classroom, ClassInfo } from '../types/Course';

const CourseSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'week' | 'semester'>('week');

  // 模拟时间段数据
  const mockTimeSlots: TimeSlot[] = [
    { id: '1', name: '第1节', startTime: '08:00', endTime: '08:45', order: 1 },
    { id: '2', name: '第2节', startTime: '08:55', endTime: '09:40', order: 2 },
    { id: '3', name: '第3节', startTime: '10:00', endTime: '10:45', order: 3 },
    { id: '4', name: '第4节', startTime: '10:55', endTime: '11:40', order: 4 },
    { id: '5', name: '第5节', startTime: '14:00', endTime: '14:45', order: 5 },
    { id: '6', name: '第6节', startTime: '14:55', endTime: '15:40', order: 6 },
    { id: '7', name: '第7节', startTime: '16:00', endTime: '16:45', order: 7 },
    { id: '8', name: '第8节', startTime: '16:55', endTime: '17:40', order: 8 },
    { id: '9', name: '第9节', startTime: '19:00', endTime: '19:45', order: 9 },
    { id: '10', name: '第10节', startTime: '19:55', endTime: '20:40', order: 10 }
  ];

  // 模拟教室数据
  const mockClassrooms: Classroom[] = [
    {
      id: 'room_001',
      name: 'A101',
      building: 'A栋',
      floor: 1,
      capacity: 60,
      equipment: ['投影仪', '音响', '空调'],
      type: 'lecture',
      status: 'available'
    },
    {
      id: 'room_002',
      name: 'A102',
      building: 'A栋',
      floor: 1,
      capacity: 80,
      equipment: ['投影仪', '音响', '空调', '录播设备'],
      type: 'lecture',
      status: 'available'
    },
    {
      id: 'room_003',
      name: 'B201',
      building: 'B栋',
      floor: 2,
      capacity: 40,
      equipment: ['电脑', '投影仪', '实验设备'],
      type: 'lab',
      status: 'available'
    }
  ];

  // 模拟班级数据
  const mockClasses: ClassInfo[] = [
    {
      id: 'class_001',
      name: '计算机2023-1班',
      department: '计算机学院',
      grade: '2023',
      studentCount: 45,
      major: '计算机科学与技术'
    },
    {
      id: 'class_002',
      name: '计算机2023-2班',
      department: '计算机学院',
      grade: '2023',
      studentCount: 42,
      major: '计算机科学与技术'
    },
    {
      id: 'class_003',
      name: '电子2023-1班',
      department: '电子工程学院',
      grade: '2023',
      studentCount: 38,
      major: '电子工程'
    }
  ];

  // 模拟课程表数据
  const mockSchedules: CourseSchedule[] = [
    {
      id: 'schedule_001',
      courseId: 'course_001',
      courseName: 'STM32嵌入式开发基础',
      classId: 'class_001',
      className: '计算机2023-1班',
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      dayOfWeek: 1, // 周一
      startTime: '08:00',
      endTime: '09:40',
      classroom: 'A101',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      semester: '2024春',
      academicYear: '2023-2024',
      status: 'active',
      notes: '理论课'
    },
    {
      id: 'schedule_002',
      courseId: 'course_001',
      courseName: 'STM32嵌入式开发基础',
      classId: 'class_001',
      className: '计算机2023-1班',
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      dayOfWeek: 3, // 周三
      startTime: '14:00',
      endTime: '15:40',
      classroom: 'B201',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      semester: '2024春',
      academicYear: '2023-2024',
      status: 'active',
      notes: '实验课'
    },
    {
      id: 'schedule_003',
      courseId: 'course_003',
      courseName: 'C语言程序设计',
      classId: 'class_002',
      className: '计算机2023-2班',
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      dayOfWeek: 2, // 周二
      startTime: '10:00',
      endTime: '11:40',
      classroom: 'A102',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      semester: '2024春',
      academicYear: '2023-2024',
      status: 'active'
    },
    {
      id: 'schedule_004',
      courseId: 'course_003',
      courseName: 'C语言程序设计',
      classId: 'class_002',
      className: '计算机2023-2班',
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      dayOfWeek: 4, // 周四
      startTime: '14:00',
      endTime: '15:40',
      classroom: 'B201',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      semester: '2024春',
      academicYear: '2023-2024',
      status: 'active',
      notes: '上机实践'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSchedules(mockSchedules);
        setTimeSlots(mockTimeSlots);
        setClassrooms(mockClassrooms);
        setClasses(mockClasses);
      } catch (error) {
        console.error('加载课程表数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 添加课程安排
  const handleAddSchedule = async (scheduleData: any) => {
    try {
      const newSchedule: CourseSchedule = {
        id: `schedule_${Date.now()}`,
        ...scheduleData,
        teacherId: 'teacher_001',
        teacherName: '刘教授',
        semester: '2024春',
        academicYear: '2023-2024',
        status: 'active' as const
      };
      
      setSchedules(prev => [...prev, newSchedule]);
      setShowAddModal(false);
    } catch (error) {
      console.error('添加课程安排失败:', error);
    }
  };

  // 删除课程安排
  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('确定要删除这个课程安排吗？')) {
      return;
    }

    try {
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
    } catch (error) {
      console.error('删除课程安排失败:', error);
    }
  };

  // 编辑课程安排
  const handleEditSchedule = async (scheduleId: string, scheduleData: any) => {
    try {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, ...scheduleData }
          : schedule
      ));
    } catch (error) {
      console.error('编辑课程安排失败:', error);
    }
  };

  // 过滤当前周的课程安排
  const filteredSchedules = schedules.filter(schedule => {
    if (viewMode === 'week') {
      return schedule.weeks.includes(selectedWeek);
    }
    return true;
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载课程表数据中...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/teacher/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                教师工作台
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link to="/teacher/courses" className="text-gray-600 hover:text-blue-600 transition-colors">
                课程管理
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">课程排表</span>
            </li>
          </ol>
        </nav>

        {/* 页面标题和操作 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">课程排表</h1>
            <p className="text-gray-600 mt-2">管理课程的时间安排和教室分配</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              添加课程安排
            </button>
            
            <Link
              to="/teacher/courses/class-assignment"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              班级课程分配
            </Link>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* 视图模式切换 */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">视图模式:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                      viewMode === 'week'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    周视图
                  </button>
                  <button
                    onClick={() => setViewMode('semester')}
                    className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                      viewMode === 'semester'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    学期视图
                  </button>
                </div>
              </div>

              {/* 周次选择 */}
              {viewMode === 'week' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">周次:</span>
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(week => (
                      <option key={week} value={week}>第{week}周</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 统计信息 */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>理论课: {schedules.filter(s => !s.notes || s.notes.includes('理论')).length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>实验课: {schedules.filter(s => s.notes && s.notes.includes('实验')).length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>上机课: {schedules.filter(s => s.notes && s.notes.includes('上机')).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 课程表网格 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <ScheduleGrid
            schedules={filteredSchedules}
            timeSlots={timeSlots}
            onEditSchedule={handleEditSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            viewMode={viewMode}
            selectedWeek={selectedWeek}
          />
        </div>

        {/* 添加课程安排模态框 */}
        {showAddModal && (
          <AddScheduleModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddSchedule}
            timeSlots={timeSlots}
            classrooms={classrooms}
            classes={classes}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CourseSchedulePage;
