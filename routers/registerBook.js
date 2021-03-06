const express = require('express')
const Author = require('../model/author')
const Book = require('../model/book')
const Genre = require('../model/genre')

const router = express.Router()

router.post('/', async (req,res)=>{
    const {title, authorFirstName, authorLastName, genre, publishedDate, rating, numberOfPages, publishedPlace} = req.body

    const author_id = await Author.findOne({
        firstName:authorFirstName, 
        lastName:authorLastName
    })

    const genreCode = await Genre.aggregate([
        {
            $match:{
                name:{$in:genre}
            }
        },{
            $group:{
                _id:null,
                Code:{$addToSet:"$code"}
            }
        }
    ])

    const book = new Book({
        title: title,
        author_id: author_id._id,
        genres: genreCode[0]["Code"],
        publishedDate: publishedDate,
        rating: rating,
        numberOfPages: numberOfPages,
        publishedPlace: publishedPlace
    })

    try{
        const respone = await book.save()
        res.json(respone)
        console.log('Book created successfully: ', respone)
    }catch(error){
        console.log(error)
        return res.json({status:'error', message: error})
    }
})

module.exports = router