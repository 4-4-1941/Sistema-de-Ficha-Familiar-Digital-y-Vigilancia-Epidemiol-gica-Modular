# 05 - Auditoría y arquitectura (modelo local por suscripción)

**Proyecto:** Sistema de Ficha Familiar Digital y Vigilancia Epidemiológica Modular
**Fecha:** 2026-10-16 (versión 4: esquema oficial de vacunación leído en el PDF)
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

## 2. Estado de los hallazgos

| # | Hallazgo | Estado |
|---|---|---|
| 1 | RLS: solo el creador ve su hogar | ✅ Ya no es problema (no hay datos centrales) |
| 2 | Contradicción local vs. Supabase | ✅ Resuelta: **local** |
| 3 | Agua "no segura" casi siempre activa | ✅ Corregido (`vulnerability_flags.py`) |
| 4 | Edad por defecto 0 = lactante | ✅ Corregido (nueva `BANDERA_EDAD_FALTANTE`) |
| 5 | Edad y banderas guardadas se desactualizan | ⚠️ Parcial: las banderas se calculan, pero `persona.py` aún guarda edades |
| 6 | Textos libres en campos clave | ⚠️ Pendiente: usar catálogos de la ficha oficial |
| 7 | Salud mental como sí/no del hogar | ⚠️ Pendiente: pasa a módulo de Psicología |
| 8 | Tablas `ff_` con datos nominales en Supabase | ⚠️ No cargar datos reales; usar solo como esquema |
| 9 | Contenido mínimo de la Ficha Familiar oficial | ⚠️ Ver sección 7.3 |
| 10 | CRED y vacunación cambiaron de norma | ✅ Vacunación verificada (7.5). CRED: anexos sin leer |
| 11 | Faltan etapas de vida Joven y Adulto | ✅ Agregadas (v1.3) |
| 12 | **Nuevo:** las reglas de vacunación infantil exigen edad en **meses** | ⚠️ Pendiente en `persona.py` (ver 7.5) |

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
| Enfermería | CRED y vacunas | Controles, dosis aplicadas con fecha |
| Nutrición | Vaso de leche / estado nutricional | Peso, talla, anemia, beneficiario |
| Psicología | Tamizajes | PHQ-9, SRQ, violencia, resultado y fecha |
| Medicina | Crónicos | Diagnósticos, tratamiento |
| Obstetricia | Gestantes | Controles prenatales |
| Trabajo Social | Social | Redes de apoyo, derivaciones |

**Principio de mínimo dato:** cada módulo guarda solo los datos de su profesión.

### 3.3 Banderas como paquete de reglas

- Cada perfil recibe un **paquete de reglas** (JSON versionado): código, condición, norma, vigencia.
- La bandera se **calcula al abrir** la ficha. No se guarda.
- Dos tipos de regla:
  - **Bandera de etapa de vida** (lactante, niño, adolescente, joven, adulto, adulto mayor).
  - **Regla de programa** con su propia edad (ej. VPH desde los 9 años), porque cruza etapas.
- Cuando cambia una norma, se publica una **nueva versión** del paquete.

```json
{
  "codigo": "VAC_VPH_9_A_11",
  "tipo": "programa",
  "perfiles": ["ENFERMERIA"],
  "condicion": "edad_anios >= 9 and edad_anios <= 11",
  "norma": "NTS 246-MINSA/DGIESP-2026, numeral 6.2.2 (p. 46)",
  "vigente_desde": "2026-06-13",
  "version": "1.0.0"
}
```

---

## 4. Seguridad y datos sensibles (Ley 29733 y su reglamento)

- Guardar localmente **no exime** de la ley. Los datos de salud y ubicación son sensibles.
- **Cifrar el almacenamiento local** con una clave del profesional.
- **Exportar solo cifrado** (respaldo y traspaso entre profesionales).
- **Consentimiento informado** antes de capturar datos en campo. La NTS 139 trae un formato de consentimiento para tratamiento de datos personales (Anexo 11).
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
| `vulnerability_flags.py` | Agua no segura, edad en 0, hacinamiento, código duplicado | ✅ Corregido |
| `vulnerability_flags.py` | Faltaban **Joven (18-29)** y **Adulto (30-59)** | ✅ Corregido (v1.3) |
| `persona.py` | Guarda `edad_anios`, `edad_meses` | ⚠️ Pendiente: calcular desde `fecha_nacimiento`, incluida la **edad total en meses** |
| `persona.py` | No hay campo de **lactancia** | ⚠️ Pendiente (lo exige el Vaso de Leche) |
| `persona.py` | Discapacidad = sí/no + texto | ⚠️ Pendiente: 6 tipos de limitación y su origen |
| `persona.py` | Parentesco, estado civil e instrucción sin catálogo | ⚠️ Pendiente: códigos de la ficha oficial (7.3) |
| `docs/02` vs código | Faltan `BANDERA_JOVEN`, `BANDERA_ADULTO` y otras 3 sin documentar | ⚠️ Pendiente |
| Esquema JSON vs SQL | `sexo` nulo distinto; 6 vs 5 perfiles | ⚠️ Pendiente |
| Campos de vivienda | Textos libres | ⚠️ Pendiente: listas cerradas |
| Kish del repo | Una sola tabla, distinta a la del estudio INSM | ⏸️ Sin cambio: no se usa en este proyecto |

---

## 7. Verificación normativa (consultada el 2026-10-16)

### 7.1 Normas confirmadas

| Tema | Norma | Qué dice | Fuente |
|---|---|---|---|
| **Ficha Familiar** | NTS N° 139-MINSA/2018/DGAIN (RM 214-2018/MINSA), **Anexo 1** | Formato básico de la Historia Clínica. | SIP-AI-RAG: `knowledge/minsa/serums-2026-ii/187487-ministerio-de-salud.md` |
| **CRED** | NTS N° 238-MINSA/DGIESP-2025 (RM 682-2025/MINSA, aprobada el 13-oct-2025) | Reemplaza la norma de 2017. Controles hasta **11 años, 11 meses y 29 días** (según página oficial del MINSA). | SIP-AI-RAG: `knowledge/minsa/nts-n-238-...pdf` (anexos sin leer) |
| **Vacunación** | NTS N° 246-MINSA/DGIESP-2026 (RM 561-2026/MINSA, 13-jun-2026) | Esquema por curso de vida (numeral 6.2) y anexos. **Leído en las imágenes del PDF.** | Archivos subidos (partes 1 y 2) y SIP-AI-RAG |
| **Dengue: vigilancia** | NTS N° 230-MINSA/CDC-2025 (RM 473-2025/MINSA) | Vigilancia de dengue y otras arbovirosis. | SIP-AI-RAG: `data/metadata/arbovirosis/` y web |
| **Dengue: vector** | NTS N° 198-MINSA/DIGESA (RM 228-2023/MINSA) | Vigilancia entomológica de *Aedes aegypti*. | Web |
| **Dengue: atención** | NTS N° 211-MINSA/DGIESP-2024 (RM 175-2024/MINSA) | Atención integral del dengue. | Web |
| **Vaso de Leche** | Ley N° 27470 | Niños de 0 a 6 años, gestantes y madres lactantes; luego 7 a 13 años, ancianos y afectados por TBC. Programa **municipal**. | Web |
| **Hacinamiento** | INEI, déficit cualitativo de vivienda (2019) | Más de 3 personas por habitación; INEI no cuenta solo dormitorios. | Web |

### 7.2 Aún no confirmado

- **Anexos de la NTS 238 (CRED):** edades y controles exactos.
- **Criterio oficial de agua segura.**
- **Tamizajes de salud mental:** el repo tiene `data/metadata/salud-mental/` (RM 136-2023 depresión, RM 686-2024, Manual HIS 2025). Falta revisarlos.
- **Vacuna contra el dengue:** el Anexo 20 de la NTS 246 (p. 137) la nombra solo como "campaña de vacunación contra el Dengue, en las regiones". **No trae edades ni dosis.**
- **Edad de "ancianos"** en el Vaso de Leche: la ley no la fija en lo que revisé.
- **Resto de la parte 1 de la NTS 246** (contraindicaciones, intervalos mínimos, estrategias): solo leí las págs. 45 a 48. El OCR de las demás páginas no es confiable.
- **Texto oficial de la Ficha Familiar, partes VII a IX:** solo vi el resumen del INR (2020).

