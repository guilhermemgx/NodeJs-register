const mongoose = require('mongoose')

// Não esqueça, essa rota esta em minha maquina, Precisamos colocar a sua rota
mongoose.connect('mongodb://localhost:27017/ecommerce')

mongoose.Promise = global.Promise

module.exports = mongoose;