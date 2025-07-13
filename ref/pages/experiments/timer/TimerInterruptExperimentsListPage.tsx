import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';

const TimerInterruptExperimentsListPage: React.FC = () => {
  const experiments = [
    {
      id: 'basic-timer',
      title: '基础定时器中断',
      description: '使用定时器产生周期性中断，控制LED闪烁',
      path: '/experiments/timer/basic'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FiClock className="mr-2" />
        定时器中断实验
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experiments.map(exp => (
          <Link
            key={exp.id}
            to={exp.path}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{exp.title}</h2>
            <p className="text-gray-600">{exp.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TimerInterruptExperimentsListPage; 