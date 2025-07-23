import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import { experimentsList } from '../data/realExperiments';
import { ExtendedExperimentApi, ExperimentListItem as ApiExperimentListItem } from '../../../../api/experimentApi';
import EnhancedSearchBox, { SearchFilter, SearchSuggestion } from '../../../../components/search/EnhancedSearchBox';

// 实验卡片组件 - 优化版本
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

  const getTypeIcon = (type: string | undefined, experimentName?: string) => {
    // 根据实验名称优先匹配图标
    if (experimentName) {
      if (experimentName.includes('LED') || experimentName.includes('led')) {
        return <div className="text-3xl">💡</div>;
      }
      if (experimentName.includes('按键') || experimentName.includes('key')) {
        return <div className="text-3xl">🔘</div>;
      }
      if (experimentName.includes('环境监测') || experimentName.includes('smarteco')) {
        return <div className="text-3xl">🌡️</div>;
      }
      if (experimentName.includes('泊车') || experimentName.includes('autopark')) {
        return <div className="text-3xl">🚗</div>;
      }
      if (experimentName.includes('健身手环') || experimentName.includes('fitband')) {
        return <div className="text-3xl">⌚</div>;
      }
      if (experimentName.includes('光学追踪') || experimentName.includes('optitracer')) {
        return <div className="text-3xl">👁️</div>;
      }
    }

    if (!type) {
      return <div className="text-3xl">⚡</div>;
    }

    // GPIO相关实验
    if (type.includes('GPIO') || type.includes('gpio')) {
      return <div className="text-3xl">⚡</div>;
    }

    // 串口通信实验
    if (type.includes('UART') || type.includes('uart') || type.includes('串口')) {
      return <div className="text-3xl">📡</div>;
    }

    // 定时器实验
    if (type.includes('定时器') || type.includes('timer')) {
      return <div className="text-3xl">⏰</div>;
    }

    // PWM实验
    if (type.includes('PWM') || type.includes('pwm')) {
      return <div className="text-3xl">📈</div>;
    }

    // 中断实验
    if (type.includes('中断') || type.includes('interrupt')) {
      return <div className="text-3xl">⚡</div>;
    }

    // ADC实验
    if (type.includes('ADC') || type.includes('adc')) {
      return <div className="text-3xl">📊</div>;
    }

    // DAC实验
    if (type.includes('DAC') || type.includes('dac')) {
      return <div className="text-3xl">🎵</div>;
    }

    // LCD显示实验
    if (type.includes('LCD') || type.includes('lcd') || type.includes('显示')) {
      return <div className="text-3xl">🖥️</div>;
    }

    // 综合应用实验
    if (type.includes('综合应用') || type.includes('智能')) {
      return <div className="text-3xl">🏠</div>;
    }

    // 默认图标
    return <div className="text-3xl">🔬</div>;
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
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden flex flex-col"
    >
      {/* 实验图标和状态 - 自适应高度 */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6 flex items-center justify-center min-h-[120px]">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          {getTypeIcon(experiment.category, experiment.name)}
        </div>

        {/* 状态标识 - 只在对应item上显示 */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {experiment.isNew && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              新
            </span>
          )}
          {experiment.isPopular && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              热门
            </span>
          )}
        </div>

        {/* 完成状态 */}
        {experiment.completed && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              ✓ 已完成
            </span>
          </div>
        )}

        {/* 头部进度条 */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/20 h-1">
          <div
            className="bg-white h-1 transition-all duration-300"
            style={{ width: `${experiment.progress || 0}%` }}
          />
        </div>
      </div>

      {/* 实验信息 - 自适应内容 */}
      <div className="flex-1 p-5 flex flex-col">
        {/* 头部信息 */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(experiment.difficulty)}`}>
            {getDifficultyText(experiment.difficulty)}
          </span>
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            {experiment.category || '实验'}
          </span>
        </div>

        {/* 标题和描述 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {experiment.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">
          {experiment.description}
        </p>

        {/* 底部信息区域 */}
        <div className="mt-auto space-y-3">
          {/* 基本信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(experiment.estimatedTime)}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{getDifficultyText(experiment.difficulty)}</span>
            </div>
          </div>

          {/* 标签 */}
          {(experiment.tags && experiment.tags.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {experiment.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                >
                  {tag}
                </span>
              ))}
              {experiment.tags.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs bg-gray-100 text-gray-600 border border-gray-200">
                  +{experiment.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 实验进度 */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-600 font-medium">学习进度</span>
              <span className={`font-semibold ${
                (experiment.progress || 0) === 100 ? 'text-green-600' :
                (experiment.progress || 0) > 0 ? 'text-blue-600' :
                'text-gray-500'
              }`}>
                {(experiment.progress || 0) === 100 ? '已完成' : `${experiment.progress || 0}%`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  (experiment.progress || 0) === 100 ? 'bg-green-500' :
                  (experiment.progress || 0) > 0 ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                style={{ width: `${Math.max(experiment.progress || 0, 2)}%` }}
              />
            </div>
          </div>
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

  // 处理快捷筛选
  const handleQuickFilter = (value: string) => {
    switch (value) {
      case 'popular':
        setSearchTerm('热门');
        break;
      case 'new':
        setSearchTerm('新');
        break;
      case 'GPIO':
        setSearchTerm('GPIO');
        break;
      case '通信':
        setSearchTerm('通信');
        break;
      case '控制':
        setSearchTerm('控制');
        break;
      default:
        setSearchTerm(value);
    }
  };

  // 处理筛选器变化
  const handleFilterChange = (key: string, value: any) => {
    if (key === 'type') {
      setSelectedType(value);
    } else if (key === 'difficulty') {
      setSelectedDifficulty(value);
    }
  };

  // 清除所有筛选
  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedDifficulty('all');
  };

  // 加载真实实验数据
  useEffect(() => {
    const loadExperiments = async () => {
      setLoading(true);
      try {
        const data = await ExtendedExperimentApi.getExperimentsList();
        setExperiments(data);
        console.log('实验数据加载成功:', data.length, '个实验');
      } catch (error) {
        console.error('加载实验数据失败:', error);
        // 如果API失败，使用本地数据作为fallback
        setExperiments(experimentsList as any);
        console.log('使用本地数据作为后备方案');
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

  // 搜索建议数据
  const searchSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'GPIO控制实验', type: 'popular', count: 89 },
    { id: '2', text: 'LED闪烁实验', type: 'popular', count: 156 },
    { id: '3', text: '串口通信实验', type: 'popular', count: 67 },
    { id: '4', text: 'PWM控制实验', type: 'popular', count: 45 },
    { id: '5', text: '定时器实验', type: 'suggestion', count: 34 },
    { id: '6', text: 'ADC采样实验', type: 'suggestion', count: 28 }
  ];

  // 筛选器配置
  const searchFilters: SearchFilter[] = [
    {
      key: 'type',
      label: '实验类型',
      type: 'select',
      options: [
        { value: 'all', label: '全部类型', count: experiments.length },
        ...experimentTypes.map(type => ({
          value: type,
          label: type,
          count: experiments.filter(exp => exp.category === type).length
        }))
      ]
    },
    {
      key: 'difficulty',
      label: '难度等级',
      type: 'select',
      options: [
        { value: 'all', label: '全部等级', count: experiments.length },
        { value: 'beginner', label: '初级', count: experiments.filter(exp => exp.difficulty === 'beginner').length },
        { value: 'intermediate', label: '中级', count: experiments.filter(exp => exp.difficulty === 'intermediate').length },
        { value: 'advanced', label: '高级', count: experiments.filter(exp => exp.difficulty === 'advanced').length }
      ]
    }
  ];

  // 快捷筛选标签
  const quickFilters = [
    { label: '热门实验', value: 'popular', count: 8 },
    { label: '新实验', value: 'new', count: 3 },
    { label: 'GPIO相关', value: 'GPIO', count: 12 },
    { label: '通信实验', value: '通信', count: 6 },
    { label: '控制实验', value: '控制', count: 9 }
  ];

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 - 重新设计 */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-800 rounded-2xl mb-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">实验中心</h1>
                <p className="text-purple-100 text-lg mb-6 max-w-2xl">
                  从GPIO基础到综合应用，循序渐进掌握STM32嵌入式开发技能
                </p>
                {/* 开发环境下显示数据加载状态 */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-purple-200 text-sm mb-4 bg-white/10 px-3 py-1 rounded-full inline-block">
                    📊 数据状态: {loading ? '加载中...' : `已加载 ${experiments.length} 个实验`}
                  </div>
                )}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">实验环境：就绪</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span className="text-sm">已完成 {stats.completed} 个实验</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-6xl">🧪</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 实验统计 - 重新设计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">个实验</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">总实验数</h3>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>基础到应用</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">✅</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                  <div className="text-sm text-gray-500">已完成</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">完成实验</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">⏳</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
                  <div className="text-sm text-gray-500">进行中</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">进行中</h3>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>继续努力！</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📝</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.notStarted}</div>
                  <div className="text-sm text-gray-500">待开始</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">未开始</h3>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>开始探索</span>
              </div>
            </div>
          </div>
        </div>

        {/* 实验路径导航 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">学习路径</h3>
            <div className="text-sm text-gray-500">循序渐进，由浅入深</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              基础入门 (GPIO/LED)
            </div>
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              中级进阶 (定时器/串口)
            </div>
            <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              高级应用 (ADC/DAC)
            </div>
            <div className="flex items-center bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              综合项目 (智能系统)
            </div>
          </div>
        </div>

        {/* 增强的搜索框 */}
        <EnhancedSearchBox
          placeholder="搜索实验名称、描述或标签..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={searchFilters}
          filterValues={{ type: selectedType, difficulty: selectedDifficulty }}
          onFilterChange={handleFilterChange}
          suggestions={searchSuggestions}
          showSuggestions={true}
          resultCount={filteredExperiments.length}
          onClear={handleClearAll}
          theme="purple"
          size="md"
          showAdvancedFilters={true}
          quickFilters={quickFilters}
          onQuickFilter={handleQuickFilter}
          className="mb-8"
        />

        {/* 实验列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 骨架屏 - 显示6个占位卡片 */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                {/* 头部骨架 */}
                <div className="h-32 bg-gradient-to-br from-gray-300 to-gray-400 relative">
                  <div className="absolute top-3 left-3 space-y-1">
                    <div className="h-5 w-8 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-gray-400 rounded-full"></div>
                  </div>
                </div>

                {/* 内容骨架 */}
                <div className="p-5 space-y-4">
                  {/* 头部信息 */}
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                    <div className="h-5 bg-gray-300 rounded-full w-12"></div>
                  </div>

                  {/* 标题 */}
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>

                  {/* 描述 */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>

                  {/* 底部信息 */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </div>

                    {/* 标签 */}
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                      <div className="h-6 bg-gray-300 rounded w-12"></div>
                      <div className="h-6 bg-gray-300 rounded w-8"></div>
                    </div>

                    {/* 进度条 */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between mb-2">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                      </div>
                      <div className="h-2.5 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
      </div>
    </MainLayout>
  );
};

export default ExperimentsPage;
