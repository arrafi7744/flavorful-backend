const { default: mongoose } = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const receiptModel = require('../../../models/receiptModels/receiptModel.js');
const userModels = require('../../../models/userModels/userModels.js');
const orderModels = require('../../../models/orderModels/orderModels.js');

module.exports = {
  async createReceiptsServices(data) {
    try {
      const { buyerId, orderIds } = data;

      // Check if the buyer exists and is not deleted
      const checkBuyerExists = await userModels.findOne({
        _id: new mongoose.Types.ObjectId(buyerId), // Use 'new' here
        isDeleted: false,
      });

      if (!checkBuyerExists) {
        return {
          status: 404,
          error: true,
          message: "Buyer doesn't exist or is deleted.",
          data: null,
        };
      }

      // Ensure that orderIds is an array and is not empty
      if (!Array.isArray(orderIds) || orderIds.length === 0) {
        return {
          status: 400,
          error: true,
          message: 'Order IDs must be an array and cannot be empty.',
          data: null,
        };
      }

      // Generate unique key ID for the receipt
      const uniqueKeyId = uuidv4();

      // Create the receipt
      const crtReceipt = await receiptModel.create({
        uniqueKeyId, // Include the unique key ID
        buyerId: new mongoose.Types.ObjectId(buyerId), // Use 'new' here
        orderIds: orderIds.map((id) => new mongoose.Types.ObjectId(id)), // Use 'new' here
        totalProductQuantity: orderIds.length, // Set total product quantity
      });

      if (crtReceipt) {
        return {
          status: 200,
          error: false,
          message: 'Successfully created the receipt.',
          data: crtReceipt,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: 'Failed to create the receipt.',
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: 409,
        error: true,
        message: 'Create receipt service failed.',
        data: null,
      };
    }
  },

  async getAllReceiptsByUser(data) {
    try {
      const userId = data.id;

      // Check if the buyer exists
      const checkBuyerExists = await userModels.findOne({
        _id: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
      });

      if (!checkBuyerExists) {
        return {
          status: 404,
          error: true,
          message: 'Buyer Not Found',
          data: null,
        };
      }

      // Find all receipts for the user
      const findReceipts = await receiptModel.find({
        buyerId: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
      });

      if (findReceipts && findReceipts.length > 0) {
        // Add order details and calculate totals for each receipt
        const receiptsWithOrderDetails = await Promise.all(
          findReceipts.map(async (receipt) => {
            const orderDetails = await Promise.all(
              receipt.orderIds.map(async (orderId) => {
                const order = await orderModels.findOne({
                  _id: orderId,
                  isDeleted: false,
                });

                if (order) {
                  return {
                    allTotalPrice: order.allTotalPrice, // Include the total price from order
                  };
                }
                return null;
              })
            );

            // Filter out null orders (in case some are not found)
            const validOrders = orderDetails.filter((order) => order !== null);

            // Calculate the total price for this receipt
            const totalOrderPrice = validOrders.reduce(
              (total, order) => total + order.allTotalPrice,
              0
            );
            
            return {
              ...receipt.toObject(),
              totalOrderPrice, // Total price for this receipt
            };
          })
        );

        return {
          status: 200,
          error: false,
          message: 'List of all the Receipts',
          data: receiptsWithOrderDetails,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: 'Failed to fetch the Receipts',
        };
      }
    } catch (error) {
      console.log('get all receipts by user service error', error);
      return {
        status: 400,
        error: true,
        message: 'Get All Receipts By User Service Error',
        data: null,
      };
    }
  },
};

// async showSingleOrderService(params) {
//   try {
//     const userId = params.id;
//     const findSingleOrder = await orderModel.findOne({
//       userId: userId,
//       isDeleted: false,
//     });
//     if (findSingleOrder) {
//       return {
//         status: 200,
//         error: false,
//         message: "Single Order Data: ",
//         data: findSingleOrder,
//       };
//     } else {
//       return {
//         status: 404,
//         error: true,
//         message: "Failed to find the Order",
//         data: null,
//       };
//     }
//   } catch (error) {
//     console.log("Show Single Order Service Error", error);
//     return {
//       status: 500,
//       error: true,
//       message: "Show Single Order Service Error",
//       data: error,
//     };
//   }
// },
