const router = require('express').Router();
const db = require('../users/users-model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
    const user = req.body
    const hash = bcrypt.hashSync(user.password, 8)

    user.password = hash

    db.add(user)
        .then(user => {
            res.status(201).json({ message: "You're registered!" })
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error registering.", err })
        })
});

router.post('/login', (req, res) => {
    const { username, password } = req.body

    db.findBy({ username })
        .then(user => {
            if (user && bcrypt.compareSync(user.password, password)) {
                res.status(200).json({ message: `You're logged in, ${user.username}!` })
            } else {
                res.status(401).json({ errorMessage: "Your credentials were invalid!" })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error logging you in!" })
        })
});

module.exports = router;
