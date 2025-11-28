import React from 'react';
import { Card } from '@/components/ui/card';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationCardProps {
  type: 'reminder' | 'alert' | 'achievement' | 'tip';
  title: string;
  message: string;
  timestamp: Date;
  icon: string;
  read: boolean;
  onClick?: () => void;
  description?: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  type,
  title,
  message,
  timestamp,
  icon,
  read,
  onClick,
  description,
}) => {
  const Icon = (Icons[icon as keyof typeof Icons] || Icons.Bell) as LucideIcon;

  const typeConfig = {
    reminder: 'bg-primary/10 text-primary',
    alert: 'bg-warning/10 text-warning',
    achievement: 'bg-accent/10 text-accent',
    tip: 'bg-secondary/10 text-secondary',
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all duration-200 hover:shadow-lg',
        read ? 'bg-card/50 opacity-75' : 'bg-card shadow-neu',
        'border-l-4',
        type === 'reminder' && 'border-l-primary',
        type === 'alert' && 'border-l-warning',
        type === 'achievement' && 'border-l-accent',
        type === 'tip' && 'border-l-secondary'
      )}
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', typeConfig[type])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-semibold text-sm text-foreground">{title}</h4>
            {!read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-2" />}
          </div>
          <p className="text-sm text-muted-foreground mb-1">{message}</p>
          {description && <p className="text-sm text-muted-foreground mb-1">{description}</p>}
          <p className="text-xs text-muted-foreground">{getTimeAgo(timestamp)}</p>
        </div>
      </div>
    </Card>
  );
};
