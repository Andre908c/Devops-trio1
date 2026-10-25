# FitCoach Pro – Estructura del repositorio (Fase 2)

**Grupo 3:** Andrés Juan · Daniel · Juan Camilo  
**Stack:** Node.js + Express + Sequelize + MySQL · JWT · Docker · GitHub Actions · ELK  

Este archivo define la estructura del repo. Las carpetas de microservicios están **vacías** (solo `.gitkeep`) para subirlas a GitHub y que cada integrante rellene la suya.

---

## Árbol del repositorio

```text
fitcoach-pro/
│
├── frontend/                          ← Fase 1 (Netlify / Clarity) – YA TIENE CONTENIDO
│   ├── index.html
│   ├── login.html
│   ├── entrenamiento.html
│   ├── nutricion.html
│   ├── recompensas.html
│   ├── precios.html
│   ├── style.css
│   ├── auth.js
│   └── script.js
│
├── services/                          ← Fase 2 – MICROSERVICIOS (vacíos, por persona)
│   │
│   ├── api-usuarios/                  ← ANDRÉS JUAN
│   │   └── src/
│   │       ├── baseDatos/
│   │       ├── modelos/
│   │       ├── rutas/
│   │       ├── controladores/
│   │       └── servicios/
│   │
│   ├── api-entrenamientos/            ← DANIEL
│   │   └── src/
│   │       ├── baseDatos/
│   │       ├── modelos/
│   │       ├── rutas/
│   │       ├── controladores/
│   │       └── servicios/
│   │
│   ├── api-nutricion/                 ← JUAN CAMILO
│   │   └── src/
│   │       ├── baseDatos/
│   │       ├── modelos/
│   │       ├── rutas/
│   │       ├── controladores/
│   │       └── servicios/
│   │
│   └── api-recompensas/               ← JUAN CAMILO
│       └── src/
│           ├── baseDatos/
│           ├── modelos/
│           ├── rutas/
│           ├── controladores/
│           └── servicios/
│
├── database/
│   └── crear_base_datos.sql           ← Script SQL (ya existe)
│
├── docker/                            ← docker-compose.yml (por crear)
│
├── .github/
│   └── workflows/                     ← ci.yml GitHub Actions (por crear)
│
└── docs/
    ├── DOCUMENTO_PROYECTO_DEVOPS.md
    ├── FASE2_INSTALACION_VM.md
    └── ESTRUCTURA_REPO.md             ← este archivo
```

---

## Reparto de trabajo

| Persona       | Carpeta(s)                                      | Qué implementa                                      |
|---------------|--------------------------------------------------|-----------------------------------------------------|
| Andrés Juan   | `services/api-usuarios`                          | Login, JWT, roles, planes, admin/coaches            |
| Daniel        | `services/api-entrenamientos`                    | Videos, estados, feedback del coach                 |
| Juan Camilo   | `services/api-nutricion` + `api-recompensas`     | Menús, insignias, puntos, promociones               |

**Compartido:** `database/`, `docker/`, `.github/workflows/`

---

## Capas dentro de cada microservicio (estilo demo-colegio)

```text
Petición HTTP
    → rutas/           (URL y método)
    → controladores/   (recibe request, llama servicio, responde)
    → servicios/       (reglas de negocio + validación)
    → modelos/         (Sequelize / tablas)
    → baseDatos/       (conexión)
```

Cada persona, en su carpeta, irá creando:

- `package.json`
- `Dockerfile`
- `.env.example`
- `src/app.js`
- Archivos dentro de `rutas/`, `controladores/`, `servicios/`, `modelos/`, `baseDatos/`

---

## Roles de la aplicación

| Rol           | Permisos principales                                              |
|---------------|-------------------------------------------------------------------|
| Atleta        | Videos (según plan), nutrición, recompensas, cambiar plan         |
| Coach         | Revisar videos, dejar feedback                                    |
| Admin         | Atletas, coaches, promociones (no precios base)                   |
| Super Admin   | Todo lo del Admin + crear/eliminar Admins                         |

---

## Planes

| Plan    | Videos/mes  | Nutrición              | Recompensas        | Extra                |
|---------|-------------|------------------------|--------------------|----------------------|
| Básico  | 4           | No                     | Básico             | Soporte chat         |
| Pro     | Ilimitados  | Completa               | Premium            | 1 videollamada/mes   |
| Elite   | Ilimitados  | Completa + nutricionista | Premium + exclusivos | 4 videollamadas/mes |

Cambio de plan: sin cobro a mitad de mes; el nuevo plan inicia el día 1 del mes siguiente.

---

## Qué subir a GitHub ahora

1. Todo el contenido actual de este proyecto (frontend con archivos, `database/`, `docs/`, carpetas `services/*` vacías).
2. Cada integrante trabaja **solo en su carpeta** y hace push de sus cambios.
3. Cuando tengan usuario de Docker Hub y del repo, se completan `docker/docker-compose.yml` y `.github/workflows/ci.yml`.

---

## Orden sugerido después de crear el repo

1. Subir esta estructura al repositorio  
2. Cada uno implementa su microservicio  
3. Probar en local con MySQL  
4. Dockerizar y publicar en Docker Hub  
5. Configurar GitHub Actions  
6. Desplegar en la VM (Ubuntu)  
7. Presentación final (15 min)  

---

**Nota:** Las carpetas de `services/api-*` no incluyen código todavía. Solo la estructura lista para el repo.
