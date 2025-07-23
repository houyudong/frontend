/**
 * 成就系统相关类型定义
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  level: AchievementLevel;
  points: number;
  requirements: string[];
  unlockedAt?: string;
  isUnlocked: boolean;
  rarity: AchievementRarity;
  progress?: number; // 0-100，未解锁成就的进度
  createdAt?: string;
  tags?: string[];
}

export type AchievementCategory = 
  | 'learning'      // 学习相关
  | 'experiment'    // 实验相关
  | 'skill'         // 技能相关
  | 'habit'         // 学习习惯
  | 'social'        // 社交互动
  | 'exploration'   // 探索发现
  | 'performance'   // 表现优异
  | 'milestone';    // 里程碑

export type AchievementLevel = 
  | 'bronze'    // 青铜
  | 'silver'    // 白银
  | 'gold'      // 黄金
  | 'platinum'  // 铂金
  | 'diamond';  // 钻石

export type AchievementRarity = 
  | 'common'     // 普通
  | 'uncommon'   // 不常见
  | 'rare'       // 稀有
  | 'epic'       // 史诗
  | 'legendary'; // 传说

export interface AchievementProgress {
  achievementId: string;
  currentValue: number;
  targetValue: number;
  progress: number; // 0-100
  lastUpdated: string;
}

export interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  totalPoints: number;
  averageProgress: number;
  categoryStats: CategoryStats[];
  levelStats: LevelStats[];
  recentUnlocks: Achievement[];
}

export interface CategoryStats {
  category: AchievementCategory;
  total: number;
  unlocked: number;
  points: number;
}

export interface LevelStats {
  level: AchievementLevel;
  total: number;
  unlocked: number;
  points: number;
}

export interface AchievementNotification {
  id: string;
  achievementId: string;
  achievement: Achievement;
  unlockedAt: string;
  isRead: boolean;
  showAnimation?: boolean;
}

export interface AchievementFilter {
  category?: AchievementCategory | 'all' | 'unlocked' | 'locked';
  level?: AchievementLevel | 'all';
  rarity?: AchievementRarity | 'all';
  search?: string;
  sortBy?: 'name' | 'points' | 'unlockedAt' | 'progress' | 'rarity';
  sortOrder?: 'asc' | 'desc';
}

export interface AchievementRule {
  id: string;
  achievementId: string;
  type: 'count' | 'streak' | 'score' | 'time' | 'completion';
  metric: string; // 要监控的指标
  operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
  targetValue: number;
  currentValue?: number;
  isActive: boolean;
}

// 成就触发事件类型
export interface AchievementEvent {
  type: AchievementEventType;
  userId: string;
  data: Record<string, any>;
  timestamp: string;
}

export type AchievementEventType =
  | 'course_completed'
  | 'experiment_completed'
  | 'high_score_achieved'
  | 'streak_maintained'
  | 'resource_viewed'
  | 'discussion_participated'
  | 'assignment_submitted'
  | 'login_daily'
  | 'study_time_reached';

// 成就系统配置
export interface AchievementConfig {
  enableNotifications: boolean;
  enableAnimations: boolean;
  enableSound: boolean;
  notificationDuration: number; // 毫秒
  animationDuration: number; // 毫秒
}

// 成就徽章样式配置
export interface BadgeStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  glowColor?: string;
  animation?: 'none' | 'pulse' | 'glow' | 'bounce';
}

export interface AchievementTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  level: AchievementLevel;
  points: number;
  rarity: AchievementRarity;
  rules: AchievementRule[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
