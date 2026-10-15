"""
Modelo de datos: Intervención
Registro de acciones realizadas por profesionales de la salud
"""

from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime
import uuid


@dataclass
class Intervencion:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    
    # Relaciones
    hogar_id: str = ""
    persona_id: Optional[str] = None            # Opcional: si la intervención es a una persona específica
    
    # Quién intervino
    perfil_profesional: str = ""                # ENFERMERIA, MEDICO, PSICOLOGIA, etc.
    profesional_id: str = ""                    # Identificador del profesional
    profesional_nombre: Optional[str] = None
    
    # Datos de la intervención
    fecha_intervencion: datetime = field(default_factory=datetime.now)
    tipo_accion: str = ""                       # Ej: "VACUNACION", "CONTROL_PRENATAL", "EVALUACION_PSICOLOGICA"
    observaciones: Optional[str] = None
    resultado: Optional[str] = None             # Ej: "COMPLETADO", "PENDIENTE", "REFERIDO"
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "hogar_id": self.hogar_id,
            "persona_id": self.persona_id,
            "perfil_profesional": self.perfil_profesional,
            "profesional_id": self.profesional_id,
            "profesional_nombre": self.profesional_nombre,
            "fecha_intervencion": self.fecha_intervencion.isoformat() if self.fecha_intervencion else None,
            "tipo_accion": self.tipo_accion,
            "observaciones": self.observaciones,
            "resultado": self.resultado,
  }
