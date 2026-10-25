const { Op } = require('sequelize');
const Video = require('../modelos/video');
const Usuario = require('../modelos/usuario');

exports.registrarVideo = async ({ atleta_id, titulo, descripcion, url_archivo }) => {
  const usuario = await Usuario.findByPk(atleta_id);
  if (!usuario) throw new Error('Usuario no encontrado');

  if (usuario.plan === 'basico') {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const cantidadVideosMes = await Video.count({
      where: {
        atleta_id,
        creado_en: { [Op.gte]: inicioMes }
      }
    });

    if (cantidadVideosMes >= 4) {
      throw new Error('Ha alcanzado el límite de 4 videos al mes para el Plan Básico.');
    }
  }

  return await Video.create({
    atleta_id,
    titulo,
    descripcion,
    url_archivo,
    estado: 'pendiente'
  });
};

exports.listarVideos = async ({ atleta_id, estado }) => {
  const filtro = {};
  if (atleta_id) filtro.atleta_id = atleta_id;
  if (estado) filtro.estado = estado;

  return await Video.findAll({ where: filtro });
};

exports.cambiarEstadoVideo = async (videoId, nuevoEstado, coach_id) => {
  const estadosValidos = ['pendiente', 'en_revision', 'revisado'];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error('Estado inválido');
  }

  const video = await Video.findByPk(videoId);
  if (!video) throw new Error('Video no encontrado');

  video.estado = nuevoEstado;
  if (coach_id) video.coach_id = coach_id;
  await video.save();

  return video;
};