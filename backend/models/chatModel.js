//chatName
//isGroupChat
//users
//latestMessage
//groupAdmin this is the case when we have group chat
//latestMessage will also be fetched from our database using the same schema as mongoose.Schema.Types.ObjectId
//groupAdmin is also a user so it will be of the same type as user
const mongoose = require("mongoose");
//now the next one is to create the mongoose schema
//trim is basically used so that there are no trailing spaces
//ref means it will take the reference from that specific model for example for users it will take reference from users and for latestChat it will take reference from the chat model
const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat=mongoose.model("Chat",chatModel)

module.exports=Chat
