const productModels = require("../../../models/productModels/productModels");
const statusCode = require("../../status/statusCode");
const stockModel = require("../../../models/stockModels/stockModel");
const path = require("path");
const shopModel = require("../../../models/shopModel/shopModel");
const recentViews = require("../../../models/recentViewModels/recentViewModels");
const orderMOdels = require("../../../models/orderModels/orderModels");
const { incrementProductView } = require("../../../helper");
const orderModels = require("../../../models/orderModels/orderModels");

module.exports = {
  async createProductSrvc(data) {
    try {
      let thumbnail = null;

      const {
        productName,
        productDescription,
        buyingPrice,
        sellingPrice,
        discount,
        categoryId,
        sellerId,
        stockQuantity,
        userId,
        // productThumb,
        shopId,
      } = data.body;

      const { productThumb, productsImg  } = data.files;

      if (!sellerId) {
        return {
          status: 404,
          error: true,
          message: "sellerId field missing",
          data: null,
        };
      }
      if (!shopId) {
        return {
          status: 404,
          error: true,
          message: "ShopId field missing",
          data: null,
        };
      }

      if (!productName) {
        return {
          status: 404,
          error: true,
          message: "Product Name field missing",
          data: null,
        };
      }

      if (!productDescription) {
        return {
          status: 404,
          error: true,
          message: "Product Description field missing",
          data: null,
        };
      }

      if (!sellingPrice) {
        return {
          status: 404,
          error: true,
          message: "Selling Price field missing",
          data: null,
        };
      }

      if (!productThumb) {
        return {
          status: 404,
          error: true,
          message: "Product Thumbnail field missing",
          data: null,
        };
      }

      if (!buyingPrice) {
        return {
          status: 404,
          error: true,
          message: "Product Buying Price field missing",
          data: null,
        };
      }

      if (!categoryId) {
        return {
          status: 404,
          error: true,
          message: "Product Category Id field missing",
          data: null,
        };
      }

      if (!stockQuantity) {
        return {
          status: 404,
          error: true,
          message: "Product Stock Quantity field missing",
          data: null,
        };
      }

      if (buyingPrice < 0) {
        return {
          status: 409,
          error: true,
          message: "Buying price cannot be below 0",
          data: null,
        };
      }

      const existsProductName = await productModels.findOne({
        productName: productName,
        isDeleted: false,
      });

      if (existsProductName) {
        return {
          status: 409,
          error: true,
          message: "Product Name Exists",
          data: null,
        };
      }

      const shopInfo = await shopModel.findById(shopId);

      if (!shopInfo) {
        return {
          status: 404,
          error: true,
          message: "Shop Not Found",
          data: null,
        };
      }

      if (productThumb) {
        const prodThumb = Array.isArray(productThumb)
          ? productThumb
          : [productThumb]; // Ensure it's always an array

        const imageName = path
          .normalize(prodThumb[0].path)
          .split(path.sep)
          .pop();
        thumbnail = imageName;
      }

      if (productsImg) {
        const prodImgs = Array.isArray(productsImg)
          ? productsImg
          : [productsImg];
  
        images = prodImgs.map((img) => {
          const imageName = path.normalize(img.path).split(path.sep).pop();
          return { path: imageName, originalName: img.originalname };
        });
      }

      const createProduct = await productModels.create({
        userId,
        shopId,
        // shopName: shopInfo.shopName,
        // shopLogo: shopInfo.shopLogo,
        // shopCategory: shopInfo.shopCategory,
        // shopAddress: shopInfo.location,
        productName,
        productDescription,
        buyingPrice,
        sellingPrice,
        categoryId,
        sellerId,
        productThumb: thumbnail,
        productsImg: images
      });

      if (!createProduct) {
        return {
          status: 500,
          error: true,
          data: null,
          message: "Product failed to create",
        };
      }

      const prodId = createProduct._id.toString();

      const createStock = await stockModel.create({
        stockQTY: stockQuantity,
        productId: prodId,
      });

      if (!createStock) {
        return {
          status: 500,
          error: true,
          data: createProduct,
          message: "Stock failed to create",
        };
      }

      ///update products [] array with productId in the Shop collection

      if (shopInfo && createProduct) {
        if (createProduct) {
          // Add the product ID to the products array
          shopInfo.products.push(createProduct._id.toString());

          // Save the updated shopInfo back to the database
          await shopInfo.save();
        }
      }

      return {
        status: 201,
        error: false,
        data: createProduct,
        message: "Product and Stock created successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        error: true,
        message: "Create Products Services Failed",
        data: null,
      };
    }
  },

  async searchProducts(data) {
    try {
      const { pQuery } = data;

      if (!pQuery) {
        return {
          status: 400,
          error: true,
          data: null,
          message: "Search Query is Missing",
        };
      }

      // Search for products with names that match the query, case insensitive
      const products = await productModels.find({
        productName: { $regex: pQuery, $options: "i" },
        isDeleted: false, // Exclude deleted products
      });

      if (products.length === 0) {
        return {
          status: 404,
          error: false,
          data: [],
          message: "No Product Found",
        };
      }

      return {
        status: 200,
        error: false,
        data: products,
        message: "Product fouund successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        error: true,
        data: [],
        message: "Product Search Service failed",
      };
    }
  },

  async getAllProductSrvc() {
    try {
      const result = await productModels.find({ isDeleted: false });
      if (result.length === 0) {
        return {
          status: 200,
          error: false,
          message: "No Products Listed",
          data: null,
        };
      }
      return {
        status: 200,
        error: false,
        message: "Shown All the Products",
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Products Services Failed",
        data: error,
      };
    }
  },

  async fetchAllProductsByPdId(data) {
    try {
      const { userId } = data;
      if (!userId) {
        return {
          status: 400,
          error: true,
          data: null,
          message: "User Id is Missing",
        };
      }
      const result = await productModels.find({ isDeleted: false, userId });
      if (result.length === 0) {
        return {
          status: 200,
          error: false,
          message: "No Products Listed",
          data: null,
        };
      }
      return {
        status: 200,
        error: false,
        message: "Success",
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Products Services Failed",
        data: error,
      };
    }
  },

  async calculateTotalRevenue() {
    try {
      // Aggregate to calculate the total revenue for the specified user
      const result = await orderModels.aggregate([
        { $match: { isDelivered: true } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$productSellingPrice" },
          },
        },
      ]);

      // Check if result has data, return the total revenue or 0 if no data
      const totalRevenue = result[0]?.totalRevenue || 0;

      return {
        status: 200,
        error: false,
        message: "Total Revenue Calculated Successfully",
        data: { totalRevenue },
      };
    } catch (error) {
      console.error(error);
      return {
        status: 409,
        error: true,
        message: "Calculate Total Revenue Service Failed",
        data: error,
      };
    }
  },

  async calculateTotalRevenueByUserId(data) {
    try {
      const { sellerId } = data;

      // Aggregate to calculate the total revenue for the specified user where isDelivered is true
      const result = await orderModels.aggregate([
        { $match: { sellerId, isDelivered: true } }, // Match sellerId and isDelivered
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$productSellingPrice" }, // Sum productSellingPrice
          },
        },
      ]);

      // Check if result has data, return the total revenue or 0 if no data
      const totalRevenue = result[0]?.totalRevenue || 0;

      return {
        status: 200,
        error: false,
        message: "Total Revenue Calculated Successfully",
        data: { totalRevenue },
      };
    } catch (error) {
      console.error(error);
      return {
        status: 409,
        error: true,
        message: "Calculate Total Revenue Service Failed",
        data: error,
      };
    }
  },

  async getAllPopularProductSrvc() {
    try {
      const result = await productModels
        .find({ isDeleted: false })
        .sort({ salesCount: -1 }) // Sort by salesCount in descending order
        .limit(10); // Limit to top 10
      if (result.length === 0) {
        return {
          status: 200,
          error: false,
          message: "No Popular Products Listed",
          data: null,
        };
      }
      return {
        status: 200,
        error: false,
        message: "Shown All the Popular Products",
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Popular Products Services Failed",
        data: error,
      };
    }
  },

  async filterProductPrice(data) {
    try {
      const { sort = "asc" } = data;
      // Expecting 'asc' or 'desc' for sorting

      // Set sorting order based on query
      const sortOrder = sort === "desc" ? -1 : 1;

      const products = await productModels
        .find()
        .sort({ sellingPrice: sortOrder });
      return {
        status: 200,
        error: false,
        message: "Success",
        data: products,
      };
    } catch (error) {
      console.log("Show filter Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Filter Service Error",
        data: error,
      };
    }
  },

  async getAllCategorisedProductSrvc(params) {
    try {
      const catId = params.id;
      const result = await productModels.find({
        categoryId: catId,
        isDeleted: false,
      });
      if (result.length === 0) {
        return {
          status: 200,
          error: false,
          message: "No Products Listed",
          data: null,
        };
      }
      return {
        status: 200,
        error: false,
        message: "Shown All the Categorised Products",
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Category Wise Products Services Failed",
        data: error,
      };
    }
  },

  async getAllDeletedProductSrvc() {
    try {
      const result = await productModels.find({
        isDeleted: true,
        isActive: false,
      });
      if (result.length === 0) {
        return {
          status: 200,
          error: false,
          message: "No Deleted Products Listed",
          data: null,
        };
      }
      return {
        status: 200,
        error: false,
        message: "Shown All Deleted Products",
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Deleted Products Services Failed",
        data: error,
      };
    }
  },

  async getAllProductsIdealService() {
    try {
      const result = await productModels.find();
      if (result) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of All Products",
          data: result,
        };
      } else {
        return {
          status: 404,
          error: false,
          message: "Conflict on Loading Product Details",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Products Ideal Services Failed",
        data: error,
      };
    }
  },
  // async showSingleProductService(data) {
  //   try {
  //     const prodId = data.productId;
  //     const userId = data.userId;

  //     if (!prodId) {
  //       return {
  //         status: 404,
  //         error: false,
  //         message: 'UserId and Product Id are mendatory',
  //         data: null,
  //       };
  //     }

  //     // Find product details
  //     const productDetails = await productModels.findOne({
  //       _id: prodId,
  //       isDeleted: false,
  //     });

  //     if (productDetails) {
  //       // Increment product view
  //       incrementProductView(prodId, productModels);

  //       // Check if the product already exists in recentViews for this user
  //       const existingView = await recentViews.findOne({
  //         userId: userId,
  //         productId: prodId,
  //       });

  //       if (!existingView) {
  //         // If it does not exist, add it to recentViews
  //         await recentViews.create({
  //           userId: userId,
  //           productId: prodId,
  //           productDetails: productDetails,
  //           viewedAt: new Date(),
  //         });
  //       }

  //       return {
  //         status: 200,
  //         error: false,
  //         message: 'Here is the Product Details',
  //         data: productDetails,
  //       };
  //     } else {
  //       return {
  //         status: 404,
  //         error: true,
  //         message: 'Product Not Found',
  //         data: null,
  //       };
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       status: 409,
  //       error: true,
  //       message: 'Get All Products Ideal Services Failed',
  //       data: error,
  //     };
  //   }
  // },
  async showSingleProductService(data) {
    try {
      const prodId = data.productId;
      const userId = data.userId;

      if (!prodId) {
        return {
          status: 404,
          error: false,
          message: "Product Id is mandatory",
          data: null,
        };
      }

      const productDetails = await productModels.findOne({
        _id: prodId,
        isDeleted: false,
      });

      if (productDetails) {
        if (userId) {
          const existingView = await recentViews.findOne({
            userId: userId,
            productId: prodId,
          });

          if (!existingView) {
            // If it does not exist, add it to recentViews
            await recentViews.create({
              userId: userId,
              productId: prodId,
              productDetails: productDetails,
              viewedAt: new Date(),
            });
          }
        }

        return {
          status: 200,
          error: false,
          message: "Here is the Product Details",
          data: productDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Product not found",
          data: null,
        };
      }
    } catch (error) {
      return {
        status: 409,
        error: true,
        message: "Get Single Product Services Failed",
        data: error,
      };
    }
  },

  async showRecentProducts() {
    try {
      const result = await recentViews.find();
      if (result) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of All Recent Products",
          data: result,
        };
      } else {
        return {
          status: 404,
          error: false,
          message: "No Recent Product Details",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Recent Products Ideal Services Failed",
        data: error,
      };
    }
  },

  async showRecentProductsById(data) {
    try {
      if (!data.userId) {
        return {
          status: 404,
          error: true,
          message: "User id is missing",
          data: null,
        };
      }
      const result = await recentViews.find({ userId: data.userId });
      if (result) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of All Recent Products",
          data: result,
        };
      } else {
        return {
          status: 404,
          error: false,
          message: "No Recent Product Details",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Get All Recent Products Ideal Services Failed",
        data: error,
      };
    }
  },

  async deleteProductService(data) {
    try {
      const prodId = data.id;

      if (!prodId) {
        return {
          status: 409,
          error: true,
          message: "Input Feild Missing",
          data: null,
        };
      }

      let prodExists = await productModels.findOne({ _id: prodId });
      if (!prodExists) {
        return {
          status: 404,
          error: true,
          message: "Product Not Found",
          data: null,
        };
      }

      let prodDelete = await productModels.findOneAndUpdate(
        { _id: prodId },
        { isDeleted: true, isActive: false },
        { new: true }
      );

      if (prodDelete) {
        let stockDelete = await stockModel.findOneAndUpdate(
          { productId: prodId },
          { isDelete: true, isActive: false },
          { new: true }
        );

        if (stockDelete) {
          const shopInfo = await shopModel.findById(prodExists.shopId);
          if (shopInfo) {
            // Remove the product ID from the products array
            shopInfo.products = shopInfo.products.filter(
              (productId) => productId.toString() !== prodId.toString()
            );

            // Save the updated shop information
            await shopInfo.save();
          }
          return {
            status: 200,
            error: false,
            message: "Successfully Deleted the Product and Its Stock",
            data: stockDelete,
            prodDelete,
          };
        } else {
          return {
            stats: 400,
            error: true,
            message: "Failed to Delete the Product's Stock",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Delete Products Services Failed",
        data: error,
      };
    }
  },

  async activateProductService(data) {
    try {
      const prodId = data.id;

      if (!prodId) {
        return {
          status: 409,
          error: true,
          message: "Input Feild Missing",
          data: null,
        };
      }

      let prodExists = await productModels.findOne({ _id: prodId });
      if (!prodExists) {
        return {
          status: 404,
          error: true,
          message: "Product Not Found",
          data: null,
        };
      }

      let prodDelete = await productModels.findOneAndUpdate(
        { _id: prodId },
        { isDeleted: false, isActive: true },
        { new: true }
      );

      if (prodDelete) {
        let stockDelete = await stockModel.findOneAndUpdate(
          { productId: prodId },
          { isDelete: false, isActive: true },
          { new: true }
        );

        if (stockDelete) {
          return {
            status: 200,
            error: false,
            message: "Successfully Activated the Product and Its Stock",
            data: stockDelete,
            prodDelete,
          };
        } else {
          return {
            stats: 400,
            error: true,
            message: "Failed to Activate the Product's Stock",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Delete Products Services Failed",
        data: error,
      };
    }
  },

  async updateProductInfoService(data, params) {
    try {
      const prodId = params.id;
      const prodExists = await productModels.findOne({
        _id: prodId,
        isDeleted: false,
      });
      if (!prodExists) {
        return {
          status: 404,
          error: true,
          message: "Product Dont Exists",
          data: null,
        };
      }

      if (data?.productName) {
        const result = await productModels.updateOne(
          { _id: prodId },
          { productName: data.productName },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Product Name Changed",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Change the Product Name",
            data: null,
          };
        }
      }

      if (data?.productDescription) {
        const result = await productModels.updateOne(
          { _id: prodId },
          { productDescription: data.productDescription },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Product Description Changed",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Change the Product Description",
            data: null,
          };
        }
      }

      if (data?.buyingPrice) {
        const result = await productModels.updateOne(
          { _id: prodId },
          { buyingPrice: data.buyingPrice },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Product Buying Price Changed",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Change the Product Buying Price",
            data: null,
          };
        }
      }

      if (data?.sellingPrice) {
        const result = await productModels.updateOne(
          { _id: prodId },
          { sellingPrice: data.sellingPrice },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Product Selling Price Changed",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Change the Product Selling Price",
            data: null,
          };
        }
      }

      if (data?.stockCount) {
        const result = await stockModel.updateOne(
          { productId: prodId },
          { stockQTY: data?.stockCount },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Stock Quantity Updated",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to update Stock qty",
            data: null,
          };
        }
      }

      if (data?.discount) {
        const result = await productModels.updateOne(
          { _id: prodId },
          { discount: data.discount },
          { new: true }
        );
        if (result) {
          return {
            status: 200,
            error: false,
            message: "Product Discount Changed",
            data: result,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Change the Product Discount",
            data: null,
          };
        }
      }
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Update Products Info Services Failed",
        data: error,
      };
    }
  },

  async getPopularProducts() {
    try {
    } catch (error) {
      console.log(error);
      return {
        status: 409,
        error: true,
        message: "Popular Products Services Failed",
        data: error,
      };
    }
  },
};
