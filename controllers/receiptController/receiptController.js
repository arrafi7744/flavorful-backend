const receiptServices = require("../../core/services/receiptServices/receiptServices");
const statusCode = require("../../core/status/statusCode");

const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  async showAllReceiptsController(req, res) {
    try {
      let response = await receiptServices.showAllReceiptsServices();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Show All Receipts Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllReceiptIdealController(req, res) {
    try {
      let response = await receiptServices.showAllReceiptsIdealServices();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Show All Ideal Receipts Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllReceiptsByUserIdController (req, res){
    try{
      let response = await receiptServices.getAllReceiptsByUser(req.params);
      return res.status(response.status).send(response);
    }catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Create Receipts Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async createReceiptController(req, res) {
    try {
      const response = await receiptServices.createReceiptsServices(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Create Receipts Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },
};


