const mongoose = require('mongoose')

const GenreSchema = new mongoose.Schema({
        code: {type: String, required: true, unique: true},
        name:{type: String, required: true, unique: true},
    },{collection: 'Genres'}
)

const GenreModel = mongoose.model('Genre',GenreSchema)

module.exports = GenreModel