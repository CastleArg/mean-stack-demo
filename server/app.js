const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://mark:iDAzXPdThYqaKRId@cluster0-y4p6h.mongodb.net/postdb?retryWrites=true"
  )
  .then(() => console.log("Connected to DB."))
  .catch(() => console.log("error connecting to db."));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
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
    content: req.body.content
  });
  console.log(post);
  post.save()
  .then((createdPost => {
    res.status(201).json({createdPostId : createdPost._id});
  }));

});

app.get("/api/posts", (req, res, next) => {
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
   console.log('deleting...');
   Post.deleteOne({_id: req.params.id})
   .then(() => {
     res.status(201).json();
   })
   .catch((e) => {
     console.log(e);
       res.status(500).json(e.message);
   })
 });




module.exports = app;
