from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import pandas as pd
import pickle
import requests
import json
import os
from datetime import datetime
from typing import List, Dict

app = FastAPI()

# CORS — allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Model + Scaler ----
model = tf.keras.models.load_model("neurocare_stress_model.h5", compile=False)
scaler = pickle.load(open("neurocare_scaler.pkl", "rb"))
SEQ_LEN = 7

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
NOTIFICATIONS_FILE = "notifications.json"


# ---- Notification Helpers ----
def load_notifications() -> List[Dict]:
    if os.path.exists(NOTIFICATIONS_FILE):
        with open(NOTIFICATIONS_FILE, 'r') as f:
            return json.load(f)
    return []


def save_notifications(notifications: List[Dict]):
    with open(NOTIFICATIONS_FILE, 'w') as f:
        json.dump(notifications, f, indent=2)


# ---- AI Explanation / Recommendations ----
def generate_explanation(stress_score, last_day_row):
    payload = {
        "model": "google/gemma-3-27b-it:free",
        "messages": [
            {"role": "system", "content": "You are an empathetic wellness assistant."},
            {
                "role": "user",
                "content": f"""
Stress score: {stress_score}
Recent vitals: {dict(last_day_row)}

Explain in 3–5 sentences what the user might be feeling emotionally and physically,
and offer comforting guidance. Avoid medical warnings.
"""
            }
        ]
    }

    resp = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        data=json.dumps(payload)
    )
    return resp.json()["choices"][0]["message"]["content"]


def generate_recommendation(stress_score, last_day_row):
    payload = {
        "model": "google/gemma-3-27b-it:free",
        "messages": [
            {"role": "system", "content": "You are a wellness coach providing actionable recommendations."},
            {
                "role": "user",
                "content": f"""
Stress score: {stress_score}/100
Recent vitals: {dict(last_day_row)}

Provide ONE specific, actionable wellness recommendation (2-3 sentences max)
that the user can do today to reduce stress.
"""
            }
        ]
    }

    resp = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        data=json.dumps(payload)
    )
    return resp.json()["choices"][0]["message"]["content"]


# ---- FastAPI Endpoints ----
@app.post("/predict")
def predict(payload: dict):
    df = pd.DataFrame(payload["recent_days"])
    arr = scaler.transform(df.values)
    arr = np.expand_dims(arr, axis=0)

    stress_score = float(model.predict(arr)[0][0])
    stress_score = round(stress_score, 2)

    last_day = df.tail(1).iloc[0]
    explanation = generate_explanation(stress_score, last_day)
    recommendation = generate_recommendation(stress_score, last_day)

    notifications = load_notifications()
    new_notification = {
        "id": str(len(notifications) + 1),
        "type": "tip",
        "title": f"Stress Analysis - Score: {stress_score}",
        "message": recommendation,
        "timestamp": datetime.now().isoformat(),
        "icon": "Lightbulb",
        "read": False,
        "stressScore": stress_score
    }
    notifications.insert(0, new_notification)
    save_notifications(notifications)

    return {
        "stress_score": stress_score,
        "explanation": explanation,
        "recommendation": recommendation
    }


@app.get("/notifications")
def get_notifications():
    return {"notifications": load_notifications()}


@app.post("/notifications")
def add_notification(notification: dict):
    notifications = load_notifications()
    notifications.insert(0, notification)
    save_notifications(notifications)
    return {"success": True, "notification": notification}


@app.delete("/notifications/{notification_id}")
def delete_notification(notification_id: str):
    notifications = load_notifications()
    notifications = [n for n in notifications if n["id"] != notification_id]
    save_notifications(notifications)
    return {"success": True}


@app.patch("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str):
    notifications = load_notifications()
    for notif in notifications:
        if notif["id"] == notification_id:
            notif["read"] = True
            break
    save_notifications(notifications)
    return {"success": True}


@app.post("/mock-stress-analysis")
def mock_stress_analysis():
    """Generate mock stress analysis notifications for different stress levels"""
    notifications = load_notifications()
    
    # Define mock stress scenarios with recommendations
    mock_scenarios = [
        {
            "stressScore": 25,
            "status": "low",
            "title": "Excellent Stress Management! 🌟",
            "message": "Your stress levels are wonderfully low. Keep up your healthy habits! Consider maintaining your current sleep schedule and continue with regular physical activity.",
            "icon": "Smile"
        },
        {
            "stressScore": 42,
            "status": "moderate",
            "title": "Moderate Stress Detected",
            "message": "Your stress is at a manageable level. Try incorporating 10 minutes of deep breathing exercises today. A short walk in nature could also help reset your nervous system.",
            "icon": "AlertCircle"
        },
        {
            "stressScore": 58,
            "status": "moderate-high",
            "title": "Rising Stress Levels ⚠️",
            "message": "Your stress is trending upward. Consider taking regular breaks every hour. Practice the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8.",
            "icon": "TrendingUp"
        },
        {
            "stressScore": 68,
            "status": "high",
            "title": "High Stress Alert",
            "message": "Your body is showing signs of elevated stress. Prioritize rest tonight - aim for 8 hours of sleep. Avoid caffeine after 2 PM and try progressive muscle relaxation before bed.",
            "icon": "AlertTriangle"
        },
        {
            "stressScore": 82,
            "status": "critical",
            "title": "Critical Stress Level - Immediate Action Needed",
            "message": "Your stress levels require immediate attention. Please take a 15-minute break right now. Practice box breathing (4-4-4-4). If symptoms persist, consider reaching out to a healthcare professional.",
            "icon": "AlertOctagon"
        },
        {
            "stressScore": 35,
            "status": "low-moderate",
            "title": "Balanced State Achieved ✨",
            "message": "You're maintaining good balance! Your HRV indicates healthy stress recovery. Keep hydrated and maintain your current wellness routine for optimal results.",
            "icon": "Heart"
        },
        {
            "stressScore": 72,
            "status": "high",
            "title": "Stress Spike Detected",
            "message": "We've noticed a significant increase in your stress markers. Try the 5-5-5 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
            "icon": "Activity"
        },
    ]
    
    # Generate notifications for each scenario
    new_notifications = []
    base_id = len(notifications) + 1
    
    for idx, scenario in enumerate(mock_scenarios):
        notification = {
            "id": str(base_id + idx),
            "type": "tip" if scenario["stressScore"] < 50 else "alert",
            "title": scenario["title"],
            "message": scenario["message"],
            "timestamp": datetime.now().isoformat(),
            "icon": scenario["icon"],
            "read": False,
            "stressScore": scenario["stressScore"]
        }
        new_notifications.append(notification)
    
    # Add all new notifications to the beginning of the list
    all_notifications = new_notifications + notifications
    save_notifications(all_notifications)
    
    return {
        "success": True,
        "message": f"Generated {len(new_notifications)} mock stress analysis notifications",
        "notifications": new_notifications
    }


# ---- Run Backend ----
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",   # filename:variable
        host="0.0.0.0",
        port=8000,
        reload=True
    )
