'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { conectarBaseDatos } = require('./baseDatos');
const recompensaRutas = require('./rutas/recompensaRutas');
const app = express();
const PORT = process.env.PORT || 3004;
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ servicio: 'api-recompensas', estado: 'ok', puerto: PORT }));
app.use('/api/recompensas', recompensaRutas);
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));
async function iniciar() {
  try { if (process.env.DB_NAME) await conectarBaseDatos(); } catch (e) { console.error('BD:', e.message); }
  app.listen(PORT, () => console.log(`api-recompensas en puerto ${PORT}`));
}
iniciar();
module.exports = app;
