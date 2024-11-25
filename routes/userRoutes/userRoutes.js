const express = require('express');
const router = express.Router();
const multerMiddleware = require('../../middleware/multer.middleware.js');
const userControllers = require('../../controllers/userController/userController.js');
const userController = require('../../controllers/userController/userController.js');

router.post(
  '/crt',
  multerMiddleware.single('userImg'),
  userController.createUserController
);
router.post('/crt/bygl', userController.googleUserController);
router.post('/crt/usr/info', userController.crtUserInfoController);
router.post('/crt/admin/info', userController.crtAdminInfoController);
router.post('/usr/accpt', userController.adminApproveUserController);
router.post('/usr/rjct', userController.adminRejectUserController);
router.post('/login', userController.loginUserController);
router.get('/src', userController.showAllUsers);
router.get('/src/all', userControllers.showAllUsersIdeal);
router.get('/src/all/vendors', userController.showAllVendorUsers);
router.get('/src/all/buyers', userController.showAllBUyerUsers);
router.get('/src/byId/:id', userControllers.showSingleUser);
router.get('/customer/src/byId/:id', userControllers.showSingleCustomer);
router.get('/customer/src', userControllers.showAllCustomers);
router.get('/customer/src/all', userControllers.showAllCustomersIdeal);
router.get('/seller/src/byId/:id', userControllers.showSingleSeller);
router.get('/seller/src', userControllers.showAllSellers);
router.get('/seller/src/all', userController.showAllSellersIdeal);
router.get('/del/:id', userControllers.removeSingleUser);
router.get('/actv/:id', userControllers.activateSingleUser);

router.post('/upt/:id', userControllers.userInfoUpdate);
router.post('/password/upt/:id', userControllers.updateUserPasswordController);

module.exports = router;
