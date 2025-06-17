import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiClock } from 'react-icons/fi';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  image: string;
  progress?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  instructor,
  duration,
  students,
  image,
  progress
}) => {
  return (
    <Link
      to={`/courses/${id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
            <div
              className="bg-primary-500 h-1 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <FiBook className="mr-1" />
            <span>{instructor}</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <FiUsers className="mr-1" />
            <span>{students} 学员</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard; 