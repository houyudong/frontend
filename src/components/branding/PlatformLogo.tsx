import React from 'react';
import { Link } from 'react-router-dom';
import './PlatformLogo.css';

interface PlatformLogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
  className?: string;
}

const PlatformLogo: React.FC<PlatformLogoProps> = ({
  size = 'medium',
  withText = true,
  className = ''
}) => {
  const logoSize = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }[size];

  const textSize = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  }[size];

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className={`platform-logo ${logoSize}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" className="logo-circle" />
          <path
            d="M30 50 L45 65 L70 35"
            className="logo-check"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {withText && (
        <span className={`ml-2 font-bold ${textSize} text-primary-600`}>
          STM32 IDE
        </span>
      )}
    </Link>
  );
};

export default PlatformLogo; 