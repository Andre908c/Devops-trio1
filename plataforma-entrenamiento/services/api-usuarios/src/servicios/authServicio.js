'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../baseDatos');

const JWT_SECRET = process.env.JWT_SECRET || 'cambiar_secreto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

function firmarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      plan: usuario.plan
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

const authServicio = {
  async registrar({ nombre, email, password }) {
    const existe = await Usuario.scope('conPassword').findOne({ where: { email } });
    if (existe) {
      const err = new Error('Ya existe una cuenta con ese correo');
      err.status = 409;
      throw err;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({
      nombre,
      email,
      password_hash,
      rol: 'atleta',
      plan: 'basico',
      activo: true
    });

    const token = firmarToken(usuario);
    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        plan: usuario.plan
      }
    };
  },

  async login({ email, password }) {
    const usuario = await Usuario.scope('conPassword').findOne({ where: { email } });
    if (!usuario || !usuario.activo) {
      const err = new Error('Correo o contraseña incorrectos');
      err.status = 401;
      throw err;
    }

    const ok = await bcrypt.compare(password, usuario.password_hash);
    if (!ok) {
      const err = new Error('Correo o contraseña incorrectos');
      err.status = 401;
      throw err;
    }

    const token = firmarToken(usuario);
    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        plan: usuario.plan
      }
    };
  },

  async obtenerPorId(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario || !usuario.activo) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }
    return usuario;
  }
};

module.exports = authServicio;
