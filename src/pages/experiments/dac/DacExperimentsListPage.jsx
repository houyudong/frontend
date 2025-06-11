import { useState } from 'react';
import { Link } from 'react-router-dom';

// 模拟DAC实验数据
const experimentsData = [
  {
    id: 'basic-dac-output',
    title: '基础DAC输出',
    description: '学习配置STM32H7的DAC进行基本模拟信号输出，生成固定电压和简单波形，掌握DAC的基础编程。',
    difficulty: 'beginner',
    tags: ['DAC', '模拟输出', '电压控制'],
    thumbnail: '/images/experiments/basic-dac.jpg',
    updatedAt: '2024-01-18',
  },
  {
    id: 'waveform-generation',
    title: '波形信号生成',
    description: '使用DAC生成各种波形信号，包括正弦波、三角波、锯齿波等，学习波形表和数据转换技术。',
    difficulty: 'intermediate',
    tags: ['DAC', '波形', '正弦波', '查找表'],
    thumbnail: '/images/experiments/waveform.jpg',
    updatedAt: '2024-01-28',
  },
  {
    id: 'dac-with-dma',
    title: 'DAC与DMA结合',
    description: '使用DMA控制器实现DAC数据的自动传输，实现复杂波形的连续输出，减轻CPU负担。',
    difficulty: 'intermediate',
    tags: ['DAC', 'DMA', '波形生成', '连续转换'],
    thumbnail: '/images/experiments/dac-dma.jpg',
    updatedAt: '2024-02-12',
  },
  {
    id: 'dac-trigger-timer',
    title: '定时器触发DAC',
    description: '使用定时器精确触发DAC输出，实现固定频率的信号生成，适用于音频和控制信号输出。',
    difficulty: 'advanced',
    tags: ['DAC', '定时器', '触发', '精确定时'],
    thumbnail: '/images/experiments/dac-timer.jpg',
    updatedAt: '2024-02-25',
  },
  {
    id: 'audio-playback',
    title: '音频播放实验',
    description: '利用DAC和DMA实现音频信号回放，掌握音频数据处理和播放控制技术。',
    difficulty: 'advanced',
    tags: ['DAC', '音频', 'WAV', 'DMA'],
    thumbnail: '/images/experiments/audio-dac.jpg',
    updatedAt: '2024-03-10',
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
            to={`/dac/experiments/${experiment.id}`}
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

function DacExperimentsListPage() {
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
        <h1 className="text-3xl font-bold mb-4">DAC实验</h1>
        <p className="text-lg text-gray-600">
          通过这些实验学习STM32H7的数模转换器(DAC)编程，从基础电压输出到复杂波形生成和音频播放应用。
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
}

export default DacExperimentsListPage; 