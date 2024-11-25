const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/contactController/contactController");

// Route for creating a new Contact
router.post("/crt", contactController.crtContactController);

// Route for retrieving all Contact
router.get("/src/all", contactController.getAllContactController);

module.exports = router;
