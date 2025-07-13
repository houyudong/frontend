import React, { useState, useEffect, useRef } from 'react';
import { FlowStep, FlowchartConfig } from '../types/experimentTypes';

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
      const step = steps[currentStep];
      animationRef.current = setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(prev => prev + 1);
      }, step.duration + step.animationDelay);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, steps]);

  // 开始/暂停动画
  const toggleAnimation = () => {
    if (currentStep >= steps.length) {
      // 重新开始
      setCurrentStep(0);
      setCompletedSteps(new Set());
    }
    setIsPlaying(!isPlaying);
  };

  // 重置动画
  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  // 跳转到指定步骤
  const goToStep = (stepIndex: number) => {
    setIsPlaying(false);
    setCurrentStep(stepIndex);
    setCompletedSteps(new Set(Array.from({ length: stepIndex }, (_, i) => i)));
  };

  // 处理步骤点击
  const handleStepClick = (step: FlowStep, index: number) => {
    if (onStepClick) {
      onStepClick(step);
    }
    if (!isPlaying) {
      goToStep(index + 1);
    }
  };

  // 获取步骤样式
  const getStepStyle = (index: number) => {
    const isCompleted = completedSteps.has(index);
    const isCurrent = index === currentStep && isPlaying;
    
    return {
      opacity: isCompleted ? 1 : (isCurrent ? 0.8 : 0.3),
      transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
      transition: 'all 0.3s ease-in-out'
    };
  };

  // 生成连接线
  const generateConnections = () => {
    const connections = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const currentPos = steps[i].position;
      const nextPos = steps[i + 1].position;
      
      connections.push(
        <line
          key={`connection-${i}`}
          x1={currentPos.x + 20}
          y1={currentPos.y}
          x2={nextPos.x - 20}
          y2={nextPos.y}
          stroke={completedSteps.has(i) ? '#10B981' : '#D1D5DB'}
          strokeWidth="2"
          strokeDasharray={completedSteps.has(i) ? 'none' : '5,5'}
          style={{
            transition: 'stroke 0.3s ease-in-out'
          }}
        />
      );
    }
    return connections;
  };

  return (
    <div className={`flowchart-animation ${className}`}>
      {/* SVG画布 */}
      <div className="relative bg-white rounded-lg border border-gray-200 p-4">
        <svg
          width={finalConfig.width}
          height={finalConfig.height}
          viewBox={`0 0 ${finalConfig.width} ${finalConfig.height}`}
          className="w-full h-auto"
        >
          {/* 背景网格 */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* 连接线 */}
          {generateConnections()}

          {/* 流程步骤 */}
          {steps.map((step, index) => (
            <g
              key={step.id}
              style={getStepStyle(index)}
              onClick={() => handleStepClick(step, index)}
              className="cursor-pointer"
            >
              {/* 步骤图形 */}
              <g
                dangerouslySetInnerHTML={{ __html: step.svgElement }}
                transform={`translate(${step.position.x - 20}, ${step.position.y - 20})`}
              />
              
              {/* 步骤编号 */}
              <circle
                cx={step.position.x}
                cy={step.position.y - 35}
                r="12"
                fill={completedSteps.has(index) ? '#10B981' : '#6B7280'}
                className="transition-colors duration-300"
              />
              <text
                x={step.position.x}
                y={step.position.y - 31}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                {index + 1}
              </text>

              {/* 步骤标题 */}
              <text
                x={step.position.x}
                y={step.position.y + 35}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {step.title}
              </text>
            </g>
          ))}

          {/* 当前步骤高亮效果 */}
          {isPlaying && currentStep < steps.length && (
            <circle
              cx={steps[currentStep].position.x}
              cy={steps[currentStep].position.y}
              r="30"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values="25;35;25"
                dur="1s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0.2;0.6"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </svg>

        {/* 步骤说明 */}
        {currentStep < steps.length && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-1">
              步骤 {currentStep + 1}: {steps[currentStep].title}
            </h4>
            <p className="text-sm text-blue-700">
              {steps[currentStep].description}
            </p>
          </div>
        )}
      </div>

      {/* 控制面板 */}
      {finalConfig.showControls && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleAnimation}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isPlaying ? '⏸️ 暂停' : currentStep >= steps.length ? '🔄 重新开始' : '▶️ 播放'}
            </button>
            <button
              onClick={resetAnimation}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              🔄 重置
            </button>
          </div>

          {/* 进度指示器 */}
          <div className="flex items-center space-x-1">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  completedSteps.has(index)
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
                title={`跳转到步骤 ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 完成提示 */}
      {currentStep >= steps.length && !isPlaying && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <span className="text-green-600 text-xl mr-2">✅</span>
            <div>
              <h4 className="font-medium text-green-900">流程演示完成</h4>
              <p className="text-sm text-green-700">
                您已经了解了完整的实验流程，现在可以开始动手实验了！
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowchartAnimation;
