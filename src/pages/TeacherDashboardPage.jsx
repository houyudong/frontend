import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStudents, getStudentActivities, logout } from '../services/index';

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentActivities, setStudentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 加载学生列表
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await getAllStudents();
        setStudents(data);
        setLoading(false);
      } catch (err) {
        console.error('获取学生列表失败:', err);
        setError(err.message || '获取学生列表失败');
        setLoading(false);

        // 如果是权限错误，可能是教师未登录，重定向到登录页面
        if (err.message.includes('权限') || err.message.includes('登录')) {
          logout();
        }
      }
    };

    fetchStudents();
  }, [navigate]);

  // 当选择学生时加载其活动记录
  useEffect(() => {
    if (!selectedStudent) {
      setStudentActivities([]);
      return;
    }

    const fetchStudentActivities = async () => {
      try {
        setLoading(true);
        const data = await getStudentActivities(selectedStudent.id);
        setStudentActivities(data.activities || []);
        setLoading(false);
      } catch (err) {
        console.error(`获取学生 ${selectedStudent.id} 的活动记录失败:`, err);
        setError(err.message || '获取学生活动记录失败');
        setLoading(false);
      }
    };

    fetchStudentActivities();
  }, [selectedStudent]);

  // 处理学生选择
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  // 处理退出登录
  const handleLogout = () => {
    logout();
  };

  // 活动类型映射
  const activityTypeMap = {
    'login': '登录',
    'code_generator': '代码生成',
    'experiment': '实验操作',
    'serial': '串口调试',
    'debug': '错误调试'
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <nav className="bg-primary-600 py-4 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">STM32H7 教师管理平台</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-primary-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            退出登录
          </button>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* 面板标题 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">学生活动监控</h2>
            <p className="text-gray-600 mt-1">查看学生的操作记录和学习进度</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* 内容区域 */}
          <div className="flex flex-col md:flex-row">
            {/* 左侧学生列表 */}
            <div className="w-full md:w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">学生列表</h3>
              </div>

              {loading && !students.length ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-600">加载中...</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-screen overflow-y-auto">
                  {students.map((student) => (
                    <li key={student.id}>
                      <button
                        onClick={() => handleStudentSelect(student)}
                        className={`w-full text-left px-6 py-4 transition-colors hover:bg-gray-50 ${
                          selectedStudent?.id === student.id ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="font-medium text-gray-800">{student.name || '未命名学生'}</div>
                        <div className="text-sm text-gray-500">学号: {student.id}</div>
                      </button>
                    </li>
                  ))}

                  {!students.length && !loading && (
                    <li className="px-6 py-8 text-center text-gray-500">
                      无学生记录
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* 右侧活动记录 */}
            <div className="w-full md:w-2/3">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">
                  {selectedStudent
                    ? `${selectedStudent.name || '学生'} (${selectedStudent.id}) 的活动记录`
                    : '请选择一名学生查看活动'}
                </h3>
              </div>

              {loading && selectedStudent ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-600">加载活动记录中...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {selectedStudent ? (
                    studentActivities.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              时间
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              活动类型
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              详情
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {studentActivities.map((activity) => (
                            <tr key={activity.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {formatDate(activity.timestamp)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {activityTypeMap[activity.activity_type] || activity.activity_type}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                                {activity.activity_data || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        该学生暂无活动记录
                      </div>
                    )
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      请从左侧选择一名学生查看活动记录
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;