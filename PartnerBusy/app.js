const express = require("express");

const fs = require("fs");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
  });
app.get("/app.js", function (req, res) {
    res.sendFile(__dirname + "/app.js", { headers: { 'Content-Type': 'application/javascript' } });
});


app.listen(8000, function () {
    console.log("server on port 8000");
  });

  app.post("/send" , (req,res)=>{
    var phone = req.body.phone
    phone = "+91"+phone
     console.log(phone)
  

  const accountSid = "AC443b7425ddc8d4b5b17758a07cd07678";
  const authToken = "01260bbd99edb82bc9e6888559f062a4";
  const client = require('twilio')(accountSid, authToken);
  
  client.calls
        .create({
           method: 'GET',
           ttatusCallback: 'https://www.myapp.com/events',
           statusCallbackEvent: ['initiated', 'answered'],
           statusCallbackMethod: 'POST',
           url: 'http://demo.twilio.com/docs/voice.xml',
           to: phone,
           from: '+919103234911'
         })
        .then(call => console.log(call));

  //   })




  })






    // "8QY2A17P3LTN1HT47Y7U45D8"