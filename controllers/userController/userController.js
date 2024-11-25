const {
  createUserSrvc,
  getAllUsers,
  removeUserServices,
  updateUserInformation,
  loginUserSrvc,
  getSingleCustomer,
  getSingleSeller,
  getAllCustomers,
  getAllCustomersIdeal,
  getAllSellers,
  getAllSellersIdeal,
  getAllUsersIdeal,
  getSingleUser,
  updateUserPasswordSrvc,
  adminApproveUser,
  adminRejectUser,
  googleLoginUserSrvc,
  crtUserInfo,
  getAllVendorUsers,
  getAllBuyerUsers,
  activateUserServices,
  crtAdminInfo,
} = require('../../core/services/userServices/index');
const statusCode = require('../../core/status/statusCode');

const createErrorMessage = (message, data) => {
  return {
    status: statusCode,
    data: data,
    message: message,
    error: true,
  };
};

module.exports = {
  async createUserController(req, res) {
    try {
      let response = await createUserSrvc(req.body, req.file);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'User Creation Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async googleUserController(req, res) {
    try {
      let response = await googleLoginUserSrvc(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'Google Login Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async crtUserInfoController(req, res) {
    try {
      let response = await crtUserInfo(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        'User Creation Information Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async crtAdminInfoController(req, res) {
    try {
      let response = await crtAdminInfo(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        'User Creation Information Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async adminApproveUserController(req, res) {
    try {
      let response = await adminApproveUser(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'User Approval Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async adminRejectUserController(req, res) {
    try {
      let response = await adminRejectUser(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'User Rejection Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async loginUserController(req, res) {
    try {
      // console.log('hit login api');
      let response = await loginUserSrvc(req.body);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'login Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllUsers(req, res) {
    try {
      let response = await getAllUsers();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'User Show All Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllVendorUsers(req, res) {
    try {
      let response = await getAllVendorUsers();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        'User Show All vendor Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllBUyerUsers(req, res) {
    try {
      let response = await getAllBuyerUsers();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'User Show All buyer Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllUsersIdeal(req, res) {
    try {
      let response = await getAllUsersIdeal();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'User Show Ideal Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showSingleUser(req, res) {
    try {
      let response = await getSingleUser(req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'Show Single User Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async removeSingleUser(req, res) {
    try {
      let response = await removeUserServices(req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'User Remove Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },
  async activateSingleUser(req, res) {
    try {
      let response = await activateUserServices(req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'User Remove Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async userInfoUpdate(req, res) {
    try {
      let response = await updateUserInformation(
        req.body.updatedInfo,
        req.params
      );
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        'User Infomation Update Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async updateUserPasswordController(req, res) {
    try {
      let response = await updateUserPasswordSrvc(req.body, req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        'User Password Update Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllCustomers(req, res) {
    try {
      let response = await getAllCustomers();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'Customer Show All Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showSingleCustomer(req, res) {
    try {
      // console.log(req.params);
      let response = await getSingleCustomer(req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.log(error);
      return res.send({
        status: 500,
        error: true,
        message: 'SHow Single Customer Controller Failed',
        data: error,
      });
    }
  },

  async showAllCustomersIdeal(req, res) {
    try {
      let response = await getAllCustomersIdeal();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        'Customer Ideal Show All Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showSingleSeller(req, res) {
    try {
      // console.log(req.params);
      let response = await getSingleSeller(req.params);
      return res.status(response.status).send(response);
    } catch (error) {
      console.log(error);
      return res.send({
        status: 500,
        error: true,
        message: 'SHow Single Seller Controller Failed',
        data: error,
      });
    }
  },

  async showAllSellers(req, res) {
    try {
      let response = await getAllSellers();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message = 'Sellers Show All Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },

  async showAllSellersIdeal(req, res) {
    try {
      let response = await getAllSellersIdeal();
      return res.status(response.status).send(response);
    } catch (error) {
      console.error(error);
      const newError = createErrorMessage();
      newError.data = error;
      newError.message =
        'Sellers Ideal Show All Controller Internal Server Error';
      newError.status = statusCode.internalServerError;
      newError.error = true;
      return res.status(newError.status).json(newError);
    }
  },
};
