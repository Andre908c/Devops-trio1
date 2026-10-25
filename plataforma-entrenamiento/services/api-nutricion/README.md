# api-nutricion

**Responsable:** Juan Camilo  
**Puerto:** 3003  

## Qué implementa
- Planes alimenticios / menús según objetivo del atleta
- Disponible según plan (Pro y Elite; Básico sin nutrición completa)

## Estructura
```
src/
  app.js
  baseDatos/
  modelos/
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

Probar: `GET http://localhost:3003/api/health`
