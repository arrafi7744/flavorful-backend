const express = require('express');
const router = express.Router();
const ratingController = require("../../controllers/ratingController/ratingController");



router.post("/crt", ratingController.createRatingController);
router.post("/upt/byId/:id", ratingController.updateRatingController);
router.get("/src", ratingController.showRatingsController);
router.get("/src/byId/:id", ratingController.showSingleRatingController);
router.get("/src/all", ratingController.showRatingsAllController);
router.get("/del/byId/:id", ratingController.deleteSingleRatingController);



module.exports = router;