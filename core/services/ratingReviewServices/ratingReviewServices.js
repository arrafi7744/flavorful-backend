const ratingReviewModel = require("../../../models/ratingReviewModels/ratingReviewModels");
const productModel = require("../../../models/productModels/productModels");
const userModel = require("../../../models/userModels/userModels");

module.exports = {
  async createRatingReviewService(data) {
    try {
      const checkProductExists = await productModel.findOne({
        _id: data.productId,
        isDeleted: false,
      });
      if (!checkProductExists) {
        return {
          status: 404,
          error: true,
          message: "Product Not Found",
          data: null,
        };
      }

      const checkUserExists = await userModel.findOne({
        _id: data.userId,
        isDeleted: false,
      });
      if (!checkUserExists) {
        return {
          status: 404,
          error: true,
          message: "User Doesn't Exist",
          data: null,
        };
      }

      console.log("checkUserExists", checkUserExists);

      const crtReview = await ratingReviewModel.create({
        userId: data.userId,
        userFullName: checkUserExists?.userFullName,
        productId: data.productId,
        productName: checkProductExists?.productName,
        productThumb: checkProductExists?.productThumb,
        rating: data?.rating,
        review: data?.review,
        isDeleted: false,
        isActive: true,
      });

      if (crtReview) {
        return {
          status: 200,
          error: false,
          message: "Successfully Created the Review",
          data: crtReview,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Create the Review",
          data: null,
        };
      }
    } catch (error) {
      console.log("Create Rating Review Service Error", error);
      return {
        status: 400,
        error: true,
        message: "Create Rating Review Service Error",
        data: null,
      };
    }
  },

  async getSingleUserRatingReviewService(params) {
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

      const getAllReviews = await ratingReviewModel.find({
        userId: userId,
        isDeleted: false,
      });
      if (getAllReviews) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of the Reviews",
          data: getAllReviews,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Load all the Reviews given by this User",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get Single User Rating Review Service Error", error);
      return {
        status: 400,
        error: true,
        message: "Get Single User Rating Review Service Error",
        data: null,
      };
    }
  },

  async getSingleRatingReviewService(params) {
    try {
      let productId = params.id;
      const checkProductExists = await productModel.findOne({
        _id: productId,
        isDeleted: false,
      });
      if (!checkProductExists) {
        return {
          status: 400,
          error: true,
          message: "Product Doesn't Exists",
          data: null,
        };
      }

      const getSingleProdRvs = await ratingReviewModel.find({
        productId: productId,
        isDeleted: false,
      });
      if (getSingleProdRvs) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of the Reviews",
          data: getSingleProdRvs,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Load all the Reviews of this Product",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get Single Rating Review Service Error", error);
      return {
        status: 400,
        error: true,
        message: "Get Single Rating Review Service Error",
        data: null,
      };
    }
  },

  async getAllRatingReviewService() {
    try {
      const getAllReviews = await ratingReviewModel.find({ isDeleted: false });
      if (getAllReviews) {
        return {
          status: 200,
          error: false,
          message: "Here is the List of All the Reviews",
          data: getAllReviews,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No Reviews Found",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get All Rating Review Service Error", error);
      return {
        status: 400,
        error: true,
        message: "Get All Rating Review Service Error",
        data: null,
      };
    }
  },

  async updateSingleRatingReviewService() {
    try {
    } catch (error) {
      console.log("Update Single Rating Review Service Error", error);
      return {
        status: 400,
        error: true,
        message: "Update Single Rating Review Service Error",
        data: null,
      };
    }
  },

  async removeSingleRatingReviewService(params) {
    try {
      const reviewId = params.id;
      const checkReviewExists = await ratingReviewModel.findOne({
        _id: reviewId,
        isDeleted: false,
      });
      if (!checkReviewExists) {
        return {
          status: 400,
          error: true,
          message: "Review Doesn't exist in the DB",
          data: null,
        };
      }

      const rmvReview = await ratingReviewModel.findOneAndUpdate(
        { _id: reviewId, isDeleted: false },
        { isActive: false, status: false, isDeleted: true },
        { new: true }
      );
      if (rmvReview) {
        return {
          status: 200,
          error: false,
          message: "Review Deleted",
          data: rmvReview,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Delete the Review",
          data: null,
        };
      }
    } catch (error) {
      console.log("Remove Single Rating Review Service Error", error);
      return {
        status: 400,
        error: true,
        message: "Remove Single Rating Review Service Error",
        data: null,
      };
    }
  },

  async activateSingleRatingReviewService(params) {
    try {
      const reviewId = params.id;
      const checkReviewExists = await ratingReviewModel.findOne({
        _id: reviewId,
        isDeleted: true,
      });
      if (!checkReviewExists) {
        return {
          status: 400,
          error: true,
          message: "Review Doesn't exist in the DB",
          data: null,
        };
      }

      const rmvReview = await ratingReviewModel.findOneAndUpdate(
        { _id: reviewId, isDeleted: true },
        { isActive: true, status: true, isDeleted: false },
        { new: true }
      );
      if (rmvReview) {
        return {
          status: 200,
          error: false,
          message: "Review Activated",
          data: rmvReview,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Activate the Review",
          data: null,
        };
      }
    } catch (error) {
      console.log("Remove Single Rating Review Service Error", error);
      return {
        status: 400,
        error: true,
        message: "Remove Single Rating Review Service Error",
        data: null,
      };
    }
  },

  async removeAllRatingReviewService() {
    try {
    } catch (error) {
      console.log("Remove All Rating Review Service Error", error);
      return {
        status: 400,
        error: true,
        message: "Remove All Rating Review Service Error",
        data: null,
      };
    }
  },
};
