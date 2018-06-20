const sassMiddleware = require('node-sass-middleware')
const path = require('path')
const bodyParser = require("body-parser")
const Sequelize = require('sequelize')
const express = require('express')
const session = require('express-session')

const middleware = require('./middleware')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const config = require('./config')
const dbs = require('./dbs')

// favicon
app.get('/favicon.ico', (req, res) => res.status(204))

app.use(sassMiddleware({
    src: 'public',
    debug: true
}))
app.set('views', 'public/views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(session({
    secret: 'mwSlzMW7K9uQdQgQrUg1vqkN0W6bAPGMs4kyDpogndGjmIGbB6',
    resave: true,
    saveUninitialized: false
}))
app.use(middleware.user)

const routes = require('./routes')(app)

app.listen(config.express.port, () => console.log('Listening on port', config.express.port))
