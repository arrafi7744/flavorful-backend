const express = require('express');
const router = express.Router();
const deliveryChargesController = require("../../controllers/deliveryChargesController/deliveryChargestController");

router.get("/src/all", deliveryChargesController.getAllDeliveryChargesController);
router.post("/crt", deliveryChargesController.createDeliveryChargesController);
router.get("/src/byId/:id", deliveryChargesController.getSingleDeliveryChargesController);
router.get("/del/byId/:id", deliveryChargesController.removeSingleDeliveryChargesController);

module.exports = router;