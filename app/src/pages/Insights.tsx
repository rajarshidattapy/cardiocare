import React from 'react';
import { useWellness } from '@/contexts/WellnessContext';
import { NotificationCard } from '@/components/wellness/NotificationCard';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/card';
import { TrendGraph } from '@/components/wellness/TrendGraph';
import { BellOff } from 'lucide-react';

export default function Insights() {
  const { insights, markInsightRead, weeklyInsights, recommendations } = useWellness();

  const unreadCount = insights.filter((i) => !i.read).length;

  const majorStressReasons = [
    { factor: 'Work pressure', impact: 'High', icon: '🧳' },
    { factor: 'Sleep quality', impact: 'Moderate', icon: '🌙' },
    { factor: 'Physical activity', impact: 'Low', icon: '🏃' },
    { factor: 'Social connections', impact: 'Moderate', icon: '🧑‍🤝‍🧑' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader
        title="Insights"
        subtitle={`${unreadCount} unread insight${unreadCount !== 1 ? 's' : ''}`}
      />

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* 7-Day Stress Trend Graph */}
        <Card className="p-6 bg-gradient-calm shadow-neu">
          <h3 className="font-semibold text-lg mb-4">7-Day Stress Trend</h3>
          <TrendGraph
            title="Stress Levels Over the Week"
            data={weeklyInsights.map((day) => ({
              date: day.date,
              value: day.stressScore,
            }))}
          />
        </Card>

        {/* Major Stress Reasons */}
        <Card className="p-6 bg-gradient-warm shadow-neu">
          <h3 className="font-semibold text-lg mb-4">Major Stress Reasons</h3>
          <ul className="space-y-3">
            {majorStressReasons.map((reason, index) => (
              <li key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-primary text-xl">{reason.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{reason.factor}</h4>
                  <p className="text-xs text-muted-foreground">Impact: {reason.impact}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 bg-gradient-fresh shadow-neu">
          <h3 className="font-semibold text-lg mb-4">Recommendations</h3>
          <ul className="space-y-3">
            {recommendations.map((rec) => (
              <li key={rec.id} className="flex flex-col gap-2">
                <h4 className="font-semibold text-sm text-foreground">{rec.title}</h4>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
