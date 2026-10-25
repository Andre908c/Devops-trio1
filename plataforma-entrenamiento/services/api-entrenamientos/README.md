# api-entrenamientos

**Responsable:** Daniel  
**Puerto:** 3002  

## Qué implementa
- Registro de videos del atleta
- Estados: pendiente → en_revision → revisado
- Feedback del coach
- Límite de 4 videos/mes para plan Básico
- Listados para atleta y para coach

## Tablas que usa (BD compartida fitcoach_pro)
- `videos`
- `feedbacks`
- `usuarios` (solo lectura: rol y plan)

## Estructura
```
src/
  app.js
  baseDatos/
  modelos/       → Video, Feedback
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

Probar: `GET http://localhost:3002/api/health`
