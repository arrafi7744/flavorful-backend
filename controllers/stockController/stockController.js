const {
  createStockService,
  showAllStockServices,
  showSingleStockService,
  updateStockService,
  stockIncreaseService,
  stockDecreaseService,
  showAllStockIdeal,
  deleteStockService,
  showAllStockOutServices,
} = require("../../core/services/stockServices/stockServices");

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
  async createStockController(req, res) {
    try {
      let response = await createStockService(req.body);
      return res.status(response.status).send(response);
      // console.log(req.body);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Create Stock Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllStockController(req, res) {
    try {
      let response = await showAllStockServices();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Show All Stock Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showSingleStockController(req, res) {
    try {
      // console.log(req.params);
      let response = await showSingleStockService(req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Show Single Stock Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showStockOutsController(req, res) {
    try {
      let response = await showAllStockOutServices();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Show Stock outs Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async updateStockController(req, res) {
    try {
      let response = await updateStockService(req.body, req.params.id);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = "Update Single Stock Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async increaseStockController(req, res) {
    try {
      let response = await stockIncreaseService(req.body, req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        "Increase Single Stock Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async decreaseStockController(req, res) {
    try {
      let response = await stockDecreaseService(req.body, req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        "Decrease Single Stock Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllStockIdealController(req, res) {
    try {
      let response = await showAllStockIdeal();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        "Show All Stock Ideal Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async deleteStockController(req, res) {
    try {
      let response = await deleteStockService(req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        "Decrease Single Stock Controller Internal Server Error";
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },
};
