const express=require('express');
const router=express.Router();
const cors=require('cors');
const md5=require('md5');
const AddUser=require('../models/createuser');//models to create a user
const bodyparser = require('body-parser');
router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cors())

router.post('/createuser', async function(req,res){
   const firstname=req.body.firstname;
   const lastname=req.body.lastname;
   const username=req.body.username;
   const email=req.body.email;
   const dob=req.body.dob;
   const password=md5(req.body.password);


    const adduser=  new AddUser({
             firstname:firstname,
             lastname:lastname,
             username:username,
             email:email,
              dob:dob,
             password:password,
             date:Date.now()
        }
    )
   const submit= adduser.save();
   submit.then(docs=>{
       res.status(200).json({message:"Registration successful",docs})
   }).catch(error=>{
       console.log('This is an error',error)
   })


})

module.exports=router;