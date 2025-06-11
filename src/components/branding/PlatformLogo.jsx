import React, { useState, useEffect } from 'react';
import './PlatformLogo.css';

const PlatformLogo = ({ size = 'default', withText = true, className = '' }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    small: 'h-8',
    default: 'h-10',
    large: 'h-12'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`logo-shine ${isAnimated ? 'logo-fade-in' : 'logo-hidden'}`}>
        <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg"
            className={sizeClasses[size]}>
          {/* Microchip base */}
          <rect x="5" y="10" width="30" height="20" rx="2" stroke="#2563EB" strokeWidth="1.5" fill="#E0F2FE" fillOpacity="0.6" />

          {/* Circuit lines */}
          <path className="circuit-line" d="M10,15 L30,15" stroke="#2563EB" strokeWidth="1.5" />
          <path className="circuit-line" d="M10,20 L30,20" stroke="#2563EB" strokeWidth="1.5" />
          <path className="circuit-line" d="M10,25 L30,25" stroke="#2563EB" strokeWidth="1.5" />
          <path className="circuit-line" d="M15,10 L15,30" stroke="#2563EB" strokeWidth="1.5" />
          <path className="circuit-line" d="M20,10 L20,30" stroke="#2563EB" strokeWidth="1.5" />
          <path className="circuit-line" d="M25,10 L25,30" stroke="#2563EB" strokeWidth="1.5" />

          {/* Neural network nodes */}
          <circle className="node node-1" cx="15" cy="15" r="2" fill="#7C3AED" />
          <circle className="node node-2" cx="25" cy="20" r="2" fill="#7C3AED" />
          <circle className="node node-3" cx="20" cy="25" r="2" fill="#7C3AED" />

          {/* Neural connections */}
          <path className="circuit-line" d="M15,15 L25,20" stroke="#7C3AED" strokeWidth="1" />
          <path className="circuit-line" d="M25,20 L20,25" stroke="#7C3AED" strokeWidth="1" />
          <path className="circuit-line" d="M15,15 L20,25" stroke="#7C3AED" strokeWidth="1" />

          {/* Platform text */}
          {withText && (
            <g className="text-appear">
              <text x="42" y="25" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#1E293B">
                <tspan fill="#2563EB">嵌入式</tspan>
                <tspan fill="#7C3AED">AI实训平台</tspan>
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default PlatformLogo;