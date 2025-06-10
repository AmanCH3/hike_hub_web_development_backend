require("dotenv").config()
const express = require("express")
const connectDB = require('./config/db')
const trailRoutes = require("./routers/trail.routers")
const userRoutes = require("./routers/user.routers")
const cors = require('cors')



const app = express()

  
let corsOption = {
        origin : "*" // can provide list of domain



    }
    app.use(cors(corsOption))
    
connectDB()


app.use(express.json())

app.use("/api/trail" ,trailRoutes )
app.use("/api/auth" , userRoutes)


// 5050
const PORT = process.env.PORT 

app.listen(
    PORT ,
    () => {
console.log(`Server is running on ${PORT} `)
    }

)