import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiClock } from 'react-icons/fi';

interface HomeCourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  image: string;
}

const HomeCourseCard: React.FC<HomeCourseCardProps> = ({
  id,
  title,
  description,
  instructor,
  duration,
  students,
  image
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

export default HomeCourseCard; 