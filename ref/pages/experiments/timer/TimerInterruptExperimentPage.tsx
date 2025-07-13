import React from 'react';
import { FiClock } from 'react-icons/fi';

const TimerInterruptExperimentPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FiClock className="mr-2" />
        定时器中断实验
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">
          本实验将展示如何使用STM32的定时器产生周期性中断，实现LED的定时闪烁。
        </p>
        {/* 实验内容将在这里实现 */}
      </div>
    </div>
  );
};

export default TimerInterruptExperimentPage; 