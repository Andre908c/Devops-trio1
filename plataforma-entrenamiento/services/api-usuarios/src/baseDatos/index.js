'use strict';
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'fitcoach_pro',
  process.env.DB_USER || 'fitcoach',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false
  }
);

const Usuario = require('../modelos/usuario')(sequelize, DataTypes);

async function conectarBaseDatos() {
  await sequelize.authenticate();
  console.log('api-usuarios: conectado a la base de datos.');
}

module.exports = {
  sequelize,
  Usuario,
  conectarBaseDatos
};
