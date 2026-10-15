"""
Módulo de selección por método de cumpleaños (contingencia del Kish).
Versión 1.0

Regla:
- Se selecciona a la persona cuyo cumpleaños (día/mes) está más próximo
  a la fecha actual (ya sea el próximo o el más reciente).
- En caso de empate, se usa un desempate determinístico por ID de persona.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, date
import hashlib


def _dias_hasta_cumpleanos(dia: int, mes: int, hoy: date) -> int:
    """
    Calcula los días absolutos hasta el próximo cumpleaños
    o desde el último (el más cercano).
    """
    try:
        cumple_este_anio = date(hoy.year, mes, dia)
    except ValueError:
        # Manejo de 29 de febrero en años no bisiestos
        cumple_este_anio = date(hoy.year, mes, 28)

    if cumple_este_anio >= hoy:
        delta = (cumple_este_anio - hoy).days
    else:
        # Cumpleaños del próximo año
        try:
            cumple_siguiente = date(hoy.year + 1, mes, dia)
        except ValueError:
            cumple_siguiente = date(hoy.year + 1, mes, 28)
        delta = (cumple_siguiente - hoy).days

    # También calculamos días desde el último cumpleaños
    if cumple_este_anio <= hoy:
        dias_desde_ultimo = (hoy - cumple_este_anio).days
    else:
        try:
            cumple_anterior = date(hoy.year - 1, mes, dia)
        except ValueError:
            cumple_anterior = date(hoy.year - 1, mes, 28)
        dias_desde_ultimo = (hoy - cumple_anterior).days

    # Retornamos la distancia más cercana
    return min(delta, dias_desde_ultimo)


def _desempate_por_id(persona_id: str) -> int:
    """Genera un número determinístico a partir del ID para desempate."""
    return int(hashlib.md5(persona_id.encode()).hexdigest(), 16)


def seleccionar_persona_cumpleanos(
    personas: List[Dict[str, Any]],
    fecha_referencia: Optional[date] = None
) -> Optional[Dict[str, Any]]:
    """
    Selecciona a la persona cuyo cumpleaños está más próximo a la fecha de referencia.

    Parámetros:
    - personas: lista de personas (deben tener fecha_nacimiento_dia y fecha_nacimiento_mes)
    - fecha_referencia: fecha a usar como referencia (por defecto hoy)

    Retorna:
    - La persona seleccionada o None si no hay elegibles
    """
    if fecha_referencia is None:
        fecha_referencia = date.today()

    elegibles = [
        p for p in personas
        if p.get("residente_habitual") == 1
        and p.get("fecha_nacimiento_dia")
        and p.get("fecha_nacimiento_mes")
    ]

    if not elegibles:
        return None

    # Calculamos distancia de cumpleaños + desempate
    candidatos = []
    for p in elegibles:
        dias = _dias_hasta_cumpleanos(
            p["fecha_nacimiento_dia"],
            p["fecha_nacimiento_mes"],
            fecha_referencia
        )
        desempate = _desempate_por_id(p.get("id", ""))
        candidatos.append((dias, desempate, p))

    # Ordenamos por menor distancia, luego por desempate
    candidatos.sort(key=lambda x: (x[0], x[1]))

    return candidatos[0][2]


# -------------------------------------------------
# Ejemplo de uso rápido
# -------------------------------------------------
if __name__ == "__main__":
    personas_ejemplo = [
        {"id": "p1", "nombres_apellidos": "Juan", "fecha_nacimiento_dia": 15, "fecha_nacimiento_mes": 3, "residente_habitual": 1},
        {"id": "p2", "nombres_apellidos": "María", "fecha_nacimiento_dia": 20, "fecha_nacimiento_mes": 10, "residente_habitual": 1},
        {"id": "p3", "nombres_apellidos": "Pedro", "fecha_nacimiento_dia": 5, "fecha_nacimiento_mes": 1, "residente_habitual": 1},
    ]

    seleccionada = seleccionar_persona_cumpleanos(personas_ejemplo)
    print("Persona seleccionada por cumpleaños:")
    print(seleccionada)
