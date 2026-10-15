"""
Modelo de datos: Hogar
"""

from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime
import uuid


@dataclass
class Hogar:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    fecha_registro: datetime = field(default_factory=datetime.now)
    
    # Geolocalización
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    altitud: Optional[float] = None
    precision_gps_metros: Optional[float] = None
    
    # Ubicación
    departamento: Optional[str] = None
    provincia: Optional[str] = None
    distrito: Optional[str] = None
    centro_poblado: Optional[str] = None
    conglomerado_manzana: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    
    # Banderas de vulnerabilidad del hogar
    banderas: List[str] = field(default_factory=list)
    
    # Metadatos
    creado_por: Optional[str] = None
    actualizado_en: Optional[datetime] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "fecha_registro": self.fecha_registro.isoformat() if self.fecha_registro else None,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "altitud": self.altitud,
            "precision_gps_metros": self.precision_gps_metros,
            "departamento": self.departamento,
            "provincia": self.provincia,
            "distrito": self.distrito,
            "centro_poblado": self.centro_poblado,
            "conglomerado_manzana": self.conglomerado_manzana,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "banderas": self.banderas,
            "creado_por": self.creado_por,
            "actualizado_en": self.actualizado_en.isoformat() if self.actualizado_en else None,
  }
