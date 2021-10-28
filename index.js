const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Mongo User: geniusmechanics
// Mongo Pass: TAvJ0hXNswHYeZef

// Mongo uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbhxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// Mongo Client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMaster");
    const servicesCollection = database.collection("services");

    // GET API - Services
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // GET API - Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Getting specific service: ", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("Hitting the POST Api", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// APP GET
app.get("/", (req, res) => {
  res.send("Genius Car Mechanics Node Server");
});

// Test Locally
app.get("/hello", (req, res) => {
  res.send("Hello from heroku deployment test");
});

// APP LISTEN
app.listen(port, () => {
  console.log("Listening to port: ", port);
});

/* 
one time: 
1. heroku account open
2. install heroku windows software

Every Project
1. git init
2. .gitignore (node_modules, .env)
3. push everything to git
4. make sure you have this script in package.json file: "start": "node index.js"
5. make sure: put process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main

---
update:
1. save everything and check locally
2. git add, git commit-m"first commit", git push
2. git push heroku main
*/
