const express = require("express");
const router = express.Router();
const stockController = require("../../controllers/stockController/stockController");

router.post("/crt", stockController.createStockController);
router.post("/upt/:id", stockController.updateStockController);
router.post("/upt-incr/:id", stockController.increaseStockController);
router.post("/upt-decr/:id", stockController.decreaseStockController);
router.get("/src", stockController.showAllStockController);
router.get("/src/all", stockController.showAllStockIdealController);
router.get("/src/:id", stockController.showSingleStockController);
router.get("/stkouts/src", stockController.showStockOutsController);
router.get("/del/:id", stockController.deleteStockController);

module.exports = router;
