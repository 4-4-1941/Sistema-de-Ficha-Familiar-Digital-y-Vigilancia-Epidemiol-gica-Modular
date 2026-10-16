"""
Servicio que calcula y asigna banderas de vulnerabilidad
al Hogar y a cada Persona usando una única fuente de lógica
(src/core/vulnerability_flags.py).
"""

from typing import List
from src.models.hogar import Hogar
from src.models.persona import Persona
from src.core.vulnerability_flags import calcular_banderas, calcular_banderas_persona


def asignar_banderas(hogar: Hogar, personas: List[Persona]) -> Hogar:
    """Calcula banderas agregadas e individuales de forma consistente."""
    personas_dict = [p.to_dict() for p in personas]

    # Hacinamiento con el número actual de residentes habituales
    residentes = sum(1 for p in personas if p.residente_habitual == 1)
    if hogar.nro_habitaciones_dormir > 0:
        hogar.personas_por_habitacion = residentes / hogar.nro_habitaciones_dormir

    datos_hogar = {
        "nro_habitaciones_dormir": hogar.nro_habitaciones_dormir,
        "personas_por_habitacion": hogar.personas_por_habitacion,
        "fuente_agua": hogar.fuente_agua,
        "agua_tratada": hogar.agua_tratada,
        "servicio_higienico": hogar.servicio_higienico,
        "combustible_cocina": hogar.combustible_cocina,
        "disposicion_basura": hogar.disposicion_basura,
        "es_monoparental": hogar.es_monoparental,
        "tiene_desercion_escolar": hogar.tiene_desercion_escolar,
        "riesgo_salud_mental": hogar.riesgo_salud_mental,
        "presencia_vectores_criaduras": hogar.presencia_vectores_criaduras,
    }

    hogar.banderas = calcular_banderas(personas_dict, datos_hogar)

    # Banderas de cada persona: misma regla única
    for persona, datos in zip(personas, personas_dict):
        persona.banderas = calcular_banderas_persona(datos)

    return hogar
