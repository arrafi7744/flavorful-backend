const express = require('express');
const router = express.Router();
const salesController = require("../../controllers/salesController/salesController");

router.post('/crt', salesController.createSalesController);
router.post('/upt/:id', salesController.updateSingleSaleController);
router.get('/src', salesController.showSalesController);
router.get('/src/all', salesController.showAllSalesController);
router.get('/src/:id', salesController.showSingleSaleController);
router.get('/del/:id', salesController.removeSingleSaleController);


module.exports = router;