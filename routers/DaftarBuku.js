const express = require('express')
const Book = require('../model/book')
const Genre = require('../model/genre')

const router = express.Router()

router.get('/', async (req,res)=>{
    try{
        const Books = await Book.aggregate([{
            $lookup:{
                from: "Genres",
                localField: "genres",
                foreignField: "code",
                as: "genres"
            }
        },{
            $lookup:{
                from: "Author",
                localField: "author_id",
                foreignField: "_id",
                as: "author"
            }
        },{
            $project:{
                _id: 0,
                Title: "$title",
                Genre: "$genres.name",
                author: {firstName:1,lastName:1},
                Rating: "$rating"
            }
        }])
        res.json(Books)
    }catch(err){
        console.log(err)
        res.json({status: 'error', message: err})
    }
})

module.exports = router