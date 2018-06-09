const sassMiddleware = require('node-sass-middleware')
const path = require('path')
const Sequelize = require('sequelize')
const express = require('express')

const app = express()

const config = require('./config')
const dbs = require('./dbs')
const routes = require('./routes')

app.use(sassMiddleware({
    src: 'public',
    debug: true
}))

app.set('view engine', 'ejs')
app.use(express.static('public'))

routes(app)

app.listen(config.express.port, () => console.log('Listening on port', config.express.port))
