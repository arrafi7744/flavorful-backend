const Faq = require('../../models/faqModels/FaqModel');

// Create a new FAQ
exports.createFaq = async (req, res) => {
  try {
    const newFaq = new Faq({
      question: req.body.question,
      answer: req.body.answer,
      userId: req.body.userId,
    });
    const savedFaq = await newFaq.save();

    // Send the response to the client
    res.status(201).json({
      status: 201,
      error: false,
      message: 'FAQ Created Successfully',
      data: savedFaq,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      error: true,
      message: error.message,
      data: null,
    });
  }
};

// Get all FAQs
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json({
      status: 200,
      error: false,
      message: 'FAQs Retrieved Successfully',
      data: faqs,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: true,
      message: error.message,
      data: null,
    });
  }
};

// Get a single FAQ by ID
exports.getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({
        status: 404,
        error: true,
        message: 'FAQ Not Found',
        data: null,
      });
    }
    res.status(200).json({
      status: 200,
      error: false,
      message: 'FAQ Retrieved Successfully',
      data: faq,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: true,
      message: error.message,
      data: null,
    });
  }
};

// Update an FAQ by ID
exports.updateFaqById = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      { question: req.body.question, answer: req.body.answer },
      { new: true }
    );
    if (!faq) {
      return res.status(404).json({
        status: 404,
        error: true,
        message: 'FAQ Not Found',
        data: null,
      });
    }
    res.status(200).json({
      status: 200,
      error: false,
      message: 'FAQ Updated Successfully',
      data: faq,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      error: true,
      message: error.message,
      data: null,
    });
  }
};

// Delete an FAQ by ID
exports.deleteFaqById = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({
        status: 404,
        error: true,
        message: 'FAQ Not Found',
        data: null,
      });
    }
    res.status(200).json({
      status: 200,
      error: false,
      message: 'FAQ Deleted Successfully',
      data: faq,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: true,
      message: error.message,
      data: null,
    });
  }
};
