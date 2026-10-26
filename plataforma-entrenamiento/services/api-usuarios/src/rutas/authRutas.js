'use strict';
const { Router } = require('express');
const authControlador = require('../controladores/authControlador');
const { autenticar } = require('../middleware/authMiddleware');

const router = Router();

router.post('/registro', authControlador.registro);
router.post('/login', authControlador.login);
router.get('/me', autenticar, authControlador.me);

module.exports = router;
