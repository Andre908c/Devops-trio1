# api-usuarios

**Responsable:** Andrés Juan  
**Puerto:** 3001  

## Qué implementa
- Registro e inicio de sesión (JWT)
- Roles: super_admin, admin, coach, atleta
- Planes: basico, pro, elite y cambio de plan
- Admin: gestión de coaches y atletas
- Super Admin: gestión de admins

## Estructura
```
src/
  app.js
  baseDatos/     → conexión Sequelize
  modelos/       → Usuario, etc.
  rutas/
  controladores/
  servicios/
```

## Cómo arrancar
```bash
cp .env.example .env
npm install
npm run dev
```

Probar: `GET http://localhost:3001/api/health`
