/**
 * 增强的收藏管理组件
 * 
 * 提供更好的收藏资源管理和分类功能
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface FavoriteItem {
  id: string;
  type: 'course' | 'experiment' | 'video' | 'document' | 'article';
  itemId: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  author?: string;
  addedAt: string;
  lastAccessedAt?: string;
  tags: string[];
  url?: string;
  metadata?: Record<string, any>;
}

interface EnhancedFavoritesManagerProps {
  showHeader?: boolean;
  compact?: boolean;
  maxDisplay?: number;
}

const EnhancedFavoritesManager: React.FC<EnhancedFavoritesManagerProps> = ({
  showHeader = true,
  compact = false,
  maxDisplay = 20
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'addedAt' | 'title' | 'lastAccessed'>('addedAt');
  const [loading, setLoading] = useState(true);

  // 模拟数据加载
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟收藏数据
        const mockFavorites: FavoriteItem[] = [
          {
            id: 'fav_001',
            type: 'course',
            itemId: 'course_001',
            title: 'STM32嵌入式开发基础',
            description: '全面学习STM32微控制器的开发技术',
            thumbnail: '/images/courses/stm32.jpg',
            category: '嵌入式开发',
            author: '刘教授',
            addedAt: '2024-01-20T10:30:00Z',
            lastAccessedAt: '2024-01-22T14:30:00Z',
            tags: ['STM32', '嵌入式', '微控制器', '硬件']
          },
          {
            id: 'fav_002',
            type: 'experiment',
            itemId: 'exp_001',
            title: 'GPIO控制LED实验',
            description: '通过GPIO端口控制LED灯的亮灭',
            thumbnail: '/images/experiments/gpio_led.jpg',
            category: '基础实验',
            addedAt: '2024-01-18T16:15:00Z',
            lastAccessedAt: '2024-01-21T09:45:00Z',
            tags: ['GPIO', 'LED', '基础', '实验']
          },
          {
            id: 'fav_003',
            type: 'video',
            itemId: 'video_001',
            title: 'ARM架构详解',
            description: '深入讲解ARM处理器的架构原理',
            thumbnail: '/images/videos/arm_arch.jpg',
            category: '理论学习',
            author: '张教授',
            addedAt: '2024-01-15T14:20:00Z',
            lastAccessedAt: '2024-01-19T11:30:00Z',
            tags: ['ARM', '架构', '处理器', '理论']
          },
          {
            id: 'fav_004',
            type: 'document',
            itemId: 'doc_001',
            title: 'STM32参考手册',
            description: 'STM32F4系列微控制器完整参考手册',
            category: '参考资料',
            addedAt: '2024-01-12T08:45:00Z',
            lastAccessedAt: '2024-01-20T16:20:00Z',
            tags: ['STM32', '参考手册', '文档', 'F4系列']
          },
          {
            id: 'fav_005',
            type: 'article',
            itemId: 'article_001',
            title: '嵌入式系统设计原则',
            description: '介绍嵌入式系统设计的基本原则和最佳实践',
            category: '设计理念',
            author: '李工程师',
            addedAt: '2024-01-10T13:15:00Z',
            tags: ['嵌入式', '设计', '原则', '最佳实践']
          }
        ];

        setFavorites(mockFavorites);
      } catch (error) {
        console.error('加载收藏数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // 筛选和排序收藏
  const filteredFavorites = favorites
    .filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesType && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'lastAccessed':
          const aTime = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0;
          const bTime = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0;
          return bTime - aTime;
        case 'addedAt':
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
    })
    .slice(0, maxDisplay);

  // 获取类型图标
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'course': return '📚';
      case 'experiment': return '🧪';
      case 'video': return '📺';
      case 'document': return '📄';
      case 'article': return '📰';
      default: return '📖';
    }
  };

  // 获取类型颜色
  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'experiment': return 'bg-green-100 text-green-700 border-green-200';
      case 'video': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'document': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'article': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // 格式化时间
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString();
  };

  // 移除收藏
  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  // 统计数据
  const stats = {
    total: favorites.length,
    courses: favorites.filter(f => f.type === 'course').length,
    experiments: favorites.filter(f => f.type === 'experiment').length,
    videos: favorites.filter(f => f.type === 'video').length,
    documents: favorites.filter(f => f.type === 'document').length,
    articles: favorites.filter(f => f.type === 'article').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-gray-600">加载收藏数据中...</span>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-6'}`}>
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">我的收藏</h2>
            <p className="text-gray-600 mt-1">管理您收藏的学习资源</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-sm text-gray-600">共 {stats.total} 个收藏</span>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">课程</p>
              <p className="text-2xl font-bold text-blue-700">{stats.courses}</p>
            </div>
            <span className="text-2xl">📚</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">实验</p>
              <p className="text-2xl font-bold text-green-700">{stats.experiments}</p>
            </div>
            <span className="text-2xl">🧪</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">视频</p>
              <p className="text-2xl font-bold text-purple-700">{stats.videos}</p>
            </div>
            <span className="text-2xl">📺</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">文档</p>
              <p className="text-2xl font-bold text-orange-700">{stats.documents}</p>
            </div>
            <span className="text-2xl">📄</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600">文章</p>
              <p className="text-2xl font-bold text-indigo-700">{stats.articles}</p>
            </div>
            <span className="text-2xl">📰</span>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* 搜索框 */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索收藏的资源..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* 类型筛选 */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">所有类型</option>
              <option value="course">课程</option>
              <option value="experiment">实验</option>
              <option value="video">视频</option>
              <option value="document">文档</option>
              <option value="article">文章</option>
            </select>

            {/* 排序 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="addedAt">收藏时间</option>
              <option value="title">标题</option>
              <option value="lastAccessed">最近访问</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            显示 {filteredFavorites.length} 个结果
          </div>
        </div>
      </div>

      {/* 收藏列表 */}
      <div className="space-y-4">
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <span className="text-6xl">❤️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无收藏</h3>
            <p className="text-gray-600">开始收藏您感兴趣的学习资源</p>
          </div>
        ) : (
          filteredFavorites.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                {/* 缩略图或图标 */}
                <div className="flex-shrink-0">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-lg border flex items-center justify-center ${getTypeColor(item.type)}`}>
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    </div>
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                          {item.type === 'course' ? '课程' :
                           item.type === 'experiment' ? '实验' :
                           item.type === 'video' ? '视频' :
                           item.type === 'document' ? '文档' : '文章'}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📂 {item.category}</span>
                        {item.author && <span>👨‍🏫 {item.author}</span>}
                        <span>📅 收藏于 {formatTime(item.addedAt)}</span>
                        {item.lastAccessedAt && <span>👁️ 最近访问 {formatTime(item.lastAccessedAt)}</span>}
                      </div>

                      {/* 标签 */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/student/${item.type}s/${item.itemId}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        查看
                      </Link>

                      <button
                        onClick={() => removeFavorite(item.id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        移除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedFavoritesManager;
