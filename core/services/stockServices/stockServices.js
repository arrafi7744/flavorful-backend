const stockModel = require("../../../models/stockModels/stockModel");
const productModel = require("../../../models/productModels/productModels");

module.exports = {
  async createStockService(data) {
    try {
      const qty = data.stockQuantity;
      const prodId = data.productId;
      const productExists = await productModel.findOne({
        _id: prodId,
        isDeleted: false,
      });
      if (productExists === null) {
        return {
          status: 404,
          error: true,
          message: "Product Don't Exists",
          data: null,
        };
      }
      const stockExists = await stockModel.findOne({
        productId: prodId,
        isDeleted: false,
      });
      if (stockExists !== null) {
        return {
          status: 409,
          error: true,
          message: "Stock Already Exists",
          data: null,
        };
      }
      const createStock = await stockModel.create({
        productId: prodId,
        stockQTY: qty,
      });

      if (createStock) {
        return {
          status: 200,
          error: false,
          message: "Stock Created",
          data: createStock,
        };
      }
    } catch (error) {
      console.log("Create Stock Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Create Stock Service Error",
        data: error,
      };
    }
  },

  async showAllStockServices() {
    try {
      const stockDetails = await stockModel.find({ isDeleted: false });
      if (stockDetails.length > 0) {
        return {
          status: 200,
          error: false,
          message: "Here are the List of all the Stocks",
          data: stockDetails,
        };
      }
      return {
        status: 404,
        error: true,
        message: "No Content Found on see all stock services",
        data: [],
      };
    } catch (error) {
      console.log("Show All Stock Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Stock Service Error",
        data: error,
      };
    }
  },

  async showAllStockOutServices() {
    try {
      const stockDetails = await stockModel.find({
        stockQTY: 0,
      });
      if (stockDetails.length > 0) {
        return {
          status: 200,
          error: false,
          message: "Here are the List of all the Stock Out Products",
          data: stockDetails,
        };
      }
      return {
        status: 404,
        error: true,
        message: "No Content Found on see all stock out services",
        data: [],
      };
    } catch (error) {
      console.log("Show All Stock Out Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Stock Out Service Error",
        data: error,
      };
    }
  },

  async showSingleStockService(data) {
    try {
      const prodId = data.id;
      // let pId = prodId.toString();
      const stockDetails = await stockModel.findOne({
        productId: prodId,
        isDeleted: false,
      });
      if (stockDetails) {
        return {
          status: 200,
          error: false,
          message: "Here is the Stock Details",
          data: stockDetails,
        };
      } else {
        return {
          status: 204,
          error: true,
          message: "No Content Found on see all stock services",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Single Stock Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Single Stock Service Error",
        data: error,
      };
    }
  },

  async updateStockService(data, params) {
    try {
      const uptQty = data;
      const prodId = params;

      const existsProduct = await productModel.findOne({
        _id: prodId,
        isDeleted: false,
      });
      if (existsProduct === null) {
        return {
          status: 404,
          error: true,
          message: "Product Not Found",
          data: null,
        };
      }

      const existStock = await stockModel.findOne({
        productId: prodId,
        isDeleted: false,
      });
      if (existStock === null) {
        return {
          status: 404,
          error: true,
          message: "Stock Not Found",
          data: null,
        };
      }

      const uptStock = await stockModel.findOneAndUpdate(
        { productId: prodId },
        { stockQTY: uptQty },
        { new: true }
      );
      if (uptStock) {
        return {
          status: 200,
          error: false,
          message: "Stock Updated",
          data: uptStock,
        };
      } else {
        return {
          status: 409,
          error: true,
          message: "Stock Failed to Update",
          data: null,
        };
      }
    } catch (error) {
      console.log("Update Single Stock Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Update Single Stock Service Error",
        data: error,
      };
    }
  },

  async stockIncreaseService(data, params) {
    try {
      const uptQty = data.increaseAmount;
      const prodId = params.id;

      const existsProduct = await productModel.findOne({
        _id: prodId,
        isDeleted: false,
      });
      if (existsProduct === null) {
        return {
          status: 404,
          error: true,
          message: "Product Not Found",
          data: null,
        };
      }

      const existStock = await stockModel.findOne({
        productId: prodId,
        isDeleted: false,
      });
      if (existStock === null) {
        return {
          status: 404,
          error: true,
          message: "Stock Not Found",
          data: null,
        };
      }

      const prevStockDetails = await stockModel.findOne({
        productId: prodId,
        isDeleted: false,
      });
      const prevQty = prevStockDetails.stockQTY;
      const increasedQty = prevQty + uptQty;

      const uptStock = await stockModel.findOneAndUpdate(
        { productId: prodId },
        { stockQTY: increasedQty },
        { new: true }
      );

      if (uptStock) {
        return {
          status: 200,
          error: false,
          message: "Stock Increased",
          data: uptStock,
        };
      } else {
        return {
          status: 409,
          error: true,
          message: "Stock Failed to Increase",
          data: null,
        };
      }
    } catch (error) {
      console.log("Increase Single Stock Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Increase Single Stock Service Error",
        data: error,
      };
    }
  },

  async stockDecreaseService(data, params) {
    try {
      const uptQty = data.decreaseAmount;
      const prodId = params.id;

      const existsProduct = await productModel.findOne({
        _id: prodId,
        isDeleted: false,
      });
      if (existsProduct === null) {
        return {
          status: 404,
          error: true,
          message: "Product Not Found",
          data: null,
        };
      }

      const existStock = await stockModel.findOne({
        productId: prodId,
        isDeleted: false,
      });
      if (existStock === null) {
        return {
          status: 404,
          error: true,
          message: "Stock Not Found",
          data: null,
        };
      }

      const prevStockDetails = await stockModel.findOne({
        productId: prodId,
        isDeleted: false,
      });
      const prevQty = prevStockDetails.stockQTY;
      const decreaseQty = prevQty - uptQty;

      if (decreaseQty < 0) {
        return {
          status: 409,
          error: true,
          message: "Stock Quantity cannot Go Below 0",
          data: null,
        };
      }

      const uptStock = await stockModel.findOneAndUpdate(
        { productId: prodId },
        { stockQTY: decreaseQty },
        { new: true }
      );

      if (uptStock) {
        return {
          status: 200,
          error: false,
          message: "Stock Decreased",
          data: uptStock,
        };
      } else {
        return {
          status: 409,
          error: true,
          message: "Stock Failed to Decrease",
          data: null,
        };
      }
    } catch (error) {
      console.log("Decrease Single Stock Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Decrease Single Stock Service Error",
        data: error,
      };
    }
  },

  async showAllStockIdeal() {
    try {
      const stockDetails = await stockModel.find();
      if (stockDetails === null) {
        return {
          status: 404,
          error: true,
          message: "Stock Not Found",
          data: null,
        };
      } else {
        return {
          status: 200,
          error: false,
          message: "List of All Stocks",
          data: stockDetails,
        };
      }
    } catch (error) {
      console.log("Show All Stock Ideal Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Stock Ideal Service Error",
        data: error,
      };
    }
  },

  async deleteStockService(params) {
    try {
      const stockId = params.id;

      const existStock = await stockModel.findOne({
        _id: stockId,
        isDeleted: false,
      });
      if (existStock === null) {
        return {
          status: 404,
          error: true,
          message: "Stock Not Found",
          data: null,
        };
      }

      const stockDelete = await stockModel.findOneAndUpdate(
        { _id: stockId },
        { isDeleted: true, isActive: false },
        { new: true }
      );
      if (stockDelete) {
        return {
          status: 200,
          error: false,
          message: "Stock Deleted",
          data: stockDelete,
        };
      } else {
        return {
          status: 409,
          error: true,
          message: "Stock Failed to Delete",
          data: null,
        };
      }
    } catch (error) {
      console.log("Delete Single Stock Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Delete Single Stock Service Error",
        data: error,
      };
    }
  },
};
