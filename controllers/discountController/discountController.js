const statusCode = require("../../core/status/statusCode.js");
const discountServices = require ("../../core/services/discountServices/discountServices.js");

const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  async createDiscountController(req, res) {
    try {
      let response = await discountServices.createDiscountService(req.body, req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.log("Create Discount Controller Error", error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Discount Creation Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async getSingleDiscountController(req, res) {
    try {
      let response = await discountServices.getSingleDiscountService(req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.log("Create Single Discount Controller Error", error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Single DIscount Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async getAllDiscountsController(req, res) {
    try {
      let response = await discountServices.getAllDiscountService();
      return res.status(response.status).send(response);
    } catch (error) {
      console.log("Get All Discounts Controller Error", error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Discount Creation Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async updateDiscountController(req, res) {
    try {
      let response = await discountServices.updateDiscountService(req.body, req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.log("Update Discount Controller Error", error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Discount Update Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async removeDiscountController(req, res) {
    try {
      let response = await discountServices.removeDiscountService(req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.log("Remove Discount Controller Error", error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Discount Remove Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },
};
