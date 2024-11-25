const { createSaleServices, showSaleServices, showAllSaleServices, updatSaleServices, showSingleSaleServices, removeSaleServices } = require("../../core/services/salesServices/saleServices");
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
    async createSalesController(req, res) {
      try {
        let response = await createSaleServices(req.body);
        return res.status(response.status).send(response);
      } catch (error) {
        console.error(error);
        const newError = createErrorMessage();
        newError.data = error;
        newError.message = "Sales Creation Controller Error";
        newError.status = statusCode.internalServerError;
        newError.error = true;
        return res.status(newError.status).json(newError);
      }
    },

    async showSalesController(req, res) {
        try {
          // console.log("Hit Sales Console");
          let response = await showSaleServices();
          return res.status(response.status).send(response);
        } catch (error) {
          console.error(error);
          const newError = createErrorMessage();
          newError.data = error;
          newError.message = "Show Sales Controller Error";
          newError.status = statusCode.internalServerError;
          newError.error = true;
          return res.status(newError.status).json(newError);
        }
      },

      async showAllSalesController(req, res) {
        try {
          let response = await showAllSaleServices();
          return res.status(response.status).send(response);
        } catch (error) {
          console.error(error);
          const newError = createErrorMessage();
          newError.data = error;
          newError.message = "Show All Sales Controller Error";
          newError.status = statusCode.internalServerError;
          newError.error = true;
          return res.status(newError.status).json(newError);
        }
      },

      async showSingleSaleController(req, res) {
        try {
          let response = await showSingleSaleServices(req.params);
          return res.status(response.status).send(response);
        } catch (error) {
          console.error(error);
          const newError = createErrorMessage();
          newError.data = error;
          newError.message = "Show Single Sale Controller Error";
          newError.status = statusCode.internalServerError;
          newError.error = true;
          return res.status(newError.status).json(newError);
        }
      },


      async updateSingleSaleController(req, res) {
        try {
          let response = await updatSaleServices(req.body, req.params);
          return res.status(response.status).send(response);
        } catch (error) {
          console.error(error);
          const newError = createErrorMessage();
          newError.data = error;
          newError.message = "Update Single Sale Controller Error";
          newError.status = statusCode.internalServerError;
          newError.error = true;
          return res.status(newError.status).json(newError);
        }
      },

      async removeSingleSaleController(req, res) {
        try {
          let response = await removeSaleServices(req.params);
          return res.status(response.status).send(response);
        } catch (error) {
          console.error(error);
          const newError = createErrorMessage();
          newError.data = error;
          newError.message = "Remove Single Sale Controller Error";
          newError.status = statusCode.internalServerError;
          newError.error = true;
          return res.status(newError.status).json(newError);
        }
      },
  };

