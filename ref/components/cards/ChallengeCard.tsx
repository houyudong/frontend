import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiUsers, FiClock } from 'react-icons/fi';

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  participants: number;
  deadline: string;
  prize: string;
  image: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  id,
  title,
  description,
  participants,
  deadline,
  prize,
  image
}) => {
  return (
    <Link
      to={`/challenges/${id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-sm">
          {prize}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <FiUsers className="mr-1" />
            <span>{participants} 参与者</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>截止: {deadline}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChallengeCard; 