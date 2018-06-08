const Sequelize = require('sequelize')
const dbs = require('../app/dbs')

const Sentence = require('./Sentence').Sentence
const Particle = require('./Particle').Particle

const FillInTheBlank = exports.FillInTheBlank = dbs.language.define('fillintheblank', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    index: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

// foreign keys
FillInTheBlank.belongsTo(Sentence, { onDelete: 'CASCADE', hooks: true })
FillInTheBlank.belongsTo(Particle, { as: 'answer', onDelete: 'CASCADE', hooks: true })

// sync
FillInTheBlank.sync().then(() => console.log('FillInTheBlank table synced'))

// functions
