const productModel = require("../../../models/productModels/productModels.js");
const discountModel = require("../../../models/discountModels/discountModels.js");

module.exports = {
  async createDiscountService(body, params) {
    try {
      let productId = params.id;
      let discountNumber = body.discountNumber;

      const checkProdExists = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });
      if (!checkProdExists) {
        return {
          status: 404,
          error: true,
          message: "Product Doesn't Exists",
          data: null,
        };
      }

      const checkProdExistInDiscount = await productModel.findOne({
        _id: productId,
        discount: { $gt: 0 },
        isDeleted: false,
      });
      if (checkProdExistInDiscount) {
        return {
          status: 400,
          error: true,
          message: "Already Applied discount to this product",
          data: null,
        };
      }

      const createProdDiscount = await productModel.findOneAndUpdate(
        {
          _id: productId,
        },
        { discount: discountNumber },
        { new: true }
      );

      if (createProdDiscount) {
        const getOldProdSellingPrice = await productModel.findOne({
          _id: productId,
          isDeleted: false,
        });
        if (getOldProdSellingPrice) {
          const oldPrice = getOldProdSellingPrice.sellingPrice;
          const percntDerive = discountNumber / 100;
          const discountAmnt = percntDerive * oldPrice;
          const finalAmnt = oldPrice - discountAmnt;

          const updateProductSellingPrice = await productModel.findOneAndUpdate(
            { _id: productId },
            {
              sellingPrice: finalAmnt.toFixed(2),
              discount: discountNumber,
            },
            { new: true }
          );
          if (updateProductSellingPrice) {
            return {
              status: 200,
              error: false,
              message: "Successfully Added the Discount",
              data: updateProductSellingPrice,
            };
          }
        }
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Create the Discount for this Product",
          data: null,
        };
      }
    } catch (error) {
      console.log("Create Discount Service Error", error);
      return {
        status: 400,
        error: true,
        data: null,
        message: "Failed On Create Discount Service",
      };
    }
  },

  async getSingleDiscountService(params) {
    try {
      const productId = params.id;
      const checkProductExists = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });
      if (!checkProductExists) {
        return {
          status: 400,
          error: true,
          message: "Product Doesn't Exist",
          data: null,
        };
      }

      const getDiscountedItem = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });
      if (getDiscountedItem.discount > 0) {
        return {
          status: 200,
          error: false,
          message: " Here is your discounted product",
          data: getDiscountedItem,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "This product has not discounted yet",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get Single Discount Service Error", error);
      return {
        status: 400,
        error: true,
        data: null,
        message: "Failed On Get Single Discount Service",
      };
    }
  },

  async getAllDiscountService() {
    try {
      const getAllDiscountedProducts = await productModel.find({
        isDeleted: false,
        discount: { $gt: 0 },
      });
      if (getAllDiscountedProducts) {
        return {
          status: 200,
          error: false,
          data: getAllDiscountedProducts,
          message: "Successfull",
        };
      } else {
        return {
          status: 200,
          error: false,
          data: null,
          message: "NO Discounted Products Found",
        };
      }
    } catch (error) {
      console.log("Get All Discount Service Error", error);
      return {
        status: 400,
        error: true,
        data: null,
        message: "Failed On Get All Discount Service",
      };
    }
  },

  async updateDiscountService(body, params) {
    try {
      const productId = params.id;
      const updatedDiscountNumber = body.updatedDiscountNumber;

      const checkProductsOldSellingPrice = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });
      if (checkProductsOldSellingPrice) {

        const oldSellingProductPrice = checkProductsOldSellingPrice?.sellingPrice;
        const discntAmnt = (((checkProductsOldSellingPrice.discount)/100)*oldSellingProductPrice);
        const removeDscnt = discntAmnt + oldSellingProductPrice;

        const updateDiscountedAmountCalc = (updatedDiscountNumber/100)*removeDscnt;
        const updatedSellingPrice = removeDscnt + updateDiscountedAmountCalc;


        const updateDiscountModel = await productModel.findOneAndUpdate(
          { _id: productId },
          {
            discount: updatedDiscountNumber,
            sellingPrice: updatedSellingPrice,
          },
          { new: true }
        );

        if (updateDiscountModel) {
          return {
            status: 200,
            error: false,
            data: updateDiscountModel,
            message: "SUccessfull",
          };
        } else {
          return {
            status: 400,
            error: true,
            data: null,
            message: "Failed to update discounted Price",
          };
        }
      } else {
        return {
          status: 404,
          error: true,
          message: "Product Doesn't Exist",
          data: null,
        };
      }
    } catch (error) {
      console.log("Update Discount Service Error", error);
      return {
        status: 400,
        error: true,
        data: null,
        message: "Failed On Update Discount Service",
      };
    }
  },

  async removeDiscountService(params) {
    try {
      const productId = params.id;

      const checkProdExists = await productModel.findOne({_id: productId, isDeleted: false});
      if(checkProdExists){
        const oldSellingPrice= checkProdExists.sellingPrice;
        const oldDiscount = checkProdExists.discount;
        const calcDiscount = 1 - (oldDiscount/100);


        const removeDiscountFromProd = oldSellingPrice / calcDiscount;


        const removeDscnt = await productModel.findOneAndUpdate(
          { _id: productId, isDeleted: false },
          {
            discount: 0,
            sellingPrice: removeDiscountFromProd,
          },
          { new: true }
        );
  
        if (removeDscnt) {
          return {
            status: 200,
            error: false,
            message: "Successfully removed the discount",
            data: removeDscnt,
          };
        } else {
          return {
            status: 400,
            error: true,
            message: "Failed to Remove the Discount",
            data: null,
          };
        }

      }else{
        return {
          status: 404,
          error: true,
          message: "product doesn't exists",
          data:null,
        }
      }

    } catch (error) {
      console.log("Remove Discount Service Error", error);
      return {
        status: 400,
        error: true,
        data: null,
        message: "Failed On Remove Discount Service",
      };
    }
  },
};
