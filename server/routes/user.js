const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup",(req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(
    hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
      .then(result => {
        res.status(201).json({
          result: result
        });
      })
      .catch(err=> {
        res.status(500).json({
          error: err
        });
      });
    }
  );
});

router.post("/login",(req, res, next) => {
  console.log('logging in ');
  let dbUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: "There was a problem with your credentials."
      });
    }
    dbUser = user;
   return bcrypt.compare(req.body.password, user.password)
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "There was a problem with your credentials."
      });
    }
    console.log(process.env.MONGO_DB_CONNECTION);
    console.log(process.env.JWT_TOKEN);
    const token = jwt.sign({email: dbUser.email, userId: dbUser._id}, process.env.JWT_TOKEN, { expiresIn: '1h'} );
    res.status(200).json({
      token: token
    });
  })
  .catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "There was a problem with your credentials."
    });
  });
});


module.exports = router;
