const { DataTypes } = require('sequelize');
const sequelize = require('../baseDatos');
const Video = require('./video');
const Usuario = require('./usuario');

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  video_id: { type: DataTypes.INTEGER, allowNull: false },
  coach_id: { type: DataTypes.INTEGER, allowNull: false },
  comentario: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'feedbacks',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false
});

Feedback.belongsTo(Video, { foreignKey: 'video_id', as: 'video' });
Feedback.belongsTo(Usuario, { foreignKey: 'coach_id', as: 'coach' });
Video.hasMany(Feedback, { foreignKey: 'video_id', as: 'feedbacks' });

module.exports = Feedback;