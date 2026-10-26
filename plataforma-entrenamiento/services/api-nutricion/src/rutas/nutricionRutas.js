'use strict';
const { Router } = require('express');
const ctrl = require('../controladores/nutricionControlador');
const { autenticar, autorizar } = require('../middleware/authMiddleware');
const router = Router();
router.get('/mi-plan', autenticar, autorizar('atleta'), ctrl.miPlan);
router.put('/atleta/:atletaId', autenticar, autorizar('coach', 'admin', 'super_admin'), ctrl.actualizar);
module.exports = router;
