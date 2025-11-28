import React from 'react';
import { cn } from '@/lib/utils';

interface StressScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const StressScoreGauge: React.FC<StressScoreGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score < 30) return 'stroke-stress-low';
    if (score < 55) return 'stroke-stress-moderate';
    if (score < 75) return 'stroke-stress-high';
    return 'stroke-stress-critical';
  };

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  };

  const textSize = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className={cn('relative', sizeClasses[size])}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-muted"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-all duration-1000 ease-out', getColor())}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold', textSize[size])}>{score}</span>
        {showLabel && <span className="text-xs text-muted-foreground mt-1">Stress Score</span>}
      </div>
    </div>
  );
};
