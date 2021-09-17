const express = require('express')
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv/config')

const router = express.Router()


router.get('/', async(req,res)=>{
    const {username,password} = req.body

    const user = await User.findOne({username: username}).lean()

    if (!user) {
        return res.json({status: 'error', error: 'Invalid username/password'})
    }

    if(await bcrypt.compare(password, user.password)){

        const token = jwt.sign({id: user._id, username: user.username},process.env.JWT_SECRET,{expiresIn: '100m'})

        return res.json({status: 'ok', data: token})
    }

    res.json({status : 'ok', error: 'Invalid username/password'})
})

module.exports = router