# Ecosistema de Ficha Familiar Digital y Vigilancia Epidemiológica Modular
**Documento de Estado Técnico, Arquitectura y Hoja de Ruta para Colaboración IA**  
*Fecha de corte: Octubre 2026*  
*Autor: Lic. Richard Castillejo (Psicología / Salud Comunitaria / Epidemiología)*  
*Entorno de desarrollo: Colaboración en Co-Creación con IA*

---

## 1. Visión y Objetivos del Proyecto

### 1.1 Objetivo General
Desarrollar una herramienta digital modular de recolección en campo, estratificación epidemiológica automática y seguimiento de intervenciones comunitarias, diseñada para profesionales de SERUMS y equipos de atención primaria en salud (MINSA - Perú), con capacidad de funcionamiento sin conexión (offline-first).

### 1.2 Objetivos Específicos
1. **Digitalizar la Ficha Familiar Integral:** Reemplazar el llenado físico en papel por un registro estructurado con georreferenciación (GPS) y determinantes sociales de salud (acceso a agua, saneamiento, combustible intradomiciliario, hacinamiento, dinámica familiar).
2. **Cálculo Automático de Banderas de Vulnerabilidad:** Automatizar la detección temprana de riesgos sanitarios por curso de vida (lactantes, niños, gestantes, adultos mayores) y del entorno ambiental (humo, vectores, agua insegura).
3. **Muestreo Epidemiológico Ciego en Campo:** Mantener integrados los algoritmos de selección muestral probabilística para estudios comunitarios (Matriz de Kish y método de cumpleaños).
4. **Módulos de Intervención por Perfil Profesional:** Permitir que cada profesional (enfermería, medicina, psicología, obstetricia, trabajo social) registre sus actividades domiciliarias y seguimiento sin alterar la estructura básica de la familia.
5. **Convivencia No Destructiva con el Ecosistema SERUMS:** Integrar este módulo dentro de la infraestructura existente de base de datos (`SERUM-APP` / Supabase) con aislamiento estricto de tablas para no interferir con el banco de preguntas ni la preparación académica.
6. **Cumplimiento Normativo:** Alinear la recolección al Modelo de Cuidado Integral por Curso de Vida del MINSA y proteger la confidencialidad de datos personales sensibles según la Ley N° 29733 (Ley de Protección de Datos Personales en Perú).

---

## 2. Lo Avanzado Hasta el Momento

### 2.1 Repositorio GitHub: `Sistema-de-Ficha-Familiar-Digital-y-Vigilancia-Epidemiol-gica-Modular`
* **Rama principal:** `main`
* **Últimos commits aplicados:**
  * `8c4dfc1`: Corrección y enriquecimiento de modelos de datos Python y validación JSON.
  * `db55975`: Incorporación del script de creación de base de datos en `sql/01_tablas_ficha_familiar.sql`.
  * `8c95e61`: Endurecimiento de integridad referencial clínica (`ON DELETE RESTRICT`).

#### Componentes clave actualizados en código:
1. **`src/models/hogar.py`**:
   * Ubicación estandarizada (Ubigeo INEI de 6 dígitos, conglomerado/manzana).
   * Coordenadas GPS con precisión métrica.
   * Determinantes sociales: fuente de agua, agua tratada (clorada/hervida), tipo de baño, combustible de cocina, disposición de basura.
   * Variables de riesgo: hacinamiento (cálculo automático de residentes / habitaciones para dormir), monoparentalidad, deserción escolar, salud mental y presencia de vectores/criaderos.
2. **`src/models/persona.py`**:
   * Fecha de nacimiento completa (`date`) y método `calcular_edad()` que computa tanto **años cumplidos** como **meses exactos** (fundamental para controles CRED e inmunizaciones en menores de 5 años).
   * Curso de vida según normativa MINSA.
   * Diagnósticos crónicos en formato de lista tipada y marcadores de gestación/discapacidad.
   * Mantenimiento de propiedades de compatibilidad hacia atrás (`edad`, `fecha_nacimiento_dia`, `fecha_nacimiento_mes`) para no romper los módulos de selección muestral.
3. **`src/core/vulnerability_flags.py` & `src/services/flag_calculator.py`**:
   * Centralización de la lógica de alertas. Calcula y asigna banderas tanto a nivel del hogar como a nivel individual evitando duplicidad o inconsistencias.
4. **`data/schemas/ficha_familiar.schema.json`**:
   * Esquema JSON Schema draft 2020-12 completo y validado sintácticamente para verificar cargas masivas o sincronizaciones externas.
5. **`examples/ejemplo_uso.py`**:
   * Script de prueba integral funcional que simula un hogar vulnerable, calcula banderas, ejecuta la matriz de Kish y registra una intervención de enfermería.

### 2.2 Base de Datos (Supabase): Tablas Independientes
Se ejecutó con éxito en el esquema `public` de Supabase el script SQL que creó los cajones de datos con prefijo `ff_`:
1. **`public.ff_hogares`**: Almacena las viviendas, georreferenciación y determinantes del entorno.
2. **`public.ff_personas`**: Almacena los integrantes familiares vinculados a `ff_hogares` mediante `hogar_id`. Se configuró con `ON DELETE RESTRICT` para impedir que una eliminación accidental del hogar borre el historial de salud de sus miembros.
3. **`public.ff_intervenciones`**: Registra cada visita o atención por perfil profesional (`ENFERMERIA`, `MEDICO`, `PSICOLOGIA`, `TRABAJO_SOCIAL`, `OBSTETRA`), vinculada al hogar y opcionalmente a la persona específica atendida.
4. **Índices de optimización:** Creados para agilizar búsquedas en campo por Ubigeo, DNI y relaciones de parentesco.

