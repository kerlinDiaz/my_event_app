from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Event(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    imagen: Optional[str] = None  # URL de la imagen

    class Config:
        validate_by_name = True