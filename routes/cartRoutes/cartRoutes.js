const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/cartController/cartController");

router.post("/crt", cartController.insertCartItemController);
router.post("/upt/byid/:id", cartController.updateSingleCartController);
router.get("/src", cartController.getCartController);
router.get("/src/all", cartController.getAllCartController);
router.get("/src/byuser/:id", cartController.getCartByUserController)
router.get("/src/byId/:id", cartController.getSingleCartController);
router.get("/qty/incr/:id", cartController.increaseCartQtyController);
router.get("/qty/decr/:id", cartController.decreaseCartQtyController);
router.get("/del/byId/:id", cartController.removeSingleCartController);
router.get("/remove/byid/:id", cartController.deleteSingleCartController);


module.exports = router;