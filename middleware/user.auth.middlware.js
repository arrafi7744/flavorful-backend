const jwt = require("jsonwebtoken");
const userModels = require("../models/userModels/userModels");
const statusCode = require("../core/status/statusCode");

async function verifyJWT(req, res, next) {
  try {
    // console.log( "hi i am here middle ware verifying jwt");
    // console.log(req.headers["authorization"]?.split(" ")[1]);

    const token =
      req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    console.log(token, "token");
    if (!token) {
      return {
        data: null,
        statusCode: statusCode.unAuthorized,
        error: true,
        message: "unathorized request",
      };
    }
    // console.log('hi verify jwt');
    // console.log("hi",process.env.ACCESS_TOKEN_SECRET);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decoded, "decoded things");
    const user = await userModels
      .findById(decoded._id)
      .select("-password -refreshToken")
      .lean();
    // console.log(user, "par kar pita");

    if (!user) {
      return {
        status: statusCode.notFound,
        data: null,
        message: "invalid user request",
        error: true,
      };
    }

    req.user = { ...user };
    // console.log(req.user,"this is req.user");
    next();
    //writing a comment when in am initiating and engaging in code :)
  } catch (error) {
    console.log(error);
    return {
      status: statusCode.internalServerError,
      error: true,
      data: null,
      messege: "auth middlware internal service error",
    };
  }
}

module.exports = { verifyJWT };
