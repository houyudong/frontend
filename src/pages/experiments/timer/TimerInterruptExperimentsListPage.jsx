import { useState } from 'react';
import { Link } from 'react-router-dom';

// 模拟定时中断实验数据
const experimentsData = [
  {
    id: 'basic-timer-interrupt',
    title: '基础定时器中断',
    description: '学习配置STM32H7的基本定时器，使用中断机制实现精确定时控制，掌握中断优先级设置和中断处理程序编写。',
    difficulty: 'beginner',
    tags: ['定时器', '中断', 'TIM6', 'TIM7'],
    thumbnail: '/images/experiments/basic-timer.jpg',
    updatedAt: '2024-01-12',
  },
  {
    id: 'pwm-generation',
    title: 'PWM信号生成',
    description: '使用STM32H7的高级定时器生成PWM信号，控制LED亮度或伺服电机，掌握PWM配置和调节技术。',
    difficulty: 'intermediate',
    tags: ['PWM', '定时器', 'TIM1', 'TIM8'],
    thumbnail: '/images/experiments/pwm-generation.jpg',
    updatedAt: '2024-01-18',
  },
  {
    id: 'input-capture',
    title: '输入捕获测量',
    description: '使用定时器的输入捕获功能测量外部信号的频率和脉宽，学习捕获模式、滤波和预分频配置。',
    difficulty: 'intermediate',
    tags: ['输入捕获', '定时器', '频率测量'],
    thumbnail: '/images/experiments/input-capture.jpg',
    updatedAt: '2024-01-27',
  },
  {
    id: 'timer-sync',
    title: '定时器同步',
    description: '学习配置多个定时器同步工作，实现复杂的定时序列或精确的多路PWM控制，适用于高级应用场景。',
    difficulty: 'advanced',
    tags: ['定时器', '同步', '主从模式'],
    thumbnail: '/images/experiments/timer-sync.jpg',
    updatedAt: '2024-02-08',
  },
  {
    id: 'rtc-alarm',
    title: 'RTC实时时钟与闹钟',
    description: '使用STM32H7的RTC模块实现实时时钟功能，设置闹钟中断，掌握低功耗模式下的时间保持。',
    difficulty: 'advanced',
    tags: ['RTC', '闹钟', '低功耗', 'NVIC'],
    thumbnail: '/images/experiments/rtc-alarm.jpg',
    updatedAt: '2024-02-20',
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
          <Link
            to={`/timer/experiments/${experiment.id}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-800"
          >
            开始实验
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function TimerInterruptExperimentsListPage() {
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
        <h1 className="text-3xl font-bold mb-4">定时中断实验</h1>
        <p className="text-lg text-gray-600">
          通过这些实验学习STM32系列的定时器中断编程，从基础定时器使用到高级PWM控制和输入捕获。
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
        <h2 className="text-2xl font-bold mb-6">如何开始定时中断实验</h2>
        <div className="space-y-6">
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">理解定时器基础</h3>
              <p className="text-gray-600">学习STM32系列定时器的结构和工作原理，包括预分频器、计数器、自动重载寄存器等核心概念。</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">准备硬件连接</h3>
              <p className="text-gray-600">根据实验需求连接LED、输入信号源或其他外设到开发板的相应引脚。</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">配置NVIC中断系统</h3>
              <p className="text-gray-600">学习配置嵌套向量中断控制器(NVIC)，包括中断优先级和分组配置。</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">编程与调试</h3>
              <p className="text-gray-600">实现定时器初始化、中断服务程序，并使用串口工具或逻辑分析仪验证定时器功能。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimerInterruptExperimentsListPage;

 