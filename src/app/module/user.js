const mongoose = require('../../database')
const bcrypt = require('bcrypt')

const UserScheme = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    passwordResetToken:{
        type:String,
        select:false
    },
    passwordResetExpires:{
        type:String,
        select:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
})

UserScheme.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    next()
})

const user = mongoose.model('user', UserScheme)

module.exports = user