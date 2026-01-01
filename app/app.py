from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime
import random
import os

# ------------------------------------------------------------------------------
# APP
# ------------------------------------------------------------------------------
app = FastAPI(
    title="Ping-the-World API",
    version="2.0.0",
    description="Realtime cyber latency telemetry service powering hologram ops console."
)

# ------------------------------------------------------------------------------
# CORS
# ------------------------------------------------------------------------------
origins = [
    "http://localhost:5173",
    "http://ecs-python-api-dev-alb-*.elb.amazonaws.com",
    "*"  # Wide open for demo UI; restrict for prod
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# CONFIG / DATA SOURCES
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
    previous_latency_ms: float
    delta_ms: float
    min_ms: float
    max_ms: float
    jitter_ms: float
    loss_percent: float
    reliability_score: float
    status: str              # stable / warning / degraded / outage
    severity: int            # 0-3 (color gradient control)
    color: str               # green/yellow/orange/red
    timestamp: str

class RegionAggregation(BaseModel):
    region: str
    latency_ms: float
    severity: int

class AggregationResponse(BaseModel):
    fastest_region: str
    slowest_region: str
    global_average_latency: float
    global_average_jitter: float
    global_average_loss: float
    regions: List[RegionAggregation]  
    timestamp: str

class TimeseriesPoint(BaseModel):
    region: str
    latency_history: List[float]
    timestamps: List[str]

class TimeseriesResponse(BaseModel):
    data: List[TimeseriesPoint]

class WorldHeatmapResponse(BaseModel):
    heatmap: Dict[str, str]
    timestamp: str

# ------------------------------------------------------------------------------
# INTERNAL LOGIC
# ------------------------------------------------------------------------------
def classify(latency: float) -> (str, int, str):
    """Return status name, severity, and color."""
    if latency <= 150: return ("stable",   0, "green")
    if latency <= 250: return ("warning",  1, "yellow")
    if latency <= 350: return ("degraded", 2, "orange")
    return ("outage", 3, "red")

def simulate_ping(region: str) -> RegionPing:
    """Primary physics for hologram console latency."""
    current = random.randint(120, 420)
    prev = current + random.randint(-70, 50)
    delta = current - prev

    jitter = random.uniform(3, 27)
    loss = random.uniform(0.1, 1.8)
    score = max(0, 100 - ((current * 0.20) + (jitter * 2) + (loss * 8)))

    status, severity, color = classify(current)

    return RegionPing(
        region=region,
        latency_ms=current,
        previous_latency_ms=prev,
        delta_ms=round(delta, 2),
        min_ms=current - random.randint(10, 25),
        max_ms=current + random.randint(15, 55),
        jitter_ms=round(jitter, 2),
        loss_percent=round(loss, 2),
        reliability_score=round(score, 2),
        status=status,
        severity=severity,
        color=color,
        timestamp=datetime.utcnow().isoformat()
    )

# ------------------------------------------------------------------------------
# 1) GLOBAL HEATMAP SNAPSHOT
# ------------------------------------------------------------------------------
@app.get("/ping-world/heatmap", response_model=WorldHeatmapResponse)
def get_world_heatmap():
    return WorldHeatmapResponse(
        heatmap={c: simulate_ping(c).color for c in CITIES},
        timestamp=datetime.utcnow().isoformat()
    )

# ------------------------------------------------------------------------------
# 2) REGION RANKING + GLOBAL AGGREGATES
# ------------------------------------------------------------------------------
@app.get("/ping-world/aggregate", response_model=AggregationResponse)
def get_global_aggregations():
    data = [simulate_ping(city) for city in CITIES]
    fastest = min(data, key=lambda x: x.latency_ms)
    slowest = max(data, key=lambda x: x.latency_ms)

    region_list = [
        {"region": d.region, "latency_ms": d.latency_ms, "severity": d.severity}
        for d in sorted(data, key=lambda x: x.latency_ms)
    ]

    return AggregationResponse(
        fastest_region=fastest.region,
        slowest_region=slowest.region,
        global_average_latency=sum(d.latency_ms for d in data) / len(data),
        global_average_jitter=sum(d.jitter_ms for d in data) / len(data),
        global_average_loss=sum(d.loss_percent for d in data) / len(data),
        regions=region_list,
        timestamp=datetime.utcnow().isoformat()
    )

# ------------------------------------------------------------------------------
# 3) FULL REGION METRICS FOR RADAR
# ------------------------------------------------------------------------------
@app.get("/ping-world/stability", response_model=List[RegionPing])
def get_stability_metrics():
    return [simulate_ping(city) for city in CITIES]

# ------------------------------------------------------------------------------
# 4) TIME SERIES TRENDLINE (10-POINT SNAPSHOT)
# ------------------------------------------------------------------------------
@app.get("/ping-world/timeseries", response_model=TimeseriesResponse)
def get_timeseries():
    payload = []
    for city in CITIES:
        values = [random.randint(100, 420) for _ in range(10)]
        timestamps = [datetime.utcnow().isoformat() for _ in range(10)]
        payload.append(TimeseriesPoint(region=city, latency_history=values, timestamps=timestamps))
    return TimeseriesResponse(data=payload)

# ------------------------------------------------------------------------------
# 5) REGION DETAIL (for click-to-focus on map/table)
# ------------------------------------------------------------------------------
@app.get("/ping-world/region/{name}", response_model=RegionPing)
def get_region_detail(name: str):
    if name not in CITIES:
        return {"error": f"{name} is not known"}
    return simulate_ping(name)

# ------------------------------------------------------------------------------
# HEALTHCHECKS
# ------------------------------------------------------------------------------
@app.get("/health") 
def health(): return {"status": "ok"}

@app.get("/ready")  
def ready(): return {"status": "ready"}

@app.get("/info")
def info():
    return {
        "environment": os.getenv("APP_ENV", "dev"),
        "container_id": os.getenv("HOSTNAME", "unknown"),
        "region": os.getenv("AWS_REGION", "ap-south-2"),
        "service": "Ping-the-World",
        "version": "2.0.0"
    }
