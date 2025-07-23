/**
 * 增强的成就展示组件
 * 
 * 包含动画效果、进度提示和更好的用户体验
 */

import React, { useState, useEffect } from 'react';
import { Achievement, AchievementProgress } from '../types/Achievement';

interface EnhancedAchievementDisplayProps {
  showHeader?: boolean;
  compact?: boolean;
  maxDisplay?: number;
}

const EnhancedAchievementDisplay: React.FC<EnhancedAchievementDisplayProps> = ({
  showHeader = true,
  compact = false,
  maxDisplay = 12
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progressData, setProgressData] = useState<AchievementProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAnimation, setShowAnimation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 模拟成就数据
  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟成就数据
        const mockAchievements: Achievement[] = [
          {
            id: 'ach_001',
            name: '初学者',
            description: '完成第一门课程的学习',
            icon: '🎓',
            category: 'learning',
            level: 'bronze',
            points: 100,
            requirements: ['完成任意一门课程'],
            unlockedAt: '2024-01-15T10:30:00Z',
            isUnlocked: true,
            rarity: 'common',
            progress: 100
          },
          {
            id: 'ach_002',
            name: '实验达人',
            description: '完成10个实验项目',
            icon: '🧪',
            category: 'experiment',
            level: 'silver',
            points: 250,
            requirements: ['完成10个实验项目'],
            unlockedAt: '2024-01-20T14:15:00Z',
            isUnlocked: true,
            rarity: 'rare',
            progress: 100
          },
          {
            id: 'ach_003',
            name: '编程高手',
            description: '在实验中获得90分以上成绩5次',
            icon: '💻',
            category: 'skill',
            level: 'gold',
            points: 500,
            requirements: ['在实验中获得90分以上成绩5次'],
            isUnlocked: false,
            rarity: 'epic',
            progress: 60
          },
          {
            id: 'ach_004',
            name: '连续学习者',
            description: '连续7天进行学习活动',
            icon: '🔥',
            category: 'habit',
            level: 'bronze',
            points: 150,
            requirements: ['连续7天进行学习活动'],
            unlockedAt: '2024-01-18T09:00:00Z',
            isUnlocked: true,
            rarity: 'common',
            progress: 100
          },
          {
            id: 'ach_005',
            name: '知识探索者',
            description: '浏览超过50个学习资源',
            icon: '🔍',
            category: 'exploration',
            level: 'silver',
            points: 200,
            requirements: ['浏览超过50个学习资源'],
            isUnlocked: false,
            rarity: 'uncommon',
            progress: 75
          },
          {
            id: 'ach_006',
            name: '团队合作者',
            description: '参与5次小组讨论',
            icon: '🤝',
            category: 'social',
            level: 'bronze',
            points: 120,
            requirements: ['参与5次小组讨论'],
            isUnlocked: false,
            rarity: 'common',
            progress: 40
          }
        ];

        setAchievements(mockAchievements);
      } catch (error) {
        console.error('加载成就数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  // 筛选成就
  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'unlocked') return achievement.isUnlocked;
    if (selectedCategory === 'locked') return !achievement.isUnlocked;
    return achievement.category === selectedCategory;
  }).slice(0, maxDisplay);

  // 获取等级颜色
  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'bronze': return 'from-amber-400 to-amber-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-blue-400 to-blue-600';
      case 'diamond': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // 获取稀有度颜色
  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'uncommon': return 'border-green-300 bg-green-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  // 获取稀有度文本
  const getRarityText = (rarity: string): string => {
    switch (rarity) {
      case 'common': return '普通';
      case 'uncommon': return '不常见';
      case 'rare': return '稀有';
      case 'epic': return '史诗';
      case 'legendary': return '传说';
      default: return '普通';
    }
  };

  // 处理成就点击
  const handleAchievementClick = (achievement: Achievement) => {
    if (achievement.isUnlocked) {
      setShowAnimation(achievement.id);
      setTimeout(() => setShowAnimation(null), 2000);
    }
  };

  // 计算统计数据
  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.isUnlocked).length,
    totalPoints: achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.points, 0),
    averageProgress: achievements.reduce((sum, a) => sum + (a.progress || 0), 0) / achievements.length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
        <span className="ml-2 text-gray-600">加载成就数据中...</span>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-6'}`}>
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">成就徽章</h2>
            <p className="text-gray-600 mt-1">展示您的学习成就和里程碑</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-sm text-gray-600">
              已解锁 {stats.unlocked}/{stats.total} 个成就
            </div>
            <div className="text-sm font-medium text-yellow-600">
              总积分: {stats.totalPoints}
            </div>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">总成就</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.total}</p>
            </div>
            <span className="text-2xl">🏆</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">已解锁</p>
              <p className="text-2xl font-bold text-green-700">{stats.unlocked}</p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">总积分</p>
              <p className="text-2xl font-bold text-purple-700">{stats.totalPoints}</p>
            </div>
            <span className="text-2xl">⭐</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">平均进度</p>
              <p className="text-2xl font-bold text-blue-700">{Math.round(stats.averageProgress)}%</p>
            </div>
            <span className="text-2xl">📊</span>
          </div>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: '全部', icon: '🏆' },
          { key: 'unlocked', label: '已解锁', icon: '✅' },
          { key: 'locked', label: '未解锁', icon: '🔒' },
          { key: 'learning', label: '学习', icon: '📚' },
          { key: 'experiment', label: '实验', icon: '🧪' },
          { key: 'skill', label: '技能', icon: '💻' },
          { key: 'habit', label: '习惯', icon: '🔥' },
          { key: 'social', label: '社交', icon: '🤝' }
        ].map(category => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.key
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* 成就网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            onClick={() => handleAchievementClick(achievement)}
            className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              achievement.isUnlocked ? 'hover:shadow-lg' : 'opacity-75'
            } ${showAnimation === achievement.id ? 'animate-pulse' : ''}`}
          >
            <div className={`rounded-xl border-2 p-6 ${getRarityColor(achievement.rarity)} ${
              achievement.isUnlocked ? 'shadow-md' : 'border-dashed'
            }`}>
              {/* 成就图标和等级 */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                  achievement.isUnlocked
                    ? `bg-gradient-to-r ${getLevelColor(achievement.level)} shadow-lg`
                    : 'bg-gray-200'
                }`}>
                  {achievement.isUnlocked ? achievement.icon : '🔒'}
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    achievement.level === 'bronze' ? 'bg-amber-100 text-amber-700' :
                    achievement.level === 'silver' ? 'bg-gray-100 text-gray-700' :
                    achievement.level === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {achievement.level === 'bronze' ? '青铜' :
                     achievement.level === 'silver' ? '白银' :
                     achievement.level === 'gold' ? '黄金' : '铂金'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getRarityText(achievement.rarity)}
                  </div>
                </div>
              </div>

              {/* 成就信息 */}
              <div className="mb-4">
                <h3 className={`font-bold text-lg mb-2 ${
                  achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.name}
                </h3>
                <p className={`text-sm ${
                  achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
              </div>

              {/* 进度条 */}
              {!achievement.isUnlocked && achievement.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">进度</span>
                    <span className="font-medium text-gray-900">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* 积分和解锁时间 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className={`text-sm font-medium ${
                    achievement.isUnlocked ? 'text-yellow-600' : 'text-gray-400'
                  }`}>
                    {achievement.points} 积分
                  </span>
                </div>
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <div className="text-xs text-gray-500">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* 解锁动画效果 */}
              {showAnimation === achievement.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-xl">
                  <div className="text-center">
                    <div className="text-6xl animate-bounce mb-2">🎉</div>
                    <div className="text-lg font-bold text-yellow-600">成就解锁！</div>
                  </div>
                </div>
              )}

              {/* 悬浮提示 */}
              {!achievement.isUnlocked && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white rounded-lg p-3 shadow-lg max-w-xs">
                    <h4 className="font-medium text-gray-900 mb-2">解锁条件:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {achievement.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <span className="text-6xl">🏆</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无成就</h3>
          <p className="text-gray-600">继续学习以解锁更多成就徽章</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedAchievementDisplay;
