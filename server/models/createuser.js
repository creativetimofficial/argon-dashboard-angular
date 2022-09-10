const mongoose = require('mongoose');
const CreateUserSchema={
    firstname:String,
    lastname:String,
    username:String,
    email:String,
    dob:String,
    password:String,
    date:String
   
}
const CreateUser=mongoose.model("createuser",CreateUserSchema);
module.exports=CreateUser;
