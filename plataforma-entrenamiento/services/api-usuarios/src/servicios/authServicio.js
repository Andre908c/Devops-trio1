'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, Usuario, Log, Op } = require('../baseDatos');

const JWT_SECRET = process.env.JWT_SECRET || 'cambiar_secreto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

function firmarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      role: usuario.rol,
      plan: usuario.plan
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

const authServicio = {
  async registrar({ nombre, email, password, rol = 'atleta', plan = 'basico', ip = '127.0.0.1' }) {
    const t = await sequelize.transaction();
    try {
      // Validar estricta unicidad de correo y nombre de usuario
      const existe = await Usuario.scope('conPassword').findOne({
        where: {
          [Op.or]: [{ email }, { nombre }]
        },
        transaction: t
      });

      if (existe) {
        const err = new Error('El nombre de usuario o correo electrónico ya está en uso');
        err.status = 409;
        throw err;
      }

      const password_hash = await bcrypt.hash(password, 10);
      const nuevoRol = ['super_admin', 'admin', 'coach', 'atleta'].includes(rol) ? rol : 'atleta';
      const nuevoPlan = ['basico', 'pro', 'elite'].includes(plan) ? plan : 'basico';

      const usuario = await Usuario.create(
        {
          nombre,
          email,
          password_hash,
          rol: nuevoRol,
          plan: nuevoPlan,
          activo: true
        },
        { transaction: t }
      );

      // Log de auditoría por rol
      await Log.create(
        {
          tipo: nuevoRol === 'super_admin' ? 'super_admin' : (nuevoRol === 'admin' ? 'admin' : (nuevoRol === 'coach' ? 'coach' : 'atleta')),
          usuario_id: usuario.id,
          accion: 'REGISTRO_USUARIO',
          detalle: `Usuario ${nombre} (${email}) registrado con rol ${nuevoRol} y plan ${nuevoPlan}`,
          ip
        },
        { transaction: t }
      );

      await t.commit();

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
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async login({ email, password, ip = '127.0.0.1' }) {
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

    // Registrar log de acceso
    try {
      await Log.create({
        tipo: usuario.rol === 'super_admin' ? 'super_admin' : (usuario.rol === 'admin' ? 'admin' : (usuario.rol === 'coach' ? 'coach' : 'atleta')),
        usuario_id: usuario.id,
        accion: 'INICIO_SESION',
        detalle: `Inicio de sesión exitoso para ${usuario.email}`,
        ip
      });
    } catch (e) {
      // Ignorar error de log no crítico
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

  async cambiarPlan({ usuarioId, nuevoPlan, ip = '127.0.0.1' }) {
    const t = await sequelize.transaction();
    try {
      const usuario = await Usuario.findByPk(usuarioId, { transaction: t });
      if (!usuario) {
        const err = new Error('Usuario no encontrado');
        err.status = 404;
        throw err;
      }

      usuario.plan = nuevoPlan;
      await usuario.save({ transaction: t });

      await Log.create(
        {
          tipo: 'atleta',
          usuario_id: usuario.id,
          accion: 'CAMBIO_PLAN',
          detalle: `Plan actualizado a ${nuevoPlan}`,
          ip
        },
        { transaction: t }
      );

      await t.commit();
      return usuario;
    } catch (error) {
      await t.rollback();
      throw error;
    }
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
