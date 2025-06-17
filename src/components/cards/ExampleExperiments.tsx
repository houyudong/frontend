import React from 'react';
import { Link } from 'react-router-dom';
import { FiCode, FiArrowRight } from 'react-icons/fi';
import './ExampleExperiments.css';

interface ExampleExperiment {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  image: string;
}

interface ExampleExperimentsProps {
  experiments: ExampleExperiment[];
}

const ExampleExperiments: React.FC<ExampleExperimentsProps> = ({ experiments }) => {
  const getDifficultyBadge = (difficulty: string): JSX.Element => {
    const badges = {
      beginner: { color: 'bg-green-100 text-green-800', text: '入门' },
      intermediate: { color: 'bg-yellow-100 text-yellow-800', text: '中级' },
      advanced: { color: 'bg-red-100 text-red-800', text: '高级' }
    };
    const badge = badges[difficulty as keyof typeof badges] || badges.beginner;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="example-experiments">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map(experiment => (
          <Link
            key={experiment.id}
            to={`/experiments/${experiment.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={experiment.image}
                alt={experiment.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                {getDifficultyBadge(experiment.difficulty)}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{experiment.category}</span>
                <FiCode className="text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{experiment.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{experiment.description}</p>
              <div className="flex items-center text-primary-500 text-sm">
                <span>查看实验</span>
                <FiArrowRight className="ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExampleExperiments; 