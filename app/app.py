from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
import random
import os

app = FastAPI(
    title="Ping-the-World API",
    version="1.0.0",
    description="Global latency simulation and metrics service for major world cities."
)

# ------------------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------------------

CITIES = [
    "New York", "San Francisco", "London", "Frankfurt", "Singapore",
    "Tokyo", "Sydney", "Dubai", "São Paulo", "Toronto"
]

# ------------------------------------------------------------------------------
# DATA MODELS
# ------------------------------------------------------------------------------

class RegionPing(BaseModel):
    region: str
    latency_ms: float
    min_ms: float
    max_ms: float
    jitter_ms: float
    loss_percent: float
    reliability_score: float
    timestamp: str

class AggregationResponse(BaseModel):
    fastest_region: str
    slowest_region: str
    global_average_latency: float
    global_average_jitter: float
    global_average_loss: float
    timestamp: str

class TimeseriesPoint(BaseModel):
    region: str
    latency_history: List[float]
    timestamps: List[str]

class TimeseriesResponse(BaseModel):
    data: List[TimeseriesPoint]

class WorldHeatmapResponse(BaseModel):
    heatmap: Dict[str, str]  # region -> color code
    timestamp: str

# ------------------------------------------------------------------------------
# INTERNAL SIMULATION
# ------------------------------------------------------------------------------

def simulate_ping(region: str) -> RegionPing:
    """
    This simulates ping metrics. Replace with real probing later.
    """
    base = random.randint(120, 400)
    jitter = random.uniform(3, 22)
    loss = random.uniform(0.1, 1.4)

    score = max(0, 100 - ((base * 0.2) + (jitter * 2) + (loss * 8)))

    return RegionPing(
        region=region,
        latency_ms=base,
        min_ms=base - random.randint(5, 20),
        max_ms=base + random.randint(10, 40),
        jitter_ms=round(jitter, 2),
        loss_percent=round(loss, 2),
        reliability_score=round(score, 2),
        timestamp=datetime.utcnow().isoformat()
    )

def classify_color(latency: float) -> str:
    if latency <= 150: return "green"
    if latency <= 250: return "yellow"
    if latency <= 350: return "orange"
    return "red"

# ------------------------------------------------------------------------------
# 1) GLOBAL LATENCY SNAPSHOT (Heatmap data)
# ------------------------------------------------------------------------------

@app.get("/ping-world/heatmap", response_model=WorldHeatmapResponse)
def get_world_heatmap():
    response = {}
    for city in CITIES:
        simulated = simulate_ping(city)
        response[city] = classify_color(simulated.latency_ms)

    return WorldHeatmapResponse(
        heatmap=response,
        timestamp=datetime.utcnow().isoformat()
    )

# ------------------------------------------------------------------------------
# 2) REGION RANKING + AGGREGATED STATISTICS (Bar chart input)
# ------------------------------------------------------------------------------

@app.get("/ping-world/aggregate", response_model=AggregationResponse)
def get_global_aggregations():
    data = [simulate_ping(city) for city in CITIES]

    fastest = min(data, key=lambda x: x.latency_ms)
    slowest = max(data, key=lambda x: x.latency_ms)

    return AggregationResponse(
        fastest_region=fastest.region,
        slowest_region=slowest.region,
        global_average_latency=sum(d.latency_ms for d in data) / len(data),
        global_average_jitter=sum(d.jitter_ms for d in data) / len(data),
        global_average_loss=sum(d.loss_percent for d in data) / len(data),
        timestamp=datetime.utcnow().isoformat()
    )

# ------------------------------------------------------------------------------
# 3) STABILITY + RELIABILITY RADAR (Spider chart data)
# ------------------------------------------------------------------------------

@app.get("/ping-world/stability", response_model=List[RegionPing])
def get_stability_metrics():
    return [simulate_ping(city) for city in CITIES]

# ------------------------------------------------------------------------------
# 4) TIME-SERIES TRENDLINE (Live polling / rolling metrics)
# ------------------------------------------------------------------------------

@app.get("/ping-world/timeseries", response_model=TimeseriesResponse)
def get_timeseries():
    timeseries_payload = []
    for city in CITIES:
        history = [random.randint(100, 420) for _ in range(10)]
        timestamps = [datetime.utcnow().isoformat() for _ in range(10)]

        timeseries_payload.append(
            TimeseriesPoint(
                region=city,
                latency_history=history,
                timestamps=timestamps
            )
        )

    return TimeseriesResponse(data=timeseries_payload)

# ------------------------------------------------------------------------------
# HEALTHCHECKS (ALB & ECS Expected)
# ------------------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/ready")
def ready():
    return {"status": "ready"}

@app.get("/info")
def info():
    return {
        "environment": os.getenv("APP_ENV", "dev"),
        "container_id": os.getenv("HOSTNAME", "unknown"),
        "region": os.getenv("AWS_REGION", "ap-south-2"),
        "service": "Ping-the-World"
    }
