const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/post");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    process.env.MONGO_DB_CONNECTION
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
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
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
  post.save()
  .then((createdPost => {
    res.status(201).json({createdPostId : createdPost._id});
  }));
});

app.put("/api/posts/:id", (req, res,next) => {
  console.log('editing post ' + req.body.id);
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id},post)
  .then(() => {
    res.status(200).json();
  })
  .catch(() => {
    res.status(500).json();
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find()
    .then(results => {
      res.status(200).json({
        message: "You got some posts!",
        posts: results
      });
    })
    .catch(() => res.status(500).json());
});

app.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json();
    }
  })
})


app.delete("/api/posts/:id", (req, res, next) => {
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
