const { DataTypes } = require('sequelize');
const sequelize = require('../baseDatos');
const Usuario = require('./usuario');

const Video = sequelize.define('Video', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  atleta_id: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  url_archivo: { type: DataTypes.STRING, allowNull: false },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_revision', 'revisado'),
    defaultValue: 'pendiente'
  },
  coach_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'videos',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

Video.belongsTo(Usuario, { foreignKey: 'atleta_id', as: 'atleta' });
Video.belongsTo(Usuario, { foreignKey: 'coach_id', as: 'coach' });

module.exports = Video;