"""
Servicio que calcula y asigna banderas de vulnerabilidad
al Hogar y a cada Persona usando una única fuente de lógica.
"""

from typing import List
from src.models.hogar import Hogar
from src.models.persona import Persona
from src.core.vulnerability_flags import calcular_banderas


def asignar_banderas(hogar: Hogar, personas: List[Persona]) -> Hogar:
    """Calcula banderas agregadas e individuales de forma consistente."""
    personas_dict = [p.to_dict() for p in personas]

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

    # Calcular hacinamiento con el número actual de residentes habituales
    residentes = sum(1 for p in personas if p.residente_habitual == 1)
    if hogar.nro_habitaciones_dormir > 0:
        hogar.personas_por_habitacion = residentes / hogar.nro_habitaciones_dormir
        datos_hogar["personas_por_habitacion"] = hogar.personas_por_habitacion

    hogar.banderas = calcular_banderas(personas_dict, datos_hogar)

    # Banderas específicas de cada persona (derivadas de los mismos datos personales)
    for persona in personas:
        persona.banderas = []
        if persona.residente_habitual != 1:
            continue

        edad = persona.edad_anios
        if edad < 1 or (persona.edad_meses > 0 and persona.edad_meses < 12):
            persona.banderas.append("BANDERA_LACTANTE")
        if 1 <= edad <= 4:
            persona.banderas.append("BANDERA_NINO_1_A_4")
        if 5 <= edad <= 11:
            persona.banderas.append("BANDERA_NINO_5_A_11")
        if 12 <= edad <= 17:
            persona.banderas.append("BANDERA_ADOLESCENTE")
        if edad >= 60:
            persona.banderas.append("BANDERA_ADULTO_MAYOR")
        if persona.es_gestante:
            persona.banderas.append("BANDERA_GESTANTE")
        if persona.tiene_enfermedad_cronica:
            persona.banderas.append("BANDERA_CRONICO")
        if persona.discapacidad:
            persona.banderas.append("BANDERA_DISCAPACIDAD")
        if 3 <= edad <= 17 and persona.asiste_escuela is False:
            persona.banderas.append("BANDERA_DESERCION_ESCOLAR")

    return hogar
