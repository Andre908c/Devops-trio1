'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ servicio: 'api-nutricion', estado: 'ok', puerto: PORT });
});

// TODO Juan Camilo: montar rutas de nutrición / menús
// app.use('/api/nutricion', require('./rutas/nutricionRutas'));

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada', ruta: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`api-nutricion escuchando en puerto ${PORT}`);
});

module.exports = app;
