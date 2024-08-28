var express = require('express');
var router = express.Router();

const User = require('../models/userSchema')
const Recepie = require('../models/recepieSchema')

router.get('/',async(req,res)=>{
    try{
        const recepie =await Recepie.find()
        res.render('explore',{recepie,user:req.user})
    }catch(err){
        res.send(err)
    }
})

module.exports = router;