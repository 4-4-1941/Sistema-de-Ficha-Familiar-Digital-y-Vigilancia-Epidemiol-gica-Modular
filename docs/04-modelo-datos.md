# 04 - Modelo de Datos

## Entidades principales

### 1. Hogar

Representa la vivienda / unidad familiar.

| Campo                    | Tipo          | Descripción                                      |
|--------------------------|---------------|--------------------------------------------------|
| id                       | UUID / string | Identificador único del hogar                    |
| fecha_registro           | datetime      | Fecha y hora de creación                         |
| latitud                  | float         | Coordenada GPS                                   |
| longitud                 | float         | Coordenada GPS                                   |
| altitud                  | float         | Altitud (opcional)                               |
| precision_gps_metros     | float         | Precisión del GPS en metros                      |
| departamento             | string        |                                                  |
| provincia                | string        |                                                  |
| distrito                 | string        |                                                  |
| centro_poblado           | string        |                                                  |
| conglomerado_manzana     | string        |                                                  |
| direccion                | string        |                                                  |
| telefono                 | string        |                                                  |
| banderas                 | list[string]  | Lista de códigos de banderas activas del hogar   |
| creado_por               | string        | ID o nombre del profesional que registró         |
| actualizado_en           | datetime      | Última actualización                             |

### 2. Persona

Cada miembro del hogar.

| Campo                    | Tipo          | Descripción                                      |
|--------------------------|---------------|--------------------------------------------------|
| id                       | UUID / string | Identificador único de la persona                |
| hogar_id                 | string        | Relación con el hogar                            |
| nombres_apellidos        | string        |                                                  |
| edad                     | integer       | Años cumplidos (0 si es menor de 1 año)          |
| fecha_nacimiento_dia     | integer       | Día de nacimiento (1-31)                         |
| fecha_nacimiento_mes     | integer       | Mes de nacimiento (1-12)                         |
| sexo                     | integer       | 1 = Masculino, 2 = Femenino                      |
| parentesco               | integer       | Código de parentesco (1 al 10)                    |
| estado_civil             | integer       | Solo mujeres ≥ 12 años                           |
| nivel_instruccion        | integer       | Código 0 al 10                                   |
| aporta_ingresos          | integer       | 1 = Sí, 0 = No                                   |
| residente_habitual       | integer       | 1 = Sí, 0 = No                                   |
| banderas                 | list[string]  | Banderas específicas de esta persona             |
| es_gestante              | boolean       |                                                  |
| tiene_enfermedad_cronica | boolean       |                                                  |

### 3. Intervencion

Registro de una acción realizada por un profesional.

| Campo                    | Tipo          | Descripción                                      |
|--------------------------|---------------|--------------------------------------------------|
| id                       | UUID / string |                                                  |
| hogar_id                 | string        |                                                  |
| persona_id               | string        | (opcional, si la intervención es a una persona)  |
| perfil_profesional       | string        | ENFERMERIA, MEDICO, PSICOLOGIA, etc.             |
| profesional_id           | string        | Quién realizó la intervención                    |
| fecha_intervencion       | datetime      |                                                  |
| tipo_accion              | string        | Código o descripción de la acción                |
| observaciones            | text          |                                                  |
| resultado                | string        |                                                  |

## Relaciones

- Un **Hogar** tiene muchas **Personas**
- Un **Hogar** puede tener muchas **Intervenciones**
- Una **Persona** puede tener muchas **Intervenciones**
