const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
});

module.exports = Game = mongoose.model('game', GameSchema);