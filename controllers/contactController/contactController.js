const statusCode = require("../../core/status/statusCode");
const contactServices = require("../../core/services/contactServices/contactServices");

const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  async crtContactController(req, res) {
    try {
      let response = await contactServices.createContactServices(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.log(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Create Contact Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async getAllContactController(req, res) {
    try {
      let response = await contactServices.getAllContactServices();
      return res.status(response.status).send(response);
    } catch (error) {
      console.log(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Get Contact Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },
};
