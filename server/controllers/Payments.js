const https=require('https');
require("dotenv").config()
exports.schoolFeesPayment=(request,res,next)=>{


    const params = JSON.stringify({
      "email": "customer@email.com",
      "amount": "20000"
    })
    
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: 'Bearer sk_live_eebc6bd6fca7c71758f8a69d4aa93fbf1a9f4991',
        'Content-Type': 'application/json'
      }
    }
    
    const req = https.request(options, res => {
      let data = ''
    
      res.on('data', (chunk) => {
        data += chunk
      });
    
      res.on('end', () => {
        console.log(JSON.parse(data))
      })
    }).on('error', error => {
      console.error(error)
    })
    
    req.write(params)
    req.end()

 
}