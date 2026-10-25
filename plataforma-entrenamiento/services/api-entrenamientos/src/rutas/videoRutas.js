const express = require('express');
const router = express.Router();
const videoControlador = require('../controladores/videoControlador');

router.post('/', videoControlador.crear);
router.get('/', videoControlador.listar);
router.patch('/:id/estado', videoControlador.actualizarEstado);

module.exports = router;