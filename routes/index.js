var express = require('express');
var router = express.Router();
const User = require('../models/userSchema')
const Recepie = require('../models/recepieSchema')

/* GET home page. */
router.get('/', async(req, res, next)=> {
  try{
    const users = await User.find()
    const recepie = await Recepie.find()
    res.render('index',{user:req.user,users,recepie});
  }catch(err){
    res.send(err)
  }

});

module.exports = router;
