const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
        title: {type: String, required: true},
        author_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true},
        genres: {type: [String], required: true},
        publishedDate: {type: Date, required: true},
        rating: {type: Number, required: true},
        numberOfPages: {type: Number, required: true},
        publishedPlace: {type: String, required: true}
    },{collection: 'Books'}
)

const BookModel = mongoose.model('Book',BookSchema)

module.exports = BookModel