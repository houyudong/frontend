import React, { useState } from 'react';
import { KnowledgePoint, KnowledgeCategory } from '../types/experimentTypes';

interface KnowledgePointCardProps {
  knowledgePoint: KnowledgePoint;
  isExpanded?: boolean;
  onToggle?: () => void;
  showCategory?: boolean;
  className?: string;
}

/**
 * KnowledgePointCard - 知识点卡片组件
 * 
 * 用于展示单个知识点的详细信息
 * 支持展开/收起、分类显示和相关概念链接
 */
const KnowledgePointCard: React.FC<KnowledgePointCardProps> = ({
  knowledgePoint,
  isExpanded = false,
  onToggle,
  showCategory = true,
  className = ''
}) => {
  const [internalExpanded, setInternalExpanded] = useState(isExpanded);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const expanded = onToggle ? isExpanded : internalExpanded;

  // 获取分类颜色
  const getCategoryColor = (category: KnowledgeCategory) => {
    const colors = {
      gpio: 'bg-blue-100 text-blue-800',
      timer: 'bg-green-100 text-green-800',
      uart: 'bg-purple-100 text-purple-800',
      adc: 'bg-yellow-100 text-yellow-800',
      dac: 'bg-pink-100 text-pink-800',
      interrupt: 'bg-red-100 text-red-800',
      sensor: 'bg-indigo-100 text-indigo-800',
      lcd: 'bg-gray-100 text-gray-800',
      architecture: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // 获取等级颜色
  const getLevelColor = (level: string) => {
    const colors = {
      basic: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // 获取等级文本
  const getLevelText = (level: string) => {
    const texts = {
      basic: '基础',
      intermediate: '中级',
      advanced: '高级'
    };
    return texts[level as keyof typeof texts] || level;
  };

  // 获取分类文本
  const getCategoryText = (category: KnowledgeCategory) => {
    const texts = {
      gpio: 'GPIO',
      timer: '定时器',
      uart: '串口通信',
      adc: 'ADC',
      dac: 'DAC',
      interrupt: '中断系统',
      sensor: '传感器',
      lcd: 'LCD显示',
      architecture: '系统架构'
    };
    return texts[category] || category;
  };

  return (
    <div className={`knowledge-point-card bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* 卡片头部 */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {knowledgePoint.title}
              </h3>
              {showCategory && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(knowledgePoint.category)}`}>
                  {getCategoryText(knowledgePoint.category)}
                </span>
              )}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(knowledgePoint.level)}`}>
                {getLevelText(knowledgePoint.level)}
              </span>
            </div>
            
            {/* 简短内容预览 */}
            {!expanded && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {knowledgePoint.content}
              </p>
            )}
          </div>
          
          {/* 展开/收起图标 */}
          <div className="ml-4">
            <span className={`text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* 展开内容 */}
      {expanded && (
        <div className="px-4 pb-4">
          {/* 详细内容 */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">
              {knowledgePoint.content}
            </p>
          </div>

          {/* 相关概念 */}
          {knowledgePoint.relatedConcepts && knowledgePoint.relatedConcepts.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">相关概念</h4>
              <div className="flex flex-wrap gap-2">
                {knowledgePoint.relatedConcepts.map((concept, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 应用示例 */}
          {knowledgePoint.examples && knowledgePoint.examples.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">应用示例</h4>
              <ul className="space-y-1">
                {knowledgePoint.examples.map((example, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 参考资料 */}
          {knowledgePoint.references && knowledgePoint.references.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">参考资料</h4>
              <ul className="space-y-1">
                {knowledgePoint.references.map((reference, index) => (
                  <li key={index} className="text-sm">
                    <a 
                      href={reference} 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📖 {reference}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface KnowledgePointSectionProps {
  title: string;
  knowledgePoints: KnowledgePoint[];
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * KnowledgePointSection - 知识点分组组件
 * 
 * 用于展示一组相关的知识点（如前置知识点、核心知识点等）
 */
export const KnowledgePointSection: React.FC<KnowledgePointSectionProps> = ({
  title,
  knowledgePoints,
  defaultExpanded = false,
  className = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    defaultExpanded ? new Set(knowledgePoints.map(kp => kp.id)) : new Set()
  );

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedItems(new Set(knowledgePoints.map(kp => kp.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  if (knowledgePoints.length === 0) {
    return null;
  }

  return (
    <div className={`knowledge-point-section ${className}`}>
      {/* 分组标题和控制按钮 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={expandAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            全部展开
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={collapseAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            全部收起
          </button>
        </div>
      </div>

      {/* 知识点列表 */}
      <div className="space-y-3">
        {knowledgePoints.map((knowledgePoint) => (
          <KnowledgePointCard
            key={knowledgePoint.id}
            knowledgePoint={knowledgePoint}
            isExpanded={expandedItems.has(knowledgePoint.id)}
            onToggle={() => toggleItem(knowledgePoint.id)}
            showCategory={true}
          />
        ))}
      </div>
    </div>
  );
};

export default KnowledgePointCard;
