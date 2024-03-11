//here we will create the logic for registration page
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//using async handler so that all the errors can be accumulated at one place

const registerUser = asyncHandler(async (req, res) => {
  //take few things that we need from req.body
  const { name, email, password, pic } = req.body;

  //once we have destructed these then we will find if all the things are provided or not if not then throw errors
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }
  //here we will first check if the user already exists or not
  //here we are finding the user with a specific email
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  //now if the user doesnt exist then we will create a new user
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  //if there are users then we will send them in the response
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    //this is the case when the user doesnt exist
    res.status(400);
    throw new Error("failed to create the user");
  }
});

//similarly create a function for auth user
//here we will perform the authentication for our user

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //now here we will check if the user already exists and if the password entered is equal to the password in our mongodb database
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("enter valid email or password");
  }
});

//here write a function to get all the users
//here we will perform the query like ?search these type of queries will help us to find the users
const allUsers = asyncHandler(async (req, res) => {
  //req.query will give us the output of the queries we use
  //here we will use or operator to search for the query with specific name and email
  //$i is for case sensitivity
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  //here we will find the keyword from the user model
  const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
  res.send(users)
  // console.log(keyword);
});

module.exports = { registerUser, authUser, allUsers };
