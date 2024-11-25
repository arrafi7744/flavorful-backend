const express = require('express');
const router = express.Router();
const faqController = require('../../controllers/faqController/FaqController');

// Route for creating a new FAQ
router.post('/crt', faqController.createFaq);

// Route for retrieving all FAQs
router.get('/src/all', faqController.getAllFaqs);

// Route for retrieving a single FAQ by ID
router.get('/src/:id', faqController.getFaqById);

// Route for updating an FAQ by ID
router.post('/src/updt/:id', faqController.updateFaqById);

// Route for deleting an FAQ by ID
router.delete('/src/dlt/:id', faqController.deleteFaqById);

module.exports = router;
