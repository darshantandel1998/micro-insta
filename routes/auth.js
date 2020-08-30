const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

const User = mongoose.model("User");
const router = express.Router();

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: 'please fill email or password' });
    }
    User.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: 'invalid email or password' });
        }
        bcrypt.compare(password, savedUser.password).then((isMatch) => {
            if (!isMatch) {
                return res.status(422).json({ error: 'invalid email or password' });
            }
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email, followers, following, image } = savedUser;
            res.json({ token, user: { _id, name, email, followers, following, image } });
        }).catch((err) => {
            console.log(err);
        });
    });
});

router.post('/signup', (req, res) => {
    const { name, email, password, image } = req.body;
    if (!name || !email || !password || !image) {
        return res.status(422).json({ error: 'please fill all required fields' });
    }
    User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: 'user already exist' });
        }
        bcrypt.hash(password, 10).then((hasedPassword) => {
            const user = new User({ name, email, password: hasedPassword, followers: [], following: [], image });
            user.save().then((user) => {
                res.json({ message: 'saved successfully' });
            }).catch((err) => {
                console.log(err);
            });
        });
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = router;