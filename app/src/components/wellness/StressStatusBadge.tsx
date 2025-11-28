import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StressStatusBadgeProps {
  status: 'low' | 'moderate' | 'high' | 'critical';
  size?: 'sm' | 'md' | 'lg';
}

export const StressStatusBadge: React.FC<StressStatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = {
    low: {
      label: 'Low Stress',
      className: 'bg-stress-low/20 text-stress-low border-stress-low/40',
    },
    moderate: {
      label: 'Moderate',
      className: 'bg-stress-moderate/20 text-stress-moderate border-stress-moderate/40',
    },
    high: {
      label: 'High Stress',
      className: 'bg-stress-high/20 text-stress-high border-stress-high/40',
    },
    critical: {
      label: 'Critical',
      className: 'bg-stress-critical/20 text-stress-critical border-stress-critical/40',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-semibold border-2 shadow-sm',
        config[status].className,
        sizeClasses[size]
      )}
    >
      {config[status].label}
    </Badge>
  );
};
