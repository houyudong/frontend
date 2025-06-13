import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExperimentCard } from '../components/cards';
import { FaSearch } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import './ExperimentsPage.css';

interface Experiment {
  id: string | number;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  timeEstimate: number;
  imageUrl?: string;
  isNew?: boolean;
  isPopular?: boolean;
  tags?: string[];
  slug?: string | null;
}

interface Filters {
  type: string;
  difficulty: string;
}

// 静态实验数据，避免在每次渲染时重新创建
const EXPERIMENTS: Experiment[] = [
  {
    id: 1,
    title: 'LED闪烁实验',
    description: '学习如何使用STM32的GPIO控制LED灯的闪烁，掌握基本的GPIO配置和操作。',
    type: 'GPIO实验',
    difficulty: '初级',
    timeEstimate: 30,
    tags: ['GPIO', 'LED', '基础实验'],
    isNew: true,
    slug: 'led-blink'
  },
  {
    id: 2,
    title: '串口通信实验',
    description: '通过串口与电脑进行通信，学习串口配置和数据传输。',
    type: '串口实验',
    difficulty: '中级',
    timeEstimate: 45,
    tags: ['UART', '通信', '串口'],
    isPopular: true,
    slug: 'uart-communication'
  },
  {
    id: 3,
    title: '定时器中断实验',
    description: '使用定时器产生精确的时间间隔，实现定时任务。',
    type: '定时中断',
    difficulty: '中级',
    timeEstimate: 60,
    tags: ['定时器', '中断', 'TIM'],
    isNew: true,
    slug: 'timer-interrupt'
  },
  {
    id: 4,
    title: 'ADC采样实验',
    description: '使用ADC采集模拟信号，将模拟量转换为数字量。',
    type: 'ADC实验',
    difficulty: '中级',
    timeEstimate: 90,
    tags: ['ADC', '模拟量', '采样'],
    isPopular: true,
    slug: 'adc-sampling'
  },
  {
    id: 5,
    title: 'DAC输出实验',
    description: '使用DAC输出模拟信号，生成不同波形。',
    type: 'DAC实验',
    difficulty: '高级',
    timeEstimate: 120,
    tags: ['DAC', '模拟量', '波形生成'],
    slug: 'dac-output'
  },
  {
    id: 6,
    title: 'DMA传输实验',
    description: '使用DMA进行数据传输，提高传输效率。',
    type: 'DMA实验',
    difficulty: '高级',
    timeEstimate: 150,
    tags: ['DMA', '数据传输', '效率优化'],
    slug: 'dma-transfer'
  },
  {
    id: 7,
    title: '综合应用场景',
    description: '结合多个外设，实现一个完整的应用场景。',
    type: '综合应用场景',
    difficulty: '高级',
    timeEstimate: 180,
    tags: ['综合应用', '项目实战', '系统集成'],
    isNew: true,
    slug: 'comprehensive-application'
  }
];

/**
 * ExperimentsPage - 实验项目列表页面
 *
 * 显示所有可用的STM32系列实验项目，支持按关键词搜索、按类型和难度等级筛选。
 * 实验数据目前是静态的，未来可以从API获取。
 *
 * @component
 * @example
 * ```tsx
 * <ExperimentsPage />
 * ```
 *
 * @returns {JSX.Element} ExperimentsPage组件
 */
const ExperimentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    type: '',
    difficulty: ''
  });

  // 使用useMemo优化过滤逻辑，避免不必要的重新计算
  const filteredExperiments = useMemo(() => {
    return EXPERIMENTS.filter(experiment => {
      const matchesSearch = experiment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          experiment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          experiment.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          experiment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          experiment.difficulty.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !filters.type || experiment.type.toLowerCase() === filters.type.toLowerCase();
      const matchesDifficulty = !filters.difficulty || experiment.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
      
      return matchesSearch && matchesType && matchesDifficulty;
    });
  }, [searchTerm, filters]);

  // 获取所有可用的实验类型和难度级别
  const availableTypes = useMemo(() => {
    return Array.from(new Set(EXPERIMENTS.map(exp => exp.type)));
  }, []);

  const availableDifficulties = useMemo(() => {
    return Array.from(new Set(EXPERIMENTS.map(exp => exp.difficulty)));
  }, []);

  // 获取URL参数
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const typeFromUrl = queryParams.get('type');

  // 初始化页面时记录一下console日志，用于调试
  useEffect(() => {
    console.log('ExperimentsPage mounted, typeFromUrl:', typeFromUrl);
  }, []);

  // 过滤状态 - 使用typeFromUrl的初始值，但以后不再依赖它
  const [filteredExperimentsState, setFilteredExperimentsState] = useState<Experiment[]>(EXPERIMENTS);

  // 处理过滤器变化
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 更新过滤器状态
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    // 只更新URL，不再依赖URL参数来更新state
    if (name === 'type') {
      if (value !== 'all') {
        navigate(`/experiments?type=${value}`, { replace: true });
      } else {
        navigate('/experiments', { replace: true });
      }
    }
  };

  // 当过滤结果变化时更新state
  useEffect(() => {
    setFilteredExperimentsState(filteredExperiments);
  }, [filteredExperiments]);

  // 监听URL变化，更新过滤器 - 使用ref避免循环
  useEffect(() => {
    // URL变化时，直接更新filters.type
    // 这里不需要检查，因为我们已经分离了URL变化和状态更新的逻辑
    if (typeFromUrl) {
      setFilters(prev => ({ ...prev, type: typeFromUrl }));
    } else {
      setFilters(prev => ({ ...prev, type: 'all' }));
    }
  }, [location.search]); // 只依赖location.search，不依赖typeFromUrl或filters

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>STM32实验列表 - 嵌入式开发学习平台</title>
        <meta name="description" content="浏览和选择各种STM32系列实验，从基础到高级，涵盖GPIO、串口、定时器、ADC、DAC、DMA等多个方面。" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">STM32系列实验</h1>
        <p className="text-lg text-gray-600">
          探索各种STM32实验，从基础到高级，掌握嵌入式开发技能。
        </p>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="搜索实验..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">所有类型</option>
            {availableTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.difficulty}
            onChange={handleFilterChange}
          >
            <option value="">所有难度</option>
            {availableDifficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 实验列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperimentsState.map(experiment => (
          <ExperimentCard
            key={experiment.id}
            id={experiment.id}
            title={experiment.title}
            description={experiment.description}
            type={experiment.type}
            difficulty={experiment.difficulty}
            timeEstimate={experiment.timeEstimate}
            imageUrl={experiment.imageUrl}
            isNew={experiment.isNew}
            isPopular={experiment.isPopular}
            tags={experiment.tags}
            slug={experiment.slug}
          />
        ))}
      </div>

      {/* 无结果提示 */}
      {filteredExperimentsState.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">没有找到匹配的实验</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {
              setSearchTerm('');
              setFilters({ type: '', difficulty: '' });
            }}
          >
            清除筛选条件
          </button>
        </div>
      )}
    </div>
  );
};

export default ExperimentsPage; 