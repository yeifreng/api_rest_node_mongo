const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
       document: String,
       name: String,
       phone: String,
       email: String,
       pwdUser: String,
       date: String
    }
)

module.exports = mongoose.model('User', userSchema)