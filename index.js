require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");
const passport = require("passport");
require("./utils/OAuth"); 

const trailRoutes = require("./routers/trail.routers");
const authRoutes = require("./routers/auth.routers");
const groupRoutes = require("./routers/group.routers");
const checklistRoutes = require("./routers/checklist");
const userRoutes = require("./routers/admin/user.routes");
const messageRoutes = require("./routers/message.routes");
const chatbotRoutes = require("./routers/chatbot.routes");
const paymentRoutes = require("./routers/payment.router");
const stepRoutes = require("./routers/step.router");

// Models
const Message = require("./models/message.model");

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

connectDB();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/trail", trailRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/group", groupRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/steps", stepRoutes);

app.get("/", (req, res) => {
  res.send("TrailMate API is running ✅");
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group room ${groupId}`);
  });

  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
    console.log(`User ${socket.id} left group ${groupId}`);
  });

  socket.on("sendMessage", async ({ groupId, senderId, text }) => {
    try {
      const newMessage = new Message({
        group: groupId,
        sender: senderId,
        text: text,
      });
      const savedMessage = await newMessage.save();

      const populatedMessage = await Message.findById(savedMessage._id).populate(
        "sender",
        "name profileImage"
      );

      io.to(groupId).emit("newMessage", populatedMessage);
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("messageError", { message: "Could not send message." });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
