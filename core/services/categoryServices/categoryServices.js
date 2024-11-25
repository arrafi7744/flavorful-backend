const categoryModel = require('../../../models/categoryModels/categoryModels');
const productModel = require('../../../models/productModels/productModels');
const subCategoryModel = require('../../../models/subCategoryModels/subCategoryModels');

const options = {
  httpOnly: true,
  secure: true,
};

module.exports = {
  async createCategoryService(data) {
    try {
      const catName = data.categoryName;
      const catCode = data.categoryCode;
      // const catIconName = data.categoryIcon;

      const existsCatName = await categoryModel.findOne({
        categoryName: catName,
        isDeleted: false,
      });
      if (existsCatName !== null) {
        return {
          status: 409,
          error: true,
          message: 'Category Name Exists',
          data: null,
        };
      }
      const existsCatCode = await categoryModel.findOne({
        categoryCode: catCode,
        isDeleted: false,
      });
      if (existsCatCode !== null) {
        return {
          status: 409,
          error: true,
          message: 'Category Code Exists',
          data: null,
        };
      }

      const categoryDetails = {
        categoryName: catName,
        categoryCode: catCode,
        // categoryIcon: catIconName,
      };
      const createCategory = await categoryModel.create(categoryDetails);
      if (createCategory) {
        return {
          status: 200,
          error: false,
          message: 'Successfully Created Category',
          data: createCategory,
        };
      }
    } catch (error) {
      console.log('Create Category Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Create Category Service Error',
        data: error,
      };
    }
  },

  async createSubCategoryService(data) {
    try {
      const catName = data.subCategoryName.toLowerCase();
      const categoryId = data.categoryId;
      const subCategoryCodeString = data.subCategoryCode;
      // const subCatIconName = data.subCategoryIconName;
      const subCategoryCode = parseInt(subCategoryCodeString);

      const existsCatName = await subCategoryModel.findOne({
        subCategoryName: catName,
        isDeleted: false,
      });

      if (existsCatName !== null) {
        return {
          status: 409,
          error: true,
          message: 'Sub-Category Name Exists',
          data: null,
        };
      }
      const existsCatCode = await subCategoryModel.findOne({
        categoryCode: subCategoryCode,
        isDeleted: false,
      });

      if (existsCatCode !== null) {
        return {
          status: 409,
          error: true,
          message: 'Category Code Exists',
          data: null,
        };
      }

      const existsCategory = await categoryModel.findOne({
        _id: categoryId,
        isDeleted: false,
      });

      if (!existsCategory) {
        return {
          status: 400,
          error: true,
          message: "Category Doesn't Exists",
          data: null,
        };
      }

      const subCategoryDetails = {
        subCategoryName: catName,
        subCategoryCode: subCategoryCode,
        categoryId: categoryId,
        // subCategoryIconName: subCatIconName,
      };
      const createSubCategory = await subCategoryModel.create(
        subCategoryDetails
      );
      if (createSubCategory) {
        return {
          status: 200,
          error: false,
          message: 'Successfully Created Sub-Category',
          data: createSubCategory,
        };
      }
    } catch (error) {
      console.log('Create Sub Category Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Create Sub Category Service Error',
        data: error,
      };
    }
  },

  async showAllCategoryService() {
    try {
      const categoryDetails = await categoryModel.find({ isDeleted: false });
      if (categoryDetails) {
        return {
          status: 200,
          error: false,
          message: 'Here are all the Categories',
          data: categoryDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: 'No Category Found',
          data: null,
        };
      }
    } catch (error) {
      console.log('Show All Category Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Show All Category Service Error',
        data: error,
      };
    }
  },

  async showAllSubCategoryService() {
    try {
      const categoryDetails = await subCategoryModel.find({ isDeleted: false });
      if (categoryDetails) {
        return {
          status: 200,
          error: false,
          message: 'Here are all the Sub-Categories',
          data: categoryDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: 'No Sub-Category Found',
          data: null,
        };
      }
    } catch (error) {
      console.log('Show All Sub-Category Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Show All Sub-Category Service Error',
        data: error,
      };
    }
  },

  async showSingleCategoryService(data) {
    try {
      let catCode = data.id;
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

  async showSingleSubCategoryService(data) {
    try {
      let catCode = data.subCategoryCode;
      let catDetails = await subCategoryModel.findOne({
        subCategoryCode: catCode,
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
        message: 'Here is the Sub-Category',
        data: catDetails,
      };
    } catch (error) {
      console.log('Show Single Sub-Category Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Show Single Category Service Error',
        data: error,
      };
    }
  },

  async deletingCategoryService(params) {
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

  async deletingSubCategoryService(data) {
    try {
      const catCode = data.subCategoryCode;
      const alreadyDeletedCat = await subCategoryModel.findOne({
        categoryCode: catCode,
        isDeleted: true,
      });
      if (alreadyDeletedCat !== null) {
        return {
          status: 409,
          error: true,
          message: 'Sub-Category Already Deleted Earlier',
          data: null,
        };
      }

      const deleteCat = await subCategoryModel.findOne({
        subCategoryCode: catCode,
        isDeleted: false,
      });
      if (deleteCat) {
        const result = await subCategoryModel.updateOne(
          { subCategoryCode: catCode },
          { isDeleted: true, isActive: false },
          { new: true }
        );
        return {
          status: 200,
          error: false,
          message: 'Sub-Category Deleted',
          data: result,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: 'Sub-Category Not Found',
          data: null,
        };
      }
    } catch (error) {
      console.log('Delete Sub-Category Service Error', error);
      return {
        status: 500,
        error: true,
        message: 'Delete Sub-Category Service Error',
        data: error,
      };
    }
  },
};
