const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../model/user')

const router = express.Router()

router.post('/', async (req,res) =>{
    const {username, name,  password: plainTextPassword} = req.body
    
    if(!username || typeof username !== 'string'){
        return res.json({status: 'error', error: 'Invaild username'})
    }
    
    if(!plainTextPassword || typeof plainTextPassword !== 'string'){
        return res.json({status: 'error', error: 'Invaild password'})
    }

    if (plainTextPassword.length<5) {
        return res.json({status: 'error', error: 'Password too small. Should be atleast 6 characters'})
    }
    
    const password = await bcrypt.hash(plainTextPassword,10)

    const user = new User({
        username: username,
        name: name,
        password: password
    })

    try{
        const userSaved = await user.save()
        res.json(userSaved)
        console.log('User created successfully: ', userSaved)
    }catch(error){
        console.log(error)
        if(error.code === 11000){
            return res.json({status: 'error', error:'Username already in use'})
        }
        return res.json({status:'error'})
    }
    //res.json({status: 'ok'})
})

module.exports = router