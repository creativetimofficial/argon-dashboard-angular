const express=require("express");
const router=express.Router();
const payment=require('../controllers/Payments')

router.post('/schoolfeespayment',payment.schoolFeesPayment);

module.exports=router;