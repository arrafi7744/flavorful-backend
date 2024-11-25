const express = require("express");
const router = express.Router();
const {
  createOrderController,
  showOrderController,
  showSingleOrderController,
  deleteOrderController,
  updateOrderController,
  showAllOrderController,
  pendingOrderController,
  cancelledOrderController,
  confirmedOrderController,
  showOrdersByUserController,
  showRefunedOrdersByUserController,
  showAllPendingOrdersController,
  showAllDeliveredOrdersController,
  showAllDeletedOrdersController,
  showAllTodayOrdersController,
  showAllCancelledOrdersController,
  showAllConfirmedOrdersController,
  deliveryConfirmedOrderController,
  showAllPendingOrdersByUserIdController,
  showAllConfirmedOrdersByUserIdController,
  showAllDeliveredOrdersByUserIdController,
  showAllCancelledOrdersByUserIdController,
  showAllOrdersByUsrIdController,
  showAllRecentOrdersController,
  showAllRecentOrdersByUsrIdController,
  showAllPendingOrdersBySellerIdController,
  showAllConfirmedOrdersBySellerIdController,
  showAllDeliveredOrdersBySellerIdController,
  showAllCancelledOrdersBySellerIdController,
  showSingleOrderWithOrderIdController,
} = require("../../controllers/orderController/orderController");

router.post("/crt", createOrderController);
router.post("/upt/byid/:id", updateOrderController);
router.get("/confirm/byid/:id", confirmedOrderController);
router.get("/delivery/confirm/byid/:id", deliveryConfirmedOrderController);
router.get("/cancel/byid/:id", cancelledOrderController);
router.get("/pending/byid/:id", pendingOrderController);
router.get("/src", showOrderController);
router.get("/src/all", showAllOrderController);
router.get("/src/byid/:id", showSingleOrderController);
router.get("/src/orderId/:id", showSingleOrderWithOrderIdController);
router.get("/src/user/byid/:id", showOrdersByUserController);

router.get("/src/pending/all", showAllPendingOrdersController);
router.get("/src/confirmed/all", showAllConfirmedOrdersController);
router.get("/src/delivered/all", showAllDeliveredOrdersController);
router.get("/src/cancel/all", showAllCancelledOrdersController);
router.get("/src/deleted/all", showAllDeletedOrdersController);
router.get("/src/today/all", showAllTodayOrdersController);

router.get(
  "/src/pending/orders/bysellerid/:id",
  showAllPendingOrdersBySellerIdController
);
router.get(
  "/src/cancelled/orders/bysellerid/:id",
  showAllCancelledOrdersBySellerIdController
);
router.get(
  "/src/delivered/orders/bysellerid/:id",
  showAllDeliveredOrdersBySellerIdController
);
router.get(
  "/src/confirmed/orders/bysellerid/:id",
  showAllConfirmedOrdersBySellerIdController
);

router.post("/src/pending/all/byusr", showAllPendingOrdersByUserIdController);
router.post(
  "/src/confirmed/all/byusr",
  showAllConfirmedOrdersByUserIdController
);
router.post(
  "/src/delivered/all/byusr",
  showAllDeliveredOrdersByUserIdController
);
router.post("/src/cancel/all/byusr", showAllCancelledOrdersByUserIdController);
router.post("/src/all/pd/usrid", showAllOrdersByUsrIdController);
router.post("/src/all/rco", showAllRecentOrdersController);
router.post("/src/all/rco/byusr", showAllRecentOrdersByUsrIdController);

router.get("/del/byid/:id", deleteOrderController);
router.get("/refunds/byid/:id", showRefunedOrdersByUserController);

module.exports = router;
