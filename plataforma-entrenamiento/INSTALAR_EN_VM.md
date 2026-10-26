# FitCoach Pro – Despliegue Automatizado en Ubuntu Server (IP 192.168.1.21)

Esta carpeta `plataforma-entrenamiento` incluye todos los microservicios, frontend y scripts para despliegue automatizado con PM2 y Apache:

```
plataforma-entrenamiento/
├── frontend/             → Páginas web estáticas (HTML, CSS, JS)
├── services/
│   ├── api-usuarios/     → Puerto 3001
│   ├── api-entrenamientos/→ Puerto 3002
│   ├── api-nutricion/    → Puerto 3003
│   └── api-recompensas/  → Puerto 3004
├── database/
│   └── crear_base_datos.sql
├── ecosystem.config.js   → Configuración PM2 para gestionar los 4 microservicios
├── deploy.sh             → Script de instalación masiva y arranque con PM2
├── fitcoach.conf         → Configuración Apache VirtualHost (Proxy Inverso)
├── docker/
│   └── docker-compose.yml
└── docs/
```

---

## Pasos para Despliegue en la VM Ubuntu Server

### 1. Copiar los archivos a la VM (desde la máquina local)

```bash
rsync -avz --progress ./plataforma-entrenamiento/ usuario@192.168.1.21:~/fitcoach-pro/
```

### 2. Importar la Base de Datos MySQL

```bash
cd ~/fitcoach-pro
sudo mysql -u root -p < database/crear_base_datos.sql
```

### 3. Ejecutar el despliegue automático con un solo comando

```bash
cd ~/fitcoach-pro
./deploy.sh
```

El script `./deploy.sh` realiza automáticamente:
- `npm install` masivo en cada uno de los 4 microservicios.
- Ejecuta `pm2 start ecosystem.config.js` levantando los servicios en los puertos 3001, 3002, 3003 y 3004.

### 4. Configurar Apache como Proxy Inverso

```bash
# Copiar configuración del VirtualHost
sudo cp fitcoach.conf /etc/apache2/sites-available/fitcoach.conf

# Habilitar módulos de Proxy Inverso y Reescritura
sudo a2enmod proxy proxy_http rewrite

# Activar el sitio
sudo a2ensite fitcoach.conf

# Reiniciar Apache
sudo apache2ctl configtest
sudo systemctl reload apache2
```

¡Listo! Todo responderá en el navegador bajo la IP local `http://192.168.1.21`.
