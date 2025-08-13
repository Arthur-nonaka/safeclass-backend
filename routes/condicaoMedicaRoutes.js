const express = require('express');
const router = express.Router();
const condicaoMedicaController = require('../controllers/condicaoMedicaController');

// Rotas para condições médicas
router.get('/', condicaoMedicaController.getAllCondicoesMedicas);
router.get('/:id', condicaoMedicaController.getCondicaoMedicaById);
router.post('/', condicaoMedicaController.createCondicaoMedica);
router.put('/:id', condicaoMedicaController.updateCondicaoMedica);
router.delete('/:id', condicaoMedicaController.deleteCondicaoMedica);

module.exports = router;
