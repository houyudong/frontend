import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../../shared/ui/layout/MainLayout';
import { experimentsList } from '../data/realExperiments';
import { ExperimentListItem } from '../types/experimentTypes';
import { experimentApi, ExperimentListItem as ApiExperimentListItem } from '../../../../shared/api/experimentApi';

// 实验接口定义
interface Experiment {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: number; // 分钟
  completed: boolean;
  progress: number; // 0-100
  tags: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

// 模拟实验数据
const mockExperiments: Experiment[] = [
  {
    id: 'led-blink',
    title: 'LED闪烁实验',
    description: '学习如何使用STM32的GPIO控制LED灯的闪烁，掌握基本的GPIO配置和操作。',
    type: 'GPIO实验',
    difficulty: 'beginner',
    timeEstimate: 30,
    completed: true,
    progress: 100,
    tags: ['GPIO', 'LED', '基础实验'],
    isNew: false,
    isPopular: true
  },
  {
    id: 'uart-communication',
    title: '串口通信实验',
    description: '通过串口与电脑进行通信，学习串口配置和数据传输。',
    type: '串口实验',
    difficulty: 'intermediate',
    timeEstimate: 45,
    completed: false,
    progress: 60,
    tags: ['UART', '通信', '串口'],
    isNew: false,
    isPopular: true
  },
  {
    id: 'timer-interrupt',
    title: '定时器中断实验',
    description: '使用定时器产生精确的时间间隔，实现定时任务。',
    type: '定时中断',
    difficulty: 'intermediate',
    timeEstimate: 60,
    completed: false,
    progress: 0,
    tags: ['定时器', '中断', 'TIM'],
    isNew: true,
    isPopular: false
  },
  {
    id: 'adc-sampling',
    title: 'ADC采样实验',
    description: '使用ADC采集模拟信号，将模拟量转换为数字量。',
    type: 'ADC实验',
    difficulty: 'intermediate',
    timeEstimate: 90,
    completed: false,
    progress: 0,
    tags: ['ADC', '模拟量', '采样'],
    isNew: false,
    isPopular: false
  },
  {
    id: 'dac-output',
    title: 'DAC输出实验',
    description: '使用DAC输出模拟信号，生成不同波形。',
    type: 'DAC实验',
    difficulty: 'advanced',
    timeEstimate: 120,
    completed: false,
    progress: 0,
    tags: ['DAC', '模拟量', '波形生成'],
    isNew: false,
    isPopular: false
  },
  {
    id: 'dma-transfer',
    title: 'DMA传输实验',
    description: '使用DMA进行数据传输，提高传输效率。',
    type: 'DMA实验',
    difficulty: 'advanced',
    timeEstimate: 150,
    completed: false,
    progress: 0,
    tags: ['DMA', '数据传输', '效率优化'],
    isNew: false,
    isPopular: false
  },
  {
    id: 'comprehensive-application',
    title: '综合应用实验',
    description: '结合多个外设，实现一个完整的应用场景。',
    type: '综合应用',
    difficulty: 'advanced',
    timeEstimate: 180,
    completed: false,
    progress: 0,
    tags: ['综合应用', '项目实战', '系统集成'],
    isNew: true,
    isPopular: false
  }
];

// 实验卡片组件
const ExperimentCard: React.FC<{ experiment: ApiExperimentListItem }> = ({ experiment }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初级';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };

  const getTypeIcon = (type: string | undefined) => {
    if (!type) return '🔧';
    if (type.includes('GPIO') || type.includes('gpio')) return '💡';
    if (type.includes('串口') || type.includes('uart')) return '📡';
    if (type.includes('定时') || type.includes('timer')) return '⏰';
    if (type.includes('ADC') || type.includes('adc')) return '📊';
    if (type.includes('DAC') || type.includes('dac')) return '🎵';
    if (type.includes('DMA') || type.includes('dma')) return '⚡';
    if (type.includes('综合') || type.includes('sensor')) return '🎯';
    if (type.includes('LCD') || type.includes('lcd')) return '📺';
    if (type.includes('interrupt')) return '⚡';
    return '🔧';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  return (
    <Link
      to={`/student/experiments/${experiment.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* 实验图标和状态 */}
      <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-4xl">{getTypeIcon(experiment.category || experiment.name)}</span>
        
        {/* 状态标识 */}
        <div className="absolute top-2 left-2 flex space-x-1">
          {experiment.isNew && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">新</span>
          )}
          {experiment.isPopular && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">热门</span>
          )}
        </div>

        {/* 完成状态 */}
        {experiment.completed && (
          <div className="absolute top-2 right-2">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ 已完成</span>
          </div>
        )}

        {/* 进度条 */}
        {(experiment.progress || 0) > 0 && (experiment.progress || 0) < 100 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
            <div
              className="bg-yellow-400 h-1 transition-all duration-300"
              style={{ width: `${experiment.progress || 0}%` }}
            />
          </div>
        )}
      </div>

      {/* 实验信息 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(experiment.difficulty)}`}>
            {getDifficultyText(experiment.difficulty)}
          </span>
          <span className="text-xs text-gray-500">{experiment.category || '实验'}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{experiment.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{experiment.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>⏱️ {formatTime(experiment.estimatedTime)}</span>
          {(experiment.progress || 0) > 0 && (experiment.progress || 0) < 100 && (
            <span className="text-blue-600 font-medium">{experiment.progress}% 完成</span>
          )}
        </div>

        {/* 标签 */}
        <div className="mt-3 flex flex-wrap gap-1">
          {(experiment.tags || []).slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

/**
 * ExperimentsPage - 学生实验页面
 * 
 * 显示学生可进行的实验列表，支持搜索和筛选
 * 参考ref目录实现，集成STMIDE功能
 */
const ExperimentsPage: React.FC = () => {
  const [experiments, setExperiments] = useState<ApiExperimentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // 加载真实实验数据
  useEffect(() => {
    const loadExperiments = async () => {
      try {
        const data = await experimentApi.getExperimentsList();
        setExperiments(data);
      } catch (error) {
        console.error('Failed to load experiments:', error);
        // 如果API失败，使用本地数据作为fallback
        setExperiments(experimentsList as any);
      } finally {
        setLoading(false);
      }
    };

    loadExperiments();
  }, []);

  // 过滤实验
  const filteredExperiments = experiments.filter(experiment => {
    const matchesSearch = experiment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experiment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (experiment.tags && experiment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesType = selectedType === 'all' || experiment.category === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || experiment.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  // 统计数据
  const stats = {
    total: experiments.length,
    completed: experiments.filter(e => e.completed || false).length,
    inProgress: experiments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100).length,
    notStarted: experiments.filter(e => (e.progress || 0) === 0).length
  };

  // 获取实验类型列表
  const experimentTypes = Array.from(new Set(experiments.map(e => e.category).filter(Boolean)));

  return (
    <MainLayout>
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">实验中心</h1>
          <p className="text-gray-600">通过动手实验掌握STM32嵌入式开发的核心技能</p>
        </div>

        {/* 实验统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">总实验数</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">已完成</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">进行中</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
            <div className="text-sm text-gray-600">未开始</div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                搜索实验
              </label>
              <input
                type="text"
                className="input-primary"
                placeholder="输入实验名称、描述或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                实验类型
              </label>
              <select
                className="input-primary"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">全部类型</option>
                {experimentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                难度等级
              </label>
              <select
                className="input-primary"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="all">全部等级</option>
                <option value="beginner">初级</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
              </select>
            </div>
          </div>
        </div>

        {/* 实验列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner h-8 w-8 mr-3"></div>
            <span className="text-gray-600">加载实验中...</span>
          </div>
        ) : filteredExperiments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((experiment) => (
              <ExperimentCard key={experiment.id} experiment={experiment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的实验</h3>
            <p className="text-gray-600 mb-4">请尝试调整搜索条件或筛选选项</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedDifficulty('all');
              }}
              className="btn-primary"
            >
              重置筛选
            </button>
          </div>
        )}
    </MainLayout>
  );
};

export default ExperimentsPage;
