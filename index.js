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

// step 2
const app = express();
const PORT = process.env.PORT || 5000;

// step 3
app.use(cors());
app.use(express.json());

// step 4

// step 5
app.get("/", (req, res) => {
  res.send("server is running...");
});

// step 6
app.listen(PORT, () => {
  console.log(`this server is listening on PORT ${PORT}`);
});
