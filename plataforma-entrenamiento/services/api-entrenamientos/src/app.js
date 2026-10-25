'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ servicio: 'api-entrenamientos', estado: 'ok', puerto: PORT });
});

// TODO Daniel: montar rutas de videos y feedback
// app.use('/api/videos', require('./rutas/videoRutas'));

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada', ruta: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`api-entrenamientos escuchando en puerto ${PORT}`);
});

module.exports = app;
