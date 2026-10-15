"""
Servicio que calcula y asigna las banderas de vulnerabilidad
a un Hogar y sus Personas.
"""

from typing import List
from src.models.hogar import Hogar
from src.models.persona import Persona
from src.core.vulnerability_flags import calcular_banderas


def asignar_banderas(hogar: Hogar, personas: List[Persona]) -> Hogar:
    """
    Calcula las banderas y las asigna tanto al hogar como a cada persona.
    
    Retorna el hogar actualizado con las banderas.
    """
    
    # Convertir personas a diccionarios para el calculador
    personas_dict = [p.to_dict() for p in personas]
    
    # Preparar datos del hogar para el cálculo
    datos_hogar = {
        "personas_por_habitacion": getattr(hogar, "personas_por_habitacion", 0),
        "fuente_agua": getattr(hogar, "fuente_agua", None),
        "servicio_higienico": getattr(hogar, "servicio_higienico", None),
        "es_monoparental": getattr(hogar, "es_monoparental", False),
        "tiene_desercion_escolar": getattr(hogar, "tiene_desercion_escolar", False),
        "riesgo_salud_mental": getattr(hogar, "riesgo_salud_mental", False),
    }
    
    # Calcular banderas
    banderas_calculadas = calcular_banderas(personas_dict, datos_hogar)
    
    # Asignar banderas al hogar
    hogar.banderas = banderas_calculadas
    
    # Asignar banderas individuales a cada persona (opcional pero útil)
    for persona in personas:
        persona_banderas = []
        
        if persona.edad < 1:
            persona_banderas.append("BANDERA_LACTANTE")
        if 1 <= persona.edad <= 4:
            persona_banderas.append("BANDERA_NINO_1_A_4")
        if 5 <= persona.edad <= 11:
            persona_banderas.append("BANDERA_NINO_5_A_11")
        if 12 <= persona.edad <= 17:
            persona_banderas.append("BANDERA_ADOLESCENTE")
        if persona.edad >= 60:
            persona_banderas.append("BANDERA_ADULTO_MAYOR")
        if persona.es_gestante:
            persona_banderas.append("BANDERA_GESTANTE")
        if persona.tiene_enfermedad_cronica:
            persona_banderas.append("BANDERA_CRONICO")
            
        persona.banderas = persona_banderas
    
    return hogar
