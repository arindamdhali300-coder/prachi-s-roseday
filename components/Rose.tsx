import React from 'react';
import { RoseProps } from '../types';

export const Rose: React.FC<RoseProps> = ({ color, size = 100, className = "", style }) => {
  // Generate a unique ID for the filter to avoid conflicts if multiple roses are on screen
  const filterId = `watercolor-${color.replace('#', '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          {/* Create noise for texture */}
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          {/* Displace the graphic using the noise to create rough edges */}
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          {/* Blur slightly to blend */}
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      <g filter={`url(#${filterId})`}>
        {/* Stem - Hand-drawn style */}
        <path
          d="M50 95C50 95 52 80 48 70C46 65 50 55 50 50"
          stroke="#4a5d23" // Muted green
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
          fill="none"
        />
        
        {/* Leaves - Watercolor wash */}
        <path
          d="M50 85C50 85 62 78 68 82C62 88 56 90 50 85Z"
          fill="#5f7c35"
          opacity="0.5"
        />
        <path
          d="M50 75C50 75 32 70 28 75C34 80 44 78 50 75Z"
          fill="#5f7c35"
          opacity="0.5"
        />

        {/* Rose Petals - Layered with transparency for watercolor effect */}
        <g transform="translate(0, -5)">
            {/* Outer Wash */}
            <path
            d="M50 20C25 20 10 40 25 60C35 75 65 75 75 60C90 40 75 20 50 20Z"
            fill={color}
            opacity="0.4"
            />
            
            {/* Mid Layers */}
            <path
            d="M50 25C35 25 25 35 30 50C35 60 65 60 70 50C75 35 65 25 50 25Z"
            fill={color}
            opacity="0.5"
            />
            
            {/* Core Definition */}
            <path
            d="M50 30C42 32 40 45 50 55C60 45 58 32 50 30Z"
            fill={color}
            opacity="0.6"
            />
            
            {/* Darker accents for depth (simulating wet paint pooling) */}
            <path
            d="M35 45Q40 55 50 60Q60 55 65 45"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.8"
            fill="none"
            filter="brightness(0.7)"
            />
            
            <path
            d="M45 35Q50 30 55 35"
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.6"
            fill="none"
            filter="brightness(0.8)"
            />
        </g>
      </g>
    </svg>
  );
};