import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExperimentCard } from '../components/cards';
import { FaSearch } from 'react-icons/fa';
import './ExperimentsPage.css';

// 将实验数据移到组件外部，避免每次渲染时重新创建
const EXPERIMENTS = [
  {
    id: 1,
    title: 'LED闪烁控制 - 基础GPIO操作',
    description: '学习如何使用GPIO引脚控制LED。本实验涵盖基本的数字输出操作和控制方法。',
    type: 'GPIO实验',
    imageUrl: '/images/experiments/led-blink.jpg',
    difficulty: '初级',
    timeEstimate: 15,
    tags: ['GPIO', '数字输出', 'LED控制'],
    slug: 'gpio/experiments/led-blink',
    isNew: true,
    isPopular: true
  },
  {
    id: 2,
    title: '按键输入 - 用户交互',
    description: '了解如何通过按钮读取用户输入，并实现消抖技术以确保操作的可靠性。',
    type: 'GPIO实验',
    imageUrl: '/images/experiments/button-input.jpg',
    difficulty: '初级',
    timeEstimate: 20,
    tags: ['GPIO', '数字输入', '中断处理'],
    slug: 'gpio/experiments/button-input',
    isPopular: true
  },
  {
    id: 3,
    title: '定时器中断控制',
    description: '学习配置STM32系列的定时器并处理定时中断，实现精确的时间控制和周期性任务。',
    type: '定时中断',
    imageUrl: '/images/experiments/timer-interrupt.jpg',
    difficulty: '中级',
    timeEstimate: 30,
    tags: ['定时器', '中断', '精确控制'],
    slug: 'timer/experiments/basic-timer-interrupt',
    isNew: true
  },
  {
    id: 4,
    title: 'UART通信实现',
    description: '在STM32系列和计算机之间建立串行通信。学习如何通过UART发送和接收数据。',
    type: '串口实验',
    imageUrl: '/images/experiments/uart-comm.jpg',
    difficulty: '中级',
    timeEstimate: 30,
    tags: ['UART', '串行通信', '数据传输'],
    slug: 'uart/experiments/basic-uart',
    isNew: true
  },
  {
    id: 5,
    title: '温度传感器 - ADC读取',
    description: '将温度传感器连接到开发板，并通过ADC读取模拟值。处理数据以显示温度。',
    type: 'ADC实验',
    imageUrl: '/images/experiments/temp-sensor.jpg',
    difficulty: '中级',
    timeEstimate: 45,
    tags: ['ADC', '传感器', '模拟输入'],
    slug: 'adc/experiments/temperature-sensor',
    isNew: true
  },
  {
    id: 6,
    title: 'DAC音频输出',
    description: '使用DAC生成不同频率的音频信号，控制音量和频率，实现简单的音频播放功能。',
    type: 'DAC实验',
    imageUrl: '/images/experiments/dac-audio.jpg',
    difficulty: '中级',
    timeEstimate: 40,
    tags: ['DAC', '音频', '模拟输出'],
    slug: 'dac/experiments/audio-output',
    isNew: true
  },
  {
    id: 7,
    title: 'DMA内存到外设传输',
    description: '学习配置DMA控制器实现高效的数据传输，减轻CPU负担，提高系统性能。',
    type: 'DMA实验',
    imageUrl: '/images/experiments/dma-transfer.jpg',
    difficulty: '高级',
    timeEstimate: 60,
    tags: ['DMA', '数据传输', '性能优化'],
    slug: 'dma/experiments/memory-transfer',
    isNew: true
  },
  {
    id: 8,
    title: '智能环境监控系统',
    description: '综合运用多种技术开发一个完整的环境监控系统，包括传感器采集、数据处理与显示。',
    type: '综合应用场景',
    imageUrl: '/images/experiments/env-monitor.jpg',
    difficulty: '高级',
    timeEstimate: 120,
    tags: ['传感器', '数据处理', '系统集成'],
    slug: 'application/env-monitor',
    isNew: true
  },
  {
    id: 9,
    title: '数字信号处理与滤波',
    description: '学习在STM32系列上实现数字滤波算法，处理传感器数据，消除噪声并提取有用信号。',
    type: '综合应用场景',
    imageUrl: '/images/experiments/signal-processing.jpg',
    difficulty: '高级',
    timeEstimate: 90,
    tags: ['DSP', '滤波算法', '信号处理'],
    slug: 'application/signal-processing',
    isNew: true
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
 * ```jsx
 * <ExperimentsPage />
 * ```
 *
 * @returns {ReactElement} ExperimentsPage组件
 */
const ExperimentsPage = () => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(() => ({
    type: typeFromUrl || 'all',
    difficulty: 'all'
  }));

  // 过滤后的实验
  const [filteredExperiments, setFilteredExperiments] = useState(EXPERIMENTS);

  // 处理过滤器变化
  const handleFilterChange = (e) => {
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

  // 使用useMemo来缓存过滤后的实验，避免不必要的重新计算
  const filteredResults = useMemo(() => {
    let results = [...EXPERIMENTS];

    // 应用搜索过滤
    if (searchTerm) {
      results = results.filter(exp =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.tags && exp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // 应用类型过滤
    if (filters.type && filters.type !== 'all') {
      results = results.filter(exp => exp.type === filters.type);
    }

    // 应用难度过滤
    if (filters.difficulty && filters.difficulty !== 'all') {
      results = results.filter(exp => exp.difficulty === filters.difficulty);
    }

    return results;
  }, [searchTerm, filters]);

  // 当过滤结果变化时更新state
  useEffect(() => {
    setFilteredExperiments(filteredResults);
  }, [filteredResults]);

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
    <div className="container mx-auto py-4 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-4">STM32系列 实验项目</h1>
      <p className="text-gray-600 mb-4">
        浏览我们为STM32系列微控制器设计的实验集合。
        每个实验都包含详细的步骤说明、代码示例以及解释。
        选择您感兴趣的实验开始动手实践吧！
      </p>

      <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="搜索实验..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有类型</option>
              <option value="GPIO实验">GPIO实验</option>
              <option value="定时中断">定时中断</option>
              <option value="串口实验">串口实验</option>
              <option value="ADC实验">ADC实验</option>
              <option value="DAC实验">DAC实验</option>
              <option value="DMA实验">DMA实验</option>
              <option value="综合应用场景">综合应用场景</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有难度</option>
              <option value="初级">初级</option>
              <option value="中级">中级</option>
              <option value="高级">高级</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredExperiments.length > 0 ? (
          filteredExperiments.map(experiment => (
            <div key={experiment.id}>
              <ExperimentCard {...experiment} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h4 className="text-xl font-semibold">没有找到符合条件的实验</h4>
            <p className="text-gray-500">请尝试调整搜索条件或过滤器。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentsPage;