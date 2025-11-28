import pandas as pd
import numpy as np

days = 365
baseline_hrv = 55 + np.sin(np.linspace(0, 3*np.pi, days)) * 8
stress_cycles = np.sin(np.linspace(0, 16*np.pi, days)) * 12

df = pd.DataFrame({
    "Date": pd.date_range(start="2024-01-01", periods=days, freq="D"),
    "HRV": baseline_hrv + np.random.normal(0, 4, days),
    "HR": 75 - (baseline_hrv - 55) * 0.8 + np.random.normal(0, 3, days),
    "BreathingRate": 14 + (stress_cycles / 10) + np.random.normal(0, 1.2, days),
    "EDA": 0.55 + (stress_cycles / 50) + np.random.normal(0, 0.05, days),
    "SkinTemp": 36.6 + np.random.normal(0, 0.2, days),
    "Steps": 7000 - (stress_cycles * 120) + np.random.normal(0, 800, days),
    "ActiveMinutes": 55 - (stress_cycles * 2.2) + np.random.normal(0, 6, days),
    "SleepHours": 7.2 - (stress_cycles / 20) + np.random.normal(0, 0.4, days),
    "SleepInterruptions": (stress_cycles > 8).astype(int) + np.random.poisson(1, days)
})

for col in ["HRV", "HR", "Steps", "SleepHours"]:
    df.loc[np.random.choice(df.index, size=12, replace=False), col] = np.nan

df.loc[np.random.choice(df.index, size=8), "HRV"] = -df["HRV"].sample(8).values
df.loc[np.random.choice(df.index, size=6), "Steps"] = -df["Steps"].sample(6).values

df.loc[np.random.choice(df.index, size=5), "HR"] = np.random.randint(200, 260, 5)
df.loc[np.random.choice(df.index, size=6), "BreathingRate"] = "error"
df = pd.concat([df, df.sample(4)], ignore_index=True)
df = df.sample(frac=1).reset_index(drop=True)
fahrenheit_idx = np.random.choice(df.index, size=10)
df.loc[fahrenheit_idx, "SkinTemp"] = (df.loc[fahrenheit_idx, "SkinTemp"] * 9/5) + 32
df["StressScore"] = (
    (100 - df["HRV"].fillna(55)) * 0.22 +
    ((df["HR"] - 55).clip(0, None)) * 0.18 +
    (pd.to_numeric(df["BreathingRate"], errors="coerce").fillna(16) - 12) * 1.3 +
    (df["EDA"] * 20) +
    (8 - df["SleepHours"].fillna(7)) * 2.2 +
    df["SleepInterruptions"] * 4
).clip(0, 100)

df

df.to_csv("heart_dataset.csv", index=False)
