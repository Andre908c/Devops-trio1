'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ servicio: 'api-usuarios', estado: 'ok', puerto: PORT });
});

// TODO Andrés Juan: montar rutas de auth, usuarios, planes, admin
// app.use('/api/auth', require('./rutas/authRutas'));
// app.use('/api/usuarios', require('./rutas/usuarioRutas'));

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada', ruta: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`api-usuarios escuchando en puerto ${PORT}`);
});

module.exports = app;
