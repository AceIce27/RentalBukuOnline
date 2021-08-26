const jwt = require('jsonwebtoken')
//const User = require('../model/user')
require('dotenv/config')

function AutLog(req, res, next){
    const {token} = req.body

    if(token == null){
        res.status(403)
        return res.send('You need to sign in')
    }

    try{
        jwt.verify(token,process.env.JWT_SECRET)
    }catch(error){
        console.log(error)
        return res.send('Invaild Username/Password')
    }
    next()
}

function AutAdmin(token){
    return (req,res,next)=>{
        const user = jwt.verify(token,process.env.JWT_SECRET)
        //const adminStatus = User.findById({_id:user.id})
        if(role === false){
            res.status(401)
            return res.send('Not allowed')
        }
        next()
    }
}

module.exports = {AutLog,AutAdmin}