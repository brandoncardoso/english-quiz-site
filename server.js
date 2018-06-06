const Sequelize = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize('language', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const Sentence = sequelize.define('sentence', {
    sentence: Sequelize.TEXT(500)
}, {
    timestamps: false,
    freezeTableName: true
})

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

app.get('/', function (req, res) {
    Sentence.findAll().then(sentences => {
        res.send(sentences)
    })
})

app.listen(3000, function() {
    console.log('Listening on port 3000.')
})
