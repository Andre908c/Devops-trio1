'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'fitcoach_pro',
  process.env.DB_USER || 'fitcoach',
  process.env.DB_PASSWORD || '',
  { host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT) || 3306, dialect: 'mysql', logging: false }
);
const PlanNutricional = require('../modelos/planNutricional')(sequelize, DataTypes);
async function conectarBaseDatos() {
  await sequelize.authenticate();
  console.log('api-nutricion: conectado a la BD');
}
module.exports = { sequelize, PlanNutricional, conectarBaseDatos };
