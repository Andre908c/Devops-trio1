# api-usuarios

**Responsable:** Andrés Juan  
**Puerto:** 3001  

## Ya implementado

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/health` | No | Estado del servicio |
| POST | `/api/auth/registro` | No | Registrar atleta `{ nombre, email, password }` |
| POST | `/api/auth/login` | No | Login `{ email, password }` → devuelve JWT |
| GET | `/api/auth/me` | Bearer JWT | Perfil del usuario logueado |

## Cómo probar en local (con MySQL)

```bash
cd services/api-usuarios
cp .env.example .env
# Editar .env con tu MySQL y JWT_SECRET
npm install
npm run dev
```

```bash
# Registro
curl -X POST http://localhost:3001/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Prueba","email":"prueba@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"prueba@test.com","password":"123456"}'

# Me (usar el token que devolvió login)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer PEGA_AQUI_EL_TOKEN"
```

## Pendiente (siguientes commits)

- [ ] Cambio de plan (programar para el día 1 del mes siguiente)
- [ ] Admin: listar/crear/desactivar coaches y atletas
- [ ] Super Admin: gestionar admins
- [ ] Script crear_super_admin.js
- [ ] Logs de acciones

## Estructura

```
src/
  app.js
  middleware/authMiddleware.js
  baseDatos/index.js
  modelos/usuario.js
  rutas/authRutas.js
  controladores/authControlador.js
  servicios/authServicio.js
```
