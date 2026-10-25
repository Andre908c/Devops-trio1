const { DataTypes } = require('sequelize');
const sequelize = require('../baseDatos');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('atleta', 'coach', 'admin'), defaultValue: 'atleta' },
  plan: { type: DataTypes.ENUM('basico', 'premium'), defaultValue: 'basico' }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: false
});

module.exports = Usuario;