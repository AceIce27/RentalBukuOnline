const express = require('express')
const Author = require('../model/author')
const Book = require('../model/book')
const Genre = require('../model/genre')
const User = require('../model/user')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/', async (req,res)=>{
    const {title, authorFirstName, authorLastName, genre, publishedDate, rating, numberOfPages, publishedPlace, token} = req.body
    
    try{
        if(token == null){
            return res.json({status:'error', message: 'User has not login'})
        }else{
            const user = jwt.verify(token,process.env.JWT_SECRET)
            adminStatus = await User.findById({_id:user.id})
        }
    }catch(error){
        console.log(error)
        return res.json({status:'error', message: 'Using worng Username/Password'})
    }

    const author_id = await Author.findOne({
        firstName:authorFirstName, 
        lastName:authorLastName
    })
    const genreCode = await Genre.findOne({name: genre})

    const book = new Book({
        title: title,
        author_id: author_id._id,
        genres: genreCode.code,
        publishedDate: publishedDate,
        rating: rating,
        numberOfPages: numberOfPages,
        publishedPlace: publishedPlace
    })

    try{
        if(adminStatus.admin == true){
            const respone = await book.save()
            res.json(respone)
            console.log('Book created successfully: ', respone)
        }else{
            return res.json({status: 'error', error:'Admin Only'})
        }
    }catch(error){
        console.log(error)
        return res.json({status:'error', message: error})
    }
})

module.exports = router