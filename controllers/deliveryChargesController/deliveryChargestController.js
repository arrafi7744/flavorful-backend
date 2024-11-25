const deliveryChargesServices = require("../../core/services/deliveryChargesServices/deliveryChargesServices.js");
const statusCode = require ("../../core/status/statusCode.js");

const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  async createDeliveryChargesController(req, res) {
    try {
        let response = await deliveryChargesServices.createDeliveryChargesServices(req.body);
        return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Create Delivery Charges Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async getAllDeliveryChargesController(req, res) {
    try {
        let response = await deliveryChargesServices.getAllDeliveryChargesServices();
        return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get All Delivery Charges Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async getSingleDeliveryChargesController(req, res) {
    try {
        let response = await deliveryChargesServices.getSingleDeliveryChargesServices(req.params);
        return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Single Delivery Charges Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async removeSingleDeliveryChargesController(req, res) {
    try {
        let response = await deliveryChargesServices.deleteSingleDeliveryChargesServices(req.params);
        return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Remove Single Delivery Charges Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },
};
