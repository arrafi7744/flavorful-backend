async function incrementProductView(productId, ProductModel) {
  await ProductModel.findByIdAndUpdate(productId, { $inc: { viewsCount: 1 } });
}

async function googleSignupUserSrvc(data, UserModel) {
  try {
    const { email, name, profilePicture } = data;

    // Check if email already exists
    const emailExists = await UserModel.findOne({ userEmail: email });
    if (emailExists) {
      return {
        status: 409, // Conflict
        error: true,
        message: 'Email Already Exists',
        data: null,
      };
    }

    // Create user
    const newUser = await UserModel.create({
      userName: name.toLowerCase().replace(/\s+/g, ''), // Convert to lowercase and remove space
      userEmail: email,
      userImg: profilePicture,
      isActive: false, // Set to false until admin approval
    });

    return {
      status: 200,
      error: false,
      message: 'Google user created successfully',
      data: newUser,
    };
  } catch (error) {
    console.log('Google Signup User Service Error', error);
    return {
      status: 500,
      error: true,
      message: 'Google Signup User Service Error',
      data: error,
    };
  }
}

module.exports = {
  incrementProductView,
  googleSignupUserSrvc,
};
