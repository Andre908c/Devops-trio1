'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Recompensa', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    atleta_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tipo: { type: DataTypes.STRING(80), allowNull: false },
    titulo: { type: DataTypes.STRING(120), allowNull: false },
    puntos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    desbloqueada_en: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'recompensas', timestamps: false });
};
