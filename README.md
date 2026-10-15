# Sistema de Ficha Familiar Digital y Vigilancia Epidemiológica Modular

Este repositorio contiene el código fuente para el despliegue de la aplicación móvil y web de **Ficha Familiar Digital**. El sistema está diseñado para investigadores de campo y profesionales de la salud, unificando la apertura de fichas censales, la georreferenciación automatizada de viviendas, algoritmos de selección aleatoria (Kish y Cumpleaños) y la inyección dinámica de cuestionarios según el eje epidemiológico seleccionado.

## 🚀 Características Principales

*   **Apertura de Ficha Familiar:** Registro interactivo de la composición del hogar con flujos dinámicos de integrantes.
*   **Georreferenciación en Segundo Plano:** Captura invisible de coordenadas GPS (`Latitud`, `Longitud`, `Altitud` y `Precisión`) al iniciar el guardado del formulario.
*   **Motores de Selección Aleatoria (Ciegos):** 
    *   *Algoritmo Tabla de Kish Automatizado:* Asignación interna de columna mediante `ID MOD 18` y ordenamiento demográfico epidemiológico (Hombres de mayor a menor, Mujeres de mayor a menor) sin intervención del encuestador.
    *   *Capa por Fecha de Cumpleaños:* Algoritmo de contingencia basado en proximidad temporal de efemérides (Próximo/Último cumpleaños) con sub-rutina de desempate irreversible.
*   **Inyección Dinámica de Plantillas Temáticas:** Configuración del entorno de campo mediante 6 Ejes Maestros seleccionables:
    1. Arbovirosis y Metaxénicas (Dengue, Zika, Malaria)
    2. Enfermedades Respiratorias y Pandemias (SARS-CoV, TBC)
    3. Salud Ambiental y Antropogénica (Metales pesados, Contaminación de agua)
    4. Enfermedades Inmunoprevenibles (Brechas de vacunación)
    5. Salud Mental, Estresores y Violencia (Depresión, Ansiedad, VIF)
    6. Enfermedades Crónicas y Metabólicas (HTA, Diabetes, ECNT)
*   **Vectores Lógicos de Vulnerabilidad:** Clasificación automática del perfil del hogar (`Bandera_Lactantes`, `Bandera_Adulto_Mayor`, etc.) calculada al cierre de la entrevista.
*   **Exportación Geo-Estadística:** Salida unificada compatible con sistemas SIG (QGIS, ArcGIS, Google Earth) en formatos **GeoJSON, CSV plano o KML**.

## 🛠️ Estructura del Repositorio

```text
├── .github/               # Flujos de integración y despliegue continuo (CI/CD)
├── src/
│   ├── components/        # Componentes interactivos de la interfaz de usuario
│   ├── core/
│   │   ├── kish_matrix.py # Implementación del arreglo bidimensional de Kish
│   │   ├── birthday_calc.py# Lógica temporal de proximidad de efemérides
│   │   └── geo_tracker.py  # Módulo de captura y validación de metadatos GPS
│   └── templates/         # Formularios dinámicos inyectables (Las 6 Capas)
├── data/
│   └── schemas/           # Esquemas de validación y salida de datos (JSON/GeoJSON)
├── README.md              # Documentación general del sistema
└── Ficha_Familiar_Universal_Epidemiologica.md # Prompt matriz de requerimientos de IA
```

## 📋 Instrucciones para el Programador de IA / Desarrollador

1.  **Requerimientos del Sistema:** Toda lógica de selección individual descrita en `Ficha_Familiar_Universal_Epidemiologica.md` debe ejecutarse estrictamente *en segundo plano*. La interfaz gráfica debe permanecer limpia y ciega ante los cálculos matriciales para evitar sesgos de selección en el campo.
2.  **Validación Geográfica:** Bloquear el cierre de la Ficha Familiar si el dispositivo reporta una `precision_gps_metros` mayor a 5 metros (configurable según la cobertura geográfica de la zona).
3.  **Restricciones de Integridad:** Configurar el enrutamiento lógico (*skip logic*) de manera que el envío de datos finales sea rechazado si el ID del informante entrevistado no coincide con el hash del miembro seleccionado por el Motor activo (Kish o Cumpleaños).

## 📄 Licencia

Este proyecto está protegido bajo el Secreto Estadístico amparado por el **Decreto Supremo N° 043-2001-PCM** y normativas internacionales de protección de datos en investigaciones de salud pública.
