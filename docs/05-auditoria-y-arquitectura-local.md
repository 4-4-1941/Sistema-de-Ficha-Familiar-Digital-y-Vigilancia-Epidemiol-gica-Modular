# 05 - Auditoría y arquitectura (modelo local por suscripción)

**Proyecto:** Sistema de Ficha Familiar Digital y Vigilancia Epidemiológica Modular
**Fecha:** 2026-10-15 (versión 2: normas verificadas en fuentes oficiales)
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

**Consecuencia:** el servidor central guarda **reglas** (catálogos, banderas, normas). El dispositivo guarda **personas**.

---

## 2. Qué cambia en la auditoría previa

| # | Hallazgo previo | Estado con el modelo local |
|---|---|---|
| 1 | RLS: solo el creador ve su hogar | ✅ Deja de ser problema (no hay datos centrales) |
| 2 | Contradicción local vs. Supabase | ✅ Resuelta: **local** |
| 3 | Agua "no segura" casi siempre activa | ⚠️ Sigue. Corregir regla |
| 4 | Edad por defecto 0 = lactante | ⚠️ Sigue. Corregir regla |
| 5 | Edad y banderas guardadas se desactualizan | ⚠️ Sigue. Calcular al momento |
| 6 | Textos libres en campos clave | ⚠️ Sigue. Usar listas cerradas |
| 7 | Salud mental como sí/no del hogar | ⚠️ Sigue. Pasa a módulo de Psicología |
| 8 | Tablas `ff_` en Supabase con datos nominales | ⚠️ **No cargar datos reales.** Usar solo como esquema de referencia |
| 9 | **Nuevo:** el modelo no cubre el contenido mínimo oficial de la Ficha Familiar | ⚠️ Ver sección 7 |
| 10 | **Nuevo:** CRED y vacunación cambiaron de norma | ⚠️ Ver sección 7 |

---

## 3. Arquitectura propuesta

### 3.1 Dos zonas

| Zona | Qué guarda | Datos personales |
|---|---|---|
| **Central (matriz)** | Catálogo de banderas, normas y vigencia, perfiles, paquetes de reglas, licencias | ❌ Ninguno |
| **Local (celular del profesional)** | Hogares, miembros, intervenciones, tamizajes | ✅ Solo aquí |

### 3.2 Núcleo común + módulos por perfil

**Núcleo (lo que todos ven):** hogar, ubicación, vivienda y miembros con fecha de nacimiento, sexo, parentesco, residencia habitual, gestante sí/no, lactancia sí/no.

**Módulos (cada profesión agrega solo lo suyo):**

| Perfil | Módulo | Ejemplos de campos |
|---|---|---|
| Enfermería | CRED y vacunas | Controles, esquema de vacunación |
| Nutrición | Vaso de leche / estado nutricional | Peso, talla, anemia, beneficiario |
| Psicología | Tamizajes | PHQ-9, SRQ, violencia, resultado y fecha |
| Medicina | Crónicos | Diagnósticos, tratamiento |
| Obstetricia | Gestantes | Controles prenatales |
| Trabajo Social | Social | Redes de apoyo, derivaciones |

**Principio de mínimo dato:** una enfermera **no** debe capturar salud mental. Cada módulo guarda solo los datos de su profesión.

### 3.3 Banderas como paquete de reglas

- Cada perfil recibe un **paquete de reglas** (archivo JSON versionado) con: código de bandera, condición, norma de referencia, fecha de vigencia.
- La bandera se **calcula al abrir** la ficha. No se guarda (así no se desactualiza).
- Cuando cambia una norma, se publica una **nueva versión** del paquete. No se reprograma la app.

```json
{
  "codigo": "BANDERA_LACTANTE",
  "perfiles": ["ENFERMERIA", "NUTRICION", "MEDICO"],
  "condicion": "edad_meses < 12",
  "norma": "NTS 238-MINSA/DGIESP-2025 (CRED)",
  "vigente_desde": "POR CONFIRMAR",
  "version": "1.0.0"
}
```

### 3.4 Qué banderas usaría cada decisión (orientativo)

| Decisión | Banderas / filtros de apoyo |
|---|---|
| **Dengue** | Riesgo vectorial, agua almacenada, febriles en el hogar, gestantes, niños, adultos mayores |
| **Vacunación** | Todas las edades según el nuevo Esquema Nacional de Inmunizaciones (incluye gestantes y grupos de riesgo) |
| **CRED** | Niños hasta 11 años, 11 meses y 29 días (norma 2025) |
| **Vaso de leche** | Niños de 0 a 6 años, gestantes, madres lactantes; luego 7 a 13 años, ancianos y afectados por TBC |
| **Tamizajes de salud mental** | Adolescentes, adultos mayores, hogar monoparental, violencia (módulo de Psicología) |
| **Crónicos** | Adultos mayores, crónicos, discapacidad |

---

## 4. Seguridad y datos sensibles (Ley 29733 y su reglamento)

- Guardar localmente **no exime** de la ley. Los datos de salud y ubicación son sensibles.
- **Cifrar el almacenamiento local** con una clave del profesional (si pierde el celular, los datos no se leen).
- **Exportar solo cifrado** (respaldo y traspaso entre profesionales).
- **Consentimiento informado** registrado antes de capturar datos en campo.
- **Sin analítica ni registros** que envíen datos de familias al servidor.
- Si en el futuro se quieren **estadísticas agregadas**, solo conteos anónimos y con un mínimo de casos por celda, y evaluado por separado.
- No presentar las banderas como diagnóstico. Son **alertas de priorización**.

---

## 5. Un solo profesional suscrito

- Ese profesional crea la ficha y puede **exportar** listas para otros (ej. lista de niños para el vaso de leche).
- Si otro profesional se suscribe, puede **importar** el archivo cifrado con consentimiento. Los identificadores (UUID generados en el celular) evitan choques al unir datos.
- No hay acceso compartido automático.

---

## 6. Correcciones técnicas pendientes (en el código actual)

| Archivo | Problema | Corrección propuesta |
|---|---|---|
| `vulnerability_flags.py` | `or not agua_tratada` marca casi todo hogar | Evaluar fuente **y** tratamiento; red pública con cloro no es riesgo |
| `vulnerability_flags.py` | `edad_anios = 0` por defecto marca lactante | Exigir fecha de nacimiento o marcar "dato faltante" |
| `vulnerability_flags.py` | CRED asumido hasta 5 años | Ampliar a 11 años 11 meses 29 días (sección 7) |
| `persona.py` | Guarda `edad_anios`, `edad_meses`, `banderas` | Calcular desde `fecha_nacimiento` |
| `persona.py` | No existe campo de **lactancia** | Agregar "madre en período de lactancia" (lo exige el Vaso de Leche) |
| `persona.py` | Discapacidad = sí/no + texto | Usar los 6 tipos de limitación y su origen (sección 7) |
| `hogar.py` | `personas_por_habitacion` guardado | Calcular siempre |
| `docs/02` vs código | 3 banderas no documentadas | Documentar o retirar |
| `ficha_familiar.schema.json` vs SQL | `sexo` nulo distinto | Unificar |
| Perfiles | JSON: 6 perfiles; hoja de ruta: 5 | Unificar lista |
| Campos de vivienda | Textos libres | Listas cerradas (catálogo) |
| Hacinamiento | Cuenta solo habitaciones para dormir | Documentar la definición propia (sección 7) |

---

## 7. Verificación normativa (consultada el 2026-10-15)

### 7.1 Normas confirmadas en fuentes oficiales o de prensa oficial

| Tema | Norma | Qué encontré | Impacto en el proyecto |
|---|---|---|---|
| **Ficha Familiar** | NTS N° 139-MINSA/2018/DGAIN (RM 214-2018/MINSA), numeral 5.2 | La Ficha Familiar es un **formato básico de la Historia Clínica**. Sigue citada en documentos de 2026. | La ficha debe tratarse como documento clínico. Ver brechas en 7.3 |
| **CRED** | **NTS N° 238-MINSA/DGIESP-2025** (RM 682-2025/MINSA) | **Reemplaza la norma de 2017** (NTS 137). Amplía los controles **hasta 11 años, 11 meses y 29 días**. | Las banderas de CRED ya no deben limitarse a menores de 5 años |
| **Vacunación** | **NTS N° 246-MINSA/DGIESP-2026** (RM 561-2026/MINSA, 13-jun-2026) | **Reemplaza el esquema 2022** (NTS 196) y deja sin efecto sus modificaciones 2023-2026. | No programar con NTS 196 ni 141. Falta leer el anexo con edades y dosis |
| **Dengue: vigilancia** | NTS N° 230-MINSA/CDC-2025 (RM 473-2025/MINSA) | Vigilancia epidemiológica y laboratorio de dengue y otras arbovirosis. Obligatoria en todos los establecimientos. | Definiciones de caso para el módulo de dengue |
| **Dengue: vector** | NTS N° 198-MINSA/DIGESA (RM 228-2023/MINSA) | Vigilancia entomológica y control de *Aedes aegypti*. | Base de la bandera de riesgo vectorial y criaderos |
| **Dengue: atención** | NTS N° 211-MINSA/DGIESP-2024 (RM 175-2024/MINSA) | Atención integral de pacientes con dengue. El anexo 4 fue derogado por la norma 230. | Referencia clínica para Medicina y Enfermería |
| **Vaso de Leche** | Ley N° 27470 (complementa la Ley 24059) | Beneficiarios: niños de 0 a 6 años, gestantes y madres en lactancia, con prioridad a desnutrición o TBC. Luego niños de 7 a 13 años, ancianos y afectados por TBC. | Es un programa **municipal** (no del MINSA). La lista que genere la app es de apoyo, no el padrón oficial |
| **Hacinamiento** | INEI (déficit cualitativo de vivienda, 2019) | Más de 3 personas por habitación. Publicaciones antiguas de NBI usaron más de 3,4, sin contar baño, cocina, pasadizo ni garaje. | El corte "más de 3" es coherente. Pero INEI no cuenta solo dormitorios |

### 7.2 Lo que **no** pude confirmar (pendiente)

- **Texto oficial completo** del anexo de la Ficha Familiar. Solo leí un resumen de 2020 del Instituto Nacional de Rehabilitación (INR).
- **Anexos de las normas 238 (CRED) y 246 (vacunación):** edades exactas, dosis y periodicidad.
- **Agua segura:** criterio oficial para la bandera.
- **Tamizajes de salud mental:** norma que fija PHQ-9, SRQ u otros.
- **Vacuna contra el dengue:** solo la vi en un sitio no oficial. No usarla hasta confirmar.
- **Edad de "ancianos"** en el Vaso de Leche: la ley no la fija en lo que revisé.

### 7.3 Brechas del modelo frente al contenido mínimo de la Ficha Familiar

Según el resumen del INR, la ficha tiene 9 partes:

| Parte oficial | ¿Lo cubre el modelo actual? |
|---|---|
| I. Datos generales | ✅ Parcial |
| II. Localización de la vivienda y datos sociodemográficos | ✅ Sí |
| III. Visita de salud familiar | ❌ No (fechas y seguimiento de visitas) |
| IV. Características de los miembros de la familia | ✅ Sí |
| V. Instrumentos de evaluación familiar | ❌ No |
| VI. Riesgos por etapa de vida y como familia (incluye discapacidad) | ⚠️ Parcial: falta el detalle de limitaciones |
| VII. Características de la familia y la vivienda | ✅ Sí |
| VIII. Riesgos del entorno | ✅ Parcial (agua, vectores, combustible) |
| IX. Paquete de Atención Integral de la Familia (PAIFAM) | ❌ No |

Además, el resumen del INR indica:
- **Discapacidad:** 6 tipos de limitación (moverse, entender o aprender, ver, oír, hablar o comunicarse, relacionarse) y su origen.
- **Niños:** matriz de cumplimiento de vacunas y CRED, y signos de alarma por edad.
- **Mayores de 5 años:** enfermedades como hipertensión y diabetes.

---

## 8. Orden sugerido

1. Corregir las reglas de banderas (sección 6).
2. Definir el núcleo común y la lista cerrada de campos, usando las 9 partes de la ficha (7.3).
3. Obtener el anexo oficial de la Ficha Familiar y los anexos de las normas 238 y 246.
4. Primer perfil: enfermería (CRED y vacunas).
5. Almacenamiento local cifrado y exportación.
6. Segundo perfil (nutrición o psicología).
