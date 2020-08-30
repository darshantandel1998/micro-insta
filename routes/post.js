const express = require('express');
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');

const Post = mongoose.model('Post');
const router = express.Router();

router.get('/allpost', requireLogin, (req, res) => {
    Post.find().populate('postedBy', 'name image').populate('comments.postedBy', 'name image').then(posts => {
        res.json({ posts });
    }).catch((err) => {
        console.log(err);
    });
});

router.get('/post', requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } }).populate('postedBy', 'name image').populate('comments.postedBy', 'name image').then(posts => {
        res.json({ posts });
    }).catch((err) => {
        console.log(err);
    });
});

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id }).populate('postedBy', 'name image').populate('comments.postedBy', 'name image').then(posts => {
        res.json({ posts });
    }).catch((err) => {
        console.log(err);
    });
});

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, image } = req.body;
    if (!title || !body || !image) {
        return res.status(422).json({ error: 'please fill all required fields' });
    }
    req.user.password = undefined;
    const post = new Post({
        title, body, image, postedBy: req.user
    });
    post.save().then(result => {
        res.json({ post: result });
    }).catch((err) => {
        console.log(err);
    });
});

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body._id, {
        $addToSet: { likes: req.user._id }
    }, { new: true }).populate('postedBy', 'name image').populate('comments.postedBy', 'name image').exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        res.json(result);
    });
});

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body._id, {
        $pull: { likes: req.user._id }
    }, { new: true }).populate('postedBy', 'name image').populate('comments.postedBy', 'name image').exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        res.json(result);
    });
});

router.put('/comment', requireLogin, (req, res) => {
    const { _id, text } = req.body;
    if (!_id || !text) {
        return res.status(422).json({ error: 'please add comment' });
    }
    Post.findByIdAndUpdate(_id, {
        $push: { comments: { text, postedBy: req.user._id } }
    }, { new: true }).populate('postedBy', 'name image').populate('comments.postedBy', 'name image').exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        res.json(result);
    });
});

router.delete('/deletepost/:_id', requireLogin, (req, res) => {
    Post.findById(req.params._id).exec((err, result) => {
        if (err || !result) {
            return res.status(422).json({ error: err });
        }
        if (result.postedBy.toString() === req.user._id.toString()) {
            result.remove().then(result => {
                res.json(result);
            }).catch((err) => {
                console.log(err);
            });
        }
    });
});

router.delete('/deletecomment/:postId/:commentId', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.params.postId, {
        $pull: { comments: { _id: req.params.commentId } }
    }, { new: true }).populate('postedBy', 'name image').populate('comments.postedBy', 'name image').exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        res.json(result);
    });
});

module.exports = router;