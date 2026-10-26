'use strict';
const Joi = require('joi');
const svc = require('../servicios/recompensaServicio');

const esquemaPromo = Joi.object({
  nombre: Joi.string().required(),
  plan_aplica: Joi.string().valid('basico','pro','elite','todos').default('todos'),
  tipo_descuento: Joi.string().valid('porcentaje','monto').default('porcentaje'),
  valor: Joi.number().positive().required(),
  fecha_inicio: Joi.date().required(),
  fecha_fin: Joi.date().required(),
  usos_maximos: Joi.number().integer().positive().allow(null)
});

module.exports = {
  async mias(req, res) {
    try {
      return res.json(await svc.listarMias(req.usuario.id));
    } catch (e) { return res.status(e.status || 500).json({ mensaje: e.message }); }
  },
  async desbloquear(req, res) {
    try {
      const r = await svc.desbloquear(req.usuario.id, req.body);
      return res.status(201).json(r);
    } catch (e) { return res.status(e.status || 500).json({ mensaje: e.message }); }
  },
  async promocionesActivas(req, res) {
    try { return res.json(await svc.listarPromocionesActivas()); }
    catch (e) { return res.status(e.status || 500).json({ mensaje: e.message }); }
  },
  async crearPromocion(req, res) {
    try {
      const { error, value } = esquemaPromo.validate(req.body);
      if (error) return res.status(400).json({ mensaje: error.details[0].message });
      const p = await svc.crearPromocion(req.usuario.id, value);
      return res.status(201).json(p);
    } catch (e) { return res.status(e.status || 500).json({ mensaje: e.message }); }
  },
  async listarPromociones(req, res) {
    try { return res.json(await svc.listarTodasPromociones()); }
    catch (e) { return res.status(e.status || 500).json({ mensaje: e.message }); }
  }
};