### 7.3 Ficha Familiar oficial (NTS 139, Anexo 1) frente al modelo

| Parte oficial | ¿Lo cubre el modelo? |
|---|---|
| I. Datos generales (integrantes por etapa de vida) | ⚠️ Parcial |
| II. Localización de la vivienda y datos sociodemográficos | ✅ Parcial |
| III. Visita de salud familiar (fecha, responsable, resultado, próxima visita) | ❌ No |
| IV. Características de los miembros | ✅ Parcial |
| V. Instrumentos de evaluación familiar (ciclo vital, ecomapa, familiograma, tipo de familia) | ❌ No |
| VI. Riesgos por etapa de vida y como familia | ⚠️ Parcial |
| VII a IX. Características de la familia y la vivienda, riesgos del entorno, PAIFAM | ⚠️ Según el resumen del INR (2020) |

**Campos oficiales de cada miembro (parte IV):** nombres y apellidos, edad y sexo, DNI o carnet de extranjería, fecha de nacimiento, parentesco, estado civil, grado de instrucción, ocupación, condición de la ocupación, seguro de salud (SIS, EsSalud/FFAA/PNP, privado). A nivel de familia: etnia, idioma y religión.

**Catálogos oficiales (para reemplazar textos libres):**
- **Parentesco:** padre, madre, hijo/a, hijo/a adoptivo/a, abuelo/a, tío/a, nieto/a, padrastro, madrastra, sobrino/a, primo/a, bisabuelo/a, amigo/a, hermano/a, yerno, nuera.
- **Estado civil:** soltero/a, conviviente, casado/a, separado/a, divorciado/a, viudo/a, otros.
- **Grado de instrucción:** sin instrucción, inicial, primaria (completa/incompleta), secundaria (completa/incompleta), superior (completo/incompleto).
- **Condición de la ocupación:** estable, eventual, sin ocupación, jubilado/a, estudiante.

*Nota: el texto del repo viene de un escaneo con errores de lectura (OCR). Antes de programar, comparar con el PDF.*

### 7.4 Etapas de vida (confirmadas)

La NTS 246 (numerales 6.2.2 a 6.2.6) y la Ficha Familiar usan las mismas cinco etapas:

| Etapa | Edad |
|---|---|
| Niña/niño | 0 a 11 años, 11 meses y 29 días |
| Adolescente | 12 a 17 años |
| Joven | 18 a 29 años |
| Adulto | 30 a 59 años |
| Adulto mayor | 60 años a más |

### 7.5 Esquema oficial de vacunación (NTS 246, numeral 6.2, págs. 45 a 48)

**Gestantes (6.2.1, p. 45)**

| Momento | Vacuna | Dosis |
|---|---|---|
| 20 a 36 semanas | Tdap | 1 dosis en cada embarazo |
| 32 a 36 semanas | VRS | 1 dosis en cada embarazo |
| Cualquier edad gestacional | Influenza adulta | 1 dosis, anual |
| Cualquier edad gestacional, si no está vacunada o tiene esquema incompleto | Hepatitis B | 3 dosis: al contacto, al mes de la 1ª, al mes de la 2ª |
| Desde las 20 semanas, sin esquema primario | Tdap + dT | 1ª dosis (Tdap) desde las 20 semanas; 2ª a los 2 meses; 3ª a los 4 meses de la 2ª. Intervalo mínimo: 4 semanas |

**Niña y niño (6.2.2, págs. 45 y 46)**

