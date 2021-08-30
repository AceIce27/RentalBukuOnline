const mongoose = require('mongoose')

const RentedBookSchema = new mongoose.Schema({
        book_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true},
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        startDate: {type: Date, default:Date.now, required: true},
        endDate: {type: Date, required: true}
    },{collection: 'RentedBooks'}
)

const RentedBookModel = mongoose.model('RentedBook',RentedBookSchema)

module.exports = RentedBookModel