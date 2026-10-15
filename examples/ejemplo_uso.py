"""
Ejemplo de uso completo del sistema de Ficha Familiar Digital.
Muestra cómo registrar un hogar, sus miembros, calcular banderas
y realizar una selección Kish o por cumpleaños.
"""

from datetime import datetime
from src.models.hogar import Hogar
from src.models.persona import Persona
from src.models.intervencion import Intervencion
from src.services.flag_calculator import asignar_banderas
from src.core.kish_matrix import seleccionar_persona_kish
from src.core.birthday_calc import seleccionar_persona_cumpleanos


def main():
    print("=== Ejemplo de uso - Ficha Familiar Digital ===\n")

    # 1. Crear el hogar
    hogar = Hogar(
        departamento="Arequipa",
        provincia="Arequipa",
        distrito="Cercado",
        direccion="Calle Ejemplo 123",
        telefono="999888777",
        latitud=-16.4090,
        longitud=-71.5375,
        precision_gps_metros=4.2,
        creado_por="enfermera.01"
    )

    # 2. Crear miembros del hogar
    personas = [
        Persona(
            hogar_id=hogar.id,
            nombres_apellidos="José Ramírez Quispe",
            edad=62,
            sexo=1,
            parentesco=1,  # Jefe
            residente_habitual=1,
            tiene_enfermedad_cronica=True,
            fecha_nacimiento_dia=12,
            fecha_nacimiento_mes=5
        ),
        Persona(
            hogar_id=hogar.id,
            nombres_apellidos="Rosa Mamani de Ramírez",
            edad=58,
            sexo=2,
            parentesco=2,  # Esposa
            residente_habitual=1,
            fecha_nacimiento_dia=3,
            fecha_nacimiento_mes=11
        ),
        Persona(
            hogar_id=hogar.id,
            nombres_apellidos="Lucía Ramírez Mamani",
            edad=0,  # Lactante
            sexo=2,
            parentesco=3,  # Hija
            residente_habitual=1,
            fecha_nacimiento_dia=20,
            fecha_nacimiento_mes=9
        ),
        Persona(
            hogar_id=hogar.id,
            nombres_apellidos="Carlos Ramírez Mamani",
            edad=8,
            sexo=1,
            parentesco=3,
            residente_habitual=1,
            fecha_nacimiento_dia=7,
            fecha_nacimiento_mes=2
        ),
    ]

    # 3. Calcular y asignar banderas
    hogar = asignar_banderas(hogar, personas)

    print("Hogar ID:", hogar.id)
    print("Banderas del hogar:", hogar.banderas)
    print()

    for p in personas:
        print(f"- {p.nombres_apellidos} ({p.edad} años) → Banderas: {p.banderas}")

    print("\n--- Selección Kish ---")
    personas_dict = [p.to_dict() for p in personas]
    seleccion_kish = seleccionar_persona_kish(hogar.id, personas_dict)
    if seleccion_kish:
        print("Persona seleccionada por Kish:", seleccion_kish["nombres_apellidos"])

    print("\n--- Selección por Cumpleaños ---")
    seleccion_cumple = seleccionar_persona_cumpleanos(personas_dict)
    if seleccion_cumple:
        print("Persona seleccionada por cumpleaños:", seleccion_cumple["nombres_apellidos"])

    # 4. Ejemplo de intervención
    print("\n--- Registro de Intervención ---")
    intervencion = Intervencion(
        hogar_id=hogar.id,
        persona_id=personas[2].id,  # La lactante
        perfil_profesional="ENFERMERIA",
        profesional_id="enf-001",
        profesional_nombre="Lic. Ana Torres",
        tipo_accion="VACUNACION",
        observaciones="Aplicación de vacuna pentavalente",
        resultado="COMPLETADO"
    )
    print(intervencion.to_dict())


if __name__ == "__main__":
    main()
