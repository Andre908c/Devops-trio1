-- ============================================================
-- FitCoach Pro – Script de creación de base de datos
-- Ejecutar: mysql -u root -p < database/crear_base_datos.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS fitcoach_pro
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fitcoach_pro;

-- ------------------------------------------------------------
-- Tabla de usuarios (Atleta, Coach, Admin, Super Admin)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(120)        NOT NULL,
  email           VARCHAR(180)        NOT NULL UNIQUE,
  password_hash   VARCHAR(255)        NOT NULL,
  rol             ENUM('super_admin','admin','coach','atleta') NOT NULL DEFAULT 'atleta',
  plan            ENUM('basico','pro','elite') NULL DEFAULT 'basico',  -- solo atletas
  plan_pendiente  ENUM('basico','pro','elite') NULL,                 -- cambio programado
  plan_cambia_en  DATE NULL,                                         -- inicio del nuevo plan
  activo          TINYINT(1)          NOT NULL DEFAULT 1,
  creado_en       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_usuarios_rol (rol),
  INDEX idx_usuarios_email (email),
  INDEX idx_usuarios_activo (activo)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Videos subidos por atletas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS videos (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  atleta_id       INT UNSIGNED        NOT NULL,
  titulo          VARCHAR(200)        NOT NULL,
  descripcion     TEXT NULL,
  url_archivo     VARCHAR(500)        NOT NULL,
  estado          ENUM('pendiente','en_revision','revisado') NOT NULL DEFAULT 'pendiente',
  coach_id        INT UNSIGNED NULL,          -- quién lo está revisando / revisó
  creado_en       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_videos_atleta FOREIGN KEY (atleta_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_videos_coach  FOREIGN KEY (coach_id)  REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_videos_estado (estado),
  INDEX idx_videos_atleta (atleta_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Feedback del coach sobre un video
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedbacks (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  video_id        INT UNSIGNED        NOT NULL,
  coach_id        INT UNSIGNED        NOT NULL,
  comentario      TEXT                NOT NULL,
  creado_en       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_feedbacks_video FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  CONSTRAINT fk_feedbacks_coach FOREIGN KEY (coach_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_feedbacks_video (video_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Promociones (solo Admin / Super Admin)
-- No modifican precios base, solo descuentos temporales
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promociones (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(150)        NOT NULL,
  plan_aplica     ENUM('basico','pro','elite','todos') NOT NULL DEFAULT 'todos',
  tipo_descuento  ENUM('porcentaje','monto') NOT NULL DEFAULT 'porcentaje',
  valor           DECIMAL(10,2)       NOT NULL,
  fecha_inicio    DATE                NOT NULL,
  fecha_fin       DATE                NOT NULL,
  usos_maximos    INT UNSIGNED NULL,
  usos_actuales   INT UNSIGNED        NOT NULL DEFAULT 0,
  activa          TINYINT(1)          NOT NULL DEFAULT 1,
  creado_por      INT UNSIGNED NULL,
  creado_en       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_promociones_admin FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_promociones_fechas (fecha_inicio, fecha_fin)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Recompensas / insignias del atleta
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recompensas (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  atleta_id       INT UNSIGNED        NOT NULL,
  tipo            VARCHAR(80)         NOT NULL,   -- ej: racha_7_dias, primer_video, nivel_5
  titulo          VARCHAR(120)        NOT NULL,
  puntos          INT                 NOT NULL DEFAULT 0,
  desbloqueada_en DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_recompensas_atleta FOREIGN KEY (atleta_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_recompensas_atleta (atleta_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Logs separados por contexto (auditoría)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS logs (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo            ENUM('atleta','coach','admin','super_admin','sistema') NOT NULL,
  usuario_id      INT UNSIGNED NULL,
  accion          VARCHAR(120)        NOT NULL,
  detalle         TEXT NULL,
  ip              VARCHAR(45) NULL,
  creado_en       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_logs_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_logs_tipo (tipo),
  INDEX idx_logs_fecha (creado_en)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Notificaciones simples
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notificaciones (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT UNSIGNED        NOT NULL,
  titulo          VARCHAR(200)        NOT NULL,
  mensaje         TEXT                NOT NULL,
  leida           TINYINT(1)          NOT NULL DEFAULT 0,
  creado_en       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_notif_usuario (usuario_id, leida)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Mensaje final
-- ------------------------------------------------------------
SELECT 'Base de datos fitcoach_pro creada correctamente.' AS mensaje;

-- Planes nutricionales (api-nutricion)
CREATE TABLE IF NOT EXISTS planes_nutricionales (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  atleta_id       INT UNSIGNED        NOT NULL,
  objetivo        VARCHAR(80)         NOT NULL DEFAULT 'mantenimiento',
  kcal_dia        INT UNSIGNED NULL,
  proteinas_g     INT UNSIGNED NULL,
  carbohidratos_g INT UNSIGNED NULL,
  grasas_g        INT UNSIGNED NULL,
  menu_json       JSON NULL,
  notas           TEXT NULL,
  creado_en       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_plan_nutri_atleta FOREIGN KEY (atleta_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_plan_nutri_atleta (atleta_id)
) ENGINE=InnoDB;
