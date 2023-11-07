const express=require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')

const app=express();
const port=process.env.PORT||3000;

app.use(cors());
app.use(express.json());

// Backend-Data,NBkr9xCpPJxnfOeA
app.get("/",(req,res)=>{
    res.send("<h1>This is my home route</h1>");

})
app.get("/about",(req,res)=>{
    res.send("<h1>This is my About route</h1>");

})





const uri = `mongodb+srv://${process.env.USER_N}:${process.env.USER_p}@cluster0.kvtrj3x.mongodb.net/?retryWrites=true&w=majority`;

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
   
    const database= client.db("Fast-Database")
    const usercollaction = database.collection("user")

    app.get("/users",async(req,res)=>{
      const query={};
      const courser= usercollaction.find(query);
      const users= await courser.toArray(courser);
      res.send(users);
      // console.log(users);
    })

    app.get("/users/:id",async (req,res)=>{
      const id=req.params.id;
      const quary={_id: new ObjectId(id)};
      const user=await usercollaction.findOne(quary)
      res.send(user)

      // console.log(id);
    })


    app.delete("/users/:id",async(req,res)=>{
      const id =req.params.id;
      const quary={
        _id:new ObjectId(id)
      };
      const result= await usercollaction.deleteOne(quary);
      res.send(result)

    })


    app.post("/user",async(req,res)=>{
      const user=req.body;

      const result= await usercollaction.insertOne(user)
      res.send(result)
      

    })
 app.put('/users/:id',async(req,res)=>{
   
  const id=req.params.id;
  const filter={_id:new ObjectId(id)};
  const user=req.body;
  const option={
    upsert:true
  }
  const updateUser={
    $set:{
      name:user.name,
      email:user.email
    }
  }

  const result= await  usercollaction.updateOne(filter,updateUser,option);
  res.send(result)
  console.log(result);

 })
    
   
  } finally {
   
    // await client.close();
  }
}


run().catch(console.dir);













app.listen(port,()=>{
    console.log(`server is runing at http://localhost:${port}`);
})


