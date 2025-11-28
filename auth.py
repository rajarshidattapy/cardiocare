from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.security import OAuth2AuthorizationCodeBearer
import pandas as pd
import random

app = FastAPI(
    title="NeuroCare Stress API",
    description="Stress prediction dataset API with mock Google OAuth",
    version="1.0.0"
)

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="https://accounts.google.com/o/oauth2/auth",
    tokenUrl="https://oauth2.googleapis.com/token"
)

def verify_google_token(token: str = Depends(oauth2_scheme)):
    if not token or token == "invalid":
        raise HTTPException(status_code=401, detail="Invalid Google OAuth token")
    return {"user_email": "wenzy1024@gmail.com"}


df = pd.read_csv("cleaned_dataset.csv") 

COLUMNS = [
    "HRV", "HR", "BreathingRate", "EDA", "SkinTemp",
    "Steps", "ActiveMinutes", "SleepHours",
    "SleepInterruptions", "StressScore"
]

df = df[COLUMNS]

@app.get("/")
def root():
    return {"message": "NeuroCare Stress API running..."}

@app.get("/user/stress", summary="Get stress data")
def get_stress():
    row = df.sample(1).iloc[0]

    return {
        "HRV": round(float(row["HRV"]), 2),
        "HR": round(float(row["HR"]), 2),
        "BreathingRate": round(float(row["BreathingRate"]), 2),
        "EDA": round(float(row["EDA"]), 2),
        "SkinTemp": round(float(row["SkinTemp"]), 2),
        "Steps": int(row["Steps"]),
        "ActiveMinutes": int(row["ActiveMinutes"]),
        "SleepHours": round(float(row["SleepHours"]), 2),
        "SleepInterruptions": int(row["SleepInterruptions"]),
        "StressScore": round(float(row["StressScore"]), 2),
        "user": "wenzy1024@gmail.com"           
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "auth:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
