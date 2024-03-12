const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  //we need to have the content and the chatId where we need to send the message
  const { content, chatId } = req.body;
  //now here you perfrom some validations
  if (!content || !chatId) {
    console.log("Invalid data is passed in the request");
    return res.status(400);
  }
  var newMessage = {
    sender: req.user._id, //this is the id of the loggedin user
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    //similarly populate all the chats as well
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages=asyncHandler(async(req,res)=>{
    //here we will fetchAll the message present
    //here we will obtain the chatId from the params
    try{
        const messages=await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat")

        res.json(messages);

    }
    catch(error){
        //now here we will handle the error
        res.status(400);
        throw new Error(error.message);


    }

})
module.exports = { sendMessage,allMessages };
