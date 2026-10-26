'use strict';
const Joi = require('joi');
const videoServicio = require('../servicios/videoServicio');

const esquemaCrear = Joi.object({
  titulo: Joi.string().min(2).max(200).required(),
  descripcion: Joi.string().allow('', null),
  url_archivo: Joi.string()
    .uri()
    .regex(/\.(mp4|mov|avi|webm)($|\?)/i)
    .max(500)
    .required()
    .messages({
      'string.pattern.base': 'Formato de video no permitido. Solo se permiten extensiones .mp4, .mov, .avi o .webm'
    })
});

module.exports = {
  async crear(req, res) {
    try {
      const { error, value } = esquemaCrear.validate(req.body);
      if (error) return res.status(400).json({ mensaje: error.details[0].message });
      const video = await videoServicio.crear({
        atletaId: req.usuario.id,
        plan: req.usuario.plan || 'basico',
        ...value
      });
      return res.status(201).json(video);
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message });
    }
  },

  async mios(req, res) {
    try {
      const lista = await videoServicio.listarMios(req.usuario.id);
      return res.json(lista);
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message });
    }
  },

  async listar(req, res) {
    try {
      const lista = await videoServicio.listarTodos({
        estado: req.query.estado,
        atleta_id: req.query.atleta_id
      });
      return res.json(lista);
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message });
    }
  },

  async obtener(req, res) {
    try {
      const video = await videoServicio.obtenerPorId(req.params.id);
      const esDueño = video.atleta_id === req.usuario.id;
      const esStaff = ['coach', 'admin', 'super_admin'].includes(req.usuario.rol);
      if (!esDueño && !esStaff) return res.status(403).json({ mensaje: 'Sin permiso' });
      return res.json(video);
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message });
    }
  },

  async cambiarEstado(req, res) {
    try {
      const { estado } = req.body;
      const video = await videoServicio.cambiarEstado(req.params.id, estado, req.usuario.id);
      return res.json(video);
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message });
    }
  },

  async feedback(req, res) {
    try {
      const { comentario } = req.body;
      if (!comentario || !String(comentario).trim()) {
        return res.status(400).json({ mensaje: 'comentario es requerido' });
      }
      const fb = await videoServicio.dejarFeedback(req.params.id, req.usuario.id, comentario);
      return res.status(201).json(fb);
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message });
    }
  }
};
