const express = require('express');
const router = express.Router();
const remedioController = require('../controllers/remedioController');

// Rotas para remédios
router.get('/', remedioController.getAllRemedios);
router.get('/:id', remedioController.getRemedioById);
router.get('/aluno/:aluno_id', remedioController.getRemediosByAluno);
router.post('/', remedioController.createRemedio);
router.put('/:id', remedioController.updateRemedio);
router.delete('/:id', remedioController.deleteRemedio);

module.exports = router;
