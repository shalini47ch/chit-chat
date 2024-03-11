const jwt = require("jsonwebtoken");
//we need the userModel as it is the user whose bearer token we need and should authenticate
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

//now here we will write the logic for the middleware
const protect = asyncHandler(async (req, res, next) => {
  let token; //this is the token we will get from the loggedIn user
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //here the token is generally in the form of Bearer jwertttfddghff
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = await User.findById(decoded.id).select("-password");
      //this means that we will return the user without the password
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Not authorized,token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized,no token");
  }
});
module.exports = { protect };
