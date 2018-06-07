const Sequelize = require('sequelize')
const express = require('express')
const app = express()

const config = require('./config')
const dbs = require('./dbs')
const routes = require('./routes')(app)

app.listen(config.express.port, () => console.log('Listening on port', config.express.port))
