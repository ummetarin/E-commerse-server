const express = require('express');
const app=express();
const cors = require('cors');
const port=process.env.PORT||5000

require('dotenv').config()
const stripe=require('stripe')(process.env.STRIP_SECRET_KEY);



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdvzwaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

     const dressdata=client.db('Ecomdata').collection('Alldress');
     const carddata=client.db('Ecomdata').collection('carddata');
     const reviewdata=client.db('Ecomdata').collection('revdata');
     const userdata=client.db('Ecomdata').collection('users');

    //  dressdata
    app.get('/dress',async (req,res)=>{
      const result= await dressdata.find().toArray();
      res.send(result);
    })

     app.get('/dress/:id',async(req,res)=>{
      const id=req.params.id;
      const query={ _id : new ObjectId(id) }
      const user=await dressdata.findOne(query);
      res.send(user);
     })

     app.post('/dress',async (req,res)=>{
      const dressitem=req.body;
      const result=await dressdata.insertOne(dressitem)
      res.send(result);

    })
    
    //  review

    app.get('/Eachreviews/:id',async (req,res)=>{
      const id=req.params.id
      const query={ id : id }
      const result= await reviewdata.find(query).toArray();
      res.send(result);
    })


    app.get('/reviews',async (req,res)=>{
      const result= await reviewdata.find().toArray();
      res.send(result);
    })

    app.post('/reviews',async (req,res)=>{
      const revitem=req.body;
      const result=await reviewdata.insertOne(revitem)
      res.send(result);

    })

    // card

    app.get('/allcarddata',async(req,res)=>{
      const result=await carddata.find().toArray();
      res.send(result)
    })

    app.get('/addcard',async (req,res)=>{
      const email=req.query.email
      const query={ email : email }
      const result= await carddata.find(query).toArray();
      res.send(result);
    })

    app.post('/addcard',async (req,res)=>{
      const cartitem=req.body;
      const result=await carddata.insertOne(cartitem)
      res.send(result);

    })
    // user

    app.get('/users',async(req,res)=>{
      const result=await userdata.find().toArray();
      res.send(result)
    })

    app.post('/users',async (req,res)=>{
      const usertitem=req.body;
      const result=await userdata.insertOne(usertitem)
      res.send(result);

    })

    // payment
    app.post('/create_payment',async(req,res)=>{
      const {price}=req.body;
      const amount=parseInt(price*100);
      const paymentIntent=stripe.paymentIntents.create({
        amount:amount,
        currency:'usd',
        payment_method_types:['card'],
      });
      res.send({
        clientSecret:paymentIntent.client_secret
      });
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



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