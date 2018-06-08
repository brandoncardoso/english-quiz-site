const Sequelize = require('sequelize')
const dbs = require('../app/dbs')

const Sentence = exports.Sentence = dbs.language.define('sentence', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    sentence: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

// sync
Sentence.sync().then(() => console.log('Sentence table synced'))

// functions
exports.findById = (id) => Sentence.findById(id)
