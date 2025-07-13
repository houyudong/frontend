import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Experiment {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  thumbnail: string;
  updatedAt: string;
}

interface ExperimentCardProps {
  experiment: Experiment;
}

// 模拟定时器实验数据
const experimentsData: Experiment[] = [
  {
    id: 'timer-basic',
    title: '定时器基础应用',
    description: '学习配置STM32H7的定时器进行基本的定时和计数功能，包括定时中断和PWM输出。',
    difficulty: 'beginner',
    tags: ['定时器', '中断', 'PWM', '计数'],
    thumbnail: '/images/experiments/timer-basic.jpg',
    updatedAt: '2024-01-15',
  },
  {
    id: 'timer-pwm',
    title: 'PWM波形生成',
    description: '使用定时器生成不同频率和占空比的PWM波形，控制LED亮度或电机速度。',
    difficulty: 'intermediate',
    tags: ['定时器', 'PWM', '波形生成', '电机控制'],
    thumbnail: '/images/experiments/timer-pwm.jpg',
    updatedAt: '2024-01-25',
  },
  {
    id: 'timer-input-capture',
    title: '输入捕获模式',
    description: '使用定时器的输入捕获功能测量脉冲宽度和频率，实现精确的时间测量。',
    difficulty: 'intermediate',
    tags: ['定时器', '输入捕获', '脉冲测量', '频率测量'],
    thumbnail: '/images/experiments/timer-capture.jpg',
    updatedAt: '2024-02-10',
  },
  {
    id: 'timer-encoder',
    title: '编码器接口',
    description: '配置定时器为编码器模式，读取旋转编码器的位置和速度信息。',
    difficulty: 'advanced',
    tags: ['定时器', '编码器', '位置检测', '速度测量'],
    thumbnail: '/images/experiments/timer-encoder.jpg',
    updatedAt: '2024-02-20',
  },
  {
    id: 'timer-multi',
    title: '多定时器协同',
    description: '实现多个定时器的协同工作，完成复杂的定时任务和波形生成。',
    difficulty: 'advanced',
    tags: ['定时器', '协同工作', '复杂波形', '多任务'],
    thumbnail: '/images/experiments/timer-multi.jpg',
    updatedAt: '2024-03-05',
  },
];

// 实验卡片组件
const ExperimentCard: React.FC<ExperimentCardProps> = ({ experiment }) => {
  const [imageError, setImageError] = useState<boolean>(false);
  
  const handleImageError = (): void => {
    setImageError(true);
  };
  
  // 根据难度返回不同的颜色和标签文本
  const getDifficultyBadge = (difficulty: string): { color: string; text: string } => {
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
};

const TimerExperimentsListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  
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
        <h1 className="text-3xl font-bold mb-4">定时器实验</h1>
        <p className="text-lg text-gray-600">
          通过这些实验学习STM32H7的定时器编程，从基础定时到高级编码器接口应用。
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
    </div>
  );
};

export default TimerExperimentsListPage; 