const statusCode = require("../../core/status/statusCode");
const taxServices = require("../../core/services/taxServices/taxServices");

const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  async crtTaxController(req, res) {
    try {
      let response = await taxServices.createTaxServices(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.log(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Create Tax Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async getTaxController(req, res) {
    try {
      let response = await taxServices.getTaxServices();
      return res.status(response.status).send(response);
    } catch (error) {
      console.log(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Tax Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async removeTaxController(req, res) {
    try {
      let response = await taxServices.removeTaxServices(req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.log(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Remove Tax Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },
};
