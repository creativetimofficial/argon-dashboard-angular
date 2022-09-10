const express=require('express');
const router=express.Router();
const AddUser=require('../models/createuser');
const cors=require('cors');
router.use(cors());
router.get('/getallusers',async function(req,res){
 AddUser.find({},function(err,docs){
 res.json({"data":docs})
})


})


module.exports=router;