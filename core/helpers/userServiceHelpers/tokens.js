const jwt = require("jsonwebtoken");
const userModels = require("../../../models/userModels/userModels");

function createAccessToken(userPayload) {
  return jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}

function createRefreshToken(_id) {
  return jwt.sign({ _id: _id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
}

async function generateAccessAndRefreshToknes(data) {
  try {
    // console.log(data,"abc");
    let user = await userModels
      .findOne({ userEmail: data })
      .select("-password -refreshToken")
      .lean();
    // console.log(user, "inside gen acc ref")

    if (!user) {
      return {
        status: 404,
        error: true,
        data: null,
        message: "user not found",
      };
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user._id);

    // console.log(user,"user without refresh token")
    // user={
    //   ...user,
    //   refreshToken:refreshToken
    // }
    // console.log(user,"user with refresh token")

    let userInstance = await userModels
      .findByIdAndUpdate(
        { _id: user._id },
        {
          $set: { refreshToken: refreshToken },
        },
        { new: true }
      )
      .select("-password -refreshToken")
      .lean();

    // console.log(userInstance,"user instance")
    // console.log("inside gen");
    // console.log(refreshToken,'ref tok in gen acc ref');
    // console.log(accessToken);

    return { accessToken, refreshToken, userInstance };
  } catch (err) {
    console.log("error from token generation function", err);
    return {
      status: 500,
      error: true,
      data: null,
      message: "internal server error",
    };
  }
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  generateAccessAndRefreshToknes,
};
