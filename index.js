require("dotenv").config()
const express = require("express")
const connectDB = require('./config/db')
const trailRoutes = require("./routers/trail.routers")
const userRoutes = require("./routers/user.routers")



const app = express()


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