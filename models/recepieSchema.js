const mongoose = require('mongoose')

const recepieSchema = new mongoose.Schema({
    name:{
        type:String
    },
    image:{
        type:String 
    },
    ingriedents:{
        type:[]
    },
    steps:{
        type:[]
    },
    recepieType:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    likes:[],
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comment'
    }]
})

const recepie = mongoose.model('recepie',recepieSchema)

module.exports = recepie