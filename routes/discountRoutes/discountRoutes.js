const express = require('express');
const router = express.Router();
const discountControllers = require ("../../controllers/discountController/discountController.js");


router.post("/crt/:id", discountControllers.createDiscountController);
router.get("/src/:id", discountControllers.getSingleDiscountController);
router.get("/all/src", discountControllers.getAllDiscountsController);
router.post("/upt/:id", discountControllers.updateDiscountController);
router.get("/del/:id", discountControllers.removeDiscountController);

module.exports = router;