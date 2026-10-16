# 05 - Auditoría y arquitectura (modelo local por suscripción)

**Proyecto:** Sistema de Ficha Familiar Digital y Vigilancia Epidemiológica Modular
**Fecha:** 2026-10-16 (versión 3: fuentes del repositorio SIP-AI-RAG)
**Estado:** propuesta para revisión profesional. Nada de lo aquí descrito está implementado ni validado por un profesional.

---

## 1. Decisión de diseño (definida por el autor)

| Tema | Decisión |
|---|---|
| Datos de familias | **No se guardan en el proyecto matriz (SERUM-APP / Supabase).** Todo dato queda en el dispositivo del profesional. |
| Modelo de uso | Suscripción individual. Puede suscribirse **un solo profesional** del centro (ej. una enfermera) y trabajar extramuros. |
| Fuente común | La lista de miembros del hogar es la base. Cada profesión cambia **banderas y módulos**, no la estructura familiar. |
| Perfiles | Enfermería (CRED, vacunas), Nutrición (vaso de leche), Psicología (tamizajes), Medicina, Obstetricia, Trabajo Social, Odontología. |
| Casos de uso | Dengue, vacunación, vaso de leche, tamizajes de salud mental, otros programas. |
| Fuera de alcance | Los 4 grupos de la ficha del estudio INSM (Adulto, Adolescente, Mujer unida, Adulto mayor) y su selección Kish fueron solo para ese estudio. **No se usan aquí.** |
| Fuente normativa | Primero el repositorio **SIP-AI-RAG** (`knowledge/` y `data/metadata/`). Si falta algo, la web. |

**Consecuencia:** el servidor central guarda **reglas** (catálogos, banderas, normas). El dispositivo guarda **personas**.

---

## 2. Qué cambia en la auditoría previa

| # | Hallazgo | Estado |
|---|---|---|
| 1 | RLS: solo el creador ve su hogar | ✅ Ya no es problema (no hay datos centrales) |
| 2 | Contradicción local vs. Supabase | ✅ Resuelta: **local** |
| 3 | Agua "no segura" casi siempre activa | ✅ Corregido (`vulnerability_flags.py` v1.2) |
| 4 | Edad por defecto 0 = lactante | ✅ Corregido (nueva `BANDERA_EDAD_FALTANTE`) |
| 5 | Edad y banderas guardadas se desactualizan | ⚠️ Parcial: las banderas se calculan, pero `persona.py` aún guarda edades |
| 6 | Textos libres en campos clave | ⚠️ Pendiente: usar catálogos de la ficha oficial |
| 7 | Salud mental como sí/no del hogar | ⚠️ Pendiente: pasa a módulo de Psicología |
| 8 | Tablas `ff_` con datos nominales en Supabase | ⚠️ No cargar datos reales; usar solo como esquema |
| 9 | Contenido mínimo de la Ficha Familiar oficial | ⚠️ Ver sección 7.3 |
| 10 | CRED y vacunación cambiaron de norma | ⚠️ Ver sección 7.1 |
| 11 | **Nuevo:** faltan etapas de vida Joven y Adulto | ⚠️ Ver sección 7.4 |

---

## 3. Arquitectura propuesta

### 3.1 Dos zonas

| Zona | Qué guarda | Datos personales |
|---|---|---|
| **Central (matriz)** | Catálogo de banderas, normas y vigencia, perfiles, paquetes de reglas, licencias | ❌ Ninguno |
| **Local (celular del profesional)** | Hogares, miembros, intervenciones, tamizajes | ✅ Solo aquí |

### 3.2 Núcleo común + módulos por perfil

**Núcleo (lo que todos ven):** hogar, ubicación, vivienda y miembros con fecha de nacimiento, sexo, parentesco, residencia habitual, gestante sí/no, lactancia sí/no.

| Perfil | Módulo | Ejemplos de campos |
|---|---|---|
| Enfermería | CRED y vacunas | Controles, esquema de vacunación |
| Nutrición | Vaso de leche / estado nutricional | Peso, talla, anemia, beneficiario |
| Psicología | Tamizajes | PHQ-9, SRQ, violencia, resultado y fecha |
| Medicina | Crónicos | Diagnósticos, tratamiento |
| Obstetricia | Gestantes | Controles prenatales |
| Trabajo Social | Social | Redes de apoyo, derivaciones |

**Principio de mínimo dato:** cada módulo guarda solo los datos de su profesión (una enfermera no captura salud mental).

### 3.3 Banderas como paquete de reglas

- Cada perfil recibe un **paquete de reglas** (JSON versionado): código, condición, norma, vigencia.
- La bandera se **calcula al abrir** la ficha. No se guarda.
- Dos tipos de regla:
  - **Bandera de etapa de vida** (lactante, niño, adolescente, joven, adulto, adulto mayor).
  - **Regla de programa** con su propia edad (ej. VPH de 9 a 18 años), porque puede cruzar etapas.
- Cuando cambia una norma, se publica una **nueva versión** del paquete.

```json
{
  "codigo": "VAC_VPH_9_A_18",
  "tipo": "programa",
  "perfiles": ["ENFERMERIA"],
  "condicion": "edad_anios >= 9 and edad_anios <= 18",
  "norma": "NTS 246-MINSA/DGIESP-2026, Anexo 17, p. 125",
  "vigente_desde": "2026-06-13",
  "version": "1.0.0"
}
```

---

## 4. Seguridad y datos sensibles (Ley 29733 y su reglamento)

- Guardar localmente **no exime** de la ley. Los datos de salud y ubicación son sensibles.
- **Cifrar el almacenamiento local** con una clave del profesional.
- **Exportar solo cifrado** (respaldo y traspaso entre profesionales).
- **Consentimiento informado** antes de capturar datos en campo. La NTS 139 trae un formato de consentimiento para tratamiento de datos personales (Anexo 11) que sirve de referencia.
- **Sin analítica ni registros** que envíen datos de familias al servidor.
- Etnia, idioma y religión (la ficha oficial los incluye) son datos sensibles: dejarlos **opcionales**.
- Estadísticas agregadas futuras: solo conteos anónimos, con mínimo de casos por celda y evaluado por separado.
- Las banderas **no son diagnóstico**: son alertas de priorización.

---

## 5. Un solo profesional suscrito

- Ese profesional crea la ficha y **exporta** listas para otros (ej. niños para el vaso de leche).
- Otro profesional suscrito puede **importar** el archivo cifrado con consentimiento. Los UUID generados en el celular evitan choques al unir datos.
- No hay acceso compartido automático.

---

## 6. Correcciones técnicas

| Archivo | Problema | Estado |
|---|---|---|
| `vulnerability_flags.py` | `or not agua_tratada` marcaba casi todo hogar | ✅ Corregido (v1.2) |
| `vulnerability_flags.py` | `edad_anios = 0` marcaba lactante | ✅ Corregido |
| `vulnerability_flags.py` | Reglas por persona duplicadas en `flag_calculator.py` | ✅ Unificadas |
| `vulnerability_flags.py` | Hacinamiento con valor viejo guardado | ✅ Corregido |
| `vulnerability_flags.py` | Faltan etapas **Joven (18-29)** y **Adulto (30-59)** | ⚠️ Pendiente |
| `persona.py` | Guarda `edad_anios`, `edad_meses` | ⚠️ Pendiente: calcular desde `fecha_nacimiento` |
| `persona.py` | No hay campo de **lactancia** | ⚠️ Pendiente (lo exige el Vaso de Leche) |
| `persona.py` | Discapacidad = sí/no + texto | ⚠️ Pendiente: 6 tipos de limitación y su origen |
| `persona.py` | Parentesco, estado civil e instrucción sin catálogo | ⚠️ Pendiente: usar los códigos de la ficha oficial (7.3) |
| `docs/02` vs código | 3 banderas no documentadas | ⚠️ Pendiente |
| Esquema JSON vs SQL | `sexo` nulo distinto; 6 vs 5 perfiles | ⚠️ Pendiente |
| Campos de vivienda | Textos libres | ⚠️ Pendiente: listas cerradas |
| Kish del repo | Una sola tabla, distinta a la del estudio INSM | ⏸️ Sin cambio: no se usa en este proyecto |

---

## 7. Verificación normativa (consultada el 2026-10-16)

### 7.1 Normas confirmadas

| Tema | Norma | Qué dice | Fuente |
|---|---|---|---|
| **Ficha Familiar** | NTS N° 139-MINSA/2018/DGAIN (RM 214-2018/MINSA), **Anexo 1** | Formato básico de la Historia Clínica. Texto completo en el repo. | SIP-AI-RAG: `knowledge/minsa/serums-2026-ii/187487-ministerio-de-salud.md` |
| **CRED** | NTS N° 238-MINSA/DGIESP-2025 (RM 682-2025/MINSA, aprobada el 13-oct-2025) | Reemplaza la norma de 2017. Controles hasta **11 años, 11 meses y 29 días** (según página oficial del MINSA). | SIP-AI-RAG: `data/metadata/nino/` y `knowledge/minsa/nts-n-238-...pdf` (anexos sin leer) |
| **Vacunación** | NTS N° 246-MINSA/DGIESP-2026 (RM 561-2026/MINSA, 13-jun-2026) | Reemplaza el esquema 2022. Anexo 17 con grupos por edad (ver 7.5). | SIP-AI-RAG: `knowledge/minsa/nts-n-246-...parte-1/parte-2.pdf` (escaneados) |
| **Dengue: vigilancia** | NTS N° 230-MINSA/CDC-2025 (RM 473-2025/MINSA) | Vigilancia de dengue y otras arbovirosis. | SIP-AI-RAG: `data/metadata/arbovirosis/` y web |
| **Dengue: vector** | NTS N° 198-MINSA/DIGESA (RM 228-2023/MINSA) | Vigilancia entomológica de *Aedes aegypti*. | Web |
| **Dengue: atención** | NTS N° 211-MINSA/DGIESP-2024 (RM 175-2024/MINSA) | Atención integral del dengue. | Web |
| **Vaso de Leche** | Ley N° 27470 | Niños de 0 a 6 años, gestantes y madres lactantes; luego 7 a 13 años, ancianos y afectados por TBC. Programa **municipal**. | Web (no está en el repo) |
| **Hacinamiento** | INEI, déficit cualitativo de vivienda (2019) | Más de 3 personas por habitación; INEI no cuenta solo dormitorios. | Web |

### 7.2 Aún no confirmado

- **Dosis e intervalos** de cada vacuna: están en la parte 1 de la NTS 246 (97 páginas escaneadas), todavía sin leer.
- **Anexos de la NTS 238 (CRED):** edades y controles exactos.
- **Agua segura:** criterio oficial para la bandera.
- **Tamizajes de salud mental:** el repo tiene `data/metadata/salud-mental/` (RM 136-2023 depresión, RM 686-2024, Manual HIS 2025). Falta revisarlos.
- **Vacuna contra el dengue:** solo vista en un sitio no oficial. No usar.
- **Edad de "ancianos"** en el Vaso de Leche: la ley no la fija en lo que revisé.

### 7.3 Ficha Familiar oficial (NTS 139, Anexo 1) frente al modelo

| Parte oficial | ¿Lo cubre el modelo? |
|---|---|
| I. Datos generales (integrantes por etapa de vida) | ⚠️ Parcial |
| II. Localización de la vivienda y datos sociodemográficos | ✅ Parcial |
| III. Visita de salud familiar (fecha, responsable, resultado, próxima visita) | ❌ No |
| IV. Características de los miembros | ✅ Parcial (ver abajo) |
| V. Instrumentos de evaluación familiar (ciclo vital, ecomapa, familiograma, tipo de familia) | ❌ No |
| VI. Riesgos por etapa de vida y como familia | ⚠️ Parcial |
| VII a IX. Características de la familia y la vivienda, riesgos del entorno, PAIFAM | ⚠️ Según el resumen del INR (2020); falta releer el anexo |

**Campos oficiales de cada miembro (parte IV):** nombres y apellidos, edad y sexo, DNI o carnet de extranjería, fecha de nacimiento, parentesco, estado civil, grado de instrucción, ocupación, condición de la ocupación, seguro de salud (SIS, EsSalud/FFAA/PNP, privado). A nivel de familia: etnia, idioma y religión.

**Catálogos oficiales (para reemplazar textos libres):**
- **Parentesco:** padre, madre, hijo/a, hijo/a adoptivo/a, abuelo/a, tío/a, nieto/a, padrastro, madrastra, sobrino/a, primo/a, bisabuelo/a, amigo/a, hermano/a, yerno, nuera.
- **Estado civil:** soltero/a, conviviente, casado/a, separado/a, divorciado/a, viudo/a, otros.
- **Grado de instrucción:** sin instrucción, inicial, primaria (completa/incompleta), secundaria (completa/incompleta), superior (completo/incompleto).
- **Condición de la ocupación:** estable, eventual, sin ocupación, jubilado/a, estudiante.

*Nota: el texto del repo viene de un escaneo con errores de lectura (OCR). Antes de programar, comparar con el PDF.*

### 7.4 Etapas de vida de la ficha oficial

| Etapa | Edad |
|---|---|
| Niño | 0 a 11 años |
| Adolescente | 12 a 17 años |
| Joven | 18 a 29 años |
| Adulto | 30 a 59 años |
| Adulto mayor | 60 años a más (la cifra salió ilegible en el escaneo; coincide con el Anexo 17 de la NTS 246) |

El código actual tiene lactante, niño de 1 a 4, niño de 5 a 11, adolescente y adulto mayor. **Faltan Joven y Adulto.**

### 7.5 Vacunación por grupos (NTS 246, Anexo 17, págs. 121-129)

El Anexo 17 son **criterios de programación**, no el esquema clínico.

| Grupo | Biológicos que aparecen |
|---|---|
| Recién nacidos | BCG, hepatitis B (primeras 24 h), nirsevimab (anticuerpo monoclonal) |
| Menores de 5 años | Rotavirus, pentavalente o hexavalente (2, 4 y 6 meses), neumococo, influenza, SPR, antiamarílica (15 meses), refuerzo DPT a los 4 años |
| 9 a 18 años | VPH, dosis única; prioridad a los 9 años |
| 5 a 59 años | Hepatitis B, DT, influenza, antiamarílica, SPR en zonas de riesgo, neumococo en comorbilidad, Tdap en brotes de tos ferina |
| 60 años a más | Influenza, neumococo |
| Gestantes | Tdap (20 a 36 semanas), VRS (32 a 36 semanas), hepatitis B |
| Especiales (VIH, inmunodeprimidos) | Hexavalente acelular, meningococo, DPT-IPV |

*El indicador de cobertura mide a los 24 meses, pero el esquema continúa hasta la vejez. Lectura por OCR: confirmar contra el PDF antes de usar.*

---

## 8. Orden sugerido

1. Agregar las etapas Joven y Adulto, y reglas de programa con su propia edad (7.4 y 7.5).
2. Definir el núcleo de campos con los catálogos oficiales (7.3).
3. Leer la parte 1 de la NTS 246 y los anexos de la NTS 238 (dosis, intervalos y controles).
4. Primer perfil: enfermería (CRED y vacunas).
5. Almacenamiento local cifrado y exportación.
6. Segundo perfil (psicología, con las normas de salud mental del repo).
