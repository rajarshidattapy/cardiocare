import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useWellness } from '@/contexts/WellnessContext';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trophy, Moon, Activity, LogOut, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { userProfile, updateUserProfile } = useWellness();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  const handleSave = () => {
    updateUserProfile(formData);
    setEditing(false);
    toast({
      title: 'Profile updated',
      description: 'Your preferences have been saved successfully.',
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader title="Profile" subtitle="Your wellness settings" />

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        <Card className="p-6 bg-gradient-calm shadow-neu">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{userProfile.avatar}</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {user?.fullName || user?.firstName || userProfile.name}
              </h2>
              {user?.primaryEmailAddress && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user.primaryEmailAddress.emailAddress}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Trophy className="w-4 h-4 text-accent" />
                <span>{userProfile.wellnessStreak} day wellness streak</span>
              </div>
            </div>
          </div>

          {!editing ? (
            <div className="space-y-3">
              <Button onClick={() => setEditing(true)} className="w-full">
                Edit Profile
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(userProfile);
                    setEditing(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 bg-card shadow-neu">
          <h3 className="text-lg font-semibold mb-4">Daily Goals</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Sleep Goal</div>
                  <div className="text-sm text-muted-foreground">Target hours per night</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {editing ? (
                  <Input
                    type="number"
                    value={formData.sleepGoal}
                    onChange={(e) =>
                      setFormData({ ...formData, sleepGoal: parseFloat(e.target.value) })
                    }
                    className="w-20 text-center"
                    min="6"
                    max="10"
                    step="0.5"
                  />
                ) : (
                  <span className="text-2xl font-bold">{userProfile.sleepGoal}</span>
                )}
                <span className="text-sm text-muted-foreground">hrs</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-accent" />
                <div>
                  <div className="font-medium">Activity Goal</div>
                  <div className="text-sm text-muted-foreground">Target minutes per day</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {editing ? (
                  <Input
                    type="number"
                    value={formData.activityGoal}
                    onChange={(e) =>
                      setFormData({ ...formData, activityGoal: parseInt(e.target.value) })
                    }
                    className="w-20 text-center"
                    min="15"
                    max="120"
                    step="5"
                  />
                ) : (
                  <span className="text-2xl font-bold">{userProfile.activityGoal}</span>
                )}
                <span className="text-sm text-muted-foreground">min</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-neu">
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <div>
              <div className="font-medium">Push Notifications</div>
              <div className="text-sm text-muted-foreground">Get reminders and alerts</div>
            </div>
            <Switch
              checked={editing ? formData.notificationsEnabled : userProfile.notificationsEnabled}
              onCheckedChange={(checked) =>
                editing && setFormData({ ...formData, notificationsEnabled: checked })
              }
              disabled={!editing}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
