const jwt = require('jsonwebtoken')
const User = require('./model/user')
require('dotenv/config')

function AutLogin(req, res, next){
    const token = req.body.token
    if(token == null){
        res.status(403)
        return res.send('You need to sign in')
    }
    let user = null
    try{
        user = jwt.verify(token,process.env.JWT_SECRET)
    }catch(error){
        console.log(error)
        return res.send('Invaild Username/Password')
    }
    if(user.id){
        req.user = User.findById({_id:user.id})
    }
    next()
}

function AutAdmin(){
    return (req,res,next)=>{
        if(req.user.admin === false){
            res.status(401)
            return res.send('Not allowed')
        }
        next()
    }
}

module.exports = {AutAdmin,AutLogin}