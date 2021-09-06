const express = require('express')
const Book = require('../model/book')
const mongoose = require('mongoose')

const router = express.Router()

router.get('/', async (req,res)=>{
    
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
            Author: {
                $concat:[
                    {$arrayElemAt:["$author.firstName",0]}," ",
                    {$arrayElemAt:["$author.lastName",0]}]
                },
            Rating: "$rating"
        }
    }])
    
    try{
        res.json(Books)
    }catch(err){
        console.log(err)
        res.json({status: 'error', message: err})
    }
})

router.get('/fillterAuthor', async (req,res)=>{
    const {authorFirstName, authorLastName} = req.body
    
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
        $match:{
            "author.firstName": authorFirstName,
            "author.lastName": authorLastName
        }
    },{
        $project:{
            _id: 0,
            Title: "$title",
            Genre: "$genres.name",
            Author: {
                $concat:[
                    {$arrayElemAt:["$author.firstName",0]}," ",
                    {$arrayElemAt:["$author.lastName",0]}]
                },
            Rating: "$rating"
        }
    }])

    try{
        res.json(Books)
    }catch(error){
        console.log(error)
        res.json({status: 'error', message: error})
    }
})

router.get('/fillterGenre', async (req,res)=>{
    const {genre} = req.body
    
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
        $match:{
            "genres.name":{$in:genre}
        }
    },{
        $project:{
            _id: 0,
            Title: "$title",
            Genre: "$genres.name",
            Author: {
                $concat:[
                    {$arrayElemAt:["$author.firstName",0]}," ",
                    {$arrayElemAt:["$author.lastName",0]}]
                },
            Rating: "$rating"
        }
    }])

    try{
        res.json(Books)
    }catch(error){
        console.log(error)
        res.json({status: 'error', message: error})
    }
})

router.get('/rincianBuku', async (req,res)=>{
    const {book_id} = req.body

    const book = await Book.aggregate([{
        $match:{
            _id: mongoose.Types.ObjectId(book_id),
        }
    },{
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
            Author: {
                $concat:[
                    {$arrayElemAt:["$author.firstName",0]}," ",
                    {$arrayElemAt:["$author.lastName",0]}]
                },
            PublicDate: {
                $dateToString: {
                    format: '%Y-%m-%d',
                    date: "$publishedDate"
                    }
                },
            PublishedPlace: "$publishedPlace",
            NumberOfPages: "$numberOfPages",
            Rating: "$rating",
        }
    }])

    try{
        res.json(book)
    }catch(error){
        console.log(error)
        res.json({status: 'error', message: error})
    }
})

module.exports = router