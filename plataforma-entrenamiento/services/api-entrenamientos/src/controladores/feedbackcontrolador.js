const feedbackServicio = require('../servicios/feedbackServicio');

exports.crear = async (req, res) => {
  try {
    const feedback = await feedbackServicio.crearFeedback(req.body);
    res.status(201).json({ ok: true, feedback });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

exports.obtenerPorVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const feedbacks = await feedbackServicio.obtenerFeedbacksPorVideo(videoId);
    res.json({ ok: true, feedbacks });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};