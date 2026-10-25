# FitCoach Pro

Plataforma de entrenamiento personalizado con coach, nutrición y recompensas.

## Estructura del proyecto

```
plataforma-entrenamiento/
├── frontend/              ← SUBIR ESTO A NETLIFY (Fase 1)
│   ├── index.html
│   ├── login.html
│   ├── entrenamiento.html
│   ├── nutricion.html
│   ├── recompensas.html
│   ├── precios.html
│   ├── style.css
│   ├── auth.js            ← control de sesión
│   └── script.js
│
├── database/              ← Fase 2 (VM)
├── backend/               ← Fase 2 (VM)
└── docs/
```

## Fase 1 – Netlify (ahora)

1. Entra a Netlify
2. Sube **todo el contenido** de la carpeta `frontend` (HTML, style.css, auth.js y script.js al mismo nivel, sin subcarpetas)
3. Listo. Clarity sigue midiendo.

### Cómo probar el login

1. Abre `/login.html`
2. Crea una cuenta (pestaña “Crear cuenta”)
3. Te redirige a Entrenamiento
4. Las páginas privadas quedan protegidas
5. “Cerrar sesión” vuelve al estado de visitante

## Fase 2 – Máquina virtual (después)

- Backend Node.js + Express + Sequelize + MySQL
- Roles: Super Admin, Admin, Coach, Atleta
- JWT, límites por plan, panel del coach, promociones
- Ver `docs/FASE2_INSTALACION_VM.md` y `database/crear_base_datos.sql`

## Tracking incluido

- Google Analytics: `G-096CNY7RHV`
- Microsoft Clarity: `yxu6wvsm9n`
- Google Site Verification: presente en todas las páginas
