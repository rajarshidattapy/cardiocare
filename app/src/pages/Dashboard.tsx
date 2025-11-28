import React, { useEffect, useState } from 'react';
import { useWellness } from '@/contexts/WellnessContext';
import { StressScoreGauge } from '@/components/wellness/StressScoreGauge';
import { StressStatusBadge } from '@/components/wellness/StressStatusBadge';
import { Card } from '@/components/ui/card';
import { Heart, Activity, Wind, Moon, TrendingUp, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const StressAnalysisButton = ({ isLoading, onClick }: { isLoading: boolean; onClick: () => void }) => (
  <Button
    onClick={onClick}
    disabled={isLoading}
    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md py-2 shadow-md"
  >
    {isLoading ? (
      <>
        <Loader2 className="animate-spin mr-2" />
        Analyzing...
      </>
    ) : (
      <>
        <Sparkles className="w-4 h-4 mr-2" />
        Get Stress Analysis
      </>
    )}
  </Button>
);

export default function Dashboard() {
  const { stressData, loadNotifications, addAlert } = useWellness();
  const navigate = useNavigate();
  const [isLoadingMock, setIsLoadingMock] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const metrics = [
    { label: 'HRV', value: Math.round(stressData.hrv), unit: 'ms', icon: Heart, color: 'text-primary' },
    { label: 'Heart Rate', value: Math.round(stressData.heartRate), unit: 'bpm', icon: Activity, color: 'text-secondary' },
    { label: 'Breathing', value: Math.round(stressData.breathingRate), unit: '/min', icon: Wind, color: 'text-accent' },
    { label: 'Sleep', value: stressData.sleepHours.toFixed(1), unit: 'hrs', icon: Moon, color: 'text-warning' },
  ];

  const showCrisisMode = stressData.status === 'critical';

  const handleMockStressAnalysis = async () => {
    setIsLoadingMock(true);
    try {
      const { mockStressAnalysis } = await import('@/lib/api');
      const notifications = await mockStressAnalysis();

      // Show success toast
      toast({
        title: "Stress Analysis Complete! 🎯",
        description: `Generated ${notifications.length} stress notifications based on different scenarios. Check your notifications!`,
        duration: 5000,
      });

      // Reload notifications to show the new ones
      await loadNotifications();
    } catch (error) {
      console.error('Failed to generate mock stress analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate stress analysis. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoadingMock(false);
    }
  };

  const handleGetStressAnalysis = () => {
    setIsLoadingAnalysis(true);
    setTimeout(() => {
      const stressScore = stressData.score;
      let message = '';

      if (stressScore < 20) {
        message = `Your stress level is low with a score of ${stressScore}. Keep up the good work!`;
      } else if (stressScore < 40) {
        message = `You're holding a moderate amount of stress – a score of ${stressScore} suggests you're feeling a bit tense.`;
      } else if (stressScore < 60) {
        message = `Your stress level is elevated with a score of ${stressScore}. Consider taking some time to relax.`;
      } else {
        message = `High stress alert! Your score of ${stressScore} indicates significant stress. Please prioritize self-care.`;
      }

      setAnalysisMessage(message);
      addAlert({
        id: Date.now().toString(),
        message,
        timestamp: new Date().toISOString(),
      });
      setIsLoadingAnalysis(false);
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const stressScore = stressData.score;

      fetch('/src/data/stressAnalysisResponses.json')
        .then((response) => response.json())
        .then((data) => {
          const matchedResponse = data.find(
            (item) => stressScore >= item.range[0] && stressScore < item.range[1]
          );

          if (matchedResponse) {
            setAnalysisMessage(matchedResponse.message);
            addAlert({
              id: Date.now().toString(),
              message: matchedResponse.message,
              timestamp: new Date().toISOString(),
            });
          }
        });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [stressData, addAlert]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-calm px-6 pt-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
              <p className="text-muted-foreground mt-1">Your body is talking. We're listening.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-6">
        {showCrisisMode && (
          <Card className="mb-6 p-5 bg-gradient-to-br from-destructive/20 to-warning/20 border-2 border-destructive/40 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-destructive mb-2">High Stress Alert</h3>
                <p className="text-sm text-foreground/80 mb-4">
                  Your stress levels need attention right now. Please consider these resources.
                </p>
                <Button
                  onClick={() => navigate('/crisis')}
                  variant="default"
                  className="w-full bg-destructive hover:bg-destructive/90"
                >
                  Get Immediate Support
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-8 bg-card shadow-neu mb-6">
          <div className="flex flex-col items-center">
            <StressScoreGauge score={stressData.score} size="lg" />
            <div className="mt-4">
              <StressStatusBadge status={stressData.status} size="lg" />
            </div>

            {/* Recommendation Display */}
            {stressData.recommendation && (
              <div className="mt-6 w-full p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-primary mb-1">Personalized Recommendation</h4>
                    <p className="text-sm text-foreground/80">{stressData.recommendation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Unified Stress Analysis Button */}
            <div className="mt-6 w-full">
              <StressAnalysisButton
                isLoading={isLoadingAnalysis}
                onClick={handleGetStressAnalysis}
              />
            </div>

            <p className="text-sm text-muted-foreground mt-3 text-center">
              Last updated: {stressData.timestamp.toLocaleTimeString()}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>Click button for AI-powered analysis</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((metric) => (
            <Card key={metric.label} className="p-5 bg-gradient-to-br from-card to-muted/30 shadow-neu">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                </div>
                <div className="mt-auto">
                  <div className="text-3xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{metric.unit}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-gradient-fresh shadow-neu">
          <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="bg-card/80 hover:bg-card"
              onClick={() => navigate('/plan')}
            >
              View Today's Plan
            </Button>
            <Button
              variant="outline"
              className="bg-card/80 hover:bg-card"
              onClick={() => navigate('/insights')}
            >
              Weekly Insights
            </Button>
          </div>
          {analysisMessage && (
            <p className="mt-4 text-sm text-muted-foreground">{analysisMessage}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
