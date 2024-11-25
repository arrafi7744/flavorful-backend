const categoryModel = require('../../../models/categoryModels/categoryModels');
const productModels = require('../../../models/productModels/productModels');
const shopModel = require('../../../models/shopModel/shopModel');
const userModels = require('../../../models/userModels/userModels');

const options = {
  httpOnly: true,
  secure: true,
};

module.exports = {
  async createShopService(data) {
    const {
      userId,
      shopName,
      shopDescription,
      products,
      location,
      shopLogo,
      shopFullName,
      shopCategory,
    } = data;
    try {
      if (!userId) {
        return {
          status: 404,
          error: true,
          message: 'User Id Field Missing',
          data: null,
        };
      }
      if (!shopName) {
        return {
          status: 404,
          error: true,
          message: 'Shop Name Field Missing',
          data: null,
        };
      }

      if (!shopDescription) {
        return {
          status: 404,
          error: true,
          message: 'Shop Description Field Missing',
          data: null,
        };
      }

      if (!shopCategory) {
        return {
          status: 404,
          error: true,
          message: 'Shop Category Field Missing',
          data: null,
        };
      }
      const user = await userModels.findById(userId);

      // Check if user exists and if they are a farmer (userType === 101)
      if (!user) {
        return {
          status: 404,
          error: true,
          message: 'User Not Found',
          data: null,
        };
      }

      if (user.userType !== 101) {
        return {
          status: 403, // Forbidden
          error: true,
          message: 'Only Farmers/Sellers can create shops',
          data: null,
        };
      }

      const shopExists = await shopModel.findOne({
        shopName,
        isDeleted: false,
      });
      if (shopExists) {
        return {
          status: 409,
          error: true,
          message: 'Shop Name Exists',
          data: null,
        };
      }

      const shopDetails = {
        shopName,
        shopDescription,
        shopLogo,
        userId,
        products: [],
        shopFullName,
        location,
        shopCategory,
      };
      const createShop = await shopModel.create(shopDetails);
      if (createShop) {
        return {
          status: 200,
          error: false,
          message: 'Shop Create Successfully',
          data: createShop,
        };
      }
    } catch (error) {
      console.log('Create Shop Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Create Shop Service Error',
        data: error,
      };
    }
  },

  async getProductsByShopIdService(data) {
    const { shopId } = data;
    try {
      // Validate shopId
      if (!shopId) {
        return {
          status: 400,
          error: true,
          message: 'Shop ID is required',
          data: null,
        };
      }

      // Find the shop by ID
      const shopInfo = await shopModel.findById(shopId);
      if (!shopInfo) {
        return {
          status: 404,
          error: true,
          message: 'Shop not found',
          data: null,
        };
      }

      // Get the product IDs from the shop's products array
      const productIds = shopInfo.products;

      // Fetch all products using the product IDs
      const products = await productModels.find({
        _id: { $in: productIds },
        isDeleted: false,
      });

      // Check if there are any products
      if (!products || products.length === 0) {
        return {
          status: 404,
          error: true,
          message: 'No products found for this shop',
          data: null,
        };
      }

      // Return the list of products
      return {
        status: 200,
        error: false,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        error: true,
        message: 'Failed to retrieve products',
        data: null,
      };
    }
  },

  async showAllShopService() {
    try {
      const shopDetails = await shopModel.find({ isDeleted: false });
      if (shopDetails) {
        return {
          status: 200,
          error: false,
          message: 'Success',
          data: shopDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: 'No Shop Data Found',
          data: null,
        };
      }
    } catch (error) {
      console.log('Show All Shop Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Show All Shop Service Error',
        data: error,
      };
    }
  },

  
  async showAllShopByIdService(data) {
    try {
      const shopDetails = await shopModel.find({ isDeleted: false, userId: data.userId });
      if (shopDetails) {
        return {
          status: 200,
          error: false,
          message: 'Success',
          data: shopDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: 'No Shop Data Found',
          data: null,
        };
      }
    } catch (error) {
      console.log('Show All Shop Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Show All Shop Service Error',
        data: error,
      };
    }
  },

  async showSingleShopService(data) {
    try {
      let catCode = data.categoryCode;
      let catDetails = await categoryModel.findOne({
        categoryCode: catCode,
        isDeleted: false,
      });
      if (catDetails === null) {
        return {
          status: 404,
          error: true,
          message: 'No Category Found',
          data: null,
        };
      }
      return {
        status: 200,
        error: false,
        message: 'Here is the Category',
        data: catDetails,
      };
    } catch (error) {
      console.log('Show Single Category Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Show Single Category Service Error',
        data: error,
      };
    }
  },

  async deletingShopService(params) {
    try {
      // const catCode = data.categoryCode;
      const catId = params.id;
      const alreadyDeletedCat = await categoryModel.findOne({
        _id: catId,
        isDeleted: true,
      });
      if (alreadyDeletedCat !== null) {
        return {
          status: 409,
          error: true,
          message: 'Category Already Deleted Earlier',
          data: null,
        };
      }

      const deleteCat = await categoryModel.findOne({
        _id: catId,
        isDeleted: false,
      });
      if (deleteCat) {
        const result = await categoryModel.updateOne(
          { _id: catId },
          { isDeleted: true, isActive: false },
          { new: true }
        );
        return {
          status: 200,
          error: false,
          message: 'Category Deleted',
          data: result,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: 'Category Not Found',
          data: null,
        };
      }
    } catch (error) {
      console.log('Delete Category Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Delete Category Service Error',
        data: error,
      };
    }
  },
};
