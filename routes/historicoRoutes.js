const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');

// Rotas para histórico
router.get('/', historicoController.getAllHistorico);
router.get('/:id', historicoController.getHistoricoById);
router.get('/usuario/:usuario_id', historicoController.getHistoricoByUsuario);
router.post('/', historicoController.createHistorico);
router.put('/:id', historicoController.updateHistorico);
router.delete('/:id', historicoController.deleteHistorico);

module.exports = router;
