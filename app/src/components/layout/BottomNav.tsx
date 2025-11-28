import React from 'react';
import { NavLink } from '@/components/NavLink';
import { Home, Bell, Calendar, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/notifications', icon: Bell, label: 'Alerts' },
    { to: '/plan', icon: Calendar, label: 'Plan' },
    { to: '/insights', icon: BarChart3, label: 'Insights' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className="flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-xl transition-colors"
            activeClassName="text-primary bg-primary/10"
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('w-5 h-5 mb-1', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span className={cn('text-xs font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
