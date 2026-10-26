# FASE 2 – Instalación en Máquina Virtual (Ubuntu Server)

**Proyecto:** FitCoach Pro  
**Stack:** Node.js + Express + Sequelize + MySQL  
**Auth:** JWT  
**Roles:** Super Admin → Admin → Coach → Atleta

---

## Orden de pasos (resumen)

1. Actualizar el sistema e instalar OpenSSH + herramientas base
2. Instalar Node.js, MySQL y Nginx
3. Subir el proyecto (por SCP/SFTP o Git)
4. Crear la base de datos (archivo SQL)
5. Configurar variables de entorno (`.env`)
6. Crear el Super Admin inicial
7. Instalar dependencias del backend (`npm install`)
8. Levantar la aplicación
9. Configurar Nginx como proxy
10. Exponer a internet (firewall + dominio/IP)
11. Verificar que todo funciona
12. (Opcional) Docker + GitHub Actions + ELK

---

## 1. Actualizar el sistema e instalar OpenSSH + herramientas base

**OpenSSH debe ir primero.** Sirve para:
- Conectarte a la VM de forma segura
- Copiar archivos rápido con `scp` o `rsync`
- Hacer túneles SSH si los necesitas

```bash
sudo apt update && sudo apt upgrade -y

# OpenSSH Server (si no está instalado)
sudo apt install -y openssh-server

# Asegurar que el servicio esté activo
sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl status ssh

# Herramientas base
sudo apt install -y curl git build-essential ufw rsync
```

### Cómo copiar el proyecto desde tu PC a la VM

Desde **tu máquina local** (no dentro de la VM):

```bash
# Ejemplo con scp (copia toda la carpeta)
scp -r ./plataforma-entrenamiento usuario@IP_DE_LA_VM:/var/www/fitcoach-pro

# Ejemplo con rsync (más eficiente, solo envía cambios)
rsync -avz --progress ./plataforma-entrenamiento/ usuario@IP_DE_LA_VM:/var/www/fitcoach-pro/
```

### Túnel SSH (opcional)

Si necesitas acceder a un puerto interno de la VM desde tu PC:

```bash
# Ejemplo: reenviar el puerto 3000 de la VM a tu localhost:3000
ssh -L 3000:localhost:3000 usuario@IP_DE_LA_VM
```

---

## 2. Instalar Node.js (LTS), MySQL y Nginx

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar
node -v
npm -v

# MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Nginx
sudo apt install -y nginx
```

---

## 3. Subir / clonar el proyecto

```bash
cd /var/www
sudo git clone https://github.com/TU_USUARIO/fitcoach-pro.git
# O subir los archivos por SCP/SFTP
sudo chown -R $USER:$USER /var/www/fitcoach-pro
cd /var/www/fitcoach-pro
```

---

## 4. Crear la base de datos

Usar el archivo SQL del proyecto:

```bash
sudo mysql -u root -p < database/crear_base_datos.sql
```

El archivo `database/crear_base_datos.sql` crea:
- La base de datos `fitcoach_pro`
- Todas las tablas (usuarios, videos, feedbacks, planes, promociones, logs, etc.)
- Relaciones e índices necesarios

---

## 5. Configurar la base de datos y el usuario de la app

```bash
sudo mysql -u root -p
```

Dentro de MySQL:

```sql
CREATE USER 'fitcoach'@'localhost' IDENTIFIED BY 'TU_PASSWORD_SEGURA';
GRANT ALL PRIVILEGES ON fitcoach_pro.* TO 'fitcoach'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 6. Variables de entorno

```bash
cd /var/www/fitcoach-pro/backend
cp .env.example .env
nano .env
```

Contenido mínimo de `.env`:

```env
PORT=3000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=3306
DB_NAME=fitcoach_pro
DB_USER=fitcoach
DB_PASSWORD=TU_PASSWORD_SEGURA
DB_DIALECT=mysql

JWT_SECRET=una_clave_muy_larga_y_aleatoria_aqui
JWT_EXPIRES_IN=2h
```

**Nunca** subir el archivo `.env` a GitHub.

---

## 7. Crear el Super Admin inicial

Después de tener la base de datos y el `.env`:

```bash
cd /var/www/fitcoach-pro/backend
npm install
node scripts/crear_super_admin.js
```

Ese script pedirá (o usará valores por defecto):
- Nombre
- Email
- Contraseña

Solo existirá **un** Super Admin al inicio. Él podrá crear Admins después.

---

## 8. Levantar la aplicación

### Opción A – Desarrollo / prueba

```bash
cd /var/www/fitcoach-pro/backend
npm start
```

### Opción B – Producción con PM2 (recomendado)

```bash
sudo npm install -g pm2
cd /var/www/fitcoach-pro/backend
pm2 start src/app.js --name fitcoach-api
pm2 save
pm2 startup
```

---

## 9. Configurar Nginx (proxy inverso)

```bash
sudo nano /etc/nginx/sites-available/fitcoach
```

Ejemplo de configuración:

```nginx
server {
    listen 80;
    server_name TU_IP_O_DOMINIO;

    # Frontend (archivos estáticos)
    location / {
        root /var/www/fitcoach-pro/frontend;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Activar:

```bash
sudo ln -s /etc/nginx/sites-available/fitcoach /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 10. Exponer a internet

```bash
# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

- Si usas IP pública: abrir puertos 80 (y 443 si hay HTTPS) en el proveedor de la VM.
- Si tienes dominio: apuntar el DNS a la IP de la máquina.
- (Recomendado) Instalar Certbot para HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com
```

---

## 11. Verificar que funciona

Checklist:

- [ ] `http://TU_IP` muestra el frontend
- [ ] `http://TU_IP/api/health` responde OK
- [ ] Puedes registrar un atleta
- [ ] Puedes iniciar sesión (JWT)
- [ ] El Super Admin puede entrar al panel admin
- [ ] Un coach puede ver videos y dejar feedback
- [ ] Los límites de plan se respetan (ej. Básico = 4 videos/mes)

---

## 12. (Opcional pero pedido por el curso)

- Dockerfile + docker-compose
- GitHub Actions (build + push a Docker Hub)
- ELK Stack para logs (Grupo 3)

---

## Orden mental rápido

```
Dependencias → MySQL → Crear BD (SQL) → Usuario BD → .env → Super Admin → npm install → PM2 → Nginx → Firewall → Probar
```

Este documento se irá completando a medida que generemos los archivos reales (`crear_base_datos.sql`, `crear_super_admin.js`, modelos, etc.).
