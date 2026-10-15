"""
Módulo de selección aleatoria ciega usando Tabla de Kish.
Versión 1.0

Reglas:
- Solo se consideran personas residentes habituales.
- Se ordenan: primero hombres de mayor a menor edad, luego mujeres de mayor a menor edad.
- La columna de selección se determina con: (ID del hogar) MOD 18
"""

from typing import List, Dict, Any, Optional
import hashlib


# Tabla de Kish clásica (filas = número de personas elegibles, columnas = 0 a 17)
KISH_TABLE = {
    1:  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    2:  [1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],
    3:  [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3],
    4:  [1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2],
    5:  [1,2,3,4,5,1,2,3,4,5,1,2,3,4,5,1,2,3],
    6:  [1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6],
    7:  [1,2,3,4,5,6,7,1,2,3,4,5,6,7,1,2,3,4],
    8:  [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2],
    9:  [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9],
    10: [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8],
    11: [1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,6,7],
    12: [1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6],
    13: [1,2,3,4,5,6,7,8,9,10,11,12,13,1,2,3,4,5],
    14: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,1,2,3,4],
    15: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,1,2,3],
    16: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1,2],
    17: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,1],
    18: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
}


def _obtener_columna_kish(hogar_id: str) -> int:
    """
    Determina la columna de la tabla de Kish (0 a 17)
    a partir del ID del hogar de forma determinística.
    """
    # Usamos un hash del ID para obtener un número estable
    hash_object = hashlib.md5(hogar_id.encode())
    hash_int = int(hash_object.hexdigest(), 16)
    return hash_int % 18


def ordenar_personas_para_kish(personas: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Ordena las personas según la regla epidemiológica:
    1. Hombres de mayor a menor edad
    2. Mujeres de mayor a menor edad
    Solo incluye residentes habituales.
    """
    elegibles = [p for p in personas if p.get("residente_habitual") == 1]

    hombres = [p for p in elegibles if p.get("sexo") == 1]
    mujeres = [p for p in elegibles if p.get("sexo") == 2]

    hombres_ordenados = sorted(hombres, key=lambda x: x.get("edad", 0), reverse=True)
    mujeres_ordenadas = sorted(mujeres, key=lambda x: x.get("edad", 0), reverse=True)

    return hombres_ordenados + mujeres_ordenadas


def seleccionar_persona_kish(hogar_id: str, personas: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Selecciona una persona del hogar usando la Tabla de Kish de forma ciega.

    Parámetros:
    - hogar_id: identificador único del hogar
    - personas: lista de diccionarios con los datos de las personas

    Retorna:
    - La persona seleccionada (dict) o None si no hay personas elegibles
    """
    ordenadas = ordenar_personas_para_kish(personas)
    n = len(ordenadas)

    if n == 0:
        return None

    if n > 18:
        # Si hay más de 18 personas, se limita a las primeras 18 del orden
        ordenadas = ordenadas[:18]
        n = 18

    columna = _obtener_columna_kish(hogar_id)
    fila = n  # número de personas elegibles

    # La tabla está indexada desde 1
    indice_seleccionado = KISH_TABLE[fila][columna] - 1

    return ordenadas[indice_seleccionado]


# -------------------------------------------------
# Ejemplo de uso rápido
# -------------------------------------------------
if __name__ == "__main__":
    personas_ejemplo = [
        {"id": "p1", "nombres_apellidos": "Juan Pérez", "edad": 45, "sexo": 1, "residente_habitual": 1},
        {"id": "p2", "nombres_apellidos": "María López", "edad": 42, "sexo": 2, "residente_habitual": 1},
        {"id": "p3", "nombres_apellidos": "Pedro Pérez", "edad": 15, "sexo": 1, "residente_habitual": 1},
        {"id": "p4", "nombres_apellidos": "Ana Pérez", "edad": 10, "sexo": 2, "residente_habitual": 1},
        {"id": "p5", "nombres_apellidos": "Visitante", "edad": 30, "sexo": 1, "residente_habitual": 0},
    ]

    seleccionada = seleccionar_persona_kish("hogar-12345", personas_ejemplo)
    print("Persona seleccionada por Kish:")
    print(seleccionada)
