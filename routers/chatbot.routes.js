const express = require("express")
const router = express.Router()
const handleChatQuery = require("../controllers/chatbot.controller")



router.post(
    "/query" ,
    handleChatQuery
)
module.exports = router
