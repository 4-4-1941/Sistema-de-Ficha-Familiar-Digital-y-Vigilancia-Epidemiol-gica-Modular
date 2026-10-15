import os
import sys

# Permitir ejecutar directamente desde cualquier ubicación
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
"""
Ejemplo de uso completo del sistema de Ficha Familiar Digital.
Muestra cómo registrar un hogar, sus miembros con fecha de nacimiento exacta,
calcular banderas automáticamente y aplicar la selección muestral (Kish o cumpleaños).
"""

from datetime import date, datetime
from src.models.hogar import Hogar
from src.models.persona import Persona
from src.models.intervencion import Intervencion
from src.services.flag_calculator import asignar_banderas
from src.core.kish_matrix import seleccionar_persona_kish
from src.core.birthday_calc import seleccionar_persona_cumpleanos


def main():
    print("=== Demostración - Ficha Familiar Digital y Vigilancia Modular ===\n")

    # 1. Crear el hogar con determinantes sociales de salud
    hogar = Hogar(
        ubigeo="040101",
        departamento="Arequipa",
        provincia="Arequipa",
        distrito="Cercado",
        centro_poblado="Cercado",
        conglomerado_manzana="Mza. C Lote 4",
        direccion="Calle Ejemplo 123",
        telefono="999888777",
        latitud=-16.4090,
        longitud=-71.5375,
        precision_gps_metros=4.2,
        # Condiciones de vivienda y saneamiento
        nro_habitaciones_dormir=1,  # Probará hacinamiento
        fuente_agua="pozo",
        agua_tratada=False,         # Generará BANDERA_AGUA_NO_SEGURA
        servicio_higienico="pozo_ciego", # Generará BANDERA_SIN_SANEAMIENTO
        combustible_cocina="lenia_sin_chimenea", # Generará BANDERA_HUMO_INTRADOMICILIARIO
        presencia_vectores_criaduras=True,       # Generará BANDERA_RIESGO_VECTORIAL
        creado_por="serumista.01"
    )

    # 2. Crear miembros del hogar con fechas de nacimiento completas
    personas = [
        Persona(
            hogar_id=hogar.id,
            nombres_apellidos="José Ramírez Quispe",
            sexo=1,  # Masculino
            fecha_nacimiento=date(1964, 5, 12),  # Adulto mayor (~62 años)
            parentesco=1,  # Jefe de hogar
            residente_habitual=1,
            tiene_enfermedad_cronica=True,
            diagnosticos_cronicos=["HIPERTENSION_ARTERIAL", "DIABETES_TIPO_2"]
        ),
        Persona(
            hogar_id=hogar.id,
            nombres_apellidos="Rosa Mamani de Ramírez",
            sexo=2,  # Femenino
            fecha_nacimiento=date(1968, 11, 3),
            parentesco=2,  # Cónyuge
            residente_habitual=1
        ),
        Persona(
            hogar_id=hogar.id,
            nombres_apellidos="Lucía Ramírez Mamani",
            sexo=2,  # Femenino
            fecha_nacimiento=date(2026, 4, 15),  # Lactante (~6 meses)
            parentesco=3,  # Hija
            residente_habitual=1
        ),
        Persona(
            hogar_id=hogar.id,
            nombres_apellidos="Carlos Ramírez Mamani",
            sexo=1,  # Masculino
            fecha_nacimiento=date(2018, 2, 7),   # Niño 8 años (5 a 11)
            parentesco=3,  # Hijo
            asiste_escuela=True,
            residente_habitual=1
        ),
    ]

    # Calcular edad de cada persona
    for p in personas:
        p.calcular_edad(fecha_referencia=date(2026, 10, 15))

    # 3. Asignar banderas de vulnerabilidad
    hogar = asignar_banderas(hogar, personas)

    print(f"Hogar ID: {hogar.id}")
    print(f"Personas por habitación para dormir: {hogar.personas_por_habitacion:.2f}")
    print(f"Banderas activadas para el hogar:")
    for b in hogar.banderas:
        print(f"  [!] {b}")
    print()

    print("Miembros del hogar:")
    for p in personas:
        print(f"  - {p.nombres_apellidos}: {p.edad_anios} años ({p.edad_meses} meses) | Banderas: {p.banderas}")

    # 4. Muestreo epidemiológico ciego (Tabla de Kish)
    print("\n--- Selección Muestral Epidemiológica (Kish) ---")
    personas_dict = [p.to_dict() for p in personas]
    seleccion_kish = seleccionar_persona_kish(hogar.id, personas_dict)
    if seleccion_kish:
        print(f"Persona seleccionada al azar (Kish): {seleccion_kish['nombres_apellidos']}")

    # 5. Registro de intervención profesional
    print("\n--- Registro de Intervención Modular ---")
    intervencion = Intervencion(
        hogar_id=hogar.id,
        persona_id=personas[2].id,  # Lucía (Lactante)
        perfil_profesional="ENFERMERIA",
        profesional_id="lic_ana_torres",
        profesional_nombre="Lic. Ana Torres",
        tipo_accion="CONTROL_CRED_VACUNACION",
        observaciones="Lactante con esquema de vacunación pentavalente al día. Consejería de lactancia materna exclusiva.",
        resultado="COMPLETADO"
    )
    print(f"Intervención: {intervencion.tipo_accion} por {intervencion.profesional_nombre} ({intervencion.perfil_profesional})")
    print(f"Resultado: {intervencion.resultado}")


if __name__ == "__main__":
    main()
