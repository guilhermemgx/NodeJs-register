const mailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

const {host, port, user, pass} = require('../config/mailer.json')

const transport = mailer.createTransport({
    host,
    port,
    auth:{ user, pass }
});

transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('.'),
    extName: '.html'
}))
// backend/src/resources/mail/auth/password.html
module.exports = transport