import React from 'react';
import { Card } from '@/components/ui/card';

interface DataPoint {
  date: string;
  value: number;
}

interface TrendGraphProps {
  data: DataPoint[];
  title: string;
  color?: string;
  height?: number;
}

export const TrendGraph: React.FC<TrendGraphProps> = ({
  data,
  title,
  color = 'hsl(var(--primary))',
  height = 200,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const points = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((point.value - minValue) / range) * 80;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card className="p-6 bg-card shadow-neu">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ height: `${height}px` }} className="relative">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Area under curve */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={color}
            opacity="0.1"
          />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((point.value - minValue) / range) * 80;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
                className="animate-pulse"
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {data.map((point, index) => (
            <span key={index}>{point.date}</span>
          ))}
        </div>
      </div>
    </Card>
  );
};
