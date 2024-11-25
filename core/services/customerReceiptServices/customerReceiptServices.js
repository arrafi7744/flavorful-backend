const customerReceiptModel = require("../../../models/customerReceipt/customerReceipt");
const customerModel = require("../../../models/customerModels/customerModel");
const receiptModel = require("../../../models/receiptModels/receiptModel");
const customerReceipt = require("../../../models/customerReceipt/customerReceipt");

module.exports = {
  async createCustomerReceiptsSrvc(data) {
    try {
      const customerId = data?.customerId;
      const receiptId = data?.receiptId;

      const customerExists = await customerModel.findOne({ _id: customerId });
      if (!customerExists) {
        return {
          status: 404,
          error: true,
          message: "Customer Doesn't Exists",
          data: null,
        };
      }

      const receiptExists = await receiptModel.findOne({ _id: receiptId });
      if (!receiptExists) {
        return {
          status: 404,
          error: true,
          message: "Receipt Doesn't Exists",
          data: null,
        };
      }

      const createReceiptDetails = await customerReceiptModel.create({
        customerId: customerId,
        receiptId: receiptId,
      });

      if (createReceiptDetails) {
        return {
          status: 200,
          error: false,
          message: "Successfully Created Receipt Details",
          data: createReceiptDetails,
        };
      } else {
        return {
          status: 409,
          error: true,
          message: "Failed to Create Receipt Details",
          data: null,
        };
      }
    } catch (error) {
      console.log("Create Customer Receipts Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Create Customer Receipts Service Error",
        data: error,
      };
    }
  },
  
  async showCustomerReceiptsSrvc() {
    try {
      let customerReceiptDetails = await customerReceiptModel.find({
        isDeleted: false,
      });
      if (customerReceiptDetails.length <= 0) {
        return {
          status: 200,
          error: false,
          message: "No Customer Receipt Details Found",
          data: customerReceiptDetails,
        };
      }
      if (customerReceiptDetails) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of all Customer Receipts",
          data: customerReceiptDetails,
        };
      } else {
        return {
          status: 404,
          error: false,
          message: "Show Customer Receipt Service Error",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Customer Receipts Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Customer Receipts Service Error",
        data: error,
      };
    }
  },

  async showSingleCustomerReceiptsSrvc(params) {
    try {
      const customerReceiptId = params.id;
      const customerReceiptDetails = await customerReceiptModel.findOne({
        _id: customerReceiptId,
        isDeletd: false,
      });
      if (customerReceiptDetails) {
        return {
          status: 200,
          error: false,
          message: "Here is your Customer Receipt",
          data: customerReceiptDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Customer Receipts Not Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show Single Customer Receipts Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Single Customer Receipts Service Error",
        data: error,
      };
    }
  },

  async showAllCustomerReceiptsSrvc() {
    try {
      const customerReceiptDetails = await customerReceiptModel.find();
      if (customerReceiptDetails.length <= 0) {
        return {
          status: 200,
          error: false,
          message: "No Customer Receipt Details Found",
          data: customerReceiptDetails,
        };
      }
      if (customerReceiptDetails) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of all Customer Receipts",
          data: customerReceiptDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Show All Customer RECEIPTS Service Error",
          data: null,
        };
      }
    } catch (error) {
      console.log("Show All Customer Receipts Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Customer Receipts Service Error",
        data: error,
      };
    }
  },

  async deleteCustomerReceiptsSrvc(params) {
    try {
      const customerReceiptId = params.id;
      const existsReceipts = await customerReceiptModel.findOne({
        _id: customerReceiptId,
        isDeleted: false,
      });
      if (!existsReceipts) {
        return {
          status: 404,
          error: true,
          message: "Customer Receipts not found or deleted probably",
          data: null,
        };
      } else {
        const deleteReceiptData = await customerReceiptModel.findOneAndUpdate(
          { _id: customerReceiptId },
          { isDeleted: true, isActive: false },
          { new: true }
        );

        if (deleteReceiptData) {
          return {
            status: 200,
            error: false,
            message: "SUccessfully Deleted Customer Receipts",
            data: deleteReceiptData,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Delete Customer Receipts",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log("Delete Customer Receipts Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Delete Customer Receipts Service Error",
        data: error,
      };
    }
  },

  async updateCustomerReceiptsSrvc(data, params) {
    try {
      const customerReceiptId = params.id;
      if (data.customerId) {
        const updateCustomerReceipt = await customerModel.findOneAndUpdate(
          { _id: customerReceiptId },
          { customerId: data.customerId },
          { new: true }
        );
        if (updateCustomerReceipt) {
          return {
            status: 200,
            error: false,
            message: "Successfully Updated Customer Id",
            data: updateCustomerReceipt,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to update Customer Id",
            data: null,
          };
        }
      }

      if (data.receiptId) {
        const updateCustomerReceipt = await customerModel.findOneAndUpdate(
          { _id: customerReceiptId },
          { customerId: data.receiptId },
          { new: true }
        );
        if (updateCustomerReceipt) {
          return {
            status: 200,
            error: false,
            message: "Successfully Updated Receipt Id",
            data: updateCustomerReceipt,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to update Receipt Id",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log("Update Customer Receipts Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Update Customer Receipts Service Error",
        data: error,
      };
    }
  },
};
