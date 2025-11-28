import React from 'react';
import { useWellness } from '@/contexts/WellnessContext';
import { AppHeader } from '@/components/layout/AppHeader';
import { RecommendationCard } from '@/components/wellness/RecommendationCard';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function Recommendations() {
  const { recommendations } = useWellness();

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader 
        title="Recommendations" 
        subtitle="Personalized activities for you" 
      />

      <div className="max-w-2xl mx-auto px-6 py-6">
        <Card className="p-6 bg-gradient-warm shadow-neu mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Your Personalized Plan</h3>
              <p className="text-sm text-muted-foreground">
                Based on your current stress patterns, we've selected activities that can help you feel better.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              {...rec}
              onStart={() => {
                console.log('Starting activity:', rec.title);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
