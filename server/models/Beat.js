const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beatSchema = mongoose.Schema({
    producer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 80
    },
    description: {
        type: String
    },
    bpm: {
        type: Number,
        default: 0
    },
    length: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    date: {
        type: Date
    },
    audios: {
        type: Array,
        default: []
    },
    images: {
        type: Array,
        default: []
    },
    tags: {
        type: Array,
        default: []
    }
})

const Beat = mongoose.model('Beat', beatSchema);

module.exports = { Beat }
