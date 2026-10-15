# Sistema de Ficha Familiar Digital y Vigilancia Epidemiológica Modular

Herramienta digital en construcción para profesionales de **SERUMS** y equipos de salud pública en Perú.

> 🤝 **Desarrollo y colaboración:** Proyecto en construcción mediante colaboración integral entre conocimiento de salud comunitaria y epidemiología, y herramientas de inteligencia artificial. Las propuestas generadas con IA requieren revisión y validación profesional antes de su uso operativo o clínico.

## ¿Para qué sirve?

- Registrar la composición de los hogares y sus condiciones de vivienda.
- Identificar automáticamente banderas de vulnerabilidad familiar e individual.
- Georreferenciar viviendas para apoyar la vigilancia epidemiológica.
- Facilitar intervenciones diferenciadas según el perfil profesional.
- Apoyar acciones de promoción, prevención y respuesta en salud pública.

## Estado actual

El repositorio es un prototipo de lógica de dominio. Incluye modelos Python, cálculo inicial de banderas de vulnerabilidad y funciones de selección muestral. Aún no es una aplicación clínica lista para producción: faltan interfaz, persistencia, autenticación/autorización, sincronización, pruebas automatizadas y validación normativa y sanitaria.

No registrar datos reales de pacientes o familias en este prototipo. Los datos de salud y geolocalización requieren protección, controles de acceso y evaluación de privacidad antes de cualquier piloto.

## Estructura

- `src/models/`: modelos de Hogar, Persona e Intervención.
- `src/core/`: reglas de negocio, selección muestral y banderas.
- `src/services/`: servicios de aplicación.
- `data/schemas/`: esquemas de validación JSON.
- `docs/`: visión, alcance, perfiles y referencias normativas.

## Validación

Las reglas de vulnerabilidad y los catálogos incluidos son iniciales y deben revisarse con profesionales, normativa vigente y protocolos aplicables antes de usarse en decisiones clínicas o de salud pública.
