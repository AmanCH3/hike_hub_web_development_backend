require("dotenv").config()
const express = require("express")
const connectDB = require('./config/db')
const trailRoutes = require("./routers/trail.routers")
const authRoutes = require("./routers/auth.routers")
const groupRoutes = require("./routers/group.routers")
const checklistRoutes = require("./routers/checklist.routers")
const userRoutes = require("./routers/admin/user.routes")
const cors = require('cors')



const app = express()

  
let corsOption = {
        origin : "*" // can provide list of domain



    }
    app.use(cors(corsOption))
    
connectDB()


app.use(express.json())

app.use("/api/trail" ,trailRoutes )
app.use("/api/auth" , authRoutes)
app.use('/api/group' , groupRoutes )
app.use("/api/checklist" , checklistRoutes)
app.use("/api/user" ,userRoutes )


// 5050
const PORT = process.env.PORT 

app.listen(
    PORT ,
    () => {
console.log(`Server is running on ${PORT} `)
    }

)