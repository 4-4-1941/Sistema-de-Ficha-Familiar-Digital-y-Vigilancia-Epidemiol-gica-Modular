-- ============================================================================
-- FICHA FAMILIAR DIGITAL Y VIGILANCIA EPIDEMIOLÓGICA MODULAR
-- Tablas independientes con prefijo 'ff_'
-- 
-- Protección de datos de salud:
-- ON DELETE RESTRICT: Impide borrar accidentalmente un hogar si contiene personas.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA: ff_hogares (Vivienda y determinantes de la salud)
CREATE TABLE IF NOT EXISTS public.ff_hogares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Ubicación y Sectorización (MINSA / INEI)
    ubigeo VARCHAR(6),
    departamento VARCHAR(100),
    provincia VARCHAR(100),
    distrito VARCHAR(100),
    centro_poblado VARCHAR(150),
    conglomerado_manzana VARCHAR(100),
    direccion TEXT,
    telefono VARCHAR(30),

    -- Georreferenciación en campo
    latitud NUMERIC(10, 7),
    longitud NUMERIC(10, 7),
    altitud NUMERIC(8, 2),
    precision_gps_metros NUMERIC(6, 2),

    -- Determinantes sociales: Saneamiento y Vivienda
    nro_habitaciones_dormir INTEGER NOT NULL DEFAULT 1 CHECK (nro_habitaciones_dormir > 0),
    personas_por_habitacion NUMERIC(5, 2) DEFAULT 0.0,
    fuente_agua VARCHAR(50),
    agua_tratada BOOLEAN NOT NULL DEFAULT false,
    servicio_higienico VARCHAR(50),
    combustible_cocina VARCHAR(50),
    disposicion_basura VARCHAR(50),

    -- Indicadores psicosociales y estructurales
    es_monoparental BOOLEAN NOT NULL DEFAULT false,
    tiene_desercion_escolar BOOLEAN NOT NULL DEFAULT false,
    riesgo_salud_mental BOOLEAN NOT NULL DEFAULT false,
    presencia_vectores_criaduras BOOLEAN NOT NULL DEFAULT false,

    -- Banderas de vulnerabilidad agregadas calculadas
    banderas TEXT[] NOT NULL DEFAULT '{}',

    -- Auditoría
    creado_por VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABLA: ff_personas (Miembros del hogar, curso de vida y salud)
CREATE TABLE IF NOT EXISTS public.ff_personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hogar_id UUID NOT NULL REFERENCES public.ff_hogares(id) ON DELETE RESTRICT,

    -- Identificación personal
    tipo_documento VARCHAR(20) NOT NULL DEFAULT 'DNI',
    nro_documento VARCHAR(20),
    nombres_apellidos TEXT NOT NULL,
    sexo SMALLINT NOT NULL CHECK (sexo IN (1, 2)),

    -- Edad exacta y curso de vida (Norma MINSA)
    fecha_nacimiento DATE,
    edad_anios INTEGER NOT NULL DEFAULT 0 CHECK (edad_anios >= 0),
    edad_meses INTEGER NOT NULL DEFAULT 0 CHECK (edad_meses >= 0),

    -- Dinámica familiar y residencia
    parentesco SMALLINT,
    estado_civil SMALLINT,
    residente_habitual SMALLINT NOT NULL DEFAULT 1 CHECK (residente_habitual IN (0, 1)),

    -- Educación y economía
    nivel_instruccion SMALLINT,
    asiste_escuela BOOLEAN,
    aporta_ingresos SMALLINT CHECK (aporta_ingresos IN (0, 1)),
    ocupacion VARCHAR(150),

    -- Estado de salud y prioridades sanitarias
    seguro_salud VARCHAR(50) DEFAULT 'SIS',
    es_gestante BOOLEAN NOT NULL DEFAULT false,
    semanas_gestacion SMALLINT CHECK (semanas_gestacion BETWEEN 0 AND 42),
    fecha_probable_parto DATE,

    tiene_enfermedad_cronica BOOLEAN NOT NULL DEFAULT false,
    diagnosticos_cronicos TEXT[] NOT NULL DEFAULT '{}',
    discapacidad BOOLEAN NOT NULL DEFAULT false,
    tipo_discapacidad VARCHAR(100),

    -- Banderas individuales de la persona
    banderas TEXT[] NOT NULL DEFAULT '{}',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABLA: ff_intervenciones (Acciones por perfil profesional)
CREATE TABLE IF NOT EXISTS public.ff_intervenciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hogar_id UUID NOT NULL REFERENCES public.ff_hogares(id) ON DELETE RESTRICT,
    persona_id UUID REFERENCES public.ff_personas(id) ON DELETE SET NULL,

    perfil_profesional VARCHAR(50) NOT NULL,
    profesional_id VARCHAR(100) NOT NULL,
    profesional_nombre VARCHAR(150),
    fecha_intervencion TIMESTAMPTZ NOT NULL DEFAULT now(),

    tipo_accion VARCHAR(100) NOT NULL,
    observaciones TEXT,
    resultado VARCHAR(50) CHECK (resultado IN ('COMPLETADO', 'PENDIENTE', 'REFERIDO')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ÍNDICES (Para búsqueda ágil en campo)
CREATE INDEX IF NOT EXISTS idx_ff_hogares_ubigeo ON public.ff_hogares(ubigeo);
CREATE INDEX IF NOT EXISTS idx_ff_personas_hogar_id ON public.ff_personas(hogar_id);
CREATE INDEX IF NOT EXISTS idx_ff_personas_doc ON public.ff_personas(nro_documento);
CREATE INDEX IF NOT EXISTS idx_ff_intervenciones_hogar ON public.ff_intervenciones(hogar_id);
CREATE INDEX IF NOT EXISTS idx_ff_intervenciones_persona ON public.ff_intervenciones(persona_id);
