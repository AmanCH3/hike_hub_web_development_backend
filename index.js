// index.js
require("dotenv").config()
const express = require("express")
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require('./config/db')
const trailRoutes = require("./routers/trail.routers")
const authRoutes = require("./routers/auth.routers")
const groupRoutes = require("./routers/group.routers")
const userRoutes = require("./routers/admin/user.routes")
const messageRoutes = require("./routers/message.routes")
const chatbotRoutes = require("./routers/chatbot.routes")
const analyticsRoutes = require("./routers/analytics.router")
const activityRoutes = require("./routers/activity.router");
const path = require("path")
const cors = require('cors')
const Message = require("./models/message.model");
const bodyParser = require("body-parser");
const paymentRoutes = require('./routers/payment.router')
const checklistRoutes = require('./routers/checklist')
const { checkSubscriptionStatus } = require('./middlewares/subscription.middleware'); // --- NEW ---
const subscriptionRoutes = require("./routers/subscription.routes");

console.log("Application starting...");

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


const corsOptions = {
  origin: "http://localhost:5173", // ✅ your frontend dev server
  credentials: true,               // ✅ allow cookies/headers
};

app.use(cors(corsOptions));

connectDB()

app.use(express.json())
app.use(bodyParser.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Middleware for JSON, body-parser, and static file serving has been set up.");

// --- APPLY MIDDLEWARE TO ALL ROUTES ---
app.use("/api", checkSubscriptionStatus);
app.use('/api/subscription', subscriptionRoutes);
console.log("Subscription middleware and routes have been configured.");

// API Routes
app.use("/api/trail" ,trailRoutes )
app.use("/api/auth" , authRoutes)
app.use('/api/group' , groupRoutes )
app.use("/api/checklist" , checklistRoutes)
app.use("/api/user" ,userRoutes )
app.use("/api/messages" , messageRoutes)
app.use('/api/payment' , paymentRoutes)
app.use('/api/analytics' , analyticsRoutes)
app.use('/api/activity', activityRoutes);
app.use('/api/v1/chatbot' , chatbotRoutes)
console.log("API routes have been configured.");

// ... (keep the rest of your index.js file the same) ...
io.on("connection" , (socket) => {
//     console.log("A user connected:" , socket.id) ;

    socket.on("joinGroup" , (groupId) => {
        socket.join(groupId) ;
//         console.log(`User ${socket.id} joined group room ${groupId}`) ;

    }) ;
     socket.on("leaveGroup", (groupId) => {
     socket.leave(groupId);
//      console.log(`User ${socket.id} left group ${groupId}`);
  });
  socket.on("sendMessage", async ({ groupId, senderId, text }) => {
    console.log(`Received message from sender ${senderId} for group ${groupId}: "${text}"`);
    try {
 
      const newMessage = new Message({
        group: groupId,
        sender: senderId,
        text: text,
      });
      const savedMessage = await newMessage.save();
      console.log("Message saved to the database:", savedMessage);


      const populatedMessage = await Message.findById(savedMessage._id)
          .populate('sender', 'name profileImage');
      console.log("Broadcasting new message to group", groupId);

 
      io.to(groupId).emit("newMessage", populatedMessage);

    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit('messageError', { message: 'Could not send message.' });
    }
});
  socket.on("disconnect", () => {
//     console.log("user disconnected:", socket.id);
  });

})

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


module.exports = app