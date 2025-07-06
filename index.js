require("dotenv").config()
const express = require("express")
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require('./config/db')
const trailRoutes = require("./routers/trail.routers")
const authRoutes = require("./routers/auth.routers")
const groupRoutes = require("./routers/group.routers")
const checklistRoutes = require("./routers/checklist.routers")
const userRoutes = require("./routers/admin/user.routes")
const messageRoutes = require("./routers/message.routes")
const chatbotRoutes = require("./routers/chatbot.routes")
const path = require("path")
const cors = require('cors')
const Message = require("./models/message.model");
const { Socket } = require("dgram");
const bodyParser = require("body-parser");
const paymentRoutes = require('./routers/payment.router')


const app = express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods : ["GET" , "POST"]
  },
});

  
let corsOption = {
        origin : "*"
    }
    app.use(cors(corsOption))
    
connectDB()


app.use(express.json())
app.use(bodyParser.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/trail" ,trailRoutes )
app.use("/api/auth" , authRoutes)
app.use('/api/group' , groupRoutes )
app.use("/api/checklist" , checklistRoutes)
app.use("/api/user" ,userRoutes )
app.use("/api/messages" , messageRoutes)
app.use('/api/payment' , paymentRoutes)
// ==========chatbot =========
app.use('/api/v1/chatbot' , chatbotRoutes)

io.on("connection" , (socket) => {
    console.log("a user connected :" , socket.id) ;

    socket.on("joinGroup" , (groupId) => {
        socket.join(groupId) ;
        console.log(`User ${socket.id} joined group room ${groupId}`) ;

    }) ;
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


      const populatedMessage = await Message.findById(savedMessage._id)
          .populate('sender', 'name profileImage'); 

  
      io.to(groupId).emit("newMessage", populatedMessage);

    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit('messageError', { message: 'Could not send message.' });
    }
});
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });

})


// 5050
const PORT = process.env.PORT  || 3000

server.listen(
    PORT ,
    () => {
console.log(`Server is running on ${PORT} `)
    }

)   