const express = require("express");
const Post = require("../models/post");
const router = express.Router();

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
  .then((createdPost => {
    res.status(201).json({createdPostId : createdPost._id});
  }));
});

router.put("/:id", (req, res,next) => {
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

router.get("", (req, res, next) => {
  Post.find()
    .then(results => {
      res.status(200).json({
        message: "You got some posts!",
        posts: results
      });
    })
    .catch(() => res.status(500).json());
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json();
    }
  })
})


router.delete("/:id", (req, res, next) => {
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

 module.exports = router;
