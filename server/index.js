const express=require('express');
const bodyparser = require('body-parser');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
const port=4000;
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
const schoolfeespayment=require('./routes/schoolFeesPayment');
const createstudents=require('./routes/createstudents');
const createuser=require('./routes/createuserroutes');
const getallusers=require('./routes/getallusers');
const edituser=require('./routes/edituser');
const deleteuser=require('./routes/deleteuser');
const userlogin=require('./routes/userlogin')
const employeeperformance=require('./routes/employee_performance');
const getsingledata=require('./routes/getsingledata');
const personaldevelopment=require('./routes/personaldevelopment');
const getemployeeobjectives=require('./routes/getemployeeobjectives');
const getSingleemployeeobjective=require('./routes/getSingleemployeeobjective');
const managersendappraisal=require('./routes/managersendappraisal');
const searchstudentinfo=require('./routes/searchstudentinfo');
const managerlogin=require('./routes/adminuserroutes');
const getallemployeeobjectives=require('./routes/getallemployeeobjectives');
const getallpersonaldevelopment=require('./routes/getallpersonaldevelopment');
const md5=require('md5')
app.use(cors());
app.use('/schoolfeespayment',schoolfeespayment);
app.use('/createstudents',createstudents)
app.use('/createuser',createuser);
app.use('/personaldevelopment',personaldevelopment)
app.use('/employeeperformance',employeeperformance);
app.use('/getallusers',getallusers);
app.use('/edituser',edituser);
app.use('/deleteuser',deleteuser);
app.use('/userlogin',userlogin);
app.use('/getsingledata',getsingledata);
app.use('/getemployeeobjectives',getemployeeobjectives);
app.use('/getSingleemployeeobjective',getSingleemployeeobjective);
app.use('/managersendappraisal',managersendappraisal);
app.use('/searchstudentinfo',searchstudentinfo);
app.use('/managerlogin',managerlogin);
app.use('/getallemployeeobjectives',getallemployeeobjectives)
app.use('/getallpersonaldevelopment',getallpersonaldevelopment)


const mongodb='mongodb://localhost:27017/hris';
mongoose.connect(mongodb,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>
{
  console.log("successfully connected to the database");
}).catch(err=>{
  console.log("error connecting to the database",err)
});


app.listen(4000,()=>{
    console.log("server is running on port "+port);
})
console.log(md5("123456"))
