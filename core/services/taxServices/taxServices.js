const taxModels = require("../../../models/taxModels/taxModels");

module.exports = {
  async createTaxServices(data) {
    try {
      const crtTax = await taxModels.create({
        taxNumber: data?.taxNumber,
      });

      if (crtTax) {
        return {
          status: 200,
          error: false,
          message: "Successful",
          data: crtTax,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 400,
        error: true,
        message: "Tax Create Service Error",
        data: null,
      };
    }
  },

  async getTaxServices() {
    try {
      const getTax = await taxModels.find({isDeleted: false, isActive: true});
      if (getTax) {
        return {
          status: 200,
          error: false,
          message: "Successfull",
          data: getTax,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 400,
        error: true,
        message: "Failed Get Tax Service",
        data: null,
      };
    }
  },

  async removeTaxServices(params) {
    console.log(params?.id);
    try {
      const rmvTax = await taxModels.findOneAndUpdate(
        { _id: params.id, isDeleted: false },
        { isDeleted: true, isActive: false },
        { new: true }
      );

      console.log(rmvTax);
      if (rmvTax) {
        return {
          status: 200,
          error: false,
          message: "Successfully Removed",
          data: rmvTax,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to remove tax",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 400,
        error: true,
        message: "Failed Remove Tax Service",
        data: null,
      };
    }
  },
};
