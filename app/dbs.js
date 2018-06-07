const Sequelize = require('sequelize')
const config = require('./config')

const dbs = module.exports

dbs.language = new Sequelize('language', config.db.user, config.db.pw, {
    host: config.db.host,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

dbs.question = new Sequelize('question', config.db.user, config.db.pw, {
    host: config.db.host,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

authenticate(dbs.language)
authenticate(dbs.question)

function authenticate(db) {
    db
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully:', db.config.database)
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err)
        })
}
