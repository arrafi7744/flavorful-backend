const {
  createShopService,
  showAllShopService,
  getProductsByShopIdService,
  showAllShopByIdService,
} = require('../../core/services/shopServices/shopServices');

const statusCode = require('../../core/status/statusCode');

const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  async createShopController(req, res) {
    try {
      let response = await createShopService(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'Create Shop Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllShopController(req, res) {
    try {
      let response = await showAllShopService();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'Show All Shop Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllProductByShopIdController(req, res) {
    try {
      let response = await getProductsByShopIdService(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        'Show All Products by Shop Id Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllShopByUserIdController(req, res) {
    try {
      let response = await showAllShopByIdService(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        'Show All Products by Shop Id Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  //   async showSingleShopController(req, res) {
  //     try {
  //       let response = await showSingleCategoryService(req.body);
  //       return res.status(response.status).send(response);
  //     } catch (error) {
  //       console.error(error);
  //       const newError = createErrorMessage();
  //       newError.data = error;
  //       newError.message =
  //         'Show Single Category Controller Internal Server Error';
  //       newError.status = statusCode.internalServerError;
  //       newError.error = true;
  //       return res.status(newError.status).json(newError);
  //     }
  //   },

  //   async deleteSingleShopController(req, res) {
  //     try {
  //       let response = await deletingCategoryService(req.params);
  //       return res.status(response.status).send(response);
  //     } catch (error) {
  //       console.error(error);
  //       const newError = createErrorMessage();
  //       newError.data = error;
  //       newError.message = 'Delete Category Controller Internal Server Error';
  //       newError.status = statusCode.internalServerError;
  //       newError.error = true;
  //       return res.status(newError.status).json(newError);
  //     }
  //   },
};