| Edad | Vacunas y dosis |
|---|---|
| Recién nacido | BCG y hepatitis B (dosis única); anticuerpo monoclonal contra VRS |
| 2 meses | 1ª dosis: pentavalente o hexavalente, IPV, rotavirus, neumococo |
| 4 meses | 2ª dosis: pentavalente o hexavalente, IPV, rotavirus, neumococo |
| 6 meses | 3ª dosis: pentavalente o hexavalente, IPV. Influenza pediátrica 1ª |
| 1 a 6 meses | Anticuerpo monoclonal VRS, dosis única, si no lo recibió de recién nacido o es de alto riesgo |
| 7 meses | Influenza pediátrica 2ª |
| 12 meses | SPR 1ª; neumococo 3ª; varicela 1ª; influenza pediátrica (dosis única) |
| 15 meses | Antiamarílica (dosis única); hepatitis A (dosis única) |
| 18 meses | 1er refuerzo DPT + IPV (o hexavalente); SPR 2ª |
| 2 años | Influenza pediátrica (dosis única); varicela 2ª (se incorporará progresivamente) |
| 3 años | Influenza adulto (dosis única) |
| 4 años | 2º refuerzo DPT y 2º refuerzo APO |
| 5 a 11 años | SR/SPR dosis única, si no tiene esquema primario, en zonas de brote |
| 9 a 11 años | VPH, dosis única |

*La hexavalente depende de que se agoten los stocks de pentavalente e IPV.*

**Adolescente, joven, adulto y adulto mayor (6.2.3 a 6.2.6, págs. 47 y 48)**

| Etapa | Vacunas |
|---|---|
| **Adolescente (12-17)** | Influenza adulto (anual); dT adulto (3 dosis); hepatitis B según edad (3 dosis); antiamarílica (dosis única); SR/SPR (zonas de brote); VPH (dosis única). De 14 a 17: Tdap en zonas de brote de tos ferina y gestantes |
| **Joven (18-29)** | A los 18 años VPH (dosis única). Influenza (anual); dT (3 dosis); hepatitis B (3 dosis); antiamarílica; Tdap (brote y gestantes); SR/SPR (brote) |
| **Adulto (30-59)** | Influenza (anual); dT (3 dosis); hepatitis B (3 dosis); antiamarílica; Tdap (brote y gestantes); SR/SPR (brote) |
| **Adulto mayor (60+)** | Influenza (dosis única cada año); neumococo (dosis única) |

**Casos especiales y población en riesgo (Anexo 17, págs. 126 a 130)**
- **Niños con VIH:** esquema propio con hexavalente acelular, meningococo y DPT-IPV (6.3.1 y Anexo 17-C).
- **Comorbilidad (5 a 59 años):** influenza anual y neumococo dosis única (personal de salud, VIH, TBC, diabetes, cardiopatías, enfermedades renales, oncológicas o respiratorias crónicas).
- **60 años a más:** el Anexo 17 también prioriza neumococo para quienes tienen enfermedades neurológicas, diabetes, renales, demencia o Parkinson.
- **Personal de salud de áreas críticas:** Tdap en zonas de brote de tos ferina.

**Códigos HIS (Anexo 20, págs. 134 a 136):** BCG 90585, hepatitis B 90744, pentavalente 90723, SPR 90707, DPT 90701, influenza 90657, Tdap 90715.

**Discrepancia por aclarar:** el Anexo 17 (p. 124) ubica la 2ª dosis de varicela en la programación de niños de 3 y 4 años, mientras que el numeral 6.2.2 la pone a los 2 años. Hasta aclararlo, usar el numeral 6.2.2 y marcarlo como "incorporación progresiva".

**Para el código:** las reglas infantiles se cortan en **meses** (0, 2, 4, 6, 7, 12, 15 y 18) y luego en años (2, 3, 4, 9). Por eso `persona.py` debe calcular la edad total en meses desde la fecha de nacimiento.

---

## 8. Orden sugerido

1. `persona.py`: calcular edad (años y **meses totales**) desde la fecha de nacimiento y agregar lactancia.
2. Definir el núcleo de campos con los catálogos oficiales (7.3).
3. Primer perfil, Enfermería: paquete de reglas de vacunación con el esquema de 7.5.
4. Leer los anexos de la NTS 238 (CRED).
5. Almacenamiento local cifrado y exportación.
6. Segundo perfil (psicología, con las normas de salud mental del repo).
