import React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, BookOpen, Wind, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CrisisMode() {
  const navigate = useNavigate();

  const emergencyContacts = [
    { name: 'Crisis Helpline', number: '988', available: '24/7' },
    { name: 'Text Support', number: 'Text "HELLO" to 741741', available: '24/7' },
  ];

  const copingExercises = [
    {
      title: '5-4-3-2-1 Grounding',
      description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
      icon: Sparkles,
    },
    {
      title: 'Box Breathing',
      description: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat.',
      icon: Wind,
    },
    {
      title: 'Safe Place Visualization',
      description: 'Close your eyes and imagine your safest, most peaceful place in detail',
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/10 via-background to-warning/10 pb-24">
      <AppHeader title="Crisis Support" />

      <div className="max-w-2xl mx-auto px-6 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <Card className="p-6 bg-gradient-to-br from-destructive/20 to-warning/20 border-2 border-destructive/40 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-destructive mb-3">You're Not Alone</h2>
          <p className="text-foreground/90 mb-4">
            We're here to support you. If you're experiencing a mental health crisis, please reach out to one of these resources immediately.
          </p>
          <div className="bg-card/80 p-4 rounded-xl">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              If this is a life-threatening emergency, call 911
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-neu mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Professional Support
          </h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-primary/5 border border-primary/20"
              >
                <div className="font-semibold text-foreground">{contact.name}</div>
                <div className="text-xl font-bold text-primary my-1">{contact.number}</div>
                <div className="text-sm text-muted-foreground">Available {contact.available}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-calm shadow-neu mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Immediate Coping Techniques
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try these exercises to help calm your nervous system right now:
          </p>
          <div className="space-y-4">
            {copingExercises.map((exercise, index) => {
              const Icon = exercise.icon;
              return (
                <div key={index} className="p-4 rounded-xl bg-card/80">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{exercise.title}</h4>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-fresh shadow-neu">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={() => window.open('tel:988')}>
              <Phone className="w-5 h-5 mr-2" />
              Call Crisis Helpline Now
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Wind className="w-5 h-5 mr-2" />
              Start Guided Breathing
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Fix icon import
import { Sparkles } from 'lucide-react';
