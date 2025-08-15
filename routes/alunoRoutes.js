const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

router.get('/', alunoController.getAllAlunos);
router.get('/sala/:salaId', alunoController.getAlunosBySala);
router.get('/responsavel/:responsavelId', alunoController.getAlunosByResponsavel);
router.get('/:id', alunoController.getAlunoById);
router.post('/', alunoController.createAluno);
router.put('/:id', alunoController.updateAluno);
router.delete('/:id', alunoController.deleteAluno);

module.exports = router;
