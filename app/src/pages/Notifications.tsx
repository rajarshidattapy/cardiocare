import React from 'react';
import { useWellness } from '@/contexts/WellnessContext';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/card';
import { BellOff } from 'lucide-react';

export default function Notifications() {
  const { alerts } = useWellness();

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader
        title="Alerts"
        subtitle="Your recent stress analysis results"
      />

      <div className="max-w-2xl mx-auto px-6 py-6">
        {alerts.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-calm">
            <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No alerts available!</h3>
            <p className="text-muted-foreground">Run a stress analysis to see results here.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {alerts
              .slice()
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((alert) => (
                <Card
                  key={alert.id}
                  className="p-6 bg-white border border-gray-200 shadow-md rounded-lg"
                >
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
