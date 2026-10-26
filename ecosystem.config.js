const path = require('path');
const fs = require('fs');

function resolveServiceCwd(serviceName) {
  const pathInSubfolder = path.join(__dirname, 'plataforma-entrenamiento', 'services', serviceName);
  if (fs.existsSync(pathInSubfolder)) {
    return pathInSubfolder;
  }
  return path.join(__dirname, 'services', serviceName);
}

const dbEnvDefaults = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME || 'fitcoach_pro',
  DB_USER: process.env.DB_USER || 'fitcoach',
  DB_PASSWORD: process.env.DB_PASSWORD || 'fitcoachpass',
  DB_DIALECT: process.env.DB_DIALECT || 'mysql',
  JWT_SECRET: process.env.JWT_SECRET || 'secreto_compartido_fitcoach_pro'
};

module.exports = {
  apps: [
    {
      name: 'api-usuarios',
      cwd: resolveServiceCwd('api-usuarios'),
      script: 'src/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        ...dbEnvDefaults,
        PORT: 3001
      }
    },
    {
      name: 'api-entrenamientos',
      cwd: resolveServiceCwd('api-entrenamientos'),
      script: 'src/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        ...dbEnvDefaults,
        PORT: 3002
      }
    },
    {
      name: 'api-nutricion',
      cwd: resolveServiceCwd('api-nutricion'),
      script: 'src/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        ...dbEnvDefaults,
        PORT: 3003
      }
    },
    {
      name: 'api-recompensas',
      cwd: resolveServiceCwd('api-recompensas'),
      script: 'src/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        ...dbEnvDefaults,
        PORT: 3004
      }
    }
  ]
};
