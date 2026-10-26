'use strict';
const nutricionServicio = require('../servicios/nutricionServicio');

module.exports = {
  async miPlan(req, res) {
    try {
      const plan = await nutricionServicio.obtenerPlanAtleta(req.usuario.id, req.usuario.plan || 'basico');
      return res.json(plan);
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message });
    }
  },
  async actualizar(req, res) {
    try {
      if (!['coach', 'admin', 'super_admin'].includes(req.usuario.rol)) {
        return res.status(403).json({ mensaje: 'Solo staff puede actualizar planes' });
      }
      const atletaId = Number(req.params.atletaId || req.body.atleta_id);
      if (!atletaId) return res.status(400).json({ mensaje: 'atleta_id requerido' });
      const plan = await nutricionServicio.actualizarPlan(atletaId, req.body);
      return res.json(plan);
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message });
    }
  }
};
