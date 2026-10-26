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
    logging: false
  }
);

const Video = require('../modelos/video')(sequelize, DataTypes);
const Feedback = require('../modelos/feedback')(sequelize, DataTypes);

Video.hasMany(Feedback, { foreignKey: 'video_id', as: 'feedbacks' });
Feedback.belongsTo(Video, { foreignKey: 'video_id', as: 'video' });

async function conectarBaseDatos() {
  await sequelize.authenticate();
  console.log('api-entrenamientos: conectado a la BD');
}

module.exports = { sequelize, Video, Feedback, conectarBaseDatos };
