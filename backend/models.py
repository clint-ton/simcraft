import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum, Float, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class JobStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    DONE = "done"
    FAILED = "failed"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    status = Column(Enum(JobStatus), default=JobStatus.PENDING, nullable=False)
    sim_type = Column(String(20), nullable=False, default="quick")
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    simc_input = Column(Text, nullable=False)
    result_json = Column(Text, nullable=True)
    combo_metadata_json = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    iterations = Column(Integer, nullable=False, default=1000)
    fight_style = Column(String(30), nullable=False, default="Patchwerk")
    target_error = Column(Float, nullable=False, default=0.2)
