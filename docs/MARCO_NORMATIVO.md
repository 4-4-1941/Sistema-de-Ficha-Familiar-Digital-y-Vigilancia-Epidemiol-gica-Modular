# Marco normativo

## Sistema de Ficha Familiar Digital y Vigilancia Epidemiológica Modular

**Versión:** 1.0\
**Estado:** documento de referencia inicial; requiere contraste de
vigencia y aplicabilidad por módulo.\
**Ámbito:** herramienta digital de trabajo individual para profesionales
de salud.

## 1. Propósito

Este documento identifica las principales normas y referencias técnicas
que deben considerarse al diseñar y utilizar el Sistema de Ficha
Familiar Digital y Vigilancia Epidemiológica Modular. Busca orientar el
contenido de la ficha y el uso profesional de la información sin
convertir la aplicación en un sistema institucional centralizado.

## 2. Modelo de uso considerado

El diseño considerado para este documento es el siguiente:

-   Cada suscriptor utiliza la aplicación como herramienta individual de
    trabajo.
-   Los registros se almacenan localmente en el dispositivo del
    profesional.
-   No se presupone una base de datos central compartida ni acceso
    automático de otros suscriptores.
-   No se presupone sincronización remota de fichas.
-   La exportación de archivos, las copias de seguridad o cualquier
    futura función de intercambio deben evaluarse por separado, porque
    pueden sacar información del almacenamiento local.

Estas características describen el modelo previsto y deben contrastarse
con la implementación real del repositorio antes de presentarlas como
propiedades verificadas del software.

## 3. Normativa peruana principal

### 3.1 Decreto Supremo N.° 043-2001-PCM

**Objeto:** aprueba el Reglamento de Organización y Funciones del
Instituto Nacional de Estadística e Informática (INEI).

**Relación con el proyecto:** el prompt del proyecto establece
expresamente como principio el secreto estadístico, citando esta norma.
Debe conservarse esa exigencia como criterio de confidencialidad. Sin
embargo, antes de afirmar que el artículo 97 resulta jurídicamente
aplicable a todos los datos o a cada profesional suscriptor, corresponde
verificar su alcance según el sujeto obligado, la información tratada y
la finalidad concreta.

Fuente oficial:
https://www.gob.pe/institucion/pcm/normas-legales/2826391-043-2001-pcm

### 3.2 Ley N.° 29733, Ley de Protección de Datos Personales

**Objeto:** protege el derecho fundamental a la protección de los datos
personales.

**Relación con el proyecto:** es una referencia central para evaluar el
tratamiento de datos identificables de personas y familias, incluidos
los datos relativos a la salud y la información de ubicación cuando
permita identificar a alguien. El almacenamiento local no debe
interpretarse, por sí solo, como una exclusión automática de la
normativa. La aplicabilidad y las obligaciones concretas dependen del
tratamiento realizado y de las circunstancias del responsable.

Referencia oficial de la normativa de protección de datos:
https://www.gob.pe/institucion/anpd/campa%C3%B1as/128319-nuevo-reglamento-de-proteccion-de-datos-personales

### 3.3 Decreto Supremo N.° 016-2024-JUS

**Objeto:** aprueba el Reglamento de la Ley N.° 29733. La Autoridad
Nacional de Protección de Datos Personales informa que entró en vigor el
31 de marzo de 2025.

**Relación con el proyecto:** debe considerarse junto con la Ley N.°
29733 para revisar los datos registrados, la finalidad de su uso, las
medidas de seguridad adecuadas y cualquier exportación, copia o
transmisión que se incorpore.

Fuente oficial:
https://www.gob.pe/institucion/anpd/campa%C3%B1as/128319-nuevo-reglamento-de-proteccion-de-datos-personales

## 4. Referencia sanitaria para el enfoque familiar

### Resolución Ministerial N.° 464-2011-MINSA

**Documento aprobado:** *Modelo de Atención Integral de Salud Basado en
Familia y Comunidad (MAIS-BFC)*.

**Relación con el proyecto:** constituye una referencia técnica para
revisar la organización de la atención con enfoque familiar y
comunitario, el contexto territorial y la articulación de
intervenciones. Debe utilizarse como referencia sanitaria y no como
prueba automática de que todos los campos de la aplicación coinciden con
un formato oficial vigente.

**Criterio de implementación:** antes de reproducir formularios,
categorías, escalas o procedimientos, contrastarlos con el documento
oficial y comprobar si existen normas posteriores, modificaciones o
instrumentos específicos aplicables.

Fuente oficial MINSA:
https://www.gob.pe/institucion/minsa/normas-legales/243559-464-2011-

## 5. Principios de aplicación en el software

A partir de las normas y referencias anteriores, se proponen los
siguientes criterios funcionales, sujetos a revisión según el uso real:

1.  **Uso profesional definido:** registrar información para una
    finalidad de trabajo legítima y explícita.
2.  **Datos pertinentes:** evitar campos que no aporten a la finalidad
    prevista de la ficha.
3.  **Confidencialidad:** impedir que una persona distinta del usuario
    autorizado acceda a los registros locales sin autorización.
4.  **Protección del dispositivo:** considerar bloqueo del dispositivo,
    control de acceso a la aplicación y riesgos de pérdida, robo o uso
    compartido.
5.  **Exportaciones conscientes:** advertir que CSV, GeoJSON, KML,
    impresiones y copias de seguridad pueden contener datos personales o
    coordenadas identificables.
6.  **Geolocalización justificada:** registrar coordenadas únicamente
    cuando sean útiles para la finalidad prevista y el profesional haya
    autorizado su captura.
7.  **Separación de finalidades:** diferenciar los datos utilizados para
    la atención individual de los datos destinados a análisis
    estadístico, informes o publicación.
8.  **Anonimización prudente:** cuando se compartan resultados
    estadísticos, valorar la agregación y la eliminación de
    identificadores directos e indirectos; quitar el nombre no garantiza
    por sí solo que una familia no pueda ser identificada.
9.  **Sin afirmaciones no verificadas:** no presentar la aplicación como
    certificada, plenamente conforme o validada por el MINSA sin
    evidencia documental.

## 6. Alcance del secreto estadístico

El secreto estadístico citado en el requerimiento original se mantiene
como principio de confidencialidad del proyecto. Su aplicación jurídica
concreta debe verificarse antes de atribuirle un alcance general sobre
cualquier profesional, ficha o tratamiento de datos.

Este principio no sustituye el análisis de la Ley N.° 29733 y su
Reglamento, ni las normas sanitarias específicas que correspondan.
Tampoco implica que la aplicación pueda declarar confidencialidad
absoluta o impedir usos legítimos exigidos por una obligación legal
aplicable.

## 7. Pendientes de validación

Antes de considerar cerrado el marco normativo, corresponde:

-   Confirmar el texto y alcance del artículo 97 del DS N.° 043-2001-PCM
    en la fuente oficial.
-   Determinar, según el modelo real de suscripción y uso, quién decide
    las finalidades del tratamiento de datos y qué obligaciones resultan
    aplicables.
-   Revisar el texto completo del MAIS-BFC y verificar si existen
    documentos posteriores que deban incorporarse.
-   Identificar las normas técnicas del MINSA que correspondan a los
    formularios, indicadores de vulnerabilidad y procedimientos
    realmente implementados.
-   Contrastar el contenido de este documento con la estructura y el
    funcionamiento reales del repositorio.

## 8. Fuentes oficiales consultadas

1.  Presidencia del Consejo de Ministros. **Decreto Supremo N.°
    043-2001-PCM**.\
    https://www.gob.pe/institucion/pcm/normas-legales/2826391-043-2001-pcm
2.  Autoridad Nacional de Protección de Datos Personales. **Nuevo
    Reglamento de Protección de Datos Personales**; informa la entrada
    en vigor del DS N.° 016-2024-JUS el 31 de marzo de 2025.\
    https://www.gob.pe/institucion/anpd/campa%C3%B1as/128319-nuevo-reglamento-de-proteccion-de-datos-personales
3.  Ministerio de Salud. **Resolución Ministerial N.° 464-2011-MINSA**,
    que aprueba el MAIS-BFC.\
    https://www.gob.pe/institucion/minsa/normas-legales/243559-464-2011-

------------------------------------------------------------------------

**Nota de estado:** este archivo es una base normativa inicial, no un
dictamen legal ni una certificación de cumplimiento. Las normas y su
aplicabilidad deben validarse frente a la versión real del sistema y sus
funciones.
