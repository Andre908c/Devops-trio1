# FitCoach Pro – Todo en una carpeta para la VM

Esta carpeta `plataforma-entrenamiento` ya incluye **todo** junto:

```
plataforma-entrenamiento/
├── frontend/          → páginas web (Netlify / Nginx)
├── services/
│   ├── api-usuarios/          (Andrés)    puerto 3001
│   ├── api-entrenamientos/    (Daniel)    puerto 3002
│   ├── api-nutricion/         (Juan Camilo) 3003
│   └── api-recompensas/       (Juan Camilo) 3004
├── database/
│   └── crear_base_datos.sql
├── docker/
│   └── docker-compose.yml
└── docs/
```

## En la VM (resumen)

```bash
# 1. Copiar esta carpeta a la VM (desde tu PC):
rsync -avz --progress ./plataforma-entrenamiento/ usuario@IP_VM:~/fitcoach-pro/

# 2. En la VM:
cd ~/fitcoach-pro
sudo mysql -u root -p < database/crear_base_datos.sql

# 3. Cada API:
cd ~/fitcoach-pro/services/api-usuarios
cp .env.example .env   # editar password MySQL y JWT_SECRET
npm install
npm run dev
```

Mismo `JWT_SECRET` en las 4 APIs.