*Estado de la base de datos operativa:* Las tablas preexistentes del ecosistema SERUMS (`admins`, `banco_etiquetas`, `blueprints_carrera`, `cases`, `cie10`, `codigos_his`, `ia_preguntas_registro`, `preguntas_marcadas`, `question_import_review`, `respuestas_sesion`, `sesiones_evaluacion`, `tamizajes_clinicos`) se mantuvieron **100% intactas y operativas**.

---

## 3. Lógica Programática y Arquitectura de lo que Falta

Para transformar este núcleo de datos en una aplicación utilizable por serumistas en puestos de salud rurales o periurbanos, se requiere desarrollar los siguientes bloques:

### 3.1 Interfaz de Usuario y Captura Móvil (PWA Offline-First)
* **Tecnología sugerida:** PWA (Progressive Web App) en React / TypeScript (Tailwind CSS + shadcn/ui), instalable en dispositivos móviles Android/iOS.
* **Almacenamiento local temporal:** Uso de `IndexedDB` (vía Dexie.js o localforage) para que el profesional pueda ingresar fichas completas en zonas sin cobertura de internet (modo campo offline).
* **Captura de coordenadas GPS:** Integración con la API nativa de geolocalización del navegador móvil para capturar automáticamente latitud, longitud y precisión con un solo botón.

### 3.2 Pipeline de Sincronización Diferida (Sync Engine)
* **Cola de cambios (Outbox pattern):** Cada registro guardado sin internet se almacena localmente con estado `status: 'pending_sync'`.
* **Sincronización bidireccional:** Al detectar reconexión (Wi-Fi o red móvil al regresar al centro de salud), el motor procesa la cola y envía los registros a Supabase mediante transacciones seguras.
* **Resolución de conflictos:** Regla de última escritura o versionado (`updated_at`) para evitar sobreescrituras indebidas.

### 3.3 Motor Reactivo de Banderas y Alertas en Frontend
* Portar o invocar la lógica de `vulnerability_flags` directamente en la interfaz:
  * Al ingresar las habitaciones y miembros: calcular hacinamiento en tiempo real.
  * Al ingresar fecha de nacimiento: mostrar insignia visual de curso de vida (ej. badge naranja para lactante menor de 1 año).
  * Al marcar combustible de leña sin chimenea o agua de pozo sin clorar: encender alerta de riesgo ambiental.

### 3.4 Seguridad, Privacidad y Políticas RLS (Row Level Security)
* **Políticas en Supabase:**
  * Activar RLS en `ff_hogares`, `ff_personas` y `ff_intervenciones`.
  * Permitir lectura/escritura únicamente a usuarios autenticados con rol de salud autorizado.
  * Prevenir acceso anónimo a datos nominados (nombres, DNI, diagnósticos) protegiendo la identidad según la Ley 29733.
* **Control de acceso basado en roles (RBAC):**
  * Rol Administrador / Epidemiólogo: visualización de agregados y mapas de calor.
  * Rol Profesional de Campo: registro y edición de fichas en su jurisdicción.

### 3.5 Módulo de Visualización Epidemiológica y Mapas
* **Capa GIS:** Renderizado de puntos en mapa (Leaflet o Mapbox) utilizando las coordenadas guardadas en `ff_hogares`.
* **Filtros epidemiológicos:** Filtrar viviendas por bandera activa (ej. mostrar en rojo todos los hogares con riesgo de vector de dengue o con lactantes sin control).

---

## 4. Hoja de Ruta Priorizada (Próximos Pasos)

| Fase | Tarea Principal | Descripción Técnica |
| :--- | :--- | :--- |
| **Paso 3** | **Seguridad y RLS en Supabase** | Definir las políticas de acceso para las tablas `ff_` y roles de usuario. |
| **Paso 4** | **Construcción de la PWA (Frontend)** | Crear la estructura de pantallas: formulario de Hogar, lista de Miembros y panel de Banderas. |
| **Paso 5** | **Almacenamiento Local (Offline)** | Configurar `IndexedDB` para permitir el guardado local en el celular sin conexión. |
| **Paso 6** | **Módulo de Muestreo Integrado** | Conectar el botón de selección de la Tabla de Kish a la lista de personas del hogar en la pantalla. |
| **Paso 7** | **Módulo de Intervenciones** | Formularios rápidos para registro de tamizajes (salud mental PHQ-9/SRQ, vacunas, visitas). |
| **Paso 8** | **Tablero y Exportación** | Generación de reportes resumidos para el informe final de SERUMS y exportación en formato GeoJSON/CSV. |

---

## 5. Instrucciones de Contexto para la Siguiente IA

Para cualquier inteligencia artificial o desarrollador que retome este proyecto:

1. **Regla de No Destrucción:** El proyecto Supabase contiene tablas operativas de un banco de preguntas y evaluaciones SERUMS. **Bajo ninguna circunstancia modificar, truncar ni borrar tablas que no comiencen con el prefijo `ff_`**.
2. **Repositorio de Código:** El dominio analítico y los modelos de datos se encuentran en `https://github.com/4-4-1941/Sistema-de-Ficha-Familiar-Digital-y-Vigilancia-Epidemiol-gica-Modular.git`.
3. **Punto de Enlace:** Las tablas ya están creadas y verificadas en PostgreSQL (`ff_hogares`, `ff_personas`, `ff_intervenciones`). El siguiente trabajo debe enfocarse en la interfaz de captura (PWA) o en la definición de políticas de seguridad (RLS).
