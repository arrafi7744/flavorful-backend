const express = require('express');
const router = express.Router();
const customerReceiptController = require("../../controllers/customerReceiptController/customerReceiptController");

router.post("/crt", customerReceiptController.createCustomerReceiptContrlr);
router.post("/upt/byId/:id", customerReceiptController.updateSingleCustomerReceiptContrlr);
router.get("/src", customerReceiptController.showCustomerReceiptContrlr);
router.get("/src/byId/:id", customerReceiptController.showSingleCustomerReceiptContrlr);
router.get("/src/all", customerReceiptController.showAllCustomerReceiptContrlr);
router.get("/del/byId/:id", customerReceiptController.deleteSingleCustomerReceiptContrlr);

module.exports = router;