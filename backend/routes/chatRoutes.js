//here we will write the routes for the chat functionality and import all of them from chatcontrollers
const express=require("express")

const {protect}=require("../middleware/authMiddleware")
const {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}=require("../controllers/chatControllers")

const router=express.Router()

//the routes we need are accessChat only the loggedin user can access the  chat,fetchChats,createGroup,renameGroup,removefromgroup,addtogroup

router.route("/").post(protect,accessChat)
router.route("/").get(protect,fetchChats)

// //now the next one is to write the routes for group
router.route("/group").post(protect,createGroupChat)
router.route("/rename").put(protect,renameGroup)
router.route("/groupadd").put(protect,addToGroup)
router.route("/groupremove").put(protect,removeFromGroup)
// //now the last route will be to addToGroup


module.exports=router;