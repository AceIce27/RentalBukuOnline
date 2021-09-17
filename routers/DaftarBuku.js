const express = require('express')
const Book = require('../model/book')
const mongoose = require('mongoose')

const router = express.Router()

router.get('/', async (req,res)=>{
    
    let query = Book.aggregate([{
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
            Genres: "$genres.name",
            Author: {
                $concat:[
                    {$arrayElemAt:["$author.firstName",0]}," ",
                    {$arrayElemAt:["$author.lastName",0]}]
                },
            Rating: "$rating"
        }
    }])
    
    const queryObj = {...req.query}
    const excludedFields = ['page', 'sort','limit','fields','Genres','Author']
    excludedFields.forEach(el => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    //untuk rating masih ada yang bermasalah
    let temp = JSON.parse(queryStr)
    console.log(temp.Rating['$gte'])
    temp.Rating['$gte'] = parseInt(temp.Rating['$gte'])

    console.log(temp)
    query = query.match(temp)
    
    if(req.query.Title){
        const title = {Title: req.query.Title.split('+').join(' ')}
        query = query.match(title)
    }
    
    if(req.query.Genres){
        const genre = req.query.Genres.split(',')
        console.log(genre.length)
        if(genre.length > 1){
            query = query.match({Genres: {$size:genre.length , $all: genre}})
        }else{
            query = query.match({Genres: {$in: genre}})
        }
    }

    if(req.query.Author){
        const author = {Author: req.query.Author.split('+').join(' ')}
        query = query.match(author)
    }

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)  
    }else{
        query = query.sort('title')  
    }

    if(req.query.page){
        const page = req.query.page
        query = query.skip(10*page).limit(10*page)
    }
    /*
    if(req.query.Rating[gte]){
        const rating = req.query.Rating[gte]
        query = query.match({Rating:{$gte:rating}})
    }*/
    
    try{
        const Books = await query
        res.json(Books)
    }catch(err){
        console.log(err)
        res.json({status: 'error', message: err})
    }
})

router.get('/:Book_id', async (req,res)=>{
    
    try{
        const book = await Book.aggregate([{
            $match:{
                _id: mongoose.Types.ObjectId(req.params.Book_id),
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
        res.json(book)
    }catch(error){
        console.log(error)
        res.json({status: 'error', message: error})
    }
})

module.exports = router