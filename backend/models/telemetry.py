# app/models/telemetry.py
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Telemetry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    accx: float
    accy: float
    accz: float
    dpsx: float
    dpsy: float
    dpsz: float
    roll: float
    pitch: float
    rpm: float
    vel: float
    temp_motor: float
    soc: float
    temp_cvt: float
    volt: float
    current: float
    flags: int
    latitude: float
    longitude: float
    timestamp: datetime
