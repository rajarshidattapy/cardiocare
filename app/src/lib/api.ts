// API service for communicating with FastAPI backend

const API_BASE_URL = 'http://localhost:8000';

export interface PredictPayload {
    recent_days: Array<{
        [key: string]: number;
    }>;
}

export interface PredictResponse {
    stress_score: number;
    explanation: string;
    recommendation: string;
}

export interface Notification {
    id: string;
    type: 'reminder' | 'alert' | 'achievement' | 'tip';
    title: string;
    message: string;
    timestamp: string;
    icon: string;
    read: boolean;
    stressScore?: number;
}

export interface NotificationsResponse {
    notifications: Notification[];
}

/**
 * Predict stress score from health vitals
 */
export async function predictStress(payload: PredictPayload): Promise<PredictResponse> {
    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to predict stress: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get all notifications from backend
 */
export async function getNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/notifications`);

    if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    const data: NotificationsResponse = await response.json();
    return data.notifications;
}

/**
 * Add a new notification
 */
export async function addNotification(notification: Omit<Notification, 'id'>): Promise<Notification> {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
    });

    if (!response.ok) {
        throw new Error(`Failed to add notification: ${response.statusText}`);
    }

    const data = await response.json();
    return data.notification;
}

/**
 * Mark a notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
    });

    if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.statusText}`);
    }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.statusText}`);
    }
}

/**
 * Generate mock stress analysis notifications
 */
export async function mockStressAnalysis(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/mock-stress-analysis`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error(`Failed to generate mock stress analysis: ${response.statusText}`);
    }

    const data = await response.json();
    return data.notifications;
}

/**
 * Generate sample health data for testing
 */
export function generateSampleHealthData(): PredictPayload {
    // Generate 7 days of sample health metrics
    const days = [];
    for (let i = 0; i < 7; i++) {
        days.push({
            heart_rate: 70 + Math.random() * 20,
            hrv: 50 + Math.random() * 30,
            breathing_rate: 12 + Math.random() * 6,
            sleep_hours: 6 + Math.random() * 3,
            activity_minutes: 20 + Math.random() * 60,
            stress_level: 30 + Math.random() * 40,
            systolic_bp: 110 + Math.random() * 20,
            diastolic_bp: 70 + Math.random() * 15,
            temperature: 36.5 + Math.random() * 0.8,
            oxygen_saturation: 95 + Math.random() * 4,
        });
    }
    return { recent_days: days };
}
