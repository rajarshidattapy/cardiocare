import React, { useState } from 'react';
import { useWellness } from '@/contexts/WellnessContext';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export default function WellnessPlan() {
  const { wellnessPlans, togglePlan } = useWellness();
  const [editablePlan, setEditablePlan] = useState(null);

  const handleEdit = (plan) => {
    setEditablePlan(plan);
  };

  const handleSave = () => {
    // Logic to save the updated plan
    setEditablePlan(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader 
        title="Wellness Plan" 
        subtitle="Your personalized daily routines" 
      />

      <div className="max-w-2xl mx-auto px-6 py-6">
        <Card className="p-6 bg-gradient-warm shadow-neu mb-6">
          <h3 className="font-semibold text-lg mb-2">Today's Schedule</h3>
          <p className="text-sm text-muted-foreground">
            Consistency is key! Keep up with your wellness routine to reduce stress and improve well-being.
          </p>
        </Card>

        <div className="space-y-4">
          {wellnessPlans.map((plan) => {
            const Icon = (Icons[plan.icon as keyof typeof Icons] || Icons.Calendar) as LucideIcon;

            return (
              <Card
                key={plan.id}
                className={`p-5 transition-all duration-300 ${
                  plan.enabled
                    ? 'bg-gradient-to-br from-card to-primary/5 shadow-neu border-primary/20'
                    : 'bg-card/50 opacity-75'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    plan.enabled ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    <Icon className={`w-6 h-6 ${plan.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {editablePlan?.id === plan.id ? (
                      <div>
                        <input
                          type="text"
                          value={editablePlan.title}
                          onChange={(e) =>
                            setEditablePlan({ ...editablePlan, title: e.target.value })
                          }
                          className="w-full mb-2 p-2 border rounded"
                        />
                        <textarea
                          value={editablePlan.description}
                          onChange={(e) =>
                            setEditablePlan({ ...editablePlan, description: e.target.value })
                          }
                          className="w-full mb-2 p-2 border rounded"
                        />
                        <div className="flex gap-4">
                          <input
                            type="text"
                            value={editablePlan.time}
                            onChange={(e) =>
                              setEditablePlan({ ...editablePlan, time: e.target.value })
                            }
                            className="w-1/2 p-2 border rounded"
                          />
                          <input
                            type="text"
                            value={editablePlan.frequency}
                            onChange={(e) =>
                              setEditablePlan({ ...editablePlan, frequency: e.target.value })
                            }
                            className="w-1/2 p-2 border rounded"
                          />
                        </div>
                        <button
                          onClick={handleSave}
                          className="mt-2 px-4 py-2 bg-primary text-white rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-foreground">{plan.title}</h3>
                          <Switch
                            checked={plan.enabled}
                            onCheckedChange={() => togglePlan(plan.id)}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>🕒 {plan.time}</span>
                          <span>📅 {plan.frequency}</span>
                        </div>
                        <button
                          onClick={() => handleEdit(plan)}
                          className="mt-2 px-4 py-2 bg-secondary text-white rounded"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 p-5 bg-gradient-fresh shadow-neu">
          <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-muted-foreground">
            Set reminders 10 minutes before each activity to give yourself time to prepare mentally.
          </p>
        </Card>
      </div>
    </div>
  );
}
