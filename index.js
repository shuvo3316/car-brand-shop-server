const express =require('express')
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()


const app=express();
const port =process.env.PORT || 5000;


//middleware

app.use(cors())
app.use(express.json())

//brandmaster
//S6G8C3xG3hM25MkB


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.mab1nuw.mongodb.net/?retryWrites=true&w=majority`;

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
    const productCollection=client.db('Products_DB').collection('Products')
    const userCollection=client.db('Products_DB').collection('User')

    app.get('/allproducts',async(req,res)=>{
        const cursor=productCollection.find();
        const result=await cursor.toArray();
        res.send(result)
    })
    app.get('/allproducts/:brand',async(req,res)=>{
        const brand=req.params.brand;
        const query={brand:brand}
        console.log(query)
       const cursor=productCollection.find(query);
       // console.log(cursor)
        const result=await cursor.toArray();
        res.send(result)
    })
    app.get('/products/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result =await productCollection.findOne(query)
      res.send(result)
  })

    app.post('/allproducts',async(req,res)=>{
        const newProduct=req.body;
        console.log("products are",newProduct)
       const result=await productCollection.insertOne(newProduct)
    })


    //update
app.put('/products/:id',async(req,res)=>{
  const id =req.params.id;
  const filter={_id: new ObjectId(id)}
  const options={upsert:true};
  const updatedproduct=req.body;
  const product={
      $set:{
        //name:updatedproduct.name,
          brand:updatedproduct.brand,
          photo:updatedproduct.photo,
          type:updatedproduct.type,
          price:updatedproduct.price,
          description:updatedproduct.description,
          rating:updatedproduct.rating,
      }

  }
  const result=await productCollection.updateOne(filter,product,options)
  res.send(result)
  console.log(result)
})

    // user data 


    app.post('/users',async(req,res)=>{
      const newUser=req.body;
      console.log("products are",newUser)
     const result=await userCollection.insertOne(newUser)
     res.send(result)
  })

  // cart user 





  app.get('/users',async(req,res)=>{
    const cursor=userCollection.find();
    const result=await cursor.toArray();
    res.send(result)
})
app.get('/users/:uid',async(req,res)=>{
  const uid=req.params.uid;
  const query={uid:uid}
  console.log(query)
 const cursor=userCollection.find(query);
 // console.log(cursor)
  const result=await cursor.toArray();
  res.send(result)
})

//delete
app.delete('/users/:uid',async(req,res)=>{
  const uid= req.params.uid;
  console.log(uid)
  const query={uid:uid}
  const result = await userCollection.deleteOne(query)
  console.log(result)
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('brand shop database is running');

})

app.listen(port,()=>{
    console.log(`brand shop server is running on ${port}`)
})