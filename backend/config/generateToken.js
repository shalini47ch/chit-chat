//here we will write the logic for generating a jwt token
//jwt will help in authentication to choose only a specific user
const jwt = require("jsonwebtoken");

//jwt.sign consists of id,jwt_secret and expiresIn
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
