const userModels = require("../../../models/userModels/userModels.js");
const bcrypt = require("bcrypt");
const path = require("path");
const TOKENS = require("../../helpers/userServiceHelpers/tokens.js");
const { googleSignupUserSrvc } = require("../../../helper.js");
const customerModel = require("../../../models/customerModels/customerModel.js");
const sellerModel = require("../../../models/SellerModels/sellerModel.js");

//declaring global options
const options = {
  httpOnly: true,
  secure: true,
};

const UserTypes = {
  FARMER: 101,
  BUYER: 103,
  ADMIN: 109,
};

module.exports = {
  async createUserSrvc(data, filePath) {
    try {
      let imageName = null; // Initialize imageName to null

      if (filePath && filePath.path) {
        // Check if filePath exists and has a path property
        // Use path.basename to get only the file name
        imageName = path.basename(filePath.path);
      }

      // Check userType to handle different types of user creation
      if (data.userType === UserTypes.BUYER) {
        const {
          userName,
          userEmail,
          userType,
          userPass,
          gender,
          userFullName,
          phoneNumber,
          shippingCountry,
          shippingState,
          shippingAddress,
          shippingPostalCode,
        } = data;

        // Validation checks
        if (!userName) {
          return {
            status: 404,
            error: true,
            message: "User Name Field Missing",
            data: null,
          };
        }

        if (!userType) {
          return {
            status: 404,
            error: true,
            message: "User Type Field Missing",
            data: null,
          };
        }

        // if (!phoneNumber) {
        //   return {
        //     status: 404,
        //     error: true,
        //     message: 'Phone Number Field Missing',
        //     data: null,
        //   };
        // }

        if (!userPass) {
          return {
            status: 404,
            error: true,
            message: "User Pass Field Missing",
            data: null,
          };
        }

        if (!userEmail) {
          return {
            status: 404,
            error: true,
            message: "User Email Field Missing",
            data: null,
          };
        }

        // if (!gender) {
        //   return {
        //     status: 404,
        //     error: true,
        //     message: 'User Gender Field Missing',
        //     data: null,
        //   };
        // }

        // if (!userFullName) {
        //   return {
        //     status: 404,
        //     error: true,
        //     message: 'User Full Name Field Missing',
        //     data: null,
        //   };
        // }

        // Check if email already exists
        const emailExists = await userModels.findOne({ userEmail });
        if (emailExists) {
          return {
            status: 409,
            error: true,
            message: "Email Already Exists",
            data: null,
          };
        }

        // Check if phone number already exists
        // const phoneNumberExists = await userModels.findOne({ phoneNumber });
        // if (phoneNumberExists) {
        //   return {
        //     status: 409,
        //     error: true,
        //     message: 'Phone Number Already Exists',
        //     data: null,
        //   };
        // }

        // Check if username already exists
        const userNameExists = await userModels.findOne({ userName });
        if (userNameExists) {
          return {
            status: 409,
            error: true,
            message: "User Name Already Exists",
            data: null,
          };
        }

        // Encrypt password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userPass, salt);

        // Create user
        const userCreation = await userModels.create({
          userName: userName.toLowerCase(),
          userEmail,
          userType: UserTypes.BUYER,
          userPass: hash,
          userImg: imageName, // Set user image
          gender,
          phoneNumber,
          userFullName,
          isActive: true,
        });
        //console.log('userCreation', userCreation);

        // Create customer details if user creation was successful
        const customerDetails = await customerModel.create({
          userId: userCreation._id,
          userType: UserTypes.BUYER,
          shippingCountry,
          shippingState,
          shippingAddress,
          shippingPostalCode,
        });

        if (!customerDetails) {
          return {
            status: 500,
            error: true,
            message: "Cannot Create Customer (from user Services)",
            data: null,
          };
        }

        return {
          status: 200,
          error: false,
          message: "Create Seller Successfully",
          data: { userCreation, customerDetails },
        };
      } else if (data.userType === UserTypes.FARMER) {
        const {
          userName,
          userEmail,
          userPass,
          gender,
          userFullName,
          phoneNumber,
        } = data;

        if (!userName) {
          return {
            status: 404,
            error: true,
            message: "User Name Field Missing",
            data: null,
          };
        }

        if (!userEmail) {
          return {
            status: 404,
            error: true,
            message: "User Email Field Missing",
            data: null,
          };
        }

        if (!userPass) {
          return {
            status: 404,
            error: true,
            message: "User Password Field Missing",
            data: null,
          };
        }

        const emailExists = await userModels.findOne({ userEmail });
        if (emailExists) {
          return {
            status: 409, // 409 Conflict
            error: true,
            message: "Email Already Exists",
            data: null,
          };
        }

        // Perform similar validation checks for userType "1"
        // ...

        // Encrypt password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userPass, salt);

        // Create user
        const userCreation = await userModels.create({
          userName: userName.toLowerCase(),
          userEmail,
          userType: UserTypes.FARMER,
          //creatorId: data.creatorId,
          approvalId: "",
          userPass: hash,
          userImg: imageName, // Set user image
          gender,
          phoneNumber,
          userFullName,
          isActive: false,
        });

        return {
          status: 200,
          error: false,
          message: "Farmer/Seller Create Successfully",
          data: userCreation,
        };
      } else if (data.userType === UserTypes.ADMIN) {
        const {
          userName,
          userEmail,
          userType,
          userPass,
          gender,
          userFullName,
          phoneNumber,
          initialSalary,
        } = data;

        // Perform similar validation checks for userType "1"
        // ...

        // Encrypt password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userPass, salt);

        // Create user
        const userCreation = await userModels.create({
          userName: userName.toLowerCase(),
          userEmail,
          userType: UserTypes.ADMIN,
          userPass: hash,
          userImg: imageName, // Set user image
          gender,
          phoneNumber,
          userFullName,
          isActive: true,
        });

        return {
          status: 200,
          error: false,
          message: "Admin Create Successfully",
          data: userCreation,
        };
      }

      return {
        status: 409,
        error: true,
        message: "Failed to create User Details",
        data: null,
      };
    } catch (error) {
      console.log("Create User Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Create User Service Error",
        data: error,
      };
    }
  },

  // async googleSignupUserSrvc(data) {
  //   try {
  //     const { email, name, profilePicture } = data;

  //     // Check if email already exists
  //     const emailExists = await userModels.findOne({ userEmail: email });
  //     if (emailExists) {
  //       return {
  //         status: 409, // Conflict
  //         error: true,
  //         message: 'Email Already Exists',
  //         data: null,
  //       };
  //     }

  //     // Create user
  //     const newUser = await userModels.create({
  //       userName: name.toLowerCase().replace(/\s+/g, ''), // Convert to lowercase and remove space
  //       userEmail: email,
  //       userImg: profilePicture,
  //       isActive: false, // Set to false until admin approval
  //     });

  //     return {
  //       status: 200,
  //       error: false,
  //       message:
  //         'Google user created successfully. Waiting for admin approval.',
  //       data: newUser,
  //     };
  //   } catch (error) {
  //     console.log('Google Signup User Service Error', error);
  //     return {
  //       status: 500,
  //       error: true,
  //       message: 'Google Signup User Service Error',
  //       data: error,
  //     };
  //   }
  // },

  async adminApproveUser(data) {
    const { userId } = data;
    try {
      if (!userId) {
        return {
          status: 404,
          error: true,
          data: null,
          message: "Please give the user id",
        };
      }
      // Find the user by ID
      const user = await userModels.findById(userId);

      if (!user) {
        return {
          status: 404,
          error: true,
          data: null,
          message: "user does not exist",
        };
      }
      user.isActive = true;
      user.approvalId = data.approvalId;
      await user.save();

      return {
        status: 200,
        error: false,
        message: "User Approval Successfully",
        data: user,
      };
    } catch (error) {
      console.log("Admin Approval Error", error);
      return {
        status: 500,
        error: true,
        message: "Admin Approval Error",
        data: error,
      };
    }
  },

  async adminRejectUser(data) {
    const { userId } = data;
    try {
      if (!userId) {
        return {
          status: 404,
          error: true,
          data: null,
          message: "Please give the user id",
        };
      }
      // Find the user by ID
      const user = await userModels.findById(userId);

      if (!user) {
        return {
          status: 404,
          error: true,
          data: null,
          message: "user does not exist",
        };
      }
      user.isActive = false;
      user.approvalId = data.approvalId;
      await user.save();

      return {
        status: 200,
        error: false,
        message: "User Reject Successfully",
        data: user,
      };
    } catch (error) {
      console.log("Admin Rejection Error", error);
      return {
        status: 500,
        error: true,
        message: "Admin Reject Error",
        data: error,
      };
    }
  },

  async loginUserSrvc(data) {
    try {
      const { email, password } = data;
      // console.log(email, "email");
      if (!email || !password) {
        return {
          status: 404,
          error: true,
          data: null,
          message: "input feild missing",
        };
      }

      // console.log(email,password,"print");
      const user = await userModels.findOne({ userEmail: email });
      // console.log(user, "hit or not");
      if (!user) {
        return {
          status: 404,
          error: true,
          data: null,
          message: "user does not exist",
        };
      }

      // Check if the account is active
      if (!user.isActive) {
        return {
          status: 403,
          error: true,
          data: null,
          message: "Account is not active. Please contact the admin.",
        };
      }

      const match = await bcrypt.compare(password, user.userPass);
      // console.log(match, "match results");
      if (!match) {
        return {
          status: 401,
          error: true,
          data: null,
          message: "invalid user Credential",
        };
      }

      //  console.log(email,"with what ")
      const { accessToken, refreshToken, userInstance } =
        await TOKENS.generateAccessAndRefreshToknes(email);
      // console.log(accessToken, "actokens");
      // console.log(refreshToken, "retokens");
      // console.log(userInstance, "logged in");
      let modifiedUser = {
        ...userInstance,
        accessToken,
      };
      // console.log(modifiedUser, "modified user");

      let response = { options, modifiedUser };

      return {
        status: 200,
        error: false,
        message: "List of all the Users",
        data: response,
      };
    } catch (error) {
      console.log("Create User Service Error", error);
      return {
        status: 500,
        error: true,
        message: "login User Service Error",
        data: error,
      };
    }
  },

  async googleLoginUserSrvc(data) {
    try {
      const { email, name, picture, token } = data;

      if (!email) {
        return {
          status: 404,
          error: true,
          message: "User Email Field Missing",
          data: null,
        };
      }

      if (!name) {
        return {
          status: 404,
          error: true,
          message: "User Name Field Missing",
          data: null,
        };
      }

      // Verify token with Firebase Admin SDK (optional for security)
      const existingUser = await userModels.findOne({ userEmail: email });
      //console.log('existing user', existingUser);

      // if (existingUser) {
      //   return {
      //     status: 403,
      //     error: true,
      //     data: null,
      //     message: 'User already exisits',
      //   };
      // }
      if (!existingUser) {
        const newUser = await googleSignupUserSrvc(data, userModels);
        // const newUser = await googleSignupUserSrvc({
        //   email,
        //   name,
        //   profilePicture: picture || null,
        // });
        return newUser;
      }

      // Check if account is active
      if (!existingUser.isActive) {
        return {
          status: 201,
          error: false,
          data: null,
          message: "Account is not active. Please contact the admin.",
        };
      }

      // Generate access tokens and return login response
      const { accessToken, refreshToken, userInstance } =
        await TOKENS.generateAccessAndRefreshToknes(email);

      let modifiedUser = {
        ...userInstance,
        accessToken,
      };

      return {
        status: 200,
        error: false,
        message: "Google login successful",
        data: modifiedUser,
      };
    } catch (error) {
      console.log("Google Login User Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Google Login User Service Error",
        data: error,
      };
    }
  },

  async crtUserInfo(data) {
    try {
      const { userType, userId, gender, phoneNumber } = data;

      if (!userType) {
        return {
          status: 404,
          error: true,
          message: "User Type Field Missing",
          data: null,
        };
      }
      if (!userId) {
        return {
          status: 404,
          error: true,
          message: "User ID Field Missing",
          data: null,
        };
      }

      const findUser = await userModels.findOne({
        _id: userId,
        isDeleted: false,
      });

      //console.log('find', findUser);
      let usType = false;
      if (userType === "101") {
        usType = false;
      } else {
        usType = true;
      }
      console.log("userType", userType);
      if (findUser) {
        // Prepare update data
        const updateData = {
          userType: userType,
          isActive: usType,
          phoneNumber: phoneNumber,
          gender: gender,
        };

        await userModels.updateOne(
          { _id: userId },
          { $set: updateData },
          { new: true }
        );
        const updatedUser = await userModels.findOne({
          _id: userId,
          isDeleted: false,
        });
        //console.log('update user info', updatedUser);

        return {
          status: 200,
          error: false,
          message: "User information create successfully",
          data: updatedUser,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "User not found.",
          data: null,
        };
      }
    } catch (error) {
      console.log("User Info Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Create User Service Error",
        data: error,
      };
    }
  },

  async crtAdminInfo(data) {
    try {
      const { userName, userEmail, userPass } = data;

      const checkEmail = await userModels.findOne({ userEmail: userEmail });
      if (checkEmail) {
        return {
          status: 404,
          error: true,
          message: "Email Exists Already",
          data: null,
        };
      }

      const checkuserName= await userModels.findOne({ userName: userName });
      if (checkuserName) {
        return {
          status: 404,
          error: true,
          message: "UserName Exists Already",
          data: null,
        };
      }

      const updatedUser = await userModels.create({
        userType: 109,
        userEmail: userEmail,
        userPass: userPass,
        userName: userName,
        isActive: true
      });

      if (updatedUser) {
        return {
          status: 200,
          error: false,
          message: "Admin create successfully",
          data: updatedUser,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Create the Admin",
          data: null,
        };
      }
    } catch (error) {
      console.log("User Info Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Admin Creation Service Error",
        data: error,
      };
    }
  },

  async getAllUsers() {
    try {
      let response = await userModels.find({ isDeleted: false });
      return {
        status: 200,
        error: false,
        message: "List of all the Users",
        data: response,
      };
    } catch (error) {
      console.log("Create User Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Create User Service Error",
        data: error,
      };
    }
  },

  async updateUserPasswordSrvc(body, params) {
    try {
      const userId = params.id;
      const newPassword = body.newPassword;

      // Find the user by ID
      const user = await userModels.findOne({ _id: userId, isDeleted: false });
      if (!user) {
        return {
          status: 404,
          error: true,
          message: "User not found",
          data: null,
        };
      }

      // Encrypt the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the user's password in the database
      const updateUserPassword = await userModels.findOneAndUpdate(
        { _id: userId, isDeleted: false },
        {
          userPass: hashedPassword,
        },
        { new: true }
      );

      if (updateUserPassword) {
        return {
          status: 200,
          error: false,
          message: "Password updated successfully",
          data: updateUserPassword,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Change the Password",
          data: null,
        };
      }
    } catch (error) {
      console.log("Update User Password Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Update User Password Service Error",
        data: error,
      };
    }
  },

  async getAllUsersIdeal() {
    try {
      const allUserDetails = await userModels.find();
      if (allUserDetails) {
        return {
          status: 200,
          error: false,
          message: "Here are all the lists of Users",
          data: allUserDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to load all the list of users",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get All USers Ideal Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Get All Users Ideal Service Error",
        data: error,
      };
    }
  },

  async getAllVendorUsers() {
    try {
      const allUserDetails = await userModels.find({ userType: 101 });
      if (allUserDetails) {
        return {
          status: 200,
          error: false,
          message: "Here are all the lists of vendor Users",
          data: allUserDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to load all the list of vendor users",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get All Vendor user Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Get All Users Ideal Service Error",
        data: error,
      };
    }
  },

  async getAllBuyerUsers() {
    try {
      const allUserDetails = await userModels.find({ userType: 103 });
      if (allUserDetails) {
        return {
          status: 200,
          error: false,
          message: "Here are all the lists of  Users",
          data: allUserDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to load all the list of  users",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get All user Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Get All Users Ideal Service Error",
        data: error,
      };
    }
  },

  async getSingleUser(data) {
    try {
      let userId = data.id;
      const userDetails = await userModels.findOne({
        _id: userId,
      });
      if (userDetails) {
        return {
          status: 200,
          error: false,
          message: "Here is the Details of the User...",
          data: userDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to Load Single User (from get single user service)",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get Single Users Ideal Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Get SIngle Users Ideal Service Error",
        data: error,
      };
    }
  },

  async removeUserServices(data) {
    try {
      let userId = data.id;

      let userExists = await userModels.findOne({ _id: userId });
      if (!userExists) {
        return {
          status: 404,
          error: true,
          message: "No User Found",
          data: null,
        };
      }

      let prevResponse = await userModels.findOne({
        _id: userId,
        isDeleted: true,
        isActivate: false,
      });
      if (prevResponse) {
        return {
          status: 500,
          error: true,
          message: "User is already having {isDeleted: true}",
          data: null,
        };
      }

      let response = await userModels.findOneAndUpdate(
        { _id: userId },
        {
          isDeleted: true,
          isActive: false,
          deletedDate: Date.now(),
        },
        { new: true }
      );

      if (!response) {
        return {
          status: 409,
          error: true,
          message: "Failed to Remove User",
          data: null,
        };
      }

      if (response.userType === 2) {
        let removeCustomer = await customerModel.findOneAndUpdate(
          { userId: response._id },
          {
            isDeleted: true,
            isActive: false,
            deletedDate: Date.now(),
          },
          { new: true }
        );

        if (removeCustomer) {
          return {
            status: 200,
            error: false,
            message: "Removed User and Customer(Using Remove User Services)",
            data: response,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Remove the Customer",
            data: null,
          };
        }
      } else if (response.userType === 1) {
        let removeSeller = await sellerModel.findOneAndUpdate(
          { userId: response._id },
          {
            isDeleted: true,
            isActive: false,
            deletedDate: Date.now(),
          },
          { new: true }
        );

        if (removeSeller) {
          return {
            status: 200,
            error: false,
            message: "Removed User and Seller(Using Remove User Services)",
            data: response,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Remove the Seller",
            data: null,
          };
        }
      }
      return {
        status: 200,
        error: true,
        message: "Removed the User",
        data: null,
      };
    } catch (error) {
      console.log("Remove User Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Remove User Service Error",
        data: error,
      };
    }
  },

  async activateUserServices(data) {
    try {
      let userId = data.id;

      let userExists = await userModels.findOne({ _id: userId });
      if (!userExists) {
        return {
          status: 404,
          error: true,
          message: "No User Found",
          data: null,
        };
      }

      let prevResponse = await userModels.findOne({
        _id: userId,
        isDeleted: true,
        isActive: false,
      });
      if (prevResponse) {
        return {
          status: 500,
          error: true,
          message: "User is already having {isActive: true}",
          data: null,
        };
      }

      let response = await userModels.findOneAndUpdate(
        { _id: userId },
        {
          isDeleted: false,
          isActive: true,
          // deletedDate: Date.now(),
        },
        { new: true }
      );

      if (!response) {
        return {
          status: 409,
          error: true,
          message: "Failed to Activate User",
          data: null,
        };
      }

      if (response.userType === 2) {
        let removeCustomer = await customerModel.findOneAndUpdate(
          { userId: response._id },
          {
            isDeleted: false,
            isActive: true,
            // deletedDate: Date.now(),
          },
          { new: true }
        );

        if (removeCustomer) {
          return {
            status: 200,
            error: false,
            message: "Activated User and Customer(Using Remove User Services)",
            data: response,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Activate the Customer",
            data: null,
          };
        }
      } else if (response.userType === 1) {
        let removeSeller = await sellerModel.findOneAndUpdate(
          { userId: response._id },
          {
            isDeleted: false,
            isActive: true,
            // deletedDate: Date.now(),
          },
          { new: true }
        );

        if (removeSeller) {
          return {
            status: 200,
            error: false,
            message: "ACtivated User and Seller(Using ACtivate User Services)",
            data: response,
          };
        } else {
          return {
            status: 409,
            error: true,
            message: "Failed to Active the Seller",
            data: null,
          };
        }
      }
      return {
        status: 200,
        error: false,
        message: "Activated the User",
        data: response,
      };
    } catch (error) {
      console.log("Activating User Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Activating User Service Error",
        data: error,
      };
    }
  },

  async updateUserInformation(body, params) {
    try {
      let userId = params.id;
      let updateInfo = body;
      let findUsers = null;

      console.log(updateInfo, "Update Info");

      findUsers = await userModels.findOne({ _id: userId, isDeleted: false });

      if (findUsers) {
        if (updateInfo.userName) {
          const result = await userModels.updateOne(
            { _id: userId },
            { userName: updateInfo.userName },
            { new: true }
          );
          if (result) {
            return {
              status: 200,
              error: false,
              message: "Username Changed",
              data: result,
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "Username didn't Changed",
              data: null,
            };
          }
        }

        if (updateInfo.userEmail) {
          const result = await userModels.updateOne(
            { _id: userId },
            { userEmail: updateInfo.userEmail },
            { new: true }
          );
          if (result) {
            return {
              status: 200,
              error: false,
              message: "User email Changed",
              data: result,
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "User Email didn't Changed",
              data: null,
            };
          }
        }

        if (updateInfo.userImg) {
          const result = await userModels.updateOne(
            { _id: userId },
            { userImg: updateInfo.userImg },
            { new: true }
          );
          if (result) {
            return {
              status: 200,
              error: false,
              message: "User Image Changed",
              data: result,
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "User Image didn't Changed",
              data: null,
            };
          }
        }

        if (updateInfo.userType) {
          const result = await userModels.updateOne(
            { _id: userId },
            { userType: updateInfo.userType },
            { new: true }
          );
          if (result) {
            return {
              status: 200,
              error: false,
              message: "User Type:(Admin/User) Changed",
              data: result,
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "User Type didn't Changed",
              data: null,
            };
          }
        }

        if (updateInfo.gender) {
          const result = await userModels.updateOne(
            { _id: userId },
            { gender: updateInfo.gender },
            { new: true }
          );
          if (result) {
            return {
              status: 200,
              error: false,
              message: "User Gender Changed",
              data: result,
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "User Gender didn't Changed",
              data: null,
            };
          }
        }

        if (updateInfo.userFullName) {
          const result = await userModels.updateOne(
            { _id: userId },
            { userFullName: updateInfo.userFullName },
            { new: true }
          );
          if (result) {
            return {
              status: 200,
              error: false,
              message: "User Full Name Changed",
              data: result,
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "User Full Name didn't Changed",
              data: null,
            };
          }
        }

        if (updateInfo.userNumber) {
          const result = await userModels.updateOne(
            { _id: userId },
            { phoneNumber: updateInfo.userNumber },
            { new: true }
          );
          if (result) {
            return {
              status: 200,
              error: false,
              message: "User Phone Number Changed",
              data: result,
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "User Phone Number didn't Changed",
              data: null,
            };
          }
        }

        if (updateInfo.shippingAddress) {
          const result = await customerModel.updateOne(
            { userId: userId },
            { shippingAddress: updateInfo.shippingAddress },
            { new: true }
          );
          if (result) {
            return {
              status: 200,
              error: false,
              message: "User Shipping Address Changed",
              data: result,
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "User Shipping Address didn't Changed",
              data: null,
            };
          }
        }

        if (updateInfo.shippingState) {
          const result = await customerModel.updateOne(
            { userId: userId },
            { shippingState: updateInfo.shippingState },
            { new: true }
          );
          if (result) {
            return {
              status: 200,
              error: false,
              message: "User Shipping State Changed",
              data: result,
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "User Shipping State didn't Changed",
              data: null,
            };
          }
        }

        if (updateInfo.shippingPostalCode) {
          const result = await customerModel.updateOne(
            { userId: userId },
            { shippingPostalCode: updateInfo.shippingPostalCode },
            { new: true }
          );
          if (result) {
            return {
              status: 200,
              error: false,
              message: "User shipping postal code Changed",
              data: result,
            };
          } else {
            return {
              status: 409,
              error: true,
              message: "User shipping postal code didn't Changed",
              data: null,
            };
          }
        }
      }
    } catch (error) {
      console.log("User Information Update Service Error", error);
      return {
        status: 500,
        error: true,
        message: "User Information Update Service Error",
        data: error,
      };
    }
  },

  async getAllCustomers() {
    try {
      const allCustomers = await customerModel.find({ isDeleted: false });
      if (allCustomers) {
        return {
          status: 200,
          error: false,
          message: "Here are the List of All the Customers",
          data: allCustomers,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "All Customer Details Failed to Find",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get All Customers Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Get All Customer Service Error",
        data: error,
      };
    }
  },

  async getAllCustomersIdeal() {
    try {
      const allUserDetails = await customerModel.find();
      if (allUserDetails) {
        return {
          status: 200,
          error: false,
          message: "Here are all the lists of Customers",
          data: allUserDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to load all the list of Customers",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get All Customers Ideal Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Get All Customers Ideal Service Error",
        data: error,
      };
    }
  },

  async getSingleCustomer(data) {
    try {
      let userId = data.id;
      let userDetails = await userModels.findOne({
        _id: userId,
        isDeleted: false,
      });
      const initId = userDetails._id;
      let userStringId = initId.toString();
      if (userDetails) {
        let customerDetails = await customerModel.findOne({
          userId: userStringId,
          isDeleted: false,
        });

        if (userDetails && customerDetails) {
          return {
            status: 200,
            error: false,
            message: "here are the user details",
            data: { userDetails, customerDetails },
          };
        } else {
          return {
            status: 404,
            error: true,
            message: "Failed to Find the Customer Details",
            data: null,
          };
        }
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to Find Initial Details",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get Single User Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Get Single User Service Error",
        data: error,
      };
    }
  },

  async getAllSellers() {
    try {
      const allCustomers = await sellerModel.find({ isDeleted: false });
      if (allCustomers) {
        return {
          status: 200,
          error: false,
          message: "Here are the List of All the Sellers",
          data: allCustomers,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "All Seller Details Failed to Find",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get All Sellers Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Get All Sellers Service Error",
        data: error,
      };
    }
  },

  async getAllSellersIdeal() {
    try {
      const allUserDetails = await sellerModel.find();
      if (allUserDetails) {
        return {
          status: 200,
          error: false,
          message: "Here are all the lists of Customers",
          data: allUserDetails,
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to load all the list of Customers",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get All Customers Ideal Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Get All Customers Ideal Service Error",
        data: error,
      };
    }
  },

  async getSingleSeller(data) {
    try {
      let userId = data.id;
      console.log(userId, "userId");
      let userDetails = await userModels.findOne({
        _id: userId,
        isDeleted: false,
      });

      console.log(userDetails, "UserDetails");

      const initId = userDetails._id;
      let userStringId = initId.toString();
      if (userDetails) {
        let sellerDetails = await sellerModel.findOne({
          userId: userStringId,
          isDeleted: false,
        });

        console.log(sellerDetails, "Seller Details");
        if (userDetails && sellerDetails) {
          return {
            status: 200,
            error: false,
            message: "here are the seller details",
            data: { userDetails, sellerDetails },
          };
        } else {
          return {
            status: 404,
            error: true,
            message: "Failed to Find the Seller Details",
            data: null,
          };
        }
      } else {
        return {
          status: 404,
          error: true,
          message: "Failed to Find Initial Details",
          data: null,
        };
      }
    } catch (error) {
      console.log("Get Single Seller Service Error", error);
      return {
        status: 500,
        error: true,
        message: "Get Single Seler Service Error",
        data: error,
      };
    }
  },
};
