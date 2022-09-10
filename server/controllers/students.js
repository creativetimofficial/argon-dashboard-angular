require("dotenv").config()
const Classgrade=require('../models/Classgrade');
const jwt=require("jsonwebtoken");



exports.createstudents=(req,res, next)=>{

    try{
    const fullname=req.body.fullname;
    const classgrade=req.body.classgrade;
    const dob=req.body.dob;
 
     const createstudents = new Classgrade({
         fullname  :   fullname,
         classgrade:   classgrade,
         dob:           dob
     })
     
     //create a token
     const token=jwt.sign({
         fullname:req.body.fullname,
         dob:req.body.dob
     },process.env.TOKEN_KEY,
     {
        expiresIn: "5h",
      });
    const submit=createstudents.save();
    //save a user token 
     createstudents.token=token
     if(submit){
        console.log("You have successfully created students")
        res.status(201).json({message:"You have sucessfully created students"});
     }
    }
    catch(err){
       console.log("There was an error in creating students",err);
       res.status(500).json({message:"Sorry please an error occured while creating students"})
    }
}


exports.searchStudents=(req,res,next)=>{
    const fullname=req.body.fullname;
    const classgrade=req.body.classgrade;

 Classgrade.findOne({fullname:fullname}).then(founduser=>{
    if(!founduser){
        res.status(500).json({message:"No students found with this name"})
    }
   else{
    //check if the student is in the same classgrade 
    if(founduser.classgrade!==classgrade){
    res.status(400).json({message:"Sorry incorrect information provided"})
    }
   else{
    //check if the student is in the same classgrade 
     res.status(200).json({message:"Correct details provided",founduser:founduser})
   }
   }
 })

}