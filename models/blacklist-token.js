const mongoose = require('mongoose');

const BlacklistSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expiration: {
        type: Date,
        required: true
    },
});

module.exports = mongoose.model('token-blacklist', BlacklistSchema, "token-blacklist");