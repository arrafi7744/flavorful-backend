const stockModel = require ("../../../../models/stockModels/stockModel");
const productModel = require ("../../../../models/productModels/productModels");

module.exports = {
    async stockDecreaseService(data, params) {
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
}