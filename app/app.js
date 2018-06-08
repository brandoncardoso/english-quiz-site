const Sequelize = require('sequelize')
const express = require('express')
const path = require('path')
const app = express()

const config = require('./config')
const dbs = require('./dbs')
const routes = require('./routes')

app.set('view engine', 'ejs')
app.use(express.static('public'))

routes(app)

app.listen(config.express.port, () => console.log('Listening on port', config.express.port))
