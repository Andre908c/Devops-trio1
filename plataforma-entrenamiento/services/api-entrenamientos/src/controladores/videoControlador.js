const videoServicio = require('../servicios/videoServicio');

exports.crear = async (req, res) => {
  try {
    const video = await videoServicio.registrarVideo(req.body);
    res.status(201).json({ ok: true, video });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const { atleta_id, estado } = req.query;
    const videos = await videoServicio.listarVideos({ atleta_id, estado });
    res.json({ ok: true, videos });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, coach_id } = req.body;
    const video = await videoServicio.cambiarEstadoVideo(id, estado, coach_id);
    res.json({ ok: true, video });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};