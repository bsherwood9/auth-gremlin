const router = require("express").Router();
const db = require("../users/users-model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  db.add(user)
    .then((user) => {
      res.status(201).json({ message: "You're registered!" });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorMessage: "There was an error registering.", err });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.findBy({ username })
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res
          .status(200)
          .json({ message: `You're logged in, ${user.username}!`, token });
      } else {
        res
          .status(401)
          .json({ errorMessage: "Your credentials were invalid!" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorMessage: "There was an error logging you in!" });
    });
});

const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };
  const token = jwt.sign(payload, "Awesome Oppossum", options);
  return token;
};

module.exports = router;
