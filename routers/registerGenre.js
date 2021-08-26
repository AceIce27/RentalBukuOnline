const express = require('express')
const Genre = require('../model/genre')

const router = express.Router()

router.post('/',async (req, res)=>{
    const {code , name} = req.body

    const genre = new Genre({
        code: code,
        name: name
    })
    try{
        const genreSaved = await genre.save()
        res.json(genreSaved)
        console.log('Genre created successfully: ', genreSaved)
    }catch(error){
        console.log(error)
        return res.json({status:'error'})
    }
})

module.exports = router