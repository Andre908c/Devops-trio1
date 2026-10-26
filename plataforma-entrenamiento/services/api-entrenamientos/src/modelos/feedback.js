'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Feedback', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    video_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    coach_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    comentario: { type: DataTypes.TEXT, allowNull: false }
  }, {
    tableName: 'feedbacks',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false
  });
};
