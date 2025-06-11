import { useState } from 'react';
import { Link } from 'react-router-dom';

// 模拟GPIO实验数据
const experimentsData = [
  {
    id: 'led-blinking',
    title: 'LED闪烁控制',
    description: '学习配置基本GPIO输出模式，调整LED闪烁频率，掌握STM32嵌入式 GPIO编程的基础。',
    difficulty: 'beginner',
    tags: ['GPIO', 'LED', '输出模式'],
    thumbnail: '/images/experiments/led-blinking.jpg',
    updatedAt: '2024-01-10',
  },
  {
    id: 'button-led',
    title: '按钮控制LED',
    description: '学习配置基本GPIO输入模式，使用按钮控制LED的点亮和熄灭，掌握输入检测和防抖技术。',
    difficulty: 'beginner',
    tags: ['GPIO', '按钮', '输入模式', '防抖'],
    thumbnail: '/images/experiments/button-led.jpg',
    updatedAt: '2024-01-15',
  },
  {
    id: 'multi-led-control',
    title: '多LED控制',
    description: '使用STM32嵌入式控制多个LED，实现流水灯、交替闪烁等效果，掌握GPIO编程技能。',
    difficulty: 'intermediate',
    tags: ['GPIO', 'LED阵列', '流水灯'],
    thumbnail: '/images/experiments/multi-led.jpg',
    updatedAt: '2024-01-25',
  },
  {
    id: 'external-interrupt',
    title: '外部中断',
    description: '学习配置GPIO外部中断，使用按钮触发中断事件，掌握中断处理机制和优先级管理。',
    difficulty: 'intermediate',
    tags: ['GPIO', '中断', 'EXTI', '优先级'],
    thumbnail: '/images/experiments/external-interrupt.jpg',
    updatedAt: '2024-02-05',
  },
  {
    id: 'keypad-interfacing',
    title: '矩阵键盘接口',
    description: '使用STM32嵌入式的GPIO接口连接4x4矩阵键盘，学习键盘扫描和按键识别技术。',
    difficulty: 'advanced',
    tags: ['GPIO', '矩阵键盘', '扫描技术'],
    thumbnail: '/images/experiments/keypad.jpg',
    updatedAt: '2024-02-20',
  },
  {
    id: 'lcd-interface',
    title: 'LCD显示器接口',
    description: '通过GPIO并行接口控制字符LCD显示器，学习显示文本和创建自定义字符。',
    difficulty: 'advanced',
    tags: ['GPIO', 'LCD', '并行接口'],
    thumbnail: '/images/experiments/lcd-interface.jpg',
    updatedAt: '2024-03-05',
  },
];

// 实验卡片组件
function ExperimentCard({ experiment }) {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // 根据难度返回不同的颜色和标签文本
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return { color: 'bg-green-100 text-green-800', text: '初学者' };
      case 'intermediate':
        return { color: 'bg-blue-100 text-blue-800', text: '中级' };
      case 'advanced':
        return { color: 'bg-purple-100 text-purple-800', text: '高级' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: '未知' };
    }
  };
  
  const badge = getDifficultyBadge(experiment.difficulty);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200">
        {!imageError ? (
          <img 
            src={experiment.thumbnail} 
            alt={experiment.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{experiment.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
            {badge.text}
          </span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{experiment.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {experiment.tags.map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">更新: {experiment.updatedAt}</span>
          {experiment.id === 'keypad-interfacing' ? (
            <Link
              to="/gpio/experiments/keypad-interfacing"
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              开始实验
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          ) : experiment.id === 'lcd-interface' ? (
            <Link
              to="/gpio/experiments/lcd-interface"
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              开始实验
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          ) : experiment.id === 'button-led' ? (
            <Link
              to="/gpio/experiments/button-led"
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              开始实验
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          ) : experiment.id === 'multi-led-control' ? (
            <Link
              to="/gpio/experiments/multi-led-control"
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              开始实验
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          ) : experiment.id === 'external-interrupt' ? (
            <Link
              to="/gpio/experiments/external-interrupt"
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              开始实验
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          ) : (
            <Link
              to={`/gpio/experiments/${experiment.id}`}
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              开始实验
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function GpioExperimentsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  
  // 过滤实验
  const filteredExperiments = experimentsData.filter(experiment => {
    const matchesSearch = experiment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        experiment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        experiment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || experiment.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });
  
  return (
    <div className="py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">GPIO实验</h1>
        <p className="text-lg text-gray-600">
          通过这些实验学习STM32嵌入式的GPIO编程，从基础的LED控制到复杂的外部中断和接口应用。
          <Link to="/experiments" className="text-primary-600 hover:underline ml-2">
            返回全部实验
          </Link>
        </p>
      </div>
      
      {/* 搜索和过滤 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">搜索实验</label>
            <input
              type="text"
              id="search"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="输入关键词搜索实验..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-48">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">难度等级</label>
            <select
              id="difficulty"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value)}
            >
              <option value="all">所有级别</option>
              <option value="beginner">初学者</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 实验列表 */}
      {filteredExperiments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperiments.map(experiment => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-semibold mb-2">未找到匹配的实验</h3>
          <p className="text-gray-600">
            请尝试使用不同的搜索词或筛选条件，或者
            <button 
              className="text-primary-600 hover:underline ml-1"
              onClick={() => {
                setSearchTerm('');
                setDifficultyFilter('all');
              }}
            >
              查看所有实验
            </button>
          </p>
        </div>
      )}
      
      {/* 实验指南 */}
      <div className="mt-16 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">如何开始GPIO实验</h2>
        <div className="space-y-6">
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">准备硬件</h3>
              <p className="text-gray-600">确保你有STM32嵌入式开发板、LED、按钮、连线和其他所需的硬件。</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">查看实验指南</h3>
              <p className="text-gray-600">详细阅读每个实验的步骤说明和电路连接图，确保理解实验目标。</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">编程和测试</h3>
              <p className="text-gray-600">将生成的代码复制到你的STM32CubeIDE项目中，编译并下载到开发板。</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">验证和调试</h3>
              <p className="text-gray-600">使用平台提供的模拟器或实际硬件来验证实验结果，确保实验成功。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GpioExperimentsListPage; 