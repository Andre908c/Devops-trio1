# PROYECTO FINAL DEVOPS – WEBAPPS
## Grupo 3 | FitCoach Pro – Plataforma de Entrenamiento con Microservicios

**Módulo:** DEVOPS – WEBAPPS  
**Docente:** Jhonathan Rodriguez Ramirez  
**Fecha límite Etapa 3:** 10 de noviembre de 2026  
**Herramienta de CI/CD elegida:** GitHub Actions  
**Herramienta de Monitoreo (Grupo 3):** ELK Stack (Elasticsearch + Logstash + Kibana)

---

## 1. Descripción del Negocio (FitCoach Pro)

Plataforma web de entrenamiento personalizado con suscripción donde:

- El usuario sube videos de sus entrenamientos.
- Un coach revisa los videos y da feedback técnico.
- Existe un módulo de nutrición con menús personalizados.
- Sistema de niveles y recompensas por progreso.
- Todo gestionado mediante microservicios.

### Microservicios propuestos

| Microservicio          | Responsabilidad                              | Puerto |
|------------------------|----------------------------------------------|--------|
| frontend               | Interfaz web (HTML/CSS/JS)                   | 80     |
| api-usuarios           | Gestión de usuarios y autenticación          | 3001   |
| api-entrenamientos     | Videos, sesiones y feedback del coach        | 3002   |
| api-nutricion          | Planes alimenticios y menús                  | 3003   |
| api-recompensas        | Niveles, insignias y canjes                  | 3004   |

> **Nota:** Para cumplir el requisito de “aplicación sencilla con microservicios funcionales”, se implementará al menos la estructura de microservicios + frontend. Las APIs pueden ser mock/simples al inicio.

---

## 2. Estructura del Repositorio (recomendada)

```
fitcoach-pro/
├── frontend/                  # Páginas HTML + CSS + JS (ya creadas)
│   ├── index.html
│   ├── entrenamiento.html
│   ├── nutricion.html
│   ├── recompensas.html
│   ├── precios.html
│   ├── style.css
│   └── script.js
├── services/
│   ├── api-usuarios/
│   ├── api-entrenamientos/
│   ├── api-nutricion/
│   └── api-recompensas/
├── docker/
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions
├── monitoring/                # Configuración ELK (Grupo 3)
│   ├── elasticsearch.yml
│   ├── logstash.conf
│   └── kibana.yml
├── docs/
│   └── PRESENTACION.md
└── README.md
```

---

## 3. FASE 1 – Desarrollo de la Aplicación (Microservicios)

### Estado actual
- Frontend completo ya generado (páginas de FitCoach Pro).
- Estructura de microservicios **pendiente de implementar**.

### Qué deben hacer manualmente

1. Crear las carpetas de los microservicios.
2. Implementar APIs básicas (pueden ser Node.js + Express o Python + FastAPI).
3. Ejemplo mínimo de un microservicio (Node.js):

```bash
# Ejemplo para api-entrenamientos
mkdir -p services/api-entrenamientos
cd services/api-entrenamientos
npm init -y
npm install express cors
```

Crear `index.js` básico que responda en `/api/videos` y `/health`.

---

## 4. FASE 2 – Contenerización (Docker)

### 4.1 Dockerfile para el Frontend

Crear archivo `docker/Dockerfile.frontend`:

```dockerfile
FROM nginx:alpine
COPY frontend/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 docker-compose.yml (recomendado)

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: docker/Dockerfile.frontend
    ports:
      - "8080:80"
    restart: unless-stopped

  # Ejemplo de microservicio (agregar los demás igual)
  api-entrenamientos:
    build: ./services/api-entrenamientos
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
```

### 4.3 Comandos que deben ejecutar manualmente

```bash
# 1. Construir la imagen del frontend
docker build -t grupo3/fitcoach-frontend:latest -f docker/Dockerfile.frontend .

# 2. Ejecutar localmente
docker run -d -p 8080:80 --name fitcoach-frontend grupo3/fitcoach-frontend:latest

# 3. Verificar
curl http://localhost:8080

# 4. Iniciar sesión en Docker Hub
docker login

# 5. Subir la imagen a Docker Hub
docker tag grupo3/fitcoach-frontend:latest TU_USUARIO_DOCKERHUB/fitcoach-frontend:latest
docker push TU_USUARIO_DOCKERHUB/fitcoach-frontend:latest
```

**Estado:**  
- Dockerfile → **Listo para usar** (copiar el código de arriba)  
- Construcción, ejecución local y push a Docker Hub → **Deben hacerlo ustedes**

---

## 5. FASE 3 – Integración Continua (GitHub Actions)

### Archivo a crear: `.github/workflows/ci.yml`

```yaml
name: CI - FitCoach Pro

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout del código
        uses: actions/checkout@v4

      - name: Configurar Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Construir imagen Frontend
        run: |
          docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/fitcoach-frontend:latest -f docker/Dockerfile.frontend .

      - name: Push a Docker Hub
        run: |
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/fitcoach-frontend:latest

      # Opcional: tests básicos
      - name: Verificar que la imagen se construyó
        run: docker images
```

### Qué deben configurar manualmente en GitHub

1. Ir al repositorio → Settings → Secrets and variables → Actions.
2. Crear dos secrets:
   - `DOCKERHUB_USERNAME` → su usuario de Docker Hub
   - `DOCKERHUB_TOKEN` → Access Token de Docker Hub (no la contraseña)

3. Hacer push a la rama `main` para que se ejecute el pipeline.

**Estado:**  
- Archivo YAML → **Listo** (copiar y pegar)  
- Secrets de GitHub y primer push → **Deben hacerlo ustedes**

---

## 6. FASE 4 – Monitoreo (Grupo 3: ELK Stack)

### Qué deben investigar y explicar (Parte teórica)

- **Elasticsearch**: motor de búsqueda y almacenamiento de logs/métricas.
- **Logstash**: pipeline de recolección, transformación y envío de logs.
- **Kibana**: visualización y dashboards de los logs.

### Arquitectura básica a presentar

```
Aplicación (FitCoach) → Logs → Logstash → Elasticsearch → Kibana (dashboards)
```

### Comandos básicos de ELK con Docker (referencia)

```bash
# Ejemplo simplificado (pueden usar docker-compose oficial de Elastic)
docker network create elk

docker run -d --name elasticsearch --net elk -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0

docker run -d --name kibana --net elk -p 5601:5601 \
  -e "ELASTICSEARCH_HOSTS=http://elasticsearch:9200" \
  docker.elastic.co/kibana/kibana:8.11.0
```

**Estado:**  
- Investigación y explicación teórica → **Deben prepararla ustedes**  
- Demostración básica de ELK → Opcional pero recomendable

---

## 7. FASE 5 – Presentación Final (15 minutos)

### Parte Técnica (10 min) – Checklist

| # | Requisito                              | Estado          | Responsable |
|---|----------------------------------------|-----------------|-------------|
| 1 | Aplicación funcionando                 | Frontend listo  | Grupo       |
| 2 | Repositorio en GitHub                  | Por crear       | Grupo       |
| 3 | Dockerfile                             | Listo (copiar)  | Grupo       |
| 4 | Imagen publicada en Docker Hub         | Por hacer       | Grupo       |
| 5 | Pipeline de GitHub Actions ejecutándose| Por configurar  | Grupo       |
| 6 | Evidencia de CI/CD                     | Por generar     | Grupo       |

### Parte Teórica (5 min) – Preguntas a responder

1. ¿Qué problema resuelve DevOps?
2. ¿Qué es CI (Integración Continua)?
3. ¿Qué es CD (Entrega/Despliegue Continuo)?
4. ¿Qué hace Docker?
5. ¿Por qué es importante el monitoreo? (enfocado en ELK Stack)

---

## 8. Resumen de lo que falta por hacer (Grupo)

### Prioridad Alta (obligatorio)

- [ ] Crear repositorio en GitHub y subir el código del frontend
- [ ] Crear el Dockerfile y construir la imagen
- [ ] Ejecutar el contenedor localmente y verificar
- [ ] Crear cuenta en Docker Hub (si no tienen) y subir la imagen
- [ ] Configurar secrets en GitHub Actions
- [ ] Subir el workflow `ci.yml` y probar el pipeline
- [ ] Preparar la explicación teórica del ELK Stack
- [ ] Preparar la presentación PowerPoint (15 min)

### Prioridad Media (recomendado)

- [ ] Implementar al menos 1-2 microservicios básicos
- [ ] Usar docker-compose para levantar frontend + APIs
- [ ] Capturas de pantalla de:
  - Imagen en Docker Hub
  - Pipeline exitoso en GitHub Actions
  - Contenedor corriendo

### Prioridad Baja (si alcanza el tiempo)

- [ ] Montar ELK Stack básico con Docker
- [ ] Enviar logs de la aplicación a Logstash

---

## 9. Comandos rápidos de referencia

```bash
# Clonar / actualizar
git clone https://github.com/SU_USUARIO/fitcoach-pro.git
cd fitcoach-pro

# Construir y correr frontend
docker build -t fitcoach-frontend -f docker/Dockerfile.frontend .
docker run -d -p 8080:80 fitcoach-frontend

# Subir a Docker Hub
docker tag fitcoach-frontend SU_USUARIO/fitcoach-frontend:latest
docker push SU_USUARIO/fitcoach-frontend:latest

# Ver contenedores
docker ps
docker logs fitcoach-frontend
```

---

**Documento generado para el Grupo 3**  
FitCoach Pro + Docker + GitHub Actions + ELK Stack  
Listo para continuar el desarrollo y la presentación final.
