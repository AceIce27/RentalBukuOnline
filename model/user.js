const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
        username: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        password: {type: String, required: true},
        admin: {type: Boolean, default: false}
    },{collection: 'Users'}
)

const UserModel = mongoose.model('User',UserSchema)

module.exports = UserModel