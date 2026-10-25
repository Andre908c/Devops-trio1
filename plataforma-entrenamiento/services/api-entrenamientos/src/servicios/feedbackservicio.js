const Feedback = require('../modelos/feedback');
const Video = require('../modelos/video');

exports.crearFeedback = async ({ video_id, coach_id, comentario }) => {
  const video = await Video.findByPk(video_id);
  if (!video) throw new Error('Video no encontrado');

  const feedback = await Feedback.create({ video_id, coach_id, comentario });

  video.estado = 'revisado';
  video.coach_id = coach_id;
  await video.save();

  return feedback;
};

exports.obtenerFeedbacksPorVideo = async (video_id) => {
  return await Feedback.findAll({ where: { video_id } });
};