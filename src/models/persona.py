"""
Modelo de datos: Persona (miembro del hogar)
"""

from dataclasses import dataclass, field
from typing import List, Optional
import uuid


@dataclass
class Persona:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    hogar_id: str = ""
    
    # Datos personales
    nombres_apellidos: str = ""
    edad: int = 0
    fecha_nacimiento_dia: Optional[int] = None
    fecha_nacimiento_mes: Optional[int] = None
    sexo: Optional[int] = None                  # 1 = Masculino, 2 = Femenino
    parentesco: Optional[int] = None            # 1 al 10
    estado_civil: Optional[int] = None          # Solo mujeres ≥ 12 años
    nivel_instruccion: Optional[int] = None     # 0 al 10
    aporta_ingresos: Optional[int] = None       # 1 = Sí, 0 = No
    residente_habitual: int = 1                 # 1 = Sí, 0 = No
    
    # Indicadores de vulnerabilidad individuales
    es_gestante: bool = False
    tiene_enfermedad_cronica: bool = False
    
    # Banderas específicas de esta persona
    banderas: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "hogar_id": self.hogar_id,
            "nombres_apellidos": self.nombres_apellidos,
            "edad": self.edad,
            "fecha_nacimiento_dia": self.fecha_nacimiento_dia,
            "fecha_nacimiento_mes": self.fecha_nacimiento_mes,
            "sexo": self.sexo,
            "parentesco": self.parentesco,
            "estado_civil": self.estado_civil,
            "nivel_instruccion": self.nivel_instruccion,
            "aporta_ingresos": self.aporta_ingresos,
            "residente_habitual": self.residente_habitual,
            "es_gestante": self.es_gestante,
            "tiene_enfermedad_cronica": self.tiene_enfermedad_cronica,
            "banderas": self.banderas,
  }
