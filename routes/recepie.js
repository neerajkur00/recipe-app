var express = require('express');
var router = express.Router();
const fs = require('fs')
const path = require('path')
const upload = require('../utils/multer').single('image')
const {isLoggedIn} = require('../utils/auth')

const User = require('../models/userSchema')
const Recepie = require('../models/recepieSchema')
const Comments = require('../models/commentSchema')

router.get('/create',(req,res)=>{
    res.render('create-recepie',{user:req.user})
})

router.post('/create',upload,isLoggedIn,async(req,res)=>{
    try{
        const recepieData = {
            name:req.body.name,
            image:req.file.filename,
            ingriedents:req.body.ingriedents.split('\n'),
            steps:req.body.steps.split('\n'),
            recepieType:req.body.recepieType,
            user:req.user._id
        }
        
        const newRecepie = new Recepie(recepieData)
        req.user.recepie.push(newRecepie._id)
        await newRecepie.save()  
        await req.user.save()
        res.redirect(`/users/profile/${req.user._id}`)
    }catch(err){
        res.send(err)
    }
})

var isComments = false
var isLiked = false
var isSaved = false
router.get('/detail/:id',isLoggedIn,async(req,res)=>{
    try{
        const {id} = req.params
        const recepie = await Recepie.findById(id)
        const comments = await recepie.populate('comment')
        var del = false
        
        if(req.user._id.equals(recepie.user)){
            del = true
        } 

        if(recepie.likes.includes(req.user._id)){
            isLiked = true
        } else{
            isLiked=false
        }

        if(req.user.saved.includes(id)){
            isSaved = true
        } else{
            isSaved=false
        }
        
        res.render('recepie-detail',{recepie,del,comments,isComments,user:req.user,isLiked,isSaved})
    }catch(err){
        res.send(err)
    }
})

router.get('/delete/:id',async(req,res)=>{
    try{
        const recepie = await Recepie.findByIdAndDelete(req.params.id)
        fs.unlinkSync(path.join(__dirname,'..','public','images',recepie.image))
        await req.user.recepie.pull(recepie._id)
        await req.user.saved.pull(recepie._id)
        await req.user.save()
        res.redirect('/users/profile')
    }catch(err){
        res.send(err)
    }
})

router.get('/save/:id',async(req,res,)=>{
    try{
    if (!req.user.saved.includes(req.params.id)){
        req.user.saved.push(req.params.id)
        await req.user.save()
    }
    res.redirect(`/users/profile/${req.user._id}`)
    }catch(err){
        res.send(err)
    }
})

router.get('/remove/:id',async(req,res)=>{
    try{
       
        req.user.saved.pull(req.params.id)
        await req.user.save()
        
        res.redirect(`/users/profile/${req.user._id}`)
    }catch(err){
        res.send(err)
    }
})

router.get('/like/:id',async(req,res)=>{
    try{
        const recepie =await Recepie.findById(req.params.id)
        if(!recepie.likes.includes(req.user._id)){
            recepie.likes.push(req.user._id)
            await recepie.save()
            isLiked = true
        }else{
            recepie.likes.pull(req.user._id)
            await recepie.save()
            isLiked= false
        }
        res.redirect(`/recepie/detail/${req.params.id}`)
    }catch(err){
        res.send(err)
    }
})

router.post('/comment/:id',async(req,res)=>{
    try{
       const {id} = req.params 
       const comment =await new Comments({
        desc:req.body.desc,
        username : req.user.username,
        user:req.user._id,
        recepie : id
        })
       
       const recepie = await Recepie.findById(id)
       recepie.comment.push(comment._id)
       await recepie.save()
       await comment.save()
       res.redirect(`/recepie/detail/${id}`)
    }catch(err){
        res.send(err)
    }
})


router.get('/comment/:id',async(req,res)=>{
    try{
      isComments = true
       res.redirect(`/recepie/detail/${req.params.id}`) 
    }catch(err){
        res.send(err)
    }
})

module.exports = router;
