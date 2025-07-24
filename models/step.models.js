const mongoose = require('mongoose')

const stepSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true} ,
    trail : {type : mongoose.Schema.Types.ObjectId , ref : 'Trail'} , 
    steps : {
        type : Number ,
    } ,
    timestamp : {type : Date , default : Date.now} ,
}) ;

module.exports = mongoose.model('Step' , stepSchema)

