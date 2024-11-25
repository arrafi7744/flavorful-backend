const ratingModel = require("../../../models/ratingModels/ratingModels");
const ratingMappingModel = require("../../../models/ratingMapperModel/ratingMappeModel");
const userModels = require("../../../models/userModels/userModels");
const productModels = require("../../../models/productModels/productModels");

module.exports = {
  async createRatingSrvc(data) {
    try {
      const ratingCount = data.ratingCount;
      if (!ratingCount) {
        return {
          status: 404,
          error: true,
          message: "Rating Count Input Missing",
          data: null,
        };
      }

      const productId = data.productId;
      if (!productId) {
        return {
          status: 404,
          error: true,
          message: "ProductId Input Missing",
          data: null,
        };
      }

      const userId = data.userId;
      if (!userId) {
        return {
          status: 404,
          error: true,
          message: "User Id Input Missing",
          data: null,
        };
      }

      const userExists = await userModels.findOne({
        _id: userId,
        isDeleted: false,
      });

      if (!userExists) {
        return {
          status: 404,
          error: true,
          message: "Failed to find the User, from the Product Schema",
          data: null,
        };
      }

      const productExists = await productModels.findOne({
        _id: productId,
        isDeleted: false,
      });

      if (!productExists) {
        return {
          status: 404,
          error: true,
          message: "Failed to find the Product, from the Product Schema",
          data: null,
        };
      }

      let ratingData = await ratingModel.findOne({
        productId: productId,
        isDeleted: false,
      });

      if (ratingData) {
        let sameUserReview = await ratingMappingModel.findOne({
          ratingId: ratingData._id,
          isDeleted: false,
        });

        if (sameUserReview) {
          return {
            status: 400,
            error: true,
            message: "This product is already reviewed by the same user",
            data: null,
          };
        }
      }

      let totalRatings = 0;
      let ratingCounts = 0;

      if (ratingData) {
        totalRatings = ratingData.totalRating + 1;
        ratingCounts = ratingData.ratingCount + data.ratingCount;
        let finalratingCount = ratingCounts / totalRatings;

        let updateRatings = await ratingModel.updateOne(
          { productId: data.productId },
          { totalRating: totalRatings, ratingCount: finalratingCount },
          { new: true }
        );
        if (updateRatings) {
          let createMapper = await ratingMappingModel.create({
            ratingId: ratingData._id,
            productId: data.productId,
            userId: data.userId,
          });

          if (createMapper) {
            return {
              status: 200,
              error: false,
              message: "Updated the rating and total count",
              data: { updateRatings, createMapper },
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "Couldn't Update the rating Count and create the Mapper",
              data: null,
            };
          }
        }
      } else {
        let createRatings = await ratingModel.create({
          productId: data.productId,
          totalRating: 1,
          ratingCount: data.ratingCount,
        });

        if (createRatings) {
          let createMapper = await ratingMappingModel.create({
            ratingId: createRatings._id,
            productId: data.productId,
            userId: data.userId,
          });

          if (createMapper) {
            return {
              status: 200,
              error: false,
              message: "Created the rating and total count",
              data: {createRatings, createMapper },
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "Couldn't Create the rating Count and create the Mapper",
              data: null,
            };
          }
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Create Rating on Rating Model",
            data: null,
          };
        }
      }

      //Total Rating Calculation here//
      let prevRating = ratingCount.length;
      let totalRatingCount = prevRating + 1;

      let createRating = await ratingModel.create({
        reviewId: reviewId,
        ratingCount: ratingCount,
        totalRating: 0,
        productId: productId,
        userId: userId,
      });
    } catch (error) {
      console.log("Create Rating Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Create Rating Service Error",
        data: error,
      };
    }
  },

  async showRatingSrvc(data) {
    try {
      let ratingDetails = await ratingModel.find({isDeleted: false});
      if(ratingDetails){
        return{
          status: 200,
          error: false,
          message: "Here is the List of all the Ratings",
          data: ratingDetails,
        }
      }else{
        return{
          status: 404,
          error: true,
          message: "No Ratings Found",
          data: null,
        }
      }
    } catch (error) {
      console.log("Show Rating Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Rating Service Error",
        data: error,
      };
    }
  },

  async showSingleRatingSrvc(params) {
    try {
      const ratId = params.id;
      let ratingDetails = await ratingModel.findOne({_id: ratId, isDeleted: false});
      if(!ratingDetails){
        return{
          status: 404,
          error: true,
          message: "Rating Details Not Found",
          data: null,
        }
      }

      let ratingMapperDetails = await ratingMappingModel.findOne({ratingId: ratId, isDeleted: false});
      if(!ratingMapperDetails){
        return{
          status: 404,
          error: true,
          message: "Rating Mapper Details Not Found",
          data: null,
        }
      }
      let userDetails = await userModels.findOne({_id: ratingMapperDetails.userId, isDeleted: false});
      if(!userDetails){
        return{
          status: 404,
          error: true,
          message: "User Details Not Found",
          data: null,
        }
      }

      let productDetails = await productModels.findOne({_id: ratingMapperDetails.productId, isDeleted: false});
      if(!productDetails){
        return{
          status: 404,
          error: true,
          message: "Products Details Not Found",
          data: null,
        }
      }

      let finalDetails = {
       useName: userDetails?.userName,
       userId: userDetails?._id,
       productName: productDetails?.productName,
       productId: productDetails?._id,
       ratingCount: ratingDetails?.ratingCount,
       totalRating: ratingDetails?.totalRating,
      }

      if(ratingDetails && ratingMapperDetails && userDetails && productDetails){
        return{
          status: 200,
          error: false,
          message: "Here is the List of the Individual Rating",
          data: finalDetails,
        }
      }else{
        return{
          status: 400,
          error: true,
          message: "Failed to Generate Individual Rating",
          data: finalDetails,
        }
      }
    } catch (error) {
      console.log("Show Single Rating Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show Single Rating Service Error",
        data: error,
      };
    }
  },

  async showAllRatingSrvc() {
    try {
      let ratingDetails = await ratingModel.find();
      if(ratingDetails){
        return{
          status: 200,
          error: false,
          message: "Here is the List of all the Ratings",
          data: ratingDetails,
        }
      }else{
        return{ 
          status: 404,
          error: true,
          message: "No Ratings Found",
          data: null,
        }
      }
    } catch (error) {
      console.log("Show All Rating Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Show All Rating Service Error",
        data: error,
      };
    }
  },

  async updateRatingSrvc(data, params) {
    try {
      const ratId = params.id;
      let ratingMapperDetails = await ratingMappingModel.findOne({ratingId: ratId, userId: data.userId, isDeleted: false});
      if(ratingMapperDetails){
        let ratingDetails = await ratingModel.findOne({_id: ratId, isDeleted: false});
        console.log(ratingDetails, "Rating Details");
        if(ratingDetails){
          let updateRatings = await ratingModel.updateOne(
            {_id: ratId},
            {ratingCount: data.ratingCount},
            {new: true},
          );

          if(updateRatings){
            return{
              status: 200,
              error: false,
              message: "Ratings Updated",
              data: updateRatings,
            }
          }else{
            return{
              status: 400,
              error: true,
              message: "Failed to Update Ratings",
              data: null,
            }
          }
        }else{
          return {
            status: 404,
            error: true,
            message: "Rating Details Not Found",
            data: null,
          }  
        }
      }else{
        return {
          status: 404,
          error: true,
          message: "Rating Mapper Not Found",
          data: null,
        }
      }
    } catch (error) {
      console.log("Update Rating Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Update Rating Service Error",
        data: error,
      };
    }
  },

  async deleteRatingSrvc(params) {
    try {
      const ratId = params.id;
      let ratingDetails = await ratingModel.findOne({_id: ratId, isDeleted: false});
      if(ratingDetails){
        let deleteRating = await ratingModel.updateOne(
          {_id: ratingDetails._id},
          {isDeleted: true, isActive: false},
          {new:true},
        )
        if(deleteRating){
          let deleteMapperRating = await ratingMappingModel.findOneAndUpdate(
            {ratingId: ratingDetails._id},
            {isDeleted: true, isActive: false},
            {new: true},
          );
          if(deleteMapperRating){
            return{
              status: 200,
              error: false,
              message: "Your Rating and Rating Mapper is Deleted",
            }
          }else{
            return{
              status: 400,
              error: true,
              message: "Failed to delete the Rating Mapper",
              data: null,
            }
          }
        }else{
          return{
            status: 400,
            error: true,
            message:"Failed to Delete Rating",
            data: null,
          }
        }
      }else{
        return{
          status: 404,
          error: true,
          message: "Cannot Find Rating Details",
          data: null,
        }
      }
    } catch (error) {
      console.log("Delete Rating Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Delete Rating Service Error",
        data: error,
      };
    }
  },
};
