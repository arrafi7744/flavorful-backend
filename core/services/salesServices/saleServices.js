const salesModel = require("../../../models/salesModels/salesModels");
const productsModel = require("../../../models/productModels/productModels");
const stockModel = require("../../../models/stockModels/stockModel");
const stockServices = require("../stockServices/stockServices");
const productModels = require("../../../models/productModels/productModels");

module.exports = {
  async createSaleServices(data) {
    try {
      let { prodId, qtySold, discount, sellingPrice } = data;

      if (!prodId) {
        return {
          status: 404,
          error: true,
          message: "Product Id field missing",
          data: null,
        };
      }

      if (!qtySold) {
        return {
          status: 404,
          error: true,
          message: "Quantity Sold field missing",
          data: null,
        };
      }

      let findProdDetails = await productsModel.findOne({
        _id: prodId,
        isDeleted: false,
      });

      if (!findProdDetails) {
        return {
          status: 404,
          error: true,
          message: "Product Not Found",
          data: null,
        };
      }

      let findStockDetails = await stockModel.findOne({
        productId: prodId,
        isDeleted: false,
      });
      if (!findStockDetails) {
        return {
          status: 404,
          error: true,
          message: "Stock Not Found",
          data: null,
        };
      }

      if (findStockDetails.stockQTY <= 0) {
        return {
          status: 409,
          error: true,
          message: "Insufficient Stock Amount",
          data: null,
        };
      }

      if (qtySold > findStockDetails.stockQTY) {
        return {
          status: 409,
          error: true,
          message: "Insufficient Stock Amount",
          data: null,
        };
      }
      
      let sellingPrices = 0;
      if(data.sellingPrice >0){
        sellingPrices = data.sellingPrice;
      }else{
        sellingPrices = findProdDetails?.sellingPrice;
      };

      // Calculating Discount and Final Price//
      let discountedAmount = discount / 100;
      let discountedPrice = discountedAmount * sellingPrices;
      let finalPrice = sellingPrices - discountedPrice;

      let buyingP = findProdDetails.buyingPrice;
      let totalInvest = buyingP * qtySold;
      let totalGet = finalPrice * qtySold;
      let totalProfit = 0;
      let totalLoss = 0;

      if (buyingP < 0 || sellingPrices < 0 || discount < 0) {
        return {
          status: 409,
          error: true,
          message: "Buying, Selling Price or discount cannot be below 0",
          data: null,
        };
      }

      //Calculating Profit or Loss//
      if (totalInvest > totalGet) {
        totalLoss = totalInvest - totalGet;
        totalProfit = 0;
      } else {
        totalProfit = totalGet - totalInvest;
        totalLoss = 0;
      }

      const createSales = await salesModel.create({
        productId: prodId,
        buyingPrice: buyingP,
        sellingPrice: sellingPrices,
        finalPrice: finalPrice,
        profit: totalProfit,
        loss: totalLoss,
        qtySold: qtySold,
        discount: discount || 0,
      });

      if (createSales) {
        let stockDeduct = findStockDetails.stockQTY - qtySold;
        let stockUpdate = await stockServices.updateStockService(
          stockDeduct,
          createSales.productId
        );

        if (createSales && stockUpdate.error === false) {
          return {
            status: 200,
            error: false,
            message: "Successfully Created Sales and Updated Stock",
            data: { createSales, stockUpdate },
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Update Stock",
            data: null,
          };
        }
      } else {
        return {
          status: 409,
          error: true,
          message: "Failed to Generate Sales",
          data: null,
        };
      }
    } catch (error) {
      console.log("Create Sales Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Create Sales Service Error",
        data: error,
      };
    }
  },

  async showSaleServices() {
    try {
      const salesDetails = await salesModel.find({ isDeleted: false });
      if (salesDetails.length > 0) {
        return {
          status: 200,
          error: false,
          message: "List of Sales: ",
          data: salesDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Sales Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Sales Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Sales Service Error",
        data: error,
      };
    }
  },

  async showAllSaleServices() {
    try {
      const salesDetails = await salesModel.find();
      if (salesDetails.length > 0) {
        return {
          status: 200,
          error: false,
          message: "List of All Sales: ",
          data: salesDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Sales not Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Sales Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Sales Service Error",
        data: error,
      };
    }
  },

  async updatSaleServices(data, params) {
    try {
      const salesId = params.id;
      const existSale = await salesModel.findOne({
        _id: salesId,
        isDeleted: false,
      });
      if (!existSale) {
        return {
          status: 404,
          error: true,
          message: "Sales Not Found",
          data: null,
        };
      }

      if (data.buyingPrice) {
        let updateBuyingPrice = await salesModel.findOneAndUpdate(
          { _id: salesId, isDeleted: false },
          { buyingPrice: data.buyingPrice },
          { new: true }
        );
        if (updateBuyingPrice) {
          let finalPrice = 0;
          if (updateBuyingPrice.discount > 0) {
            let discountNumber = updateBuyingPrice.discount / 100;
            let finalDiscount = discountNumber * updateBuyingPrice.sellingPrice;
            finalPrice = updateBuyingPrice.sellingPrice - finalDiscount;

            let updateFinalPrice = await salesModel.findOneAndUpdate(
              { _id: salesId, isDeleted: false },
              { finalPrice: finalPrice },
              { new: true }
            );
          }

          let newSalesDetails = await salesModel.findOne({
            _id: salesId,
            isDeleted: false,
          });

          let totalProfit = 0;
          let totalLoss = 0;
          let totalInvest =
            newSalesDetails.buyingPrice * newSalesDetails.qtySold;
          let totalGet = newSalesDetails.finalPrice * newSalesDetails.qtySold;
          if (totalInvest > totalGet) {
            totalLoss = totalInvest - totalGet;
            totalProfit = 0;

            let updateSalesData = await salesModel.findOneAndUpdate(
              { _id: salesId, isDeleted: false },
              { loss: totalLoss, profit: totalProfit },
              { new: true }
            );
            if (updateSalesData) {
              return {
                status: 200,
                error: false,
                message:
                  "Successfully Updated the Loss according to Buying Price",
                data: updateSalesData,
              };
            } else {
              return {
                status: 409,
                error: true,
                message: "Failed to update the Loss according to Buying Price",
                data: null,
              };
            }
          } else {
            totalProfit = totalGet - totalInvest;
            totalLoss = 0;
            let updateSalesData = await salesModel.findOneAndUpdate(
              { _id: salesId, isDeleted: false },
              { profit: totalProfit, loss: totalLoss },
              { new: true }
            );
            return {
              status: 200,
              error: false,
              message:
                "Successfully Updated the Buying Price and Profit Calculated",
              data: { updateBuyingPrice, updateSalesData },
            };
          }
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to update the Buying Price",
            data: null,
          };
        }
      }

      if (data.sellingPrice) {
        let updateSellingPrice = await salesModel.findOneAndUpdate(
          { _id: salesId, isDeleted: false },
          { sellingPrice: data.sellingPrice, finalPrice: data.sellingPrice },
          { new: true }
        );
        if (updateSellingPrice) {
          let finalPrice = 0;
          if (updateSellingPrice.discount > 0) {
            let discountNumber = updateSellingPrice.discount / 100;
            let finalDiscount =
              discountNumber * updateSellingPrice.sellingPrice;
            finalPrice = updateSellingPrice.sellingPrice - finalDiscount;

            let updateFinalPrice = await salesModel.findOneAndUpdate(
              { _id: salesId, isDeleted: false },
              { finalPrice: finalPrice },
              { new: true }
            );
          }

          let newSalesDetails = await salesModel.findOne({
            _id: salesId,
            isDeleted: false,
          });

          let totalProfit = 0;
          let totalLoss = 0;
          let totalInvest =
            newSalesDetails.buyingPrice * newSalesDetails.qtySold;
          let totalGet = newSalesDetails.finalPrice * newSalesDetails.qtySold;
          if (totalInvest > totalGet) {
            totalLoss = totalInvest - totalGet;
            totalProfit = 0;

            let updateSalesData = await salesModel.findOneAndUpdate(
              { _id: salesId },
              { loss: totalLoss, profit: totalProfit },
              { new: true }
            );
            if (updateSalesData) {
              return {
                status: 200,
                error: false,
                message:
                  "Successfully Updated the Loss according to Selling Price",
                data: updateSalesData,
              };
            } else {
              return {
                status: 409,
                error: true,
                message: "Failed to update the Loss according to Selling Price",
                data: null,
              };
            }
          } else if (totalGet > totalInvest) {
            totalProfit = totalGet - totalInvest;
            totalLoss = 0;
            let updateSalesData = await salesModel.findOneAndUpdate(
              { _id: salesId },
              { profit: totalProfit, loss: totalLoss },
              { new: true }
            );
            return {
              status: 200,
              error: false,
              message:
                "Successfully Updated the Selling Price and Calculated Profit according to Selling Price",
              data: { updateSellingPrice, updateSalesData },
            };
          } else if (totalInvest === totalGet) {
            let updateSalesData = await salesModel.findOneAndUpdate(
              { _id: salesId },
              { profit: 0, loss: 0 },
              { new: true }
            );
            return {
              status: 200,
              error: false,
              message:
                "Successfully Updated the Selling Price and Calculated Profit according to Selling Price",
              data: { updateSellingPrice, updateSalesData },
            };
          }
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to update the Selling Price",
            data: null,
          };
        }
      }

      if (data.qtySold) {
        let salesDetails = await salesModel.findOne({
          _id: salesId,
          isDeleted: false,
        });

        let productId = salesDetails.productId;

        let checkStocks = await stockModel.findOne({
          productId: productId,
          isDeleted: false,
        });

        let stockRemaining = checkStocks.stockQTY;
        if(data.qtySold > stockRemaining){
          return{
            status: 409,
            error: true,
            message: "Insufficient Stock",
            data: null,
          }
        }

        let updateQtySold = await salesModel.findOneAndUpdate(
          { _id: salesId },
          { qtySold: data.qtySold },
          { new: true }
        );
        if (updateQtySold) {
          let finalPrice = 0;
          if (updateQtySold.discount > 0) {
            let discountNumber = updateQtySold.discount / 100;
            let finalDiscount = discountNumber * updateQtySold.sellingPrice;
            finalPrice = updateQtySold.sellingPrice - finalDiscount;

            let updateFinalPrice = await salesModel.findOneAndUpdate(
              { _id: salesId, isDeleted: false },
              { finalPrice: finalPrice },
              { new: true }
            );
          }

          let newSalesDetails = await salesModel.findOne({
            _id: salesId,
            isDeleted: false,
          });

          let totalProfit = 0;
          let totalLoss = 0;
          let totalInvest =
            newSalesDetails.buyingPrice * newSalesDetails.qtySold;
          let totalGet = newSalesDetails.finalPrice * newSalesDetails.qtySold;
          if (totalInvest > totalGet) {
            totalLoss = totalInvest - totalGet;
            totalProfit = 0;

            let updateSalesData = await salesModel.findOneAndUpdate(
              { _id: salesId },
              { loss: totalLoss, profit: totalProfit },
              { new: true }
            );
            if (updateSalesData) {
              return {
                status: 200,
                error: false,
                message:
                  "Successfully Updated the Loss according to Updated Stock QTY",
                data: updateSalesData,
              };
            } else {
              return {
                status: 409,
                error: true,
                message:
                  "Failed to update the Loss according to updated Stock QTY",
                data: null,
              };
            }
          } else if (totalGet > totalInvest) {
            totalProfit = totalGet - totalInvest;
            totalLoss = 0;
            let updateSalesData = await salesModel.findOneAndUpdate(
              { _id: salesId },
              { profit: totalProfit, loss: totalLoss },
              { new: true }
            );
            return {
              status: 200,
              error: false,
              message:
                "Successfully Updated the Selling Price and Calculated Profit according to updated Stock QTY",
              data: { updateSellingPrice, updateSalesData },
            };
          } else if (totalInvest === totalGet) {
            let updateSalesData = await salesModel.findOneAndUpdate(
              { _id: salesId },
              { profit: 0, loss: 0 },
              { new: true }
            );
            return {
              status: 200,
              error: false,
              message:
                "Successfully Updated the Selling Price and Calculated Profit according to updated Stock QTY",
              data: { updateSellingPrice, updateSalesData },
            };
          }
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to update the stock QUANTITY",
            data: null,
            soc,
          };
        }
      }
      if (data.discount) {
        let updateDiscount = await salesModel.findOneAndUpdate(
          { _id: salesId },
          { discount: data.discount },
          { new: true }
        );
        if (updateDiscount) {
          let finalPrice = 0;
          if (updateDiscount.discount > 0) {
            let discountNumber = updateDiscount.discount / 100;
            let finalDiscount = discountNumber * updateDiscount.sellingPrice;
            finalPrice = updateDiscount.sellingPrice - finalDiscount;

            let updateFinalPrice = await salesModel.findOneAndUpdate(
              { _id: salesId, isDeleted: false },
              { finalPrice: finalPrice },
              { new: true }
            );
          }

          let newSalesDetails = await salesModel.findOne({
            _id: salesId,
            isDeleted: false,
          });

          let totalProfit = 0;
          let totalLoss = 0;
          let totalInvest =
            newSalesDetails.buyingPrice * newSalesDetails.qtySold;
          let totalGet = newSalesDetails.finalPrice * newSalesDetails.qtySold;

          if (totalInvest > totalGet) {
            totalLoss = totalInvest - totalGet;
            totalProfit = 0;

            let updateSalesData = await salesModel.findOneAndUpdate(
              { _id: salesId },
              { loss: totalLoss, profit: totalProfit },
              { new: true }
            );

            if (updateSalesData) {
              return {
                status: 200,
                error: false,
                message:
                  "Successfully Updated the Loss according to the DIscount",
                data: updateSalesData,
              };
            } else {
              return {
                status: 409,
                error: true,
                message: "Failed to update the Loss according to the Discount",
                data: null,
              };
            }
          } else if (totalGet > totalInvest) {
            totalProfit = totalGet - totalInvest;
            totalLoss = 0;

            let updateSalesData = await salesModel.findOneAndUpdate(
              { _id: salesId },
              { profit: totalProfit, loss: totalLoss },
              { new: true }
            );

            if (updateSalesData) {
              return {
                status: 200,
                error: false,
                message:
                  "Successfully Updated the Discount and Calculated Profit according to Discount",
                data: { updateDiscount, updateSalesData },
              };
            } else if (totalInvest === totalGet) {
              let updateSalesData = await salesModel.findOneAndUpdate(
                { _id: salesId },
                { profit: 0, loss: 0 },
                { new: true }
              );
              return {
                status: 200,
                error: false,
                message:
                  "Successfully Updated the Discount and Calculated Profit or Loss according to the Discount",
                data: { updateDiscount, updateSalesData },
              };
            }
          }
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to update the Discount",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log("Update Sales Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Update Sales Service Error",
        data: error,
      };
    }
  },

  async showSingleSaleServices(params) {
    try {
      const salesId = params.id;
      const salesDetails = await salesModel.findOne({ _id: salesId });
      if (salesDetails) {
        return {
          status: 200,
          error: false,
          message: "Here is the Single Sale Data",
          data: salesDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to Load the Single Sale Data",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Single Sale Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Single Sale Service Error",
        data: error,
      };
    }
  },

  async removeSaleServices(params) {
    try {
      const salesId = params.id;
      const existSales = await salesModel.findOne({ _id: salesId });
      if (!existSales) {
        return {
          status: 404,
          error: true,
          message: "Sales not Found",
          data: null,
        };
      }

      let removeSales = await salesModel.findOneAndUpdate(
        { _id: salesId },
        { isDeleted: true, isActive: false },
        { new: true }
      );

      if (!removeSales) {
        return {
          status: 409,
          error: true,
          message: "Failed to remove Sales",
          data: null,
        };
      } else {
        return {
          status: 200,
          error: false,
          message: "Successfully Removed Sales",
          data: removeSales,
        };
      }
    } catch (error) {
      console.log("Remove Sales Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Remove Sales Service Error",
        data: error,
      };
    }
  },
};
