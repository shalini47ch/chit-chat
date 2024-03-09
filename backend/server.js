const express = require("express");
const { chats } = require("../backend/data/data");
const dotenv = require("dotenv");
const connectdb = require("./config/db");
const app = express();
const colors = require("colors");
dotenv.config();
const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
connectdb();
app.get("/", (req, res) => {
  res.send("Api running successfully");
});

//here we will try to extract dummy data
// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// //now we will try to get the details from specific id

// app.get("/api/chat/:id", (req, res) => {
//   // console.log(req.params.id)
//   //here we will try to get the information only for that single id
//   //req.params wo hai jo browser mei humlog send karre hai
//   const singleChat = chats.find((c) => c._id == req.params.id);
//   res.send(singleChat);
// });

//we are getting the data from the frontend so use it as json
app.use(express.json());

app.use("/api/user", userRoutes);

app.listen(PORT, console.log(`Server starting on port ${PORT}`.cyan.bold));
