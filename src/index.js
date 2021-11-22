const express = require('express');
const User = require('./app/controller/user')
const tokenMiddleware = require('./app/middleware/tokenUser')

const app = express();

app.use(express.json())

app.post('/register', User.create);
app.post('/login', User.loginUser);
app.post('/forgot_password', User.forgotPassword);
app.post('/reset_password', User.reserPassword);



app.get('/profile', tokenMiddleware, (req, res)=>{
    res.send({ok:true})
})


app.listen(3333)