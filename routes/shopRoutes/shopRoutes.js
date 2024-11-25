const express = require('express');
const router = express.Router();
const multerMiddleware = require('../../middleware/multer.middleware.js');
const shopController = require('../../controllers/shopController/shopController.js');

router.post(
  '/crt',
  multerMiddleware.single('shopLogo'),
  shopController.createShopController
);
router.get('/src/all', shopController.showAllShopController);
router.post('/src/al/pdbysid', shopController.showAllProductByShopIdController);
router.post('/src/alshop/byuserid', shopController.showAllShopByUserIdController);
// router.post('/usr/accpt', userController.adminApproveUserController)
// router.post('/usr/rjct', userController.adminRejectUserController)
// router.post("/login", userControllers.loginUserController);
// router.get("/src", userControllers.showAllUsers);
// router.get("/src/all", userControllers.showAllUsersIdeal);
// router.get("/src/byId/:id", userControllers.showSingleUser);
// router.get("/customer/src/byId/:id", userControllers.showSingleCustomer);
// router.get("/customer/src", userControllers.showAllCustomers);
// router.get("/customer/src/all", userControllers.showAllCustomersIdeal);
// router.get("/seller/src/byId/:id", userControllers.showSingleSeller);
// router.get("/seller/src", userControllers.showAllSellers);
// router.get("/seller/src/all", userController.showAllSellersIdeal);
// router.get("/del/:id", userControllers.removeSingleUser);
// router.post("/upt/:id", userControllers.userInfoUpdate);
// router.post("/password/upt/:id", userControllers.updateUserPasswordController);

module.exports = router;
