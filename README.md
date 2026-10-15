# Sistema de Ficha Familiar Digital y Vigilancia Epidemiológica Modular

Herramienta digital diseñada para profesionales de **SERUMS** y equipos de salud pública en Perú.

## ¿Para qué sirve?

Este sistema permite:

- Registrar la composición completa de los hogares (Ficha Familiar).
- Identificar automáticamente a las personas vulnerables de cada hogar (lactantes, niños, gestantes, adultos mayores, personas con enfermedades crónicas, etc.).
- Georreferenciar las viviendas de forma automática.
- Facilitar la intervención de diferentes profesionales de la salud según su rol (enfermeras, médicos, psicólogos, trabajadoras sociales, etc.).
- Responder de forma rápida ante campañas de vacunación, brotes epidémicos (ejemplo: dengue) o programas de prevención.

No es solo una herramienta de investigación: es una **base de datos operativa** para la acción en salud pública.

## Características principales

- **Registro dinámico de la Ficha Familiar**  
  Captura de todos los miembros del hogar con datos demográficos, parentesco, instrucción, aportes económicos y condición de residente habitual.

- **Banderas automáticas de vulnerabilidad**  
  El sistema calcula automáticamente perfiles de riesgo del hogar (ej. presencia de lactantes, adultos mayores, gestantes, personas con enfermedades crónicas, etc.).

- **Geolocalización en segundo plano**  
  Captura de coordenadas GPS (latitud, longitud, altitud y precisión) de forma invisible al guardar la ficha.

- **Módulos de intervención por perfil profesional**  
  Cada profesional (enfermera, médico, psicólogo, trabajadora social, etc.) puede desplegar los campos de acción que le corresponden.

- **Motores de selección aleatoria (opcionales)**  
  - Tabla de Kish automatizada (ciega)  
  - Método de cumpleaños como contingencia  
  Disponibles cuando se necesite aplicar un módulo de preguntas a una persona seleccionada al azar.

- **Exportación geoespacial**  
  Generación de archivos compatibles con sistemas de información geográfica (GeoJSON, CSV y KML).

## Público objetivo

- Profesionales de SERUMS
- Enfermeras y técnicos de enfermería
- Médicos
- Psicólogos
- Trabajadoras sociales
- Equipos de vigilancia epidemiológica y atención primaria

## Estructura del repositorio (en desarrollo)

```text
├── docs/                       # Documentación
├── src/
│   ├── core/                   # Lógica principal (Kish, banderas, GPS, etc.)
│   ├── models/                 # Modelos de datos
│   ├── services/               # Lógica de negocio
│   └── ...
├── data/
│   └── schemas/                # Esquemas de validación
├── tests/
└── README.md
