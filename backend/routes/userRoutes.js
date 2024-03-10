const express = require("express");
const { registerUser, authUser } = require("../controllers/userControllers");

const router = express.Router();

router.route("/").post(registerUser); //register user means the signup

router.post("/login", authUser); //these are the controllers for which we need to create a separate folder

module.exports = router;
