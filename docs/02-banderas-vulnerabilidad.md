# 02 - Banderas de Vulnerabilidad

## Principio

Las banderas se calculan automáticamente al guardar o actualizar una Ficha Familiar.  
Un hogar o una persona puede tener varias banderas activas al mismo tiempo.

Las banderas se almacenan como una lista de códigos para permitir fácil escalamiento futuro.

## Lista de Banderas - Versión 1.0

| Código                      | Descripción                                              | Nivel     |
|-----------------------------|----------------------------------------------------------|-----------|
| BANDERA_LACTANTE            | Existe al menos un niño/a menor de 1 año                 | Persona / Hogar |
| BANDERA_NINO_1_A_4          | Existe al menos un niño/a de 1 a 4 años                  | Persona / Hogar |
| BANDERA_NINO_5_A_11         | Existe al menos un niño/a de 5 a 11 años                 | Persona / Hogar |
| BANDERA_ADOLESCENTE         | Existe al menos una persona de 12 a 17 años              | Persona / Hogar |
| BANDERA_GESTANTE            | Existe al menos una mujer gestante                       | Persona / Hogar |
| BANDERA_ADULTO_MAYOR        | Existe al menos una persona de 60 años o más             | Persona / Hogar |
| BANDERA_CRONICO             | Existe persona con enfermedad crónica diagnosticada      | Persona / Hogar |
| BANDERA_SALUD_MENTAL        | Indicadores de riesgo en salud mental o violencia        | Persona / Hogar |
| BANDERA_HACINAMIENTO        | Más de 3 personas por habitación para dormir             | Hogar     |
| BANDERA_AGUA_NO_SEGURA      | Fuente de agua no segura                                 | Hogar     |
| BANDERA_SIN_SANEAMIENTO     | Sin servicio higiénico adecuado                          | Hogar     |
| BANDERA_DESERCION_ESCOLAR   | Niño/a en edad escolar que no estudia por problemas económicos | Persona / Hogar |
| BANDERA_MONOPARENTAL        | Familia monoparental                                     | Hogar     |

## Formato de almacenamiento

```json
"banderas": [
  "BANDERA_LACTANTE",
  "BANDERA_ADULTO_MAYOR",
  "BANDERA_HACINAMIENTO"
]
