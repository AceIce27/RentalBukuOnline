const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const {AutAdmin,AutLogin} = require('./basicAuth')
require('dotenv/config')

const app = express()
app.use(bodyParser.json())

//Routes
const registerRoute = require('./routers/register')
const loginRoute = require('./routers/login')
const changePasswordRoute = require('./routers/change-password') 
const daftarBukuRoute = require('./routers/DaftarBuku')
const registerBookRoute = require('./routers/registerBook')
const registerAuthorRoute = require('./routers/registerAuthor')
const registerGenreRoute = require('./routers/registerGenre')
const registerRentedBookRoute = require('./routers/registerRentedBook')
const adminRoute = require('./routers/Admin')

mongoose.connect(process.env.DB_CONNECTION,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})


//Middleware

app.use('/register', registerRoute)
app.use('/login', loginRoute)
app.use(AutLogin)
app.use('/admin',AutAdmin,adminRoute)
app.use('/registerBook',AutAdmin, registerBookRoute)
app.use('/registerAuthor',AutAdmin, registerAuthorRoute)
app.use('/registerGenre',AutAdmin, registerGenreRoute)
app.use('/change-password',changePasswordRoute)
app.use('/RentedBook',registerRentedBookRoute)
app.use('/daftarBuku', daftarBukuRoute)

app.get('/', (req,res)=>{
    res.send('We are in home page')
})

app.listen(9999,()=>{
    console.log('Server up at 9999')
})