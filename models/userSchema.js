const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    profilepic:{
        type:String,
        default:'image.png'
    },
    name:{
        type:String,
    },
    username:{
        type:String,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        RegExp:['/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/',"provide a valid email"]
    },
    bio:{
        type:String
    },
    password:{
        type:String
    },
    recepie:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'recepie'
    }],
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recepie'
    }],
    follower:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    resetPasswordToken:{
        type:Number,
        default:0
    }
})

userSchema.plugin(plm)

const user = mongoose.model('user',userSchema)

module.exports = user