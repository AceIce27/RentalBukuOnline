const express = require('express')
const Author = require('../model/author')
const User = require('../model/user')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/', async (req,res)=>{
    const {firstName, lastName, nationality, token} = req.body
    let adminStatus = null
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

    const author = new Author({
        firstName: firstName,
        lastName: lastName,
        nationality: nationality
    })

    try{
        if(adminStatus.admin == true){
            const authorSaved = await author.save()
            res.json(authorSaved)
            console.log('Author created successfully: ', authorSaved)
        }else{
            return res.json({status: 'error', error:'Admin Only'})
        }
    }catch(error){
        if(error.code === 11000){
            return res.json({status: 'error', error:'Username already in use'})
        }
        console.log(error)
        return res.json({status:'error', message: error})
    }
})

module.exports = router