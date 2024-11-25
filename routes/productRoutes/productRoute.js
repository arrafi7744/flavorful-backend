const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController/productController");
const multerMiddleware = require("../../middleware/multer.middleware");
const { upload } = require("../../middleware/helper");

//Blank Commit//
router.post(
  "/crt",
  multerMiddleware.fields([{ name: "productThumb", maxCount: 8 },{name:"productsImg",maxCount:8}]),
  productController.createProductController
);

router.post('/multipleFiles', productController.multipleFileUpload )

router.get("/src", productController.getAllProductsControllers);
router.get("/src/all", productController.idealGetAllProds);
router.post("/src/byid", productController.showSingleProdController);
router.post("/src/all/recent", productController.showRecentProdController);
router.get(
  "/src/category/:id",
  productController.getAllCategorisedProductsControllers
);
router.get("/deleted/src", productController.getAllDeletedProductsControllers);
router.get("/del/:id", productController.productDeleteController);
router.get("/actv/:id", productController.productAcitvateController);
router.post("/upt/:id", productController.productUpdateController);
router.get("/src/popular/all");

router.post("/src/prd", productController.searchProductController);
router.post("/src/flt", productController.filterByPriceProductController);
router.get("/src/popular", productController.getAllPopularProductsControllers);
router.post("/src/all/byusrid", productController.showAllProdbyPidController);
router.get("/src/rev", productController.calculateAllProdRevenueController);
router.post(
  "/src/rev/byusr",
  productController.calculateAllProdRevenueBYUserIdController
);

module.exports = router;
