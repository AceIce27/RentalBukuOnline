const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../model/user')
require('dotenv/config')

const router = express.Router()

router.post('/', async(req,res)=>{
    const {token, newpassword: plainTextPassword} = req.body

    if(!plainTextPassword || typeof plainTextPassword !== 'string'){
        return res.json({status: 'error', error: 'Invaild password'})
    }

    if (plainTextPassword.length<5) {
        return res.json({status: 'error', error: 'Password too small. Should be atleast 6 characters'})
    }
    try{
        const user = jwt.verify(token,process.env.JWT_SECRET)
    
        const _id = user.id
    
        const password = await bcrypt.hash(plainTextPassword)
        await User.updateOne({_id},{
            $set: {password}
        })
        res.json({status:'ok'})
    }catch(error){
        res.json({status: 'error', error: 'Invaild'})
    }
    
    res.json({status:'ok'})
})

module.exports = router