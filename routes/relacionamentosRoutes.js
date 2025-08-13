const express = require('express');
const router = express.Router();
const relacionamentosController = require('../controllers/relacionamentosController');

// Rotas para relacionamentos responsável-filho
router.get('/responsavel-filho', relacionamentosController.getAllResponsavelFilho);
router.get('/responsavel-filho/responsavel/:responsavel_id', relacionamentosController.getFilhosByResponsavel);
router.get('/responsavel-filho/filho/:filho_id', relacionamentosController.getResponsaveisByFilho);
router.post('/responsavel-filho', relacionamentosController.createResponsavelFilho);
router.delete('/responsavel-filho/:responsavel_id/:filho_id', relacionamentosController.deleteResponsavelFilho);

// Rotas para relacionamentos usuário-condição médica
router.get('/usuario-condicao', relacionamentosController.getAllUsuarioCondicao);
router.get('/usuario-condicao/aluno/:aluno_id', relacionamentosController.getCondicoesByAluno);
router.post('/usuario-condicao', relacionamentosController.createUsuarioCondicao);
router.delete('/usuario-condicao/:aluno_id/:condicao_id', relacionamentosController.deleteUsuarioCondicao);

module.exports = router;
