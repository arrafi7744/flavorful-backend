const orderModel = require("../../../models/orderModels/orderModels");
const stockModel = require("../../../models/stockModels/stockModel");
const productModel = require("../../../models/productModels/productModels");
const userModel = require("../../../models/userModels/userModels");
const cartModel = require("../../../models/cartModels/cartModels");
const customerModel = require("../../../models/customerModels/customerModel");
const taxModel = require("../../../models/taxModels/taxModels.js");
const nodemailer = require("nodemailer");

module.exports = {
  async createOrderService(data) {
    try {
      const cartId = data.cartId;

      const checkCartExists = await cartModel.findOne({
        _id: cartId,
        isDeleted: false,
      });

      if (checkCartExists === null) {
        return {
          status: 404,
          error: true,
          message: "Cart Not Found",
          data: null,
        };
      }

      const userId = checkCartExists.userId;
      const productId = checkCartExists.productId;

      const checkUserExists = await userModel.findOne({
        _id: userId,
        isDeleted: false,
      });
      if (!checkUserExists) {
        return {
          status: 404,
          error: true,
          message: "User Not Found",
          data: null,
        };
      }

      const checkCustomerExists = await customerModel.findOne({
        userId: userId,
        isDeleted: false,
      });
      if (!checkCustomerExists) {
        return {
          status: 404,
          error: true,
          message: "Customer Doesn't Exist",
          data: null,
        };
      }

      const checkProductExists = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });
      if (!checkProductExists) {
        return {
          status: 404,
          error: true,
          message: "Product Doesn't Exist",
          data: null,
        };
      }

      const checkStockExists = await stockModel.findOne({
        productId: productId,
        isDeleted: false,
      });
      if (!checkStockExists) {
        return {
          status: 404,
          error: true,
          message: "Stock Not Found",
          data: null,
        };
      }

      if (checkStockExists.stockQTY < 0) {
        return {
          status: 400,
          error: true,
          message: "Stock Not Available",
          data: null,
        };
      }

      const checkTaxExists = await taxModel.find({ isDeleted: false });
      if (checkTaxExists) {
        let taxNum =
          checkTaxExists[0]?.taxNumber > 0 ? checkTaxExists[0]?.taxNumber : 0;

        let totalPrice = 0;
        if (taxNum > 0) {
          let breakPrcnt = taxNum / 100;
          let calcTaxAmnt = breakPrcnt * checkCartExists.totalPrice;
          totalPrice = checkCartExists.totalPrice + calcTaxAmnt;
        } else {
          totalPrice = checkCartExists.allTotalPrice;
        }

        const createOrder = await orderModel.create({
          cartId: cartId,
          userId: userId,
          sellerId: checkProductExists.sellerId,
          productId: checkProductExists._id,
          userName: checkUserExists.userName,
          userFullName: checkUserExists.userFullName,
          userPhoneNumber: checkUserExists.phoneNumber,
          userEmail: checkUserExists.userEmail,
          // userCountry: checkCustomerExists.shippingCountry,
          userState: checkCustomerExists.shippingState,
          userAddress: checkCustomerExists.shippingAddress,
          userPostalCode: checkCustomerExists.shippingPostalCode,
          productName: checkProductExists.productName,
          productThumb: checkProductExists.productThumb,
          productSellingPrice: checkProductExists.sellingPrice,
          allTotalPrice: checkCartExists.totalPrice,
          totalQuantity: checkCartExists.quantity,
          tax: taxNum,
          discount: checkProductExists.discount,
          // deliveryFee: data.deliveryFee ? data.deliveryFee : 25,
          // deliveryShift: data.deliveryShift,
          isPending: true,
          // orderType: data.orderType,
        });

        if (createOrder) {
          let removeItemsFromCart = await cartModel.findOne({
            _id: cartId,
            isDeleted: false,
          });
          if (removeItemsFromCart) {
            await cartModel.updateOne(
              { _id: cartId },
              { isActive: false, isDeleted: true },
              { new: true }
            );
          }

          let testAccount = await nodemailer.createTestAccount();

          const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
              user: "werner52@ethereal.email",
              pass: "FQxAEMdBmB9xMB8SAw",
            },
          });

          const info = await transporter.sendMail({
            from: '"Mushfiqur Rahman 👻" <codeklucifer@gmail.com>',
            to: `${checkUserExists.userEmail}`,
            subject: "Hello Men's Shelf User",
            text: "Thank You from purchasing from Us",
            html: `<p>Dear ${checkUserExists?.userName},

Greetings from Men's Shelf ! We hope this message finds you well. First and foremost, we would like to express our sincere gratitude for choosing to shop with us. Your recent purchase means a great deal to us, and we are thrilled to have you as one of our valued customers. <br/> <br/>

At Men's Shelf, we are committed to delivering not only high-quality products but also an exceptional shopping experience. We know that you have many options, and the fact that you chose us is something we truly appreciate. Your trust and support inspire us to continue improving and providing the best service possible. <br/> <br/>

Should you have any questions or concerns about your order, or if there's anything we can do to further enhance your experience, please don't hesitate to get in touch. We are always here to assist you and ensure that you are fully satisfied with your purchase. <br/> <br/>

Additionally, we are continuously working to expand our range of products and services to meet your needs even better. Stay tuned for upcoming offers and new arrivals, as we are always looking for ways to give you more value and variety. <br/> <br/>

Once again, thank you for placing your trust in us. We are excited to be part of your shopping journey and look forward to serving you in the future. Your feedback is always welcome, as it helps us grow and offer an even better experience for customers like you. <br/> <br/>

Wishing you all the best and hoping to see you again soon! <br/> <br/>

Warm regards, <br/>
Mushfiqur Rahman <br/>
Men's Shelf</p>`,
          });

          return {
            status: 200,
            error: false,
            message: "Successfully Placed the Order",
            data: createOrder,
          };
        } else {
          return {
            status: 400,
            error: true,
            message: "Failed to Place the Order",
            data: null,
          };
        }
      } else {
        return {
          status: 400,
          error: true,
          message: "Sth wrong with the tax on crt order srvc",
          data: null,
        };
      }
    } catch (error) {
      console.log("Create Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Create Order Service Error",
        data: error,
      };
    }
  },

  async updateOrderService(body) {
    try {
      return {
        status: 200,
        error: false,
        message: "Successfully Updated the Order",
        data: {},
      };
    } catch (error) {
      console.log("Update Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Update Order Service Error",
        data: error,
      };
    }
  },

  async deleteOrderService(params) {
    try {
      const orderId = params.id;
      const checkOrderExists = await orderModel.findOne({
        _id: orderId,
        isDeleted: false,
      });
      if (!checkOrderExists) {
        return {
          status: 404,
          error: true,
          message: "Order Not Found",
          data: null,
        };
      }

      const removeOrder = await orderModel.updateOne(
        { _id: orderId },
        { isActive: false, isDeleted: true },
        { new: true }
      );

      if (removeOrder) {
        return {
          status: 200,
          error: false,
          message: "Successfully Deleted the Order",
          data: null,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to remove the Orders",
          data: null,
        };
      }
    } catch (error) {
      console.log("Delete Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Delete Order Service Error",
        data: error,
      };
    }
  },

  async showOrderService() {
    try {
      let allOrderServices = await orderModel.find({ isDeleted: false });
      if (allOrderServices) {
        return {
          status: 200,
          error: false,
          message: "List of All Orders",
          data: allOrderServices,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Load the Orders or no Orders present",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Order Service Error",
        data: error,
      };
    }
  },

  async showAllOrderService() {
    try {
      let allOrders = await orderModel.find();
      if (allOrders) {
        return {
          status: 200,
          error: false,
          message: "List of All Orders",
          data: allOrders,
        };
      }
      return {
        status: 200,
        error: false,
        message: "Successfully Retrieved All Orders",
        data: [],
      };
    } catch (error) {
      console.log("Show All Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Order Service Error",
        data: error,
      };
    }
  },

  async showSingleOrderWithOrderId(params) {
    try {
      const findSingleOrder = await orderModel.findOne({
        _id: params.id,
        isDeleted: false,
      });
      if (findSingleOrder) {
        return {
          status: 200,
          error: false,
          message: "Single Order Data: ",
          data: findSingleOrder,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to find the Order",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Single Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Single Order Service Error",
        data: error,
      };
    }
  },

  async showSingleOrderService(params) {
    try {
      const userId = params.id;
      const findSingleOrder = await orderModel.findOne({
        userId: userId,
        isDeleted: false,
      });
      if (findSingleOrder) {
        return {
          status: 200,
          error: false,
          message: "Single Order Data: ",
          data: findSingleOrder,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to find the Order",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Single Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Single Order Service Error",
        data: error,
      };
    }
  },

  async showOrdersByUserService(params) {
    try {
      const userId = params.id;
      const findSingleOrder = await orderModel.find({
        userId: userId,
        isDeleted: false,
      });
      if (findSingleOrder) {
        return {
          status: 200,
          error: false,
          message: "Orders Data: ",
          data: findSingleOrder,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to find the Orders",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Orders by UserId Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Orders by UserId Service Error",
        data: error,
      };
    }
  },

  async showAllPendingOrdersService() {
    try {
      const getPendingOrders = await orderModel.find({
        isPending: true,
        isDeleted: false,
      });
      if (getPendingOrders) {
        return {
          status: 200,
          error: false,
          message: "All Pending Orders are Here",
          data: getPendingOrders,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Pending Orders Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Pending Orders Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Pending Orders Service Error",
        data: error,
      };
    }
  },

  async showAllPendingOrdersByUserIdService(data) {
    try {
      const getPendingOrders = await orderModel.find({
        isPending: true,
        isDeleted: false,
        userId: data.userId,
      });
      if (getPendingOrders) {
        return {
          status: 200,
          error: false,
          message: "All Pending Orders by user id are Here",
          data: getPendingOrders,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Pending Orders Found within this user id",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Pending Orders by user id Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Pending Orders by user id Service Error",
        data: error,
      };
    }
  },

  async showAllPendingOrdersBySellerIdService(data) {
    try {
      const getPendingOrders = await orderModel.find({
        isPending: true,
        isDeleted: false,
        sellerId: data.id,
      });

      if (getPendingOrders) {
        return {
          status: 200,
          error: false,
          message: "All Pending Orders by seller id are Here",
          data: getPendingOrders,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Pending Orders Found within this seller id",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Pending Orders by seller id Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Pending Orders by seller id Service Error",
        data: error,
      };
    }
  },

  async showAllConfirmedOrdersService() {
    try {
      const getConfirmedOrders = await orderModel.find({
        isPending: false,
        isCanceled: false,
        isDeleted: false,
        isConfirmed: true,
        isLaunched: true,
      });
      if (getConfirmedOrders) {
        return {
          status: 200,
          error: false,
          message: "All Confirmed Orders are Here",
          data: getConfirmedOrders,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Confirmed Orders Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Confirmed Orders Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Confirmed Orders Service Error",
        data: error,
      };
    }
  },

  async showAllConfirmedOrdersByUserIdService(data) {
    try {
      const getConfirmedOrders = await orderModel.find({
        isPending: false,
        isCanceled: false,
        isDeleted: false,
        isConfirmed: true,
        isLaunched: true,
        userId: data.userId,
      });
      if (getConfirmedOrders) {
        return {
          status: 200,
          error: false,
          message: "All Confirmed Orders by user id are Here",
          data: getConfirmedOrders,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Confirmed Orders Found by this user id",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Confirmed Orders by user id Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Confirmed Orders by user id Service Error",
        data: error,
      };
    }
  },

  async showAllConfirmedOrdersBySellerIdService(data) {
    try {
      const getConfirmedOrders = await orderModel.find({
        isPending: false,
        isCanceled: false,
        isDeleted: false,
        isConfirmed: true,
        isLaunched: true,
        isDelivered: false,
        sellerId: data.id,
      });
      if (getConfirmedOrders) {
        return {
          status: 200,
          error: false,
          message: "All Confirmed Orders by user id are Here",
          data: getConfirmedOrders,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Confirmed Orders Found by this user id",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Confirmed Orders by user id Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Confirmed Orders by user id Service Error",
        data: error,
      };
    }
  },

  async showAllDeliveredOrdersService() {
    try {
      const getDeliveredOrders = await orderModel.find({
        isDelivered: true,
        isPending: false,
        isDeleted: false,
      });
      if (getDeliveredOrders) {
        return {
          status: 200,
          error: false,
          message: "All Delivered Orders are Here",
          data: getDeliveredOrders,
        };
      } else {
        return {
          status: 200,
          error: false,
          message: "No Delivered Orders Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Delivered Orders Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Delivered Orders Service Error",
        data: error,
      };
    }
  },
  async showAllDeliveredOrdersByUserIdService(data) {
    try {
      const getDeliveredOrders = await orderModel.find({
        isDelivered: true,
        isPending: false,
        isDeleted: false,
        userId: data.userId,
      });
      if (getDeliveredOrders) {
        return {
          status: 200,
          error: false,
          message: "All Delivered Orders are Here by user id",
          data: getDeliveredOrders,
        };
      } else {
        return {
          status: 200,
          error: false,
          message: "No Delivered Orders Found bby this user id",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Delivered Orders by user id Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Delivered Orders by user id Service Error",
        data: error,
      };
    }
  },

  async showAllDeliveredOrdersBySellerIdService(data) {
    try {
      const getDeliveredOrders = await orderModel.find({
        isDelivered: true,
        // isPending: false,
        // isDeleted: false,
        sellerId: data.id,
      });
      if (getDeliveredOrders) {
        return {
          status: 200,
          error: false,
          message: "All Delivered Orders are Here by user id",
          data: getDeliveredOrders,
        };
      } else {
        return {
          status: 200,
          error: false,
          message: "No Delivered Orders Found bby this user id",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Delivered Orders by user id Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Delivered Orders by user id Service Error",
        data: error,
      };
    }
  },
  async getAllOrdersByUserId(data) {
    try {
      if (!data.userId)
        return {
          status: 404,
          error: true,
          message: "User Id is missing",
          data: null,
        };
      const result = await orderModel.find({
        isDeleted: false,
        userId: data.userId,
      });
      if (result) {
        return {
          status: 200,
          error: false,
          message: "All Orders are Here by user id",
          data: result,
        };
      } else {
        return {
          status: 200,
          error: false,
          message: "No Orders Found bby this user id",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Orders by user id Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Orders by user id Service Error",
        data: error,
      };
    }
  },

  async getRecentOrdersByUsrId(data) {
    try {
      if (!data.userId)
        return {
          status: 404,
          error: true,
          message: "User Id is missing",
          data: null,
        };
      const limit = 10; // Default to 10 if no limit is provided

      // Find recent orders, sorted by createdDate in descending order
      const recentOrders = await Order.find({ userId: data.userId })
        .sort({ createdDate: -1 }) // Sort by createdDate, descending
        .limit(limit); // Limit the number of results

      res.status(200).json({
        status: 200,
        error: false,
        message: "Recent Orders Retrieved Successfully",
        data: recentOrders,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: true,
        message: error.message,
        data: null,
      });
    }
  },
  async getAllRecentOrders(data) {
    try {
      const limit = 10; // Default to 10 if no limit is provided

      // Find recent orders, sorted by createdDate in descending order
      const recentOrders = await Order.find()
        .sort({ createdDate: -1 }) // Sort by createdDate, descending
        .limit(limit); // Limit the number of results

      res.status(200).json({
        status: 200,
        error: false,
        message: "Recent Orders Retrieved Successfully",
        data: recentOrders,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: true,
        message: error.message,
        data: null,
      });
    }
  },

  async showAllCancelledOrdersService() {
    try {
      const getDeliveredOrders = await orderModel.find({
        isCanceled: true,
        isPending: false,
        isDeleted: false,
        isDelivered: false,
      });
      if (getDeliveredOrders) {
        return {
          status: 200,
          error: false,
          message: "All Cancelled Orders are Here",
          data: getDeliveredOrders,
        };
      } else {
        return {
          status: 200,
          error: false,
          message: "No Cancelled Orders Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Cancelled Orders Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Cancelled Orders Service Error",
        data: error,
      };
    }
  },
  async showAllCancelledOrdersByUserIdService(data) {
    try {
      const getDeliveredOrders = await orderModel.find({
        isCanceled: true,
        isPending: false,
        isDeleted: false,
        isDelivered: false,
        userId: data.userId,
      });
      if (getDeliveredOrders) {
        return {
          status: 200,
          error: false,
          message: "All Cancelled Orders by user id are Here",
          data: getDeliveredOrders,
        };
      } else {
        return {
          status: 200,
          error: false,
          message: "No Cancelled Orders Found by this user id",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Cancelled Orders by user id Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Cancelled Orders by user id Service Error",
        data: error,
      };
    }
  },

  async showAllCancelledOrdersBySellerIdService(data) {
    try {
      console.log(data, "cancel order ");
      const getDeliveredOrders = await orderModel.find({
        isPending: false,
        isCanceled: true,
        isDelivered: false,
        sellerId: data.id,
      });
      if (getDeliveredOrders) {
        return {
          status: 200,
          error: false,
          message: "All Cancelled Orders by Seller id are Here",
          data: getDeliveredOrders,
        };
      } else {
        return {
          status: 200,
          error: false,
          message: "No Cancelled Orders Found by this Seller id",
          data: null,
        };
      }
    } catch (error) {
      console.log(
        "Show All Cancelled Orders by Seller id Service Error",
        error
      );
      return {
        status: 500,
        error: true,
        message: "Show All Cancelled Orders by SEller id Service Error",
        data: error,
      };
    }
  },

  async showAllDeletedOrdersService() {
    try {
      const getDeletedOrders = await orderModel.find({ isDeleted: true });
      if (getDeletedOrders) {
        return {
          status: 200,
          error: false,
          message: "All Deleted Orders are Here",
          data: getDeletedOrders,
        };
      } else {
        return {
          status: 200,
          error: false,
          message: "No Deleted Orders Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Deleted Orders Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Deleted Orders Service Error",
        data: error,
      };
    }
  },

  //Filter By Date//
  async showAllTodayOrdersService() {
    try {
    } catch (error) {
      console.log("Show All Today Orders Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Today Orders Service Error",
        data: error,
      };
    }
  },

  async pendingOrderService(params) {
    try {
      let orderId = params.id;
      const existsOrder = await orderModel.findOne({
        _id: orderId,
        isDeleted: false,
      });
      if (!existsOrder) {
        return {
          status: 404,
          error: true,
          message: `Order of ${orderId} not found`,
          data: null,
        };
      }

      const shiftOrderToPending = await orderModel.updateOne(
        { _id: orderId },
        { isPending: true },
        { new: true }
      );

      if (shiftOrderToPending) {
        return {
          status: 200,
          error: false,
          message: `Successfully Placed the order of ${checkOrderExists.productName} and its pending`,
          data: shiftOrderToPending,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: `Failed to Accept the Order of ${orderId}`,
          data: null,
        };
      }
    } catch (error) {
      console.log("Accept/Pending Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Accept/Pending Order Service Error",
        data: error,
      };
    }
  },

  async refundedOrderService(params) {
    try {
      const userId = params.id;
      const checkUserExists = await userModel.findOne({
        _id: userId,
        isDeleted: false,
      });
      if (!checkUserExists) {
        return {
          status: 404,
          error: true,
          message: "User Not Found",
          data: null,
        };
      }

      const getAllRefundedOrders = await orderModel.find({
        _id: userId,
        isDeleted: true,
      });
      if (getAllRefundedOrders) {
        return {
          status: 200,
          error: false,
          message: "Here is the Refunded Orders",
          data: getAllRefundedOrders,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Fetch the Refunded Products",
          data: null,
        };
      }
    } catch (error) {
      console.log("Refunded Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Refunded Order Service Error",
        data: error,
      };
    }
  },

  async cancelledOrderService(params) {
    try {
      let orderId = params.id;
      const existsOrder = await orderModel.findOne({
        _id: orderId,
        isDeleted: false,
      });
      if (!existsOrder) {
        return {
          status: 404,
          error: true,
          message: `Order of ${orderId} not found`,
          data: null,
        };
      }

      const shiftOrderToCancelled = await orderModel.updateOne(
        { _id: orderId },
        {
          isPending: false,
          isCanceled: true,
          isDelivered: false,
        },
        { new: true }
      );

      if (shiftOrderToCancelled) {
        return {
          status: 200,
          error: false,
          message: `Successfully Cancelled the Order`,
          data: shiftOrderToCancelled,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: `Failed to Cancel the Order of ${orderId}`,
          data: null,
        };
      }
    } catch (error) {
      console.log("Cancel Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Cancel Order Service Error",
        data: error,
      };
    }
  },

  async confirmOrderService(params) {
    try {
      let orderId = params.id;
      const existsOrder = await orderModel.findOne({
        _id: orderId,
        isDeleted: false,
      });
      if (!existsOrder) {
        return {
          status: 404,
          error: true,
          message: `Order of ${orderId} not found`,
          data: null,
        };
      }

      const shiftOrderToConfirm = await orderModel.updateOne(
        { _id: orderId },
        { isConfirmed: true, isLaunched: true, isPending: false },
        { new: true }
      );

      if (shiftOrderToConfirm) {
        return {
          status: 200,
          error: false,
          message: `Successfully Delivered the Order `,
          data: shiftOrderToConfirm,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: `Failed to Deliver the Order of ${orderId}`,
          data: null,
        };
      }
    } catch (error) {
      console.log("Confirm Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Confirm Order Service Error",
        data: error,
      };
    }
  },

  async deliveryConfirmedOrderService(params) {
    try {
      let orderId = params.id;
      const existsOrder = await orderModel.findOne({
        _id: orderId,
        isDeleted: false,
      });
      if (!existsOrder) {
        return {
          status: 404,
          error: true,
          message: `Order of ${orderId} not found`,
          data: null,
        };
      }

      const shiftOrderToDeliver = await orderModel.updateOne(
        { _id: orderId },
        {
          isConfirmed: true,
          isLaunched: true,
          isDelivered: true,
          isPending: false,
        },
        { new: true }
      );

      if (shiftOrderToDeliver) {
        return {
          status: 200,
          error: false,
          message: `Successfully Delivered the Order `,
          data: shiftOrderToDeliver,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: `Failed to Deliver the Order of ${orderId}`,
          data: null,
        };
      }
    } catch (error) {
      console.log("Deliver Order Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Deliver Order Service Error",
        data: error,
      };
    }
  },
};
