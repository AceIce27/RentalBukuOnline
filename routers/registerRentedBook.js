const express = require('express')
const User = require('../model/user')
const Book = require('../model/book')
const RentedBook = require('../model/rentedBooks')

const router = express.Router()

router.post('/', async (req, res)=>{
    const {bookTitle, userName, startDate, endDate} = req.body

    book = await Book.findOne({title: bookTitle})
    user = await User.findOne({username: userName})

    rentedBook = new RentedBook({
        book_id: book._id,
        user_id: user._id,
        startDate: startDate,
        endDate: endDate
    })

    try{
        const rentedBookSaved = await rentedBook.save()
        res.json(rentedBookSaved)
        console.log('rentedBook created successfully: ', rentedBookSaved)
    }catch(error){
        console.log(error)
        return res.json({status:'error'})
    }
})

module.exports = router