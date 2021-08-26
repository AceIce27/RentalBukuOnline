const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({
        firstName: {type: String, required: true ,unique: true },
        lastName: {type: String, required: true ,unique: true },
        nationality: {type: String, required: true }
    },{collection: "Author"}
)

const AuthorModel = mongoose.model('Author',AuthorSchema)

module.exports = AuthorModel