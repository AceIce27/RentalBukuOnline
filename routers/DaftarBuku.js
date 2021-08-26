const express = require('express')
const Book = require('../model/book')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/', async (req,res)=>{
    const {token} = req.body

    if(token == null){
        return res.json({status:'error',message:'User has not login'})
    }
    
    try{
        jwt.verify(token,process.env.JWT_SECRET)
        const Books = await Book.find()
        res.json(Books)
    }catch(err){
        res.json({status: 'error', message: err})
    }
})

module.exports = router