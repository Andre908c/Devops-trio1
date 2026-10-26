'use strict';

module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    'Log',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      tipo: {
        type: DataTypes.ENUM('atleta', 'coach', 'admin', 'super_admin', 'sistema'),
        allowNull: false
      },
      usuario_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      accion: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      detalle: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ip: {
        type: DataTypes.STRING(45),
        allowNull: true
      }
    },
    {
      tableName: 'logs',
      timestamps: true,
      createdAt: 'creado_en',
      updatedAt: false
    }
  );

  return Log;
};
