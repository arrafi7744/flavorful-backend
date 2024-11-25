const express = require('express');
const router = express.Router();
const categoryController = require ("../../controllers/categoryController/categoryController");

router.post("/crt", categoryController.createCategoryController);
router.post("/sub/crt", categoryController.createSubCategoryController);
router.post("/del/byId/:id", categoryController.deleteCategoryController);
router.post("sub/del/byId/:id", categoryController.deleteSubCategoryController);
router.get("/sub/src", categoryController.showAllSubCategoryController);
router.get("/sub/src/byId/:id", categoryController.showSingleSubCategoryController);
router.get("/src", categoryController.showAllCategoryController);
router.get("/src/:id", categoryController.showSingleCategoryController);


module.exports = router;

