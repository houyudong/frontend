import React, { useState, useEffect, useRef } from 'react';
import { FlowStep, FlowchartConfig } from '../types';

interface FlowchartAnimationProps {
  steps: FlowStep[];
  config?: Partial<FlowchartConfig>;
  onStepClick?: (step: FlowStep) => void;
  className?: string;
}

/**
 * FlowchartAnimation - SVG流程图动画组件
 * 
 * 使用SVG + CSS Animation实现实验流程的可视化展示
 * 支持自动播放、手动控制和交互式步骤说明
 */
const FlowchartAnimation: React.FC<FlowchartAnimationProps> = ({
  steps,
  config = {},
  onStepClick,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // 默认配置
  const defaultConfig: FlowchartConfig = {
    width: 400,
    height: 200,
    autoPlay: false,
    showControls: true,
    stepDelay: 1500,
    theme: 'light'
  };

  const finalConfig = { ...defaultConfig, ...config };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  // 自动播放逻辑
  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      animationRef.current = setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(prev => prev + 1);
      }, finalConfig.stepDelay);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, finalConfig.stepDelay]);

  // 播放控制
  const handlePlay = () => {
    if (currentStep >= steps.length) {
      // 重新开始
      setCurrentStep(0);
      setCompletedSteps(new Set());
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setCompletedSteps(new Set());
  };

  const handleStepClick = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (onStepClick) {
      onStepClick(step);
    }
    
    // 手动跳转到指定步骤
    setCurrentStep(stepIndex + 1);
    setCompletedSteps(new Set(Array.from({ length: stepIndex + 1 }, (_, i) => i)));
    setIsPlaying(false);
  };

  // 获取步骤状态样式
  const getStepStyle = (stepIndex: number) => {
    const isCompleted = completedSteps.has(stepIndex);
    const isCurrent = stepIndex === currentStep;
    
    let baseStyle = 'transition-all duration-500 cursor-pointer hover:opacity-80';
    
    if (isCompleted) {
      baseStyle += ' opacity-100 filter-none';
    } else if (isCurrent) {
      baseStyle += ' opacity-80 animate-pulse';
    } else {
      baseStyle += ' opacity-30 filter-grayscale';
    }
    
    return baseStyle;
  };

  if (steps.length === 0) {
    return (
      <div className={`flowchart-placeholder ${className}`}>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>暂无流程图数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flowchart-animation ${className}`}>
      {/* SVG画布 */}
      <div className="relative bg-gray-50 rounded-lg border overflow-hidden">
        <svg
          width={finalConfig.width}
          height={finalConfig.height}
          viewBox={`0 0 ${finalConfig.width} ${finalConfig.height}`}
          className="w-full h-auto"
        >
          {/* 连接线 */}
          {steps.map((step, index) => {
            if (index === steps.length - 1) return null;
            const nextStep = steps[index + 1];
            return (
              <line
                key={`line-${index}`}
                x1={step.position.x + 50}
                y1={step.position.y}
                x2={nextStep.position.x - 50}
                y2={nextStep.position.y}
                stroke="#e5e7eb"
                strokeWidth="2"
                strokeDasharray="5,5"
                className={completedSteps.has(index) ? 'stroke-blue-400' : 'stroke-gray-300'}
              />
            );
          })}

          {/* 步骤节点 */}
          {steps.map((step, index) => (
            <g
              key={step.id}
              className={getStepStyle(index)}
              onClick={() => handleStepClick(index)}
            >
              {/* 步骤图形 */}
              <g
                dangerouslySetInnerHTML={{ __html: step.svgElement }}
                transform={`translate(${step.position.x - 50}, ${step.position.y - 25})`}
              />
              
              {/* 步骤标题 */}
              <text
                x={step.position.x}
                y={step.position.y + 40}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {step.title}
              </text>
              
              {/* 步骤编号 */}
              <circle
                cx={step.position.x + 30}
                cy={step.position.y - 30}
                r="12"
                className={`${
                  completedSteps.has(index) 
                    ? 'fill-green-500' 
                    : index === currentStep 
                      ? 'fill-blue-500' 
                      : 'fill-gray-400'
                }`}
              />
              <text
                x={step.position.x + 30}
                y={step.position.y - 25}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                {index + 1}
              </text>
            </g>
          ))}
        </svg>

        {/* 当前步骤说明 */}
        {currentStep < steps.length && (
          <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
            <div className="text-sm font-medium text-gray-900 mb-1">
              步骤 {currentStep + 1}: {steps[currentStep].title}
            </div>
            <div className="text-xs text-gray-600">
              {steps[currentStep].description}
            </div>
          </div>
        )}
      </div>

      {/* 控制面板 */}
      {finalConfig.showControls && (
        <div className="flex items-center justify-center space-x-4 mt-4">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep >= steps.length ? '重新播放' : '播放'}
          </button>
          
          <button
            onClick={handlePause}
            disabled={!isPlaying}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            暂停
          </button>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            重置
          </button>
          
          <div className="text-sm text-gray-600">
            {completedSteps.size} / {steps.length} 步骤完成
          </div>
        </div>
      )}

      {/* 步骤列表 */}
      <div className="mt-6 space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              completedSteps.has(index)
                ? 'bg-green-50 border-green-200'
                : index === currentStep
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => handleStepClick(index)}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                completedSteps.has(index)
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-400 text-white'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{step.title}</div>
                <div className="text-sm text-gray-600">{step.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowchartAnimation;
