import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import ExperimentTypeIcon from '../common/ExperimentTypeIcon';
import './ExperimentCard.css';

// 如果实验图片不可用，则使用内联base64编码的默认占位图像
// 这样可以避免依赖外部文件，确保图像始终可用
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgODAwIDQwMCI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNlN2YyZmYiLz48cmVjdCB3aWR0aD0iNzk2IiBoZWlnaHQ9IjM5NiIgeD0iMiIgeT0iMiIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48dGV4dCB4PSI0MDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzNiODJmNiI+U1RNMzJINemimOmmhjwvdGV4dD48dGV4dCB4PSI0MDAiIHk9IjIyMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij7lrp7pqozpobnnm67lm77niYc8L3RleHQ+PC9zdmc+';

// 实验类型到图标类型的映射表
const TYPE_TO_ICON_MAP: Record<string, string> = {
  'gpio': 'gpio',
  'gpio实验': 'gpio',
  'uart': 'serial',
  'serial': 'serial',
  '串口实验': 'serial',
  '定时中断': 'timer',
  'timer': 'timer',
  'adc': 'adc',
  'adc实验': 'adc',
  'dac': 'audio',
  'dac实验': 'audio',
  'dma': 'memory',
  'dma实验': 'memory',
  '综合应用场景': 'advanced',
  'application': 'advanced'
};

interface ExperimentCardProps {
  id: string | number;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  timeEstimate?: number;
  imageUrl?: string;
  isNew?: boolean;
  isPopular?: boolean;
  tags?: string[];
  slug?: string | null;
}

/**
 * 实验卡片组件，用于显示不同类型的实验
 */
const ExperimentCard: React.FC<ExperimentCardProps> = ({
  id,
  title,
  description,
  type,
  difficulty,
  timeEstimate,
  imageUrl = DEFAULT_IMAGE,
  isNew = false,
  isPopular = false,
  tags = [],
  slug = null
}) => {
  // 格式化时间估计为人类可读格式（例如，"30分钟"，"1.5小时"）
  const formatTimeEstimate = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} 分钟`;
    } else {
      const hours = minutes / 60;
      return `${hours % 1 === 0 ? hours : hours.toFixed(1)} 小时`;
    }
  };

  // 根据难度级别获取适当的颜色
  const getDifficultyColor = (level: string): string => {
    switch(level.toLowerCase()) {
      case 'beginner':
      case '初级':
        return 'success';
      case 'intermediate':
      case '中级':
        return 'warning';
      case 'advanced':
      case '高级':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // 将难度级别转换为中文（如果是英文）
  const getChineseDifficulty = (level: string): string => {
    switch(level.toLowerCase()) {
      case 'beginner':
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return level;
    }
  };

  // 根据实验类型获取适当的图标类型参数 - 使用缓存映射提高性能
  const getIconType = (experimentType: string): string => {
    if (!experimentType) return 'default';

    const lowerType = experimentType.toLowerCase().trim();

    // 首先查找直接映射
    if (TYPE_TO_ICON_MAP[lowerType]) {
      return TYPE_TO_ICON_MAP[lowerType];
    }

    // 如果没有直接映射，再进行包含匹配
    for (const [key, value] of Object.entries(TYPE_TO_ICON_MAP)) {
      if (lowerType.includes(key)) {
        return value;
      }
    }

    return 'default';
  };

  // 根据实验类型获取徽章颜色
  const getTypeBadgeColor = (experimentType: string): string => {
    const type = experimentType.toLowerCase();
    if (type.includes('gpio')) return 'primary';
    if (type.includes('uart') || type.includes('serial') || type.includes('串口')) return 'info';
    if (type.includes('timer') || type.includes('定时')) return 'warning';
    if (type.includes('adc')) return 'success';
    if (type.includes('dac')) return 'dark';
    if (type.includes('dma')) return 'secondary';
    if (type.includes('综合') || type.includes('application')) return 'danger';
    if (type.includes('wireless')) return 'success';
    if (type.includes('power')) return 'danger';

    return 'secondary';
  };

  // 处理图像加载错误时使用默认占位图像
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  // 预加载图标组件，避免延迟加载导致的闪烁
  const iconType = useMemo(() => getIconType(type), [type]);

  return (
    <div className="experiment-card">
      <Link to={`/experiments/${slug || id}`} className="experiment-card-link">
        <div className="experiment-image-container">
          <img
            src={imageUrl || DEFAULT_IMAGE}
            alt={title}
            className="experiment-image"
            onError={handleImageError}
          />
          <div className="experiment-badges">
            <span
              className={`experiment-type-badge inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                getTypeBadgeColor(type) === 'primary' ? 'bg-primary-100 text-primary-800' :
                getTypeBadgeColor(type) === 'info' ? 'bg-blue-100 text-blue-800' :
                getTypeBadgeColor(type) === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                getTypeBadgeColor(type) === 'success' ? 'bg-green-100 text-green-800' :
                getTypeBadgeColor(type) === 'danger' ? 'bg-red-100 text-red-800' :
                getTypeBadgeColor(type) === 'dark' ? 'bg-gray-700 text-gray-100' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              <ExperimentTypeIcon
                type={iconType}
                className="mr-1"
                size="1.1em"
              />
              <span>{type}</span>
            </span>

            {isNew && (
              <span className="experiment-status-badge inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">
                <span>新</span>
              </span>
            )}

            {isPopular && (
              <span className="experiment-status-badge inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                <span>热门</span>
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col">
          <h3 className="experiment-title">{title}</h3>

          <div className="experiment-meta">
            <span
              className={`difficulty-badge inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                getDifficultyColor(difficulty) === 'success' ? 'bg-green-100 text-green-800' :
                getDifficultyColor(difficulty) === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                getDifficultyColor(difficulty) === 'danger' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {getChineseDifficulty(difficulty)}
            </span>

            <div className="time-estimate">
              <FaClock className="mr-1" /> {timeEstimate ? formatTimeEstimate(timeEstimate) : '未指定'}
            </div>
          </div>

          <p className="experiment-description">{description}</p>

          {tags && tags.length > 0 && (
            <div className="experiment-chips">
              {tags.map((tag, index) => (
                <span key={index} className="chip-badge">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

// 使用memo包装组件以避免不必要的重渲染
export default React.memo(ExperimentCard); 