const express = require('express')
const User = require('../model/user')
const Book = require('../model/book')
const RentedBook = require('../model/rentedBooks')

const router = express.Router()

router.post('/', async (req, res)=>{
    const {bookTitle, userName, rentedDay} = req.body

    const book = await Book.findOne({title: bookTitle})
    const user = await User.findOne({username: userName})

    if(!rentedDay || typeof rentedDay !== 'number'){
        return res.json({status: 'error', error: 'Invaild rentedDay'})
    }

    if(rentedDay>30){
        return res.json({status: 'error', error: 'User cannot rental more than 30 day'})
    }

    let date = new Date()
    date.setDate(date.getDate()+rentedDay)
    
    rentedBook = new RentedBook({
        book_id: book._id,
        user_id: user._id,
        endDate: date
    })

    try{
        const rentedBookSaved = await rentedBook.save()
        res.json(rentedBookSaved)
        console.log('rentedBook created successfully: ', rentedBookSaved)
    }catch(error){
        console.log(error)
        return res.json({status:'error', message: error})
    }
})

module.exports = router