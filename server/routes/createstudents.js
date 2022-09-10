const express=require('express');
const router=express.Router();
const cors=require('cors');
const verify=require('../middleware/auth')
const createstudentsController=require('../controllers/students')
const bodyparser = require('body-parser');
router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cors())

router.post('/createstudents',verify.verifyToken,createstudentsController.createstudents);

module.exports=router;