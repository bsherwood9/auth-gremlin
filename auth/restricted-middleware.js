const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "Awesome Oppossum", (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "You done did mess up", err });
      } else {
        //sticking the payload on the request
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "you really messed up, bad. " });
  }
};
