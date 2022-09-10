const express=require('express');
const router=express.Router();
const bodyparser = require('body-parser');
const searchStudent=require('../controllers/students')
const cors=require('cors');
router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cors());


router.post('/searchstudentinfo',searchStudent.searchStudents)
  module.exports=router;