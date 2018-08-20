const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_TOKEN);
    next();
  } catch (err) {
    res.status(401).json({
      message: "Authentication failed"
    });
  }


}
