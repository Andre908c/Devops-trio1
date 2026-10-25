'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ servicio: 'api-recompensas', estado: 'ok', puerto: PORT });
});

// TODO Juan Camilo: montar rutas de recompensas y promociones
// app.use('/api/recompensas', require('./rutas/recompensaRutas'));
// app.use('/api/promociones', require('./rutas/promocionRutas'));

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada', ruta: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`api-recompensas escuchando en puerto ${PORT}`);
});

module.exports = app;
