'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Video', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    atleta_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    url_archivo: { type: DataTypes.STRING(500), allowNull: false },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_revision', 'revisado'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    coach_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }
  }, {
    tableName: 'videos',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  });
};
