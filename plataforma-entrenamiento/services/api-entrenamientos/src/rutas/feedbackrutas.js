const express = require('express');
const router = express.Router();
const feedbackControlador = require('../controladores/feedbackControlador');

router.post('/', feedbackControlador.crear);
router.get('/video/:videoId', feedbackControlador.obtenerPorVideo);

module.exports = router;