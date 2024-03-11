const express = require("express");
const { registerUser, authUser,allUsers } = require("../controllers/userControllers");
const {protect}=require("../middleware/authMiddleware")

const router = express.Router();

router.route("/").post(registerUser).get(protect,allUsers); //register user means the signup

router.post("/login", authUser); //these are the controllers for which we need to create a separate folder

module.exports = router;
