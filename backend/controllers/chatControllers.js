const asyncHandler = require("express-async-handler");

const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  //first obtain the userId
  const { userId } = req.body;
  if (!userId) {
    console.log("Userid not end ");
    return res.sendStatus(400);
  }
  //here we put both the users one with we are logged in and the user with which we want to access our chats
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      //loggedin user ka id aur jo id tumne bheja
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password") //here we will populate the users but will exclude the password
    .populate("latestMessage");
  //here we are populating the user array present in our chat model

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//now create a function to perform the logic of fetchChats
const fetchChats = asyncHandler(async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  //because in req.body we need to provide the name and the users we need to be a part of the group chat
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill the required fields" });
  }
  var users = JSON.parse(req.body.users); //we get req.body.users from frontend and then parse it to use in the backend
  //there should be more than  2 users in a group chat
  if (users.length < 2) {
    return res
      .status(400)
      .send("more than 2 users are required to form a group chat");
  }
  //once this is done the logged in user should also be a part of the group chat
  users.push(req.user);

  try {
    //here we will first create the group chat
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    //now the next step is to popilate the users and the group admin
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    //in case of error throw that specific error
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  //we need the chatId and the chatName
  const { chatId, chatName } = req.body;
  //now we will update the old name with the new name
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});
//this will help us to add a new user to a group

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(400);
    throw new Error("Chat not found");
  }
  res.json(added);
});
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(400);
    throw new Error("Chat not found");
  }
  res.json(removed);
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
