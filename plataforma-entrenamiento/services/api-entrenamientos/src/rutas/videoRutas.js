'use strict';
const { Router } = require('express');
const ctrl = require('../controladores/videoControlador');
const { autenticar, autorizar } = require('../middleware/authMiddleware');

const router = Router();

router.post('/', autenticar, autorizar('atleta'), ctrl.crear);
router.get('/mios', autenticar, autorizar('atleta'), ctrl.mios);
router.get('/', autenticar, autorizar('coach', 'admin', 'super_admin'), ctrl.listar);
router.get('/:id', autenticar, ctrl.obtener);
router.patch('/:id/estado', autenticar, autorizar('coach', 'admin', 'super_admin'), ctrl.cambiarEstado);
router.post('/:id/feedback', autenticar, autorizar('coach', 'admin', 'super_admin'), ctrl.feedback);

module.exports = router;
