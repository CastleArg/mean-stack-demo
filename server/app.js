const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
   "your creds here"
  )
  .then(() => console.log("Connected to DB."))
  .catch(() => console.log("error connecting to db."));

app.use((req, res, next) => {
  res.setHeader("LAccess-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.title
  });
  console.log(post);
  post.save();
  res.status(201).json();
});

app.use("/api/posts", (req, res, next) => {
  Post.find()
    .then(results => {
      console.log(results);
      res.status(200).json({
        message: "Ypu got the posts!",
        posts: results
      });
    })
    .catch(() => res.status(500));
});

app.delete("/api/posts/:id", (req, res, next) => {
 console.log(req.params.id);
  console.log(post);
  post.save();
  res.status(201).json();
});

module.exports = app;
