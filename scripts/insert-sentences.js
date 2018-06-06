const Sequelize = require('sequelize')
const fs = require('fs')
const readline = require('readline')
const stream = require('stream')

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
    sentence: {
        type: Sequelize.TEXT(500)
    }
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

const instream = fs.createReadStream (process.argv[2])
const outstream = new stream()
const rl = readline.createInterface(instream, outstream)

rl.on('line', function (line) {
    Sentence.create({ sentence: line })
})

rl.on('close', function (line) {
    sequelize.close()
    console.log('done')
})

