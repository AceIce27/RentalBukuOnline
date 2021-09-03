const express = require('express')
const Author = require('../model/author')

const router = express.Router()

router.post('/', async (req,res)=>{
    const {firstName, lastName, nationality, token} = req.body

    const author = new Author({
        firstName: firstName,
        lastName: lastName,
        nationality: nationality
    })

    try{
        const authorSaved = await author.save()
        res.json(authorSaved)
        console.log('Author created successfully: ', authorSaved)
    }catch(error){
        if(error.code === 11000){
            return res.json({status: 'error', error:'Username already in use'})
        }
        console.log(error)
        return res.json({status:'error', message: error})
    }
})

module.exports = router