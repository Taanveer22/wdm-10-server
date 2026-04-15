require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//Instance Initialization
const app = express();
const PORT = process.env.PORT || 5000;

//Middleware Setup
app.use(cors());
app.use(express.json());

//Database Configuration & Connection with HTTP methods and REST api routes
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
    // await client.connect();
    console.log("conneted successfully to server");
    const db = client.db("orchidDB");
    const moviesCollection = db.collection("moviesColl");
    const favMoviesCollection = db.collection("favMoviesColl");

    // ######################################################
    // Movies Collection
    // ######################################################

    //=========== read opertion for all and some movies
    app.get("/movies", async (req, res) => {
      let query = {};
      // Filter by email
      if (req.query.email) {
        query.email = req.query.email;
      }
      // Search by movie title (case-insensitive)
      if (req.query.search) {
        query.title = {
          $regex: req.query.search,
          $options: "i",
        };
      }

      const cursor = moviesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //=========== read opertion for 6 featured movies
    app.get("/movies/featured", async (req, res) => {
      const cursor = moviesCollection.find();
      const result = await cursor.sort({ rating: -1 }).limit(6).toArray();
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

    //=========== delete opertion for movies
    app.delete("/movies/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await moviesCollection.deleteOne(query);
      res.send(result);
    });

    // ######################################################
    // Favorite Movies Collection
    // ######################################################

    //=========== read opertion for some fav movies
    app.get("/favMovies", async (req, res) => {
      const query = { email: req.query.email };
      const result = await favMoviesCollection.find(query).toArray();
      res.send(result);
    });

    //=========== create opertion for fav movies
    app.post("/favMovies", async (req, res) => {
      const doc = req.body;
      // Search as plain string
      // ✅ check both movieId AND email
      const existing = await favMoviesCollection.findOne({
        // ✅ comes as movieId from frontend, store as movieId in DB
        email: doc.email,
        movieId: doc.movieId,
      });

      if (existing) {
        return res.send({ message: "already in favorites" });
      }

      const newDoc = {
        // store user email
        email: doc.email,
        // ✅ store consistent movieId
        movieId: doc.movieId,
        poster: doc.poster,
        title: doc.title,
        genre: doc.genre,
        duration: doc.duration,
        release: doc.release,
        rating: doc.rating,
      };

      const result = await favMoviesCollection.insertOne(newDoc);
      res.send(result);
    });

    //=========== delete opertion for fav movies
    app.delete("/favMovies/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await favMoviesCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.log(error);
  }
}
run();

//Server Run
app.get("/", (req, res) => {
  res.send("server is running...");
});

app.listen(PORT, () => {
  console.log(`this server is listening on PORT ${PORT}`);
});
