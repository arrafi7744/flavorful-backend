const express = require('express');
const router = express.Router();
const taxController = require ("../../controllers/taxController/taxController.js");

router.post('/crt', taxController.crtTaxController);
router.get('/src', taxController.getTaxController);
router.get('/del/byId/:id', taxController.removeTaxController);

module.exports = router;