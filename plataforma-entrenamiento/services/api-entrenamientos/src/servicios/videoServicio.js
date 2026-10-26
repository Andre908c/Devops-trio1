'use strict';
const { Op } = require('sequelize');
const { Video, Feedback, sequelize } = require('../baseDatos');

const LIMITES_PLAN = { basico: 4, pro: Infinity, elite: Infinity };

module.exports = {
  async crear({ atletaId, plan, titulo, descripcion, url_archivo }) {
    const limite = LIMITES_PLAN[plan] ?? 4;
    if (limite !== Infinity) {
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);
      const count = await Video.count({
        where: { atleta_id: atletaId, creado_en: { [Op.gte]: inicioMes } }
      });
      if (count >= limite) {
        const e = new Error(`Límite del plan ${plan}: máximo ${limite} videos este mes`);
        e.status = 403;
        throw e;
      }
    }
    return Video.create({
      atleta_id: atletaId,
      titulo,
      descripcion: descripcion || null,
      url_archivo,
      estado: 'pendiente'
    });
  },

  async listarMios(atletaId) {
    return Video.findAll({
      where: { atleta_id: atletaId },
      include: [{ model: Feedback, as: 'feedbacks' }],
      order: [['creado_en', 'DESC']]
    });
  },

  async listarTodos({ estado, atleta_id } = {}) {
    const where = {};
    if (estado) where.estado = estado;
    if (atleta_id) where.atleta_id = atleta_id;
    return Video.findAll({
      where,
      include: [{ model: Feedback, as: 'feedbacks' }],
      order: [['creado_en', 'DESC']]
    });
  },

  async obtenerPorId(id) {
    const video = await Video.findByPk(id, {
      include: [{ model: Feedback, as: 'feedbacks' }]
    });
    if (!video) {
      const e = new Error('Video no encontrado');
      e.status = 404;
      throw e;
    }
    return video;
  },

  async cambiarEstado(id, estado, coachId) {
    const video = await this.obtenerPorId(id);
    if (!['pendiente', 'en_revision', 'revisado'].includes(estado)) {
      const e = new Error('Estado inválido');
      e.status = 400;
      throw e;
    }
    video.estado = estado;
    video.coach_id = coachId;
    await video.save();
    return video;
  },

  async dejarFeedback(videoId, coachId, comentario) {
    const video = await this.obtenerPorId(videoId);
    const fb = await Feedback.create({
      video_id: videoId,
      coach_id: coachId,
      comentario
    });
    if (video.estado === 'pendiente') {
      video.estado = 'en_revision';
      video.coach_id = coachId;
      await video.save();
    }
    return fb;
  }
};
