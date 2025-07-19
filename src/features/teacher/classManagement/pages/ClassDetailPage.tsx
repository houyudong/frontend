/**
 * 班级详情页面
 * 
 * 展示班级的详细信息，包括班级信息、学生列表、课程管理等功能
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import { useClassManagement } from '../hooks/useClassManagement';
import { useCourseManagement } from '../hooks/useCourseManagement';
import ClassInfoCard from '../components/detail/ClassInfoCard';
import StudentList from '../components/detail/StudentList';
import CourseManagement from '../components/detail/CourseManagement';
import Modal from '../components/common/Modal';
import type { Class, Course } from '../types';

const ClassDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'students' | 'courses'>('info');
  
  const {
    classes,
    loading: classLoading,
    error: classError,
    fetchClasses,
    updateClass
  } = useClassManagement();

  const {
    courses,
    loading: courseLoading,
    error: courseError,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse
  } = useCourseManagement();

  // 当前班级数据
  const currentClass = classes.find(c => c.id === classId);

  // 加载数据
  useEffect(() => {
    if (classId) {
      fetchClasses({ classIds: [classId] });
      fetchCourses({ classId });
    }
  }, [classId, fetchClasses, fetchCourses]);

  // 处理班级信息更新
  const handleUpdateClass = async (data: any) => {
    if (classId) {
      await updateClass(classId, data);
    }
  };

  // 处理课程操作
  const handleCreateCourse = async (data: any) => {
    if (classId) {
      await createCourse({ ...data, classId });
    }
  };

  const handleUpdateCourse = async (courseId: string, data: any) => {
    await updateCourse(courseId, data);
  };

  const handleDeleteCourse = async (courseId: string) => {
    await deleteCourse(courseId);
  };

  // 错误处理
  if (classError || courseError) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">加载失败</h3>
            <p className="text-red-600 mb-4">{classError || courseError}</p>
            <button
              onClick={() => navigate('/teacher/management/classes')}
              className="btn btn-primary"
            >
              返回班级列表
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 加载状态
  if (classLoading || !currentClass) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">加载班级信息中...</p>
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
                onClick={() => navigate('/teacher/management/classes')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                班级管理
              </button>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="text-gray-900 font-medium">{currentClass.name}</span>
            </li>
          </ol>
        </nav>

        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span>{currentClass.name}</span>
            </h1>
            <p className="page-subtitle mt-2">
              {currentClass.description || '班级详细信息管理'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/teacher/management/classes')}
              className="btn btn-secondary"
            >
              返回列表
            </button>
          </div>
        </div>

        {/* 班级概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{currentClass.studentCount}</div>
            <div className="text-sm font-medium text-gray-600">学生总数</div>
            {currentClass.maxStudents && (
              <div className="text-xs text-gray-500 mt-1">上限: {currentClass.maxStudents}</div>
            )}
          </div>
          
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{courses.length}</div>
            <div className="text-sm font-medium text-gray-600">开设课程</div>
          </div>
          
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0v-1a4 4 0 014-4h4a4 4 0 014 4v1a4 4 0 11-8 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{currentClass.academicYear}</div>
            <div className="text-sm font-medium text-gray-600">学年</div>
          </div>
          
          <div className="card card-compact text-center group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{currentClass.semester}</div>
            <div className="text-sm font-medium text-gray-600">学期</div>
          </div>
        </div>

        {/* 新班级欢迎提示 */}
        {currentClass.studentCount === 0 && courses.length === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  🎉 班级创建成功！
                </h3>
                <p className="text-blue-800 mb-4">
                  欢迎来到 <strong>{currentClass.name}</strong> 的管理页面。您现在可以：
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 text-blue-700">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                    <span>在"课程管理"中添加课程和安排课程表</span>
                  </div>
                  <div className="flex items-center space-x-3 text-blue-700">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                    <span>在"学生管理"中添加学生到班级</span>
                  </div>
                  <div className="flex items-center space-x-3 text-blue-700">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                    <span>在"班级信息"中完善班级详细信息</span>
                  </div>
                  <div className="flex items-center space-x-3 text-blue-700">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                    <span>开始您的教学管理之旅</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    添加第一门课程
                  </button>
                  <button
                    onClick={() => setActiveTab('students')}
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    添加学生
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 标签页导航 */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'info', label: '班级信息', icon: '📋' },
              { key: 'students', label: '学生管理', icon: '👥' },
              { key: 'courses', label: '课程管理', icon: '📚' }
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
          {activeTab === 'info' && (
            <ClassInfoCard
              classData={currentClass}
              onUpdate={handleUpdateClass}
              loading={classLoading}
            />
          )}

          {activeTab === 'students' && (
            <StudentList
              classId={classId!}
              className={currentClass.name}
            />
          )}

          {activeTab === 'courses' && (
            <CourseManagement
              classId={classId!}
              courses={courses}
              loading={courseLoading}
              onCreate={handleCreateCourse}
              onUpdate={handleUpdateCourse}
              onDelete={handleDeleteCourse}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ClassDetailPage;
