'use strict';
const Joi = require('joi');
const authServicio = require('../servicios/authServicio');

const esquemaRegistro = Joi.object({
  nombre: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required()
});

const esquemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const authControlador = {
  async registro(req, res) {
    try {
      const { error, value } = esquemaRegistro.validate(req.body);
      if (error) {
        return res.status(400).json({ mensaje: error.details[0].message });
      }
      const resultado = await authServicio.registrar(value);
      return res.status(201).json(resultado);
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message || 'Error en registro' });
    }
  },

  async login(req, res) {
    try {
      const { error, value } = esquemaLogin.validate(req.body);
      if (error) {
        return res.status(400).json({ mensaje: error.details[0].message });
      }
      const resultado = await authServicio.login(value);
      return res.json(resultado);
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message || 'Error en login' });
    }
  },

  async me(req, res) {
    try {
      const usuario = await authServicio.obtenerPorId(req.usuario.id);
      return res.json({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        plan: usuario.plan,
        plan_pendiente: usuario.plan_pendiente,
        plan_cambia_en: usuario.plan_cambia_en
      });
    } catch (e) {
      return res.status(e.status || 500).json({ mensaje: e.message || 'Error' });
    }
  }
};

module.exports = authControlador;