import React, { useState } from 'react';

/**
 * 实验步骤指南组件
 * @param {Object} props - 组件属性
 * @param {Array} props.steps - 步骤数组，每个步骤包含title, description, code, image_url等字段
 */
const StepByStepGuide = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            步骤 {currentStep + 1} / {steps.length}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% 完成
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 当前步骤 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-4">{steps[currentStep].title}</h3>
        <p className="text-gray-700 mb-6">{steps[currentStep].description}</p>

        {/* 代码块 */}
        {steps[currentStep].code && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">代码示例：</h4>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              <code>{steps[currentStep].code}</code>
            </pre>
          </div>
        )}

        {/* 图片 */}
        {steps[currentStep].image_url && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">参考图：</h4>
            <img
              src={steps[currentStep].image_url}
              alt={`步骤 ${currentStep + 1}`}
              className="rounded-lg max-h-80 object-contain"
            />
          </div>
        )}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between">
        <button
          onClick={goToPrevStep}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          上一步
        </button>
        <button
          onClick={goToNextStep}
          disabled={currentStep === steps.length - 1}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentStep === steps.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          下一步
        </button>
      </div>
    </div>
  );
};

export default StepByStepGuide; 