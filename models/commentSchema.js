const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    desc:String,
    recepie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'recepie'
    },
    username:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})

const comment = mongoose.model('comment',commentSchema)

module.exports = comment