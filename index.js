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
const path = require("path")
const cors = require('cors')
const Message = require("./models/message.model");
const { Socket } = require("dgram");



const app = express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});

  
let corsOption = {
        origin : "*"



    }
    app.use(cors(corsOption))
    
connectDB()


app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/trail" ,trailRoutes )
app.use("/api/auth" , authRoutes)
app.use('/api/group' , groupRoutes )
app.use("/api/checklist" , checklistRoutes)
app.use("/api/user" ,userRoutes )
app.use("/api/messages" , messageRoutes)

io.on("connection" , (socket) => {
    console.log("a user connected :" , socket.id) ;

    socket.on("joinGroup" , (groupId) => {
        socket.join(groupId) ;
        console.log(`User ${socket.id} joined group ${groupId}`) ;

    }) ;
     socket.on("leaveGroup", (groupId) => {
     socket.leave(groupId);
     console.log(`User ${socket.id} left group ${groupId}`);
  });
  socket.on("sendMessage", async ({ groupId, senderId, text }) => {
    try {
      const message = new Message({
        group: groupId,
        sender: senderId,
        text: text,
      });
      await message.save();
      
      await message.populate('sender', 'name profileImage');

      io.to(groupId).emit("newMessage", message);
    } catch (error) {
      console.error("Error saving message:", error);
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