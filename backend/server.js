const express = require("express");
const { chats } = require("../backend/data/data");
const {
  notFound,
  errorHandler,
} = require("../backend/middleware/errorMiddleware");
const dotenv = require("dotenv");
const connectdb = require("./config/db");
const app = express();
const colors = require("colors");
dotenv.config();
const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
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

app.use("/api/chat", chatRoutes);

//now similarly add a route for the message
app.use("/api/message", messageRoutes);

//here we will add two middlewares for error handling
app.use(notFound); //first it will go to our not found and after that even if error occurs
app.use(errorHandler); //then this error handler will be implemented

const server=app.listen(PORT, console.log(`Server starting on port ${PORT}`.cyan.bold));

//adding the socket.io

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
