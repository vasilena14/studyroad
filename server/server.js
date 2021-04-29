// import express from "express";
import config from "./../config/config";
import app from "./express";
// import template from "./../template";
// import { MongoClient } from "mongodb";
import mongoose from "mongoose";

// app.get("/", (req, res) => {
//   res.status(200).send(template());
// });

// let port = process.env.PORT || 3000;
// app.listen(port, function onStart(err) {
//   if (err) {
//     console.log(err);
//   }
//   console.info("Server started on port %s.", port);
// });

// const url = process.env.MONGODB_URI || "mongodb://localhost:27017/studyroad";
// MongoClient.connect(url, (err, db) => {
//   console.log("Connected successfully to mongodb server");
//   db.close();
// });

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", config.port);
});
