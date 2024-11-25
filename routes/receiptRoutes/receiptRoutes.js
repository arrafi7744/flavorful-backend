const express = require('express');
const router = express.Router();
const receiptController = require ("../../controllers/receiptController/receiptController");

router.post("/crt", receiptController.createReceiptController);
router.post("/upt/:id");
router.get("/src", receiptController.showAllReceiptsController);
router.get("/src/all", receiptController.showAllReceiptIdealController);
router.get("/src/byUserId/:id", receiptController.showAllReceiptsByUserIdController);
router.get("/del/:id");
router.get("/return/:id");


module.exports = router;