const jwt = require('jsonwebtoken');
const auth = require('../../../config/secret.json')


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const parts = authHeader.split(' ');
    const [scheme, token] = parts;

    if(!authHeader){
        return res.status(400).send({error:"token invalido"});
    }else if(!parts.length === 2){
        return res.status(400).send({error:"token error"});
    }

    jwt.verify(token, auth.secret, (err, decoded)=>{
        if(err){
            return res.status(400).send({error:"token invalido"});
        }

        req.userId = decoded.id;
        return next();
    })
}