import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface RecommendationCardProps {
  title: string;
  description: string;
  category: string;
  duration: string;
  icon: string;
  progress: number;
  onStart?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  category,
  duration,
  icon,
  progress,
  onStart,
}) => {
  const Icon = (Icons[icon as keyof typeof Icons] || Icons.Sparkles) as LucideIcon;

  return (
    <Card className="p-5 bg-gradient-to-br from-card to-muted/30 shadow-neu hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{category} • {duration}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          
          {progress > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <Button
            onClick={onStart}
            size="sm"
            variant={progress > 0 ? 'outline' : 'default'}
            className="w-full"
          >
            {progress > 0 ? 'Continue' : 'Start Activity'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
