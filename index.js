const express = require('express');
const app=express();
const cors = require('cors');
const port=process.env.PORT||5000

require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());

// basic

app.get('/',(req,res)=>{
    res.send('My e-com is Running in 5000');
})

app.listen(port,()=>{
    console.log(`My e-com is running on ${port}`);
})