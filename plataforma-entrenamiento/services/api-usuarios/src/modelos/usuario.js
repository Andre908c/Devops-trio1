'use strict';

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    'Usuario',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      rol: {
        type: DataTypes.ENUM('super_admin', 'admin', 'coach', 'atleta'),
        allowNull: false,
        defaultValue: 'atleta'
      },
      plan: {
        type: DataTypes.ENUM('basico', 'pro', 'elite'),
        allowNull: true,
        defaultValue: 'basico'
      },
      plan_pendiente: {
        type: DataTypes.ENUM('basico', 'pro', 'elite'),
        allowNull: true
      },
      plan_cambia_en: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      tableName: 'usuarios',
      timestamps: true,
      createdAt: 'creado_en',
      updatedAt: 'actualizado_en',
      defaultScope: {
        attributes: { exclude: ['password_hash'] }
      },
      scopes: {
        conPassword: {
          attributes: { include: ['password_hash'] }
        }
      }
    }
  );

  return Usuario;
};