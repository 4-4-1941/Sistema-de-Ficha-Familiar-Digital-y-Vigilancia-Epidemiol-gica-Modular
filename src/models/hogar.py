"""
Modelo de datos: Hogar
Representa la vivienda, condiciones de saneamiento y unidad familiar.
"""

from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime
import uuid


@dataclass
class Hogar:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    fecha_registro: datetime = field(default_factory=datetime.now)
    
    # Ubicación geográfica y sectorización (MINSA / INEI)
    ubigeo: Optional[str] = None                # Código INEI 6 dígitos (ej. 040101)
    departamento: Optional[str] = None
    provincia: Optional[str] = None
    distrito: Optional[str] = None
    centro_poblado: Optional[str] = None
    conglomerado_manzana: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    
    # Geolocalización GPS en campo
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    altitud: Optional[float] = None
    precision_gps_metros: Optional[float] = None

    # Determinantes de la salud: Saneamiento y Vivienda
    nro_habitaciones_dormir: int = 1
    personas_por_habitacion: float = 0.0        # Calculado: residentes habituales / nro_habitaciones_dormir
    fuente_agua: Optional[str] = None          # 'red_domiciliaria', 'pilon', 'pozo', 'rio', 'acequia', 'camion'
    agua_tratada: bool = False                 # Hervida, clorada o filtrada
    servicio_higienico: Optional[str] = None   # 'alcantarillado', 'letrina_ventilada', 'pozo_ciego', 'rio', 'no_tiene'
    combustible_cocina: Optional[str] = None   # 'gas', 'electricidad', 'lenia_sin_chimenea', 'bosta'
    disposicion_basura: Optional[str] = None   # 'municipal', 'quema', 'campo_abierto', 'entierro'
    
    # Indicadores psicosociales y estructurales del hogar
    es_monoparental: bool = False
    tiene_desercion_escolar: bool = False
    riesgo_salud_mental: bool = False
    presencia_vectores_criaduras: bool = False # Zoonosis / Dengue / Chagas
    
    # Banderas de vulnerabilidad calculadas
    banderas: List[str] = field(default_factory=list)
    
    # Metadatos del registro
    creado_por: Optional[str] = None
    actualizado_en: Optional[datetime] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "fecha_registro": self.fecha_registro.isoformat() if self.fecha_registro else None,
            "ubigeo": self.ubigeo,
            "departamento": self.departamento,
            "provincia": self.provincia,
            "distrito": self.distrito,
            "centro_poblado": self.centro_poblado,
            "conglomerado_manzana": self.conglomerado_manzana,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "altitud": self.altitud,
            "precision_gps_metros": self.precision_gps_metros,
            "nro_habitaciones_dormir": self.nro_habitaciones_dormir,
            "personas_por_habitacion": self.personas_por_habitacion,
            "fuente_agua": self.fuente_agua,
            "agua_tratada": self.agua_tratada,
            "servicio_higienico": self.servicio_higienico,
            "combustible_cocina": self.combustible_cocina,
            "disposicion_basura": self.disposicion_basura,
            "es_monoparental": self.es_monoparental,
            "tiene_desercion_escolar": self.tiene_desercion_escolar,
            "riesgo_salud_mental": self.riesgo_salud_mental,
            "presencia_vectores_criaduras": self.presencia_vectores_criaduras,
            "banderas": self.banderas,
            "creado_por": self.creado_por,
            "actualizado_en": self.actualizado_en.isoformat() if self.actualizado_en else None,
        }
