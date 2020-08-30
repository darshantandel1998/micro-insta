const express = require('express');
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');

const User = mongoose.model("User");
const Post = mongoose.model("Post");
const router = express.Router();

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body._id, { $addToSet: { likes: req.user._id } }, { new: true }).populate('postedBy', 'name image').populate('comments.postedBy', 'name image').exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        res.json(result);
    });
});


router.put('/updateimage', requireLogin, (req, res) => {
    const { image } = req.body;
    if (!image) {
        return res.status(422).json({ error: 'please fill all required fields' });
    }
    User.findByIdAndUpdate(req.user._id, { $set: { image } }, { new: true }).select('-password').exec((err, user) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        res.json(user);
    });
});

router.get('/profile/:_id', requireLogin, (req, res) => {
    User.findById(req.params._id).select('-password').then((user) => {
        if (!user) {
            return res.status(404).json({ error: 'user not find' });
        }
        Post.find({ postedBy: user._id }).populate('postedBy', 'name').populate('comments.postedBy', 'name').then(posts => {
            res.json({ user, posts });
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
});

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body._id, {
        $addToSet: { followers: req.user._id }
    }, { new: true }).select('-password').exec((err, user) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        User.findByIdAndUpdate(req.user._id, {
            $addToSet: { following: user._id }
        }, { new: true }).select('-password').exec((err, state) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            res.json({ user, state });
        });
    });
});

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body._id, {
        $pull: { followers: req.user._id }
    }, { new: true }).select('-password').exec((err, user) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: user._id }
        }, { new: true }).select('-password').exec((err, state) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            res.json({ user, state });
        });
    });
});

module.exports = router;