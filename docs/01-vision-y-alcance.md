# 01 - Visión y Alcance del Sistema

## Visión

Desarrollar una herramienta digital de Ficha Familiar que permita a los profesionales de SERUMS y equipos de salud pública:

- Registrar de forma completa y estandarizada la composición de los hogares.
- Identificar automáticamente a las personas y hogares vulnerables.
- Georreferenciar las viviendas.
- Facilitar intervenciones diferenciadas según el perfil profesional (Enfermería, Medicina, Psicología, Trabajo Social, Obstetricia, Odontología, etc.).
- Responder de manera rápida y focalizada ante campañas de vacunación, brotes epidémicos y programas de prevención.

## Alcance actual (Versión 1.0)

- Registro de Ficha Familiar (hogar + miembros).
- Cálculo automático de banderas de vulnerabilidad.
- Captura de geolocalización.
- Definición de perfiles profesionales.
- Estructura preparada para registrar intervenciones por profesional.
- Motores de selección aleatoria (Kish y Cumpleaños) disponibles como módulos opcionales.
- Exportación básica de datos.

## Fuera de alcance en esta versión

- Aplicación móvil completa (se preparará la arquitectura).
- Sincronización offline avanzada.
- Dashboard analítico complejo.
- Integración con sistemas del MINSA (se dejará preparada la estructura).

## Principios de diseño

- Escalabilidad: se pueden agregar nuevas banderas y perfiles sin romper el sistema.
- Simplicidad en campo: la interfaz debe ser limpia y fácil de usar.
- Trazabilidad: todo registro de intervención debe quedar asociado a un profesional y una fecha.
- Confidencialidad: cumplimiento del Secreto Estadístico (D.S. 043-2001-PCM).
