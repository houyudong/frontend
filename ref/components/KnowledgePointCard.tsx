import React, { useState } from 'react';
import { KnowledgePoint, KnowledgeCategory } from '../types';

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
      basic: 'bg-green-50 border-green-200',
      intermediate: 'bg-yellow-50 border-yellow-200',
      advanced: 'bg-red-50 border-red-200'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className={`border rounded-lg ${getLevelColor(knowledgePoint.level)} ${className}`}>
      <div 
        className="p-4 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-900">{knowledgePoint.title}</h3>
              {showCategory && (
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(knowledgePoint.category)}`}>
                  {knowledgePoint.category}
                </span>
              )}
            </div>
            {!expanded && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {knowledgePoint.content}
              </p>
            )}
          </div>
          <div className="ml-4 text-gray-400">
            {expanded ? '▼' : '▶'}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200 bg-white bg-opacity-50">
          <div className="pt-4">
            <p className="text-sm text-gray-700 mb-4">
              {knowledgePoint.content}
            </p>

            {knowledgePoint.relatedConcepts && knowledgePoint.relatedConcepts.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">相关概念</h4>
                <div className="flex flex-wrap gap-2">
                  {knowledgePoint.relatedConcepts.map((concept, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {knowledgePoint.examples && knowledgePoint.examples.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">应用示例</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {knowledgePoint.examples.map((example, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {knowledgePoint.references && knowledgePoint.references.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">参考资料</h4>
                <ul className="text-sm space-y-1">
                  {knowledgePoint.references.map((reference, index) => (
                    <li key={index}>
                      <a 
                        href={reference} 
                        className="text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {reference}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
