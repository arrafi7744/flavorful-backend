const contactModels = require("../../../models/contactModels/contactModel");

module.exports = {
  async createContactServices(data) {
    try {
      const crtContact = await contactModels.create({
        userFullName: data?.userFullName,
        email: data?.email,
        subject: data?.subject,
        description: data?.description,
      });

      if (crtContact) {
        return {
          status: 200,
          error: false,
          message: "Successfully Created Contact Details",
          data: crtContact,
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
        message: "Contact Create Service Error",
        data: null,
      };
    }
  },

  async getAllContactServices() {
    try {
      const getAllContacts = await contactModels.find({
        isDeleted: false,
        isActive: true,
      });
      if (getAllContacts) {
        return {
          status: 200,
          error: false,
          message: "Fetched All Contacts Data",
          data: getAllContacts,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Fetch All Contacts",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 400,
        error: true,
        message: "Failed Get All Contacts Service",
        data: null,
      };
    }
  },
};
