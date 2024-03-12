const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {sendMessage,allMessages}=require("../controllers/messageControllers")

const router = express.Router();

// //we need two routes one to sendMessages and the other is to fetch all the messages
router.route("/").post(protect, sendMessage);
// //the other one is to get all the messages
router.route("/:chatId").get(protect, allMessages);
module.exports=router
