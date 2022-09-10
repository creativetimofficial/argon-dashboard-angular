const mongoose = require('mongoose');
const ClassGradeSchema={
   fullname:String,
   classgrade:String,
   dob:String,
   token:String
}
const Classgrade=mongoose.model("Classgrade",ClassGradeSchema);
module.exports=Classgrade;