'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { conectarBaseDatos } = require('./baseDatos');
const videoRutas = require('./rutas/videoRutas');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ servicio: 'api-entrenamientos', estado: 'ok', puerto: PORT });
});

app.use('/api/videos', videoRutas);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada', ruta: req.originalUrl });
});

async function iniciar() {
  try {
    if (process.env.DB_NAME) await conectarBaseDatos();
  } catch (e) {
    console.error('BD:', e.message);
  }
  app.listen(PORT, () => console.log(`api-entrenamientos en puerto ${PORT}`));
}

iniciar();
module.exports = app;
