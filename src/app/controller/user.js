const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const mailer = require('../../mailer')

const auth = require('../../../config/secret.json')


// const { findOne } = require("../module/user");
const User = require("../module/user");
const { use } = require('../../mailer');

function tokenGenerate(params = {}){
    const Token = jwt.sign(params, auth.secret, {
        expiresIn:86400
    })

    return Token;
}

module.exports = {
    async create(req, res){
        const {email} = req.body;

        if(await User.findOne({email})){
            return res.status(400).send({error:"usuario existente"})
        }else{
            const user = await User.create(req.body)
            return res.status(201).send({user, token: tokenGenerate({id: user.id})})
        }
    },
    async listUser(req, res){

    },

    async loginUser(req, res){
        const {email, password} = req.body

        const user = await User.findOne({email}).select("+password")
        
        if(!user){
            return res.status(400).send({error:"Usuario inexistente"})
        }else if(!await bcrypt.compare(password ,user.password)){
            return res.status(400).send({error:"senha inexistente"})
        }

        return res.send({user, token: tokenGenerate({id: user.id})})
    },

    async forgotPassword(req, res){
        const {email} = req.body;

        try{
            const user = await User.findOne({email})

            if(!user){
                return res.status(400).send({error:"User not found"})
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1)

            await User.findByIdAndUpdate(user.id, {
                '$set':{
                    passwordResetToken:token,
                    passwordResetExpires: now,
                }
            })


            mailer.sendMail({
                to: email,
                from: "maxoorgamer4@gmail.com",
                template: '/src/resources/mail/auth/password',
                context: {token}
            }, (err)=>{
                if(err){
                    console.log(err)

                    res.send({error:"cant send forgot password"})
                }

                return res.send()
            })

        }catch (err){
            console.log(err)
            res.send({error:"error on forgot password, try again"})
        }
    },

    async reserPassword(req, res){
        const {email, token, password} = req.body;

        try{
            const user = await User.findOne({email})
                .select('+passwordResetToken passwordResetExpires');
            
            if(!user){
                res.status(400).send({error: "cannot reset password, user not found"})
            }

            if(token !== user.passwordResetToken){
                return res.status(400).send({error:"token invalid"})
            }

            const now = new Date();

            if(now > user.passwordResetExpires){
                return res.status(400).send({error: 'Token expired, generate a new one'})
            }

            user.password = password;

            await user.save();

            res.send({})


        }catch{
            res.status(400).send({error: "cannot reset password"})

        }
    }
}