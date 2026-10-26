'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { conectarBaseDatos } = require('./baseDatos');
const authRutas = require('./rutas/authRutas');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ servicio: 'api-usuarios', estado: 'ok', puerto: PORT });
});

app.use('/api/auth', authRutas);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada', ruta: req.originalUrl });
});

async function iniciar() {
  try {
    if (process.env.DB_NAME) {
      await conectarBaseDatos();
    } else {
      console.log('api-usuarios: sin DB_NAME en .env — arranque sin BD (solo health)');
    }
  } catch (e) {
    console.error('No se pudo conectar a la BD:', e.message);
    console.log('El servidor arranca igual; configura .env y la BD cuando puedas.');
  }

  app.listen(PORT, () => {
    console.log(`api-usuarios escuchando en puerto ${PORT}`);
  });
}

iniciar();

module.exports = app;
