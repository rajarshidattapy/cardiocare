import React from 'react';
import { useWellness } from '@/contexts/WellnessContext';
import { NotificationCard } from '@/components/wellness/NotificationCard';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/card';
import { BellOff, TrendingUp } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead } = useWellness();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader
        title="Notifications"
        subtitle={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`}
      />

      <div className="max-w-2xl mx-auto px-6 py-6">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-calm">
            <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No new notifications at the moment.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {unreadCount > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  New ({unreadCount})
                </h3>
              </div>
            )}
            {notifications
              .filter((n) => !n.read)
              .map((notification) => (
                <div key={notification.id}>
                  <NotificationCard
                    {...notification}
                    onClick={() => markNotificationRead(notification.id)}
                  />
                  {/* Display stress score if available */}
                  {(notification as any).stressScore !== undefined && (
                    <div className="ml-4 mt-2 mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>Stress Score: {(notification as any).stressScore}/100</span>
                    </div>
                  )}
                </div>
              ))}

            {notifications.some((n) => n.read) && (
              <>
                <div className="mt-8 mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Earlier
                  </h3>
                </div>
                {notifications
                  .filter((n) => n.read)
                  .map((notification) => (
                    <div key={notification.id}>
                      <NotificationCard {...notification} />
                      {/* Display stress score if available */}
                      {(notification as any).stressScore !== undefined && (
                        <div className="ml-4 mt-2 mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <TrendingUp className="w-3 h-3" />
                          <span>Stress Score: {(notification as any).stressScore}/100</span>
                        </div>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
