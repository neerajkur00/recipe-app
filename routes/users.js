var express = require('express');
var router = express.Router();
const fs = require('fs')
const path = require('path')

const User = require('../models/userSchema')
const sendMail = require('../utils/mail')

const {isLoggedIn} =require('../utils/auth')
const upload = require('../utils/multer').single('profilepic')

const passport = require('passport')
const localStrategy = require('passport-local')
passport.use(new localStrategy(User.authenticate()))

/* GET users listing. */
router.get('/signup',(req,res)=>{
  res.render('signup')
})

router.post('/signup',async(req,res)=>{
  try{
    const {name,username,email,password} = req.body
    const newuser = new User({name,username,email})
    await User.register(newuser,password)
    res.redirect('/users/login')
  }catch(err){
    res.send(err)
  }
})

router.get('/login',(req,res)=>{
  res.render('login')
})

router.post('/login',passport.authenticate('local',{
  successRedirect:`/users/getprofilelink`,
  failureRedirect:'/users/login'
}),(req,res)=>{})

router.get('/logout',(req,res)=>{
  req.logout(()=>{
    res.redirect('/users/login')
  })
})

var save = false

router.get('/getprofilelink',(req,res)=>{
  res.redirect(`/users/profile/${req.user._id}`)
})

var isFollower = false
router.get('/profile/:id',isLoggedIn,async(req,res)=>{
  try{
    const {id} = req.params
    const user = await User.findById(id)
    const recepies = await user.populate("recepie");
    const saved = await user.populate('saved')
    if(user.follower.includes(req.user._id)){
      isFollower = true
    }else{
      isFollower = false
    }
    res.render('profile',{user,recepies,saved,save,isUser:req.user._id == id,isFollower})

  }catch(err){
    res.send(err)
  }
  
})


router.get('/created-recepies/:id',(req,res)=>{
  save = false
  res.redirect(`/users/profile/${req.params.id}`)
})

router.get('/saved-recepies/:id',(req,res)=>{
  save = true
  res.redirect(`/users/profile/${req.params.id}`)
})

router.get('/edit/:id',isLoggedIn,async(req,res)=>{
  try{
    const {id} = req.params
    const user= await User.findById(id)
    res.render('edit-profile',{user})
  }catch(err){
    res.send(err)
  }  
})
router.post('/edit/:id',async(req,res)=>{
  try{
    const {id} = req.params
    await User.findByIdAndUpdate(id,req.body)
    res.redirect(`/users/profile/${id}`)
  }catch(err){
    res.send(err)
  }
})


router.post('/image/:id',upload,async(req,res)=>{
  try{
    const {id} = req.params
    const oldData = await User.findById(id)
    if(oldData.profilepic != "image.png"){
      fs.unlinkSync(path.join(__dirname,'..','public','images',oldData.profilepic))
    }

    await User.findByIdAndUpdate(id,{profilepic:req.file.filename})
    
    res.redirect(`/users/profile/${id}`)
  }catch(err){
    res.send(err)
  }
})


router.get('/follow/:id',async(req,res)=>{
  try{
    const {id} = req.params
    const user = await User.findById(id)
    if(!user.follower.includes(req.user._id)){
      user.follower.push(req.user._id)
      await user.save()
      isFollower = true
    }else{
      user.follower.pull(req.user._id)
      await user.save()
      isFollower = false
    }
    res.redirect(`/users/profile/${id}`)
  }catch(err){
    res.send(err)
  }
})

router.get('/confirm-email',(req,res)=>{
  res.render('confirm-email')
})

router.post('/confirm-email',async(req,res)=>{
  try{
    const user =await User.findOne({email : req.body.email})
    if(user){
      sendMail(res,user)
    }else{
      res.redirect('/users/confirm-email')
    }
  }catch(err){
    res.send(err)
  }
})

router.get('/forget-password/:id',(req,res)=>{
  res.render('forget-password',{id:req.params.id})
})

router.post('/forget-password/:id',async(req,res)=>{
  try{
    const {id} = req.params
    const user = await User.findById(id)
    if(user.resetPasswordToken == 1){
      await user.setPassword(req.body.password)
      user.resetPasswordToken=0
      await user.save()
    }else{
      res.send('link expired')
    }

    res.redirect('/users/login')
  }catch(err){
    res.send(err)
  }
})

module.exports = router;