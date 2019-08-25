const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type:String,
        required: true
    },
    l_name:{
        type: String
    },
    e_mail:{
        type: String,
        required : true
    },
    u_name:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required : true
    }
})

const Account = mongoose.model('Account',accountSchema)

module.exports= Account;