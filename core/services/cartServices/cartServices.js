const cartModel = require("../../../models/cartModels/cartModels");
const userModel = require("../../../models/userModels/userModels");
const productModel = require("../../../models/productModels/productModels");
const stockModel = require("../../../models/stockModels/stockModel");
const stockHelperServices = require("../../services/stockServices/sockServiceHelper/stockServiceHelper");

module.exports = {
  async insertCartService(data) {
    try {
      const { userId, productId, quantity } = data;

      const userDetails = await userModel.findOne({
        _id: userId,
        isDeleted: false,
      });
      const productDetails = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });
      const stockDetails = await stockModel.findOne({
        productId: productId,
        isDeleted: false,
      });

      if (!userDetails) {
        return {
          status: 404,
          error: true,
          message: "User Details Not Found",
          data: null,
        };
      }

      if (!productDetails) {
        return {
          status: 404,
          error: true,
          message: "Product Details Not Found",
          data: null,
        };
      }

      if (!stockDetails) {
        return {
          status: 404,
          error: true,
          message: "Stock Details Not Found",
          data: null,
        };
      }

      if (quantity > stockDetails.stockQTY) {
        return {
          status: 400,
          error: true,
          message: "Insufficient Stock",
          data: null,
        };
      }

      let finalP = productDetails.sellingPrice;
      let finalTotalPrice = finalP * quantity;

      // if (productDetails.discount > 0) {
      //   const discount = productDetails.discount / 100;
      //   const sellingPriceDscnt = discount * productDetails.sellingPrice;
      //   finalP = productDetails.sellingPrice - sellingPriceDscnt;
      //   finalTotalPrice = finalP * quantity;
      // }

      const existingCartItem = await cartModel.findOne({
        userId: userId,
        productId: productId,
        isDeleted: false,
      });

      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        existingCartItem.totalPrice += finalTotalPrice;

        await existingCartItem.save();

        let stockDecrease = await stockHelperServices.stockDecreaseService(
          quantity,
          productId
        );
        if (stockDecrease) {
          return {
            status: 200,
            error: false,
            message: "Updated Cart Item and Deducted the Stock",
            data: { existingCartItem, stockDecrease },
          };
        } else {
          return {
            status: 400,
            error: true,
            message: "Failed to Decrease Stock",
            data: null,
          };
        }
      } else {
        const insertCart = await cartModel.create({
          userId: userDetails._id,
          productId: productDetails._id,
          customerName: userDetails.userFullName,
          productName: productDetails.productName,
          productImage: productDetails.productThumb,
          productPrice: finalP,
          totalPrice: finalTotalPrice,
          quantity: quantity,
        });

        if (insertCart) {
          let stockDecrease = await stockHelperServices.stockDecreaseService(
            quantity,
            productDetails._id
          );
          if (stockDecrease) {
            return {
              status: 200,
              error: false,
              message: "Inserted Item in Cart and Deducted the Stock",
              data: { insertCart, stockDecrease },
            };
          } else {
            return {
              status: 400,
              error: true,
              message: "Failed to Decrease Stock",
              data: null,
            };
          }
        } else {
          return {
            status: 400,
            error: true,
            message: "Failed to Create Cart Item",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log("Create Cart Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Create Cart Service Error",
        data: error,
      };
    }
  },

  async showCartService() {
    try {
      let cartItems = await cartModel.find({ isDeleted: false });
      if (cartItems) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of all the Cart Items",
          data: cartItems,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Cart Items Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Cart Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Cart Service Error",
        data: error,
      };
    }
  },

  async showAllCartService() {
    try {
      let cartItems = await cartModel.find();
      if (cartItems) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of All Cart Items",
          data: cartItems,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Cart Items not Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Cart Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Cart Service Error",
        data: error,
      };
    }
  },

  async showUserCartService(params) {
    try {
      let cartItems = await cartModel.find({
        isDeleted: false,
        userId: params.id,
      });
      if (cartItems) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of All Cart Items",
          data: cartItems,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Cart Items not Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Cart Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Cart Service Error",
        data: error,
      };
    }
  },

  async showSingleCartService(params) {
    try {
      const cartId = params.id;
      let cartItems = await cartModel.findOne({
        _id: cartId,
        isDeleted: false,
      });
      if (cartItems) {
        return {
          status: 200,
          error: false,
          message: "Here is the Cart Item you are looking for",
          data: cartItems,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to Find Cart Items",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Single Cart Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Single Cart Service Error",
        data: error,
      };
    }
  },

  async updateCartService(data, params) {
    try {
      let cartId = params.id;
      // console.log(cartId);
      const cartItemExists = await cartModel.findOne({
        _id: cartId,
        isDeleted: false,
      });
      if (!cartItemExists) {
        return {
          status: 404,
          error: true,
          message: "No Cart Items Found",
          data: null,
        };
      }

      if (data.userId) {
        let changeUserId = await cartModel.findOneAndUpdate(
          { _id: cartId },
          { userId: data.userId },
          { new: true }
        );

        if (changeUserId) {
          return {
            status: 200,
            error: false,
            message: "Changed the User Id",
            data: changeUserId,
          };
        } else {
          return {
            status: 400,
            error: true,
            message: "Failed to Change the User Id",
            data: null,
          };
        }
      }

      if (data.productId) {
        let changeProductId = await cartModel.findOneAndUpdate(
          { _id: cartId },
          { productId: data.productId },
          { new: true }
        );

        if (changeProductId) {
          return {
            status: 200,
            error: false,
            message: "Changed the product Id",
            data: changeProductId,
          };
        } else {
          return {
            status: 400,
            error: true,
            message: "Failed to Change the product Id",
            data: null,
          };
        }
      }

      if (data.quantity) {
        let cartDetails = await cartModel.findOne({
          _id: cartId,
          isDeleted: false,
        });
        let productPrice = cartDetails.productPrice;
        let finalTotalPrice = data.quantity * productPrice;

        let changeQuantity = await cartModel.findOneAndUpdate(
          { _id: cartId },
          { quantity: data.quantity, totalPrice: finalTotalPrice },
          { new: true }
        );

        if (changeQuantity) {
          return {
            status: 200,
            error: false,
            message: "Changed the Quantity",
            data: changeQuantity,
          };
        } else {
          return {
            status: 400,
            error: true,
            message: "Failed to Change the Quantity",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log("Update Cart Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Update Cart Service Error",
        data: error,
      };
    }
  },

  async deleteCartService(params) {
    try {
      let cartId = params.id;
      let cartExists = await cartModel.findOne({
        productId: cartId,
        isDeleted: false,
      });
      if (!cartExists) {
        return {
          status: 404,
          error: true,
          message: "Item was not found on Cart",
          data: null,
        };
      }

      let cartQuantity = cartExists.quantity;

      let getOldStockQty = await stockModel.findOne({
        productId: cartId,
        isDeleted: false,
      });
      if (!getOldStockQty) {
        return {
          status: 404,
          error: true,
          message: "Stock not found of this Product",
          data: null,
        };
      }

      let increasedQty = getOldStockQty.stockQTY + cartQuantity;

      let addStockBack = await stockModel.findOneAndUpdate(
        { productId: cartId, isDeleted: false },
        { stockQTY: increasedQty },
        { new: true }
      );

      if (addStockBack) {
        let removeItems = await cartModel.updateOne(
          { productId: cartId, isDeleted: false },
          {
            isDeleted: true,
            isActive: false,
          },
          { new: true }
        );

        if (removeItems) {
          return {
            status: 200,
            error: false,
            message: "Removed the Items from the Cart",
            data: removeItems,
          };
        } else {
          return {
            status: 400,
            error: true,
            message: "Failed to remove the item",
            data: null,
          };
        }
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Re-Stock",
          data: null,
        };
      }
    } catch (error) {
      console.log("Delete Cart Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Delete Cart Service Error",
        data: error,
      };
    }
  },

  async removeCartService(params) {
    try {
      let cartId = params.id;
      let cartExists = await cartModel.findOne({
        _id: cartId,
        isDeleted: false,
      });
      if (!cartExists) {
        return {
          status: 404,
          error: true,
          message: "Item was not found on Cart",
          data: null,
        };
      }

      let removeCart = await cartModel.updateOne(
        {_id: cartId},
        {isActive: false, isDeleted: true},
        {new: true},
      );

      if(removeCart){
        return{
          status: 200,
          error: false,
          message: "Successfully Removed the Cart Item after Order is Placed",
          data: removeCart,
        }
      }else{
        return{
          status: 400,
          error: true,
          message: "Failed to Remove the Cart Item after Order is Placed",
          data: null,
        }
      }
    } catch (error) {
      console.log("Delete Cart Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Delete Cart Service Error",
        data: error,
      };
    }
  },

  async increaseQtyCartService(params) {
    try {
      const cartId = params.id;
      let increasedQty = 0;

      // Find the cart details
      let prevCartDetails = await cartModel.findOne({
        _id: cartId,
        isDeleted: false,
      });

      if (!prevCartDetails) {
        return {
          status: 400,
          error: true,
          message: "No Items with this Id on the cart",
          data: null,
        };
      }

      let prevQty = prevCartDetails.quantity;

      // Check stock availability
      let checkStock = await stockModel.findOne({
        productId: prevCartDetails.productId,
        isDeleted: false,
      });

      if (
        checkStock &&
        checkStock.stockQTY > 0 &&
        prevQty < checkStock.stockQTY
      ) {
        increasedQty = prevQty + 1;

        // Update the cart quantity
        let updateQty = await cartModel.findOneAndUpdate(
          { _id: cartId },
          { quantity: increasedQty },
          { new: true }
        );

        if (updateQty) {
          let prodPrice = updateQty.productPrice;
          let totalQuantity = updateQty.quantity;
          let uptTotalPrice = prodPrice * totalQuantity;

          let updateTotalPrice = await cartModel.findOneAndUpdate(
            {_id: updateQty._id},
            {totalPrice: uptTotalPrice},
            {new: true}
          )


          let stockDetails = await stockModel.findOne({
            productId: updateQty.productId,
          });

          

          if (stockDetails) {
            let updateStockQTY = stockDetails.stockQTY - 1;

            if (updateStockQTY <= 0) {
              return {
                status: 409,
                error: true,
                message: "Stock Unavailable",
                data: null,
              };
            }

            let decreaseStock = await stockModel.findOneAndUpdate(
              { productId: updateQty.productId },
              { stockQTY: updateStockQTY },
              { new: true }
            );

            if (decreaseStock) {
              return {
                status: 200,
                error: false,
                message:
                  "Increased the Cart Item Quantity by +1 and Decreased the Stock by -1",
                data: updateQty,
              };
            } else {
              return {
                status: 400,
                error: true,
                message: "Failed to Decrease the Stock",
                data: null,
              };
            }
          }
        } else {
          return {
            status: 400,
            error: true,
            message: "Failed to Increase the Quantity",
            data: null,
          };
        }
      } else {
        return {
          status: 404,
          error: true,
          message: "Stock Not Found of this Product",
          data: null,
        };
      }
    } catch (error) {
      console.log("Increase Quantity Cart Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Increase Quantity Cart Service Error",
        data: error,
      };
    }
  },

  async decreaseQtyCartService(params) {
    try {
      const cartId = params.id;
      let decreasedQty = 0;

      let prevCartDetails = await cartModel.findOne({
        _id: cartId,
        isDeleted: false,
      });
      if (!prevCartDetails) {
        return {
          status: 400,
          error: true,
          message: "No Items with this Id on the cart",
          data: null,
        };
      }

      let prevQty = prevCartDetails.quantity;
      if (prevQty <= 0) {
        return {
          status: 400,
          error: true,
          message: "Quantity is 0, you cannot decrease it",
          data: null,
        };
      }

      decreasedQty = prevQty - 1;

      let updateQty = await cartModel.findOneAndUpdate(
        { _id: cartId },
        { quantity: decreasedQty },
        { new: true }
      );
      if (updateQty) {
        let productPrc = updateQty.productPrice;
        let prevQty = updateQty.quantity;
        let updatedPrice = prevQty * productPrc;
        let changePrice = await cartModel.findOneAndUpdate(
          { _id: updateQty._id },
          { totalPrice: updatedPrice },
          { new: true }
        );
        let stockDetails = await stockModel.findOne({
          productId: updateQty.productId,
        });
        if (stockDetails) {
          let updateQTY = stockDetails.stockQTY + 1;
          let incrsStock = await stockModel.findOneAndUpdate(
            { productId: updateQty.productId },
            { stockQTY: updateQTY },
            { new: true }
          );
          if (incrsStock) {
            return {
              status: 200,
              error: false,
              message: "Decreased the Quantity by -1 and Increased Stock by +1",
              data: updateQty,
            };
          } else {
            return {
              status: 400,
              error: true,
              message: "Failed to Increase the Stock",
              data: null,
            };
          }
        }
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Decrease the Quantity",
          data: null,
        };
      }
    } catch (error) {
      console.log("Decrease Quantity Cart Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Decrease Quantity Cart Service Error",
        data: error,
      };
    }
  },
};
