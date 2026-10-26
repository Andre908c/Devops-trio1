'use strict';
const { Op } = require('sequelize');
const { Recompensa, Promocion } = require('../baseDatos');

module.exports = {
  async listarMias(atletaId) {
    return Recompensa.findAll({ where: { atleta_id: atletaId }, order: [['desbloqueada_en', 'DESC']] });
  },
  async desbloquear(atletaId, { tipo, titulo, puntos }) {
    return Recompensa.create({ atleta_id: atletaId, tipo, titulo, puntos: puntos || 0 });
  },
  async listarPromocionesActivas() {
    const hoy = new Date().toISOString().slice(0, 10);
    return Promocion.findAll({
      where: {
        activa: true,
        fecha_inicio: { [Op.lte]: hoy },
        fecha_fin: { [Op.gte]: hoy }
      }
    });
  },
  async crearPromocion(adminId, datos) {
    return Promocion.create({ ...datos, creado_por: adminId, usos_actuales: 0, activa: true });
  },
  async listarTodasPromociones() {
    return Promocion.findAll({ order: [['creado_en', 'DESC']] });
  }
};
