const productServices = require('../../core/services/productServices/productServices');
const statusCode = require('../../core/status/statusCode');
const { multi_upload } = require('../../middleware/productMulter.middleware');
const productModels = require('../../models/productModels/productModels');

const getAllProductsControllers = async (req, res) => {
  try {
    let response = await productServices.getAllProductSrvc();
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Get All Products Controller Failed',
      data: error,
    });
  }
};

const getAllPopularProductsControllers = async (req, res) => {
  try {
    let response = await productServices.getAllPopularProductSrvc();
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Get All Popular Products Controller Failed',
      data: error,
    });
  }
};

const getAllCategorisedProductsControllers = async (req, res) => {
  try {
    let response = await productServices.getAllCategorisedProductSrvc(
      req.params
    );
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Get All Categorised Products Controller Failed',
      data: error,
    });
  }
};

const getAllDeletedProductsControllers = async (req, res) => {
  try {
    let response = await productServices.getAllDeletedProductSrvc();
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Get All Deleted Products Controller Failed',
      data: error,
    });
  }
};

const createProductController = async (req, res) => {
  try {
    let response = await productServices.createProductSrvc(req);
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Get All Products Controller Failed',
      data: error,
    });
  }
};

const multipleFileUpload = async (req, res) => {
  multi_upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
          return;
      } else if (err) {
          // An unknown error occurred when uploading.
          if (err.name == 'ExtensionError') {
              res.status(413).send({ error: { message: err.message } }).end();
          } else {
              res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
          }
          return;
      }

      // Everything went fine.
      // show file `req.files`
      // show body `req.body`
      res.status(200).end('Your files uploaded.');
  })
}

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const dm = decimal || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index]
  );
};

const searchProductController = async (req, res) => {
  try {
    let response = await productServices.searchProducts(req.body);
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Product Search Controller Failed',
      data: error,
    });
  }
};

const filterByPriceProductController = async (req, res) => {
  try {
    let response = await productServices.filterProductPrice(req.body);
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Product Filter Controller Failed',
      data: error,
    });
  }
};

const idealGetAllProds = async (req, res) => {
  try {
    let response = await productServices.getAllProductsIdealService();
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Ideal: Get All Products Controller Failed',
      data: error,
    });
  }
};

const showAllProdbyPidController = async (req, res) => {
  try {
    let response = await productServices.fetchAllProductsByPdId(req.body);
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Show All Products by userid Controller Failed',
      data: error,
    });
  }
};

const calculateAllProdRevenueController = async (req, res) => {
  try {
    let response = await productServices.calculateTotalRevenue();
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Calculate product revenue Controller Failed',
      data: error,
    });
  }
};

const calculateAllProdRevenueBYUserIdController = async (req, res) => {
  try {
    let response = await productServices.calculateTotalRevenueByUserId(
      req.body
    );
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Calculate product revenue Controller Failed',
      data: error,
    });
  }
};

const showSingleProdController = async (req, res) => {
  try {
    let response = await productServices.showSingleProductService(req.body);
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Show Single Products Controller Failed',
      data: error,
    });
  }
};

const showRecentProdController = async (req, res) => {
  try {
    let response = await productServices.showRecentProductsById(req.body);
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Recent Products Controller Failed',
      data: error,
    });
  }
};

const productDeleteController = async (req, res) => {
  try {
    let response = await productServices.deleteProductService(req.params);
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Delete Single Products Controller Failed',
      data: error,
    });
  }
};

const productAcitvateController = async (req, res) => {
  try {
    let response = await productServices.activateProductService(req.params);
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Activate Single Products Controller Failed',
      data: error,
    });
  }
};

const productUpdateController = async (req, res) => {
  try {
    let response = await productServices.updateProductInfoService(
      req.body,
      req.params
    );
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Update Single Product Controller Failed',
      data: error,
    });
  }
};

//Filter By Highest Product prices//
const popularProductController = async (req, res) => {
  try {
    let response = await productServices.getPopularProducts();
    return res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    return res.send({
      status: statusCode.internalServerError,
      error: true,
      message: 'Popular Products Controller Failed',
      data: error,
    });
  }
};

module.exports = {
  getAllProductsControllers,
  getAllPopularProductsControllers,
  createProductController,
  idealGetAllProds,
  showSingleProdController,
  popularProductController,
  productDeleteController,
  productAcitvateController,
  productUpdateController,
  getAllDeletedProductsControllers,
  getAllCategorisedProductsControllers,
  searchProductController,
  filterByPriceProductController,
  showAllProdbyPidController,
  calculateAllProdRevenueController,
  calculateAllProdRevenueBYUserIdController,
  showRecentProdController,
  multipleFileUpload,
  fileSizeFormatter
};
