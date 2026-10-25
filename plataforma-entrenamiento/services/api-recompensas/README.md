# api-recompensas

**Responsable:** Juan Camilo  
**Puerto:** 3004  

## Qué implementa
- Insignias y puntos del atleta
- Canje de recompensas
- Promociones (solo Admin crea/edita; no modifica precios base)

## Tablas que usa (BD compartida)
- `recompensas`
- `promociones`
- `usuarios` (lectura)

## Cómo arrancar
```bash
cp .env.example .env
npm install
npm run dev
```

Probar: `GET http://localhost:3004/api/health`
