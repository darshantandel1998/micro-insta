const express = require('express');
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('mongo atlas connected!');
});
mongoose.connection.on('error', () => {
    console.log('error at mongo atlas connection!');
});

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if (process.env.NODE_ENV == 'production') {
    app.use(express.static('frontend/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log('server is running on', PORT);
});