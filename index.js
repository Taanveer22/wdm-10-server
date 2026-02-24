// ==================Recommended Order=================
// 1. Required by common js (express, cors, etc.)
// 2 .Instance Initialization (const app = express())
// 3. Middleware Setup (cors, json, logging)
// 4. Database Configuration & Connection (MongoDB client setup and MongoDB run() function)
// 5. Routes(rest api methods)
// 6. Server Startup (app.listen())
// ===========================================================

// step 1
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// step 2
const app = express();
const PORT = process.env.PORT || 5000;

// step 3
app.use(cors());
app.use(express.json());

// step 4
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.89rnkti.mongodb.net/?appName=Cluster0`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("conneted successfully to server");
    const db = client.db("orchidDB");
    const moviesCollection = db.collection("moviesColl");
    const favoriteMoviesCollection = db.collection("favoritemoviesColl");

    //=========== read opertion for all movies
    app.get("/movies", async (req, res) => {
      const cursor = moviesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //=========== read opertion for one movies
    app.get("/movies/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await moviesCollection.findOne(query);
      res.send(result);
    });

    //=========== create opertion for movies
    app.post("/movies", async (req, res) => {
      const doc = req.body;
      const result = await moviesCollection.insertOne(doc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.log(error);
  }
}
run();

// step 5
app.get("/", (req, res) => {
  res.send("server is running...");
});

// step 6
app.listen(PORT, () => {
  console.log(`this server is listening on PORT ${PORT}`);
});
