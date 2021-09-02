const express = require('express')
const Book = require('../model/book')
const Genre = require('../model/genre')

const router = express.Router()


router.patch('/memambahGenre', async (req,res)=>{
    const {book_id, genre} = req.body

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
    let test = "Comedy"
    try{
        await Book.updateOne({_id:book_id},{
            $addToSet: {
                genres: genreCode[0]["Code"]
            }
        })
        res.json({status:'ok', message: 'genre berhasil ditambah'})
    }catch(error){
        console.log(error)
        return res.json({status:'error', message: error})
    }
})

router.delete('/mengurangiGenre', async (req,res)=>{
    const {book_id, genre} = req.body
    
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
console.log(genreCode[0]["Code"])
    try{
        await Book.updateOne({book_id},{
            $pullAll:{
                genres: genreCode[0]["Code"]
            }
        })
        res.json({status:'ok', message: 'genre berhasil didelete'})
    }catch(error){
        console.log(error)
        return res.json({status:'error', message: error})
    }
})

module.exports = router