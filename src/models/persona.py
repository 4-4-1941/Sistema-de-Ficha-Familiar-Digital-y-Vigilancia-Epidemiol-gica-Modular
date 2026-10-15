"""
Modelo de datos: Persona (miembro del hogar)
Estructurado según el Modelo de Cuidado Integral por Curso de Vida (MINSA).
"""

from dataclasses import dataclass, field
from typing import List, Optional
from datetime import date
import uuid


@dataclass
class Persona:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    hogar_id: str = ""
    
    # Identificación y datos personales
    tipo_documento: str = "DNI"                 # 'DNI', 'CE', 'SIN_DOC'
    nro_documento: Optional[str] = None
    nombres_apellidos: str = ""
    sexo: int = 1                               # 1 = Masculino, 2 = Femenino
    
    # Fecha de nacimiento y edad exacta
    fecha_nacimiento: Optional[date] = None     # Objeto date (año, mes, día)
    edad_anios: int = 0                         # Se calcula o ingresa
    edad_meses: int = 0                         # Relevante para CRED e inmunizaciones (< 5 años)
    
    # Dinámica familiar
    parentesco: Optional[int] = None            # 1: Jefe/a, 2: Cónyuge, 3: Hijo/a, 4: Padre/Madre, etc.
    estado_civil: Optional[int] = None          # Solo mujeres y hombres >= 12 años
    residente_habitual: int = 1                 # 1 = Sí, 0 = No (filtro para Kish)
    
    # Educación y economía
    nivel_instruccion: Optional[int] = None     # 0: Sin nivel a 10: Superior universitario completo
    asiste_escuela: Optional[bool] = None       # Detección de deserción escolar activa (edad 3-17)
    aporta_ingresos: Optional[int] = None       # 1 = Sí, 0 = No
    ocupacion: Optional[str] = None

    # Estado de salud y prioridades sanitarias (Curso de Vida)
    seguro_salud: Optional[str] = "SIS"         # 'SIS', 'ESSALUD', 'PRIVADO', 'NINGUNO'
    es_gestante: bool = False
    semanas_gestacion: Optional[int] = None
    fecha_probable_parto: Optional[date] = None
    
    tiene_enfermedad_cronica: bool = False
    diagnosticos_cronicos: List[str] = field(default_factory=list) # Ej: ['HTA', 'DIABETES']
    discapacidad: bool = False
    tipo_discapacidad: Optional[str] = None
    
    # Banderas específicas activadas para esta persona
    banderas: List[str] = field(default_factory=list)

    def calcular_edad(self, fecha_referencia: Optional[date] = None) -> None:
        """Calcula edad exacta en años y meses a partir de la fecha de nacimiento."""
        if not self.fecha_nacimiento:
            return
        hoy = fecha_referencia or date.today()
        
        # Años cumplidos
        anios = hoy.year - self.fecha_nacimiento.year - (
            (hoy.month, hoy.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
        )
        self.edad_anios = max(0, anios)
        
        # Meses totales transcurridos (clave para CRED < 5 años)
        meses_totales = (hoy.year - self.fecha_nacimiento.year) * 12 + (hoy.month - self.fecha_nacimiento.month)
        if hoy.day < self.fecha_nacimiento.day:
            meses_totales -= 1
        self.edad_meses = max(0, meses_totales)

    # Propiedades de compatibilidad con matriz de Kish y Birthday calc
    @property
    def edad(self) -> int:
        return self.edad_anios

    @property
    def fecha_nacimiento_dia(self) -> Optional[int]:
        return self.fecha_nacimiento.day if self.fecha_nacimiento else None

    @property
    def fecha_nacimiento_mes(self) -> Optional[int]:
        return self.fecha_nacimiento.month if self.fecha_nacimiento else None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "hogar_id": self.hogar_id,
            "tipo_documento": self.tipo_documento,
            "nro_documento": self.nro_documento,
            "nombres_apellidos": self.nombres_apellidos,
            "sexo": self.sexo,
            "fecha_nacimiento": self.fecha_nacimiento.isoformat() if self.fecha_nacimiento else None,
            "edad_anios": self.edad_anios,
            "edad_meses": self.edad_meses,
            "parentesco": self.parentesco,
            "estado_civil": self.estado_civil,
            "residente_habitual": self.residente_habitual,
            "nivel_instruccion": self.nivel_instruccion,
            "asiste_escuela": self.asiste_escuela,
            "aporta_ingresos": self.aporta_ingresos,
            "ocupacion": self.ocupacion,
            "seguro_salud": self.seguro_salud,
            "es_gestante": self.es_gestante,
            "semanas_gestacion": self.semanas_gestacion,
            "fecha_probable_parto": self.fecha_probable_parto.isoformat() if self.fecha_probable_parto else None,
            "tiene_enfermedad_cronica": self.tiene_enfermedad_cronica,
            "diagnosticos_cronicos": self.diagnosticos_cronicos,
            "discapacidad": self.discapacidad,
            "tipo_discapacidad": self.tipo_discapacidad,
            "banderas": self.banderas,
            # Compatibilidad con módulos existentes
            "edad": self.edad_anios,
            "fecha_nacimiento_dia": self.fecha_nacimiento_dia,
            "fecha_nacimiento_mes": self.fecha_nacimiento_mes,
        }
