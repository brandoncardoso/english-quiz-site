const sassMiddleware = require('node-sass-middleware')
const path = require('path')
const bodyParser = require("body-parser")
const Sequelize = require('sequelize')
const express = require('express')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const config = require('./config')
const dbs = require('./dbs')
const routes = require('./routes')(app)

// favicon
app.get('/favicon.ico', (req, res) => res.status(204))

app.use(sassMiddleware({
    src: 'public',
    debug: true
}))
app.set('views', 'public/views')
app.set('view engine', 'ejs')
app.use(express.static('public'))


app.listen(config.express.port, () => console.log('Listening on port', config.express.port))
