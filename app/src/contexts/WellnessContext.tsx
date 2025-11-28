import React, { createContext, useContext, useState, useEffect } from 'react';
import { WellnessContext } from './WellnessContextDefinition';

export interface StressData {
  score: number;
  status: 'low' | 'moderate' | 'high' | 'critical';
  hrv: number;
  heartRate: number;
  breathingRate: number;
  sleepHours: number;
  activityMinutes: number;
  timestamp: Date;
  recommendation?: string;
  explanation?: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'alert' | 'achievement' | 'tip';
  title: string;
  message: string;
  timestamp: Date;
  icon: string;
  read: boolean;
}

export interface WellnessPlan {
  id: string;
  title: string;
  description: string;
  time: string;
  frequency: string;
  enabled: boolean;
  icon: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  icon: string;
  progress: number;
}

export interface WeeklyInsight {
  date: string;
  stressScore: number;
  avgHRV: number;
  avgSleep: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  sleepGoal: number;
  activityGoal: number;
  notificationsEnabled: boolean;
  wellnessStreak: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
}

interface WellnessContextType {
  stressData: StressData;
  notifications: Notification[];
  wellnessPlans: WellnessPlan[];
  recommendations: Recommendation[];
  weeklyInsights: WeeklyInsight[];
  userProfile: UserProfile;
  insights: Insight[];
  markNotificationRead: (id: string) => void;
  togglePlan: (id: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  fetchStressPrediction: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  markInsightRead: (id: string) => void;
  isLoadingStress: boolean;
  alerts: {
    id: string;
    message: string;
    timestamp: string;
  }[];
  addAlert: (alert: { id: string; message: string; timestamp: string }) => void;
}

export const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};

const getStressStatus = (score: number): 'low' | 'moderate' | 'high' | 'critical' => {
  if (score < 30) return 'low';
  if (score < 55) return 'moderate';
  if (score < 75) return 'high';
  return 'critical';
};

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoadingStress, setIsLoadingStress] = useState(false);
  const [stressData, setStressData] = useState<StressData>({
    score: 42,
    status: 'moderate',
    hrv: 65,
    heartRate: 72,
    breathingRate: 14,
    sleepHours: 7.2,
    activityMinutes: 45,
    timestamp: new Date(),
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'tip',
      title: 'Box Breathing Exercise',
      message: 'Calm your nervous system with 4-4-4-4 breathing',
      timestamp: new Date(),
      icon: 'Wind',
      read: false,
    },
    {
      id: '2',
      type: 'tip',
      title: 'Nature Exposure',
      message: 'Spend time outdoors to reduce cortisol levels',
      timestamp: new Date(),
      icon: 'Tree',
      read: false,
    },
    {
      id: '3',
      type: 'tip',
      title: 'Progressive Muscle Relaxation',
      message: 'Release physical tension systematically',
      timestamp: new Date(),
      icon: 'Smile',
      read: false,
    },
    {
      id: '4',
      type: 'tip',
      title: 'Digital Detox Hour',
      message: 'Screen-free time before bed for better sleep',
      timestamp: new Date(),
      icon: 'Moon',
      read: false,
    },
  ]);

  const [wellnessPlans, setWellnessPlans] = useState<WellnessPlan[]>([
    {
      id: '1',
      title: 'Morning Meditation',
      description: 'Start your day with 10 minutes of mindfulness',
      time: '07:00 AM',
      frequency: 'Daily',
      enabled: true,
      icon: 'Sunrise',
    },
    {
      id: '2',
      title: 'Evening Walk',
      description: 'Gentle outdoor activity to unwind',
      time: '06:30 PM',
      frequency: 'Daily',
      enabled: true,
      icon: 'Footprints',
    },
    {
      id: '3',
      title: 'Sleep Hygiene Routine',
      description: 'Wind down with screen-free time',
      time: '09:30 PM',
      frequency: 'Daily',
      enabled: true,
      icon: 'Moon',
    },
    {
      id: '4',
      title: 'Midday Stretch',
      description: 'Release tension with gentle stretching',
      time: '12:30 PM',
      frequency: 'Weekdays',
      enabled: false,
      icon: 'Activity',
    },
  ]);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Box Breathing Exercise',
      description: 'Calm your nervous system with 4-4-4-4 breathing',
      category: 'Breathing',
      duration: '5 min',
      icon: 'Wind',
      progress: 75,
    },
    {
      id: '2',
      title: 'Nature Exposure',
      description: 'Spend time outdoors to reduce cortisol levels',
      category: 'Activity',
      duration: '20 min',
      icon: 'Trees',
      progress: 30,
    },
    {
      id: '3',
      title: 'Progressive Muscle Relaxation',
      description: 'Release physical tension systematically',
      category: 'Relaxation',
      duration: '15 min',
      icon: 'Sparkles',
      progress: 0,
    },
    {
      id: '4',
      title: 'Digital Detox Hour',
      description: 'Screen-free time before bed for better sleep',
      category: 'Sleep',
      duration: '60 min',
      icon: 'Smartphone',
      progress: 50,
    },
  ]);

  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([
    { date: 'Mon', stressScore: 45, avgHRV: 62, avgSleep: 7.0 },
    { date: 'Tue', stressScore: 38, avgHRV: 68, avgSleep: 7.5 },
    { date: 'Wed', stressScore: 52, avgHRV: 58, avgSleep: 6.8 },
    { date: 'Thu', stressScore: 48, avgHRV: 64, avgSleep: 7.2 },
    { date: 'Fri', stressScore: 42, avgHRV: 65, avgSleep: 7.2 },
    { date: 'Sat', stressScore: 28, avgHRV: 72, avgSleep: 8.1 },
    { date: 'Sun', stressScore: 32, avgHRV: 70, avgSleep: 7.8 },
  ]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex',
    avatar: '👤',
    sleepGoal: 8,
    activityGoal: 30,
    notificationsEnabled: true,
    wellnessStreak: 7,
  });

  const [insights, setInsights] = useState<Insight[]>([
    {
      id: '1',
      title: 'Insight 1',
      description: 'Description for Insight 1',
      timestamp: new Date(),
      read: false,
    },
  ]);

  const [alerts, setAlerts] = useState<{
    id: string;
    message: string;
    timestamp: string;
  }[]>([]);

  // Fetch stress prediction from backend
  const fetchStressPrediction = async () => {
    setIsLoadingStress(true);
    try {
      const { predictStress, generateSampleHealthData } = await import('@/lib/api');
      const sampleData = generateSampleHealthData();
      const result = await predictStress(sampleData);

      setStressData({
        score: result.stress_score,
        status: getStressStatus(result.stress_score),
        hrv: sampleData.recent_days[6].hrv,
        heartRate: sampleData.recent_days[6].heart_rate,
        breathingRate: sampleData.recent_days[6].breathing_rate,
        sleepHours: sampleData.recent_days[6].sleep_hours,
        activityMinutes: sampleData.recent_days[6].activity_minutes,
        timestamp: new Date(),
        recommendation: result.recommendation,
        explanation: result.explanation,
      });

      // Reload notifications to get the new recommendation
      await loadNotifications();
    } catch (error) {
      console.error('Failed to fetch stress prediction:', error);
    } finally {
      setIsLoadingStress(false);
    }
  };

  // Load notifications from backend
  const loadNotifications = async () => {
    try {
      const { getNotifications } = await import('@/lib/api');
      const backendNotifications = await getNotifications();

      // Convert timestamp strings to Date objects
      const formattedNotifications = backendNotifications.map(notif => ({
        ...notif,
        timestamp: new Date(notif.timestamp),
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Simulate live updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStressData((prev) => {
        const newScore = Math.max(0, Math.min(100, prev.score + (Math.random() - 0.5) * 8));
        return {
          ...prev,
          score: Math.round(newScore),
          status: getStressStatus(newScore),
          hrv: Math.max(40, Math.min(90, prev.hrv + (Math.random() - 0.5) * 4)),
          heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 3)),
          breathingRate: Math.max(12, Math.min(20, prev.breathingRate + (Math.random() - 0.5) * 1)),
          timestamp: new Date(),
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const togglePlan = (id: string) => {
    setWellnessPlans((prev) =>
      prev.map((plan) => (plan.id === id ? { ...plan, enabled: !plan.enabled } : plan))
    );
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const markInsightRead = (id: string) => {
    setInsights((prev) =>
      prev.map((insight) =>
        insight.id === id ? { ...insight, read: true } : insight
      )
    );
  };

  const addAlert = (alert: { id: string; message: string; timestamp: string }) => {
    setAlerts((prev) => {
      // Avoid duplicate alerts
      if (prev.some((existingAlert) => existingAlert.message === alert.message)) {
        return prev;
      }
      return [...prev, alert];
    });
  };

  return (
    <WellnessContext.Provider
      value={{
        stressData,
        notifications,
        wellnessPlans,
        recommendations,
        weeklyInsights,
        userProfile,
        insights,
        markNotificationRead,
        togglePlan,
        updateUserProfile,
        fetchStressPrediction,
        loadNotifications,
        markInsightRead,
        isLoadingStress,
        alerts,
        addAlert,
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
};
