const Sequelize = require('sequelize')
const dbs = require('../app/dbs')

const Sentence = require('./Sentence').Sentence
const Particle = require('./Particle').Particle

const FillInTheBlank = exports.FillInTheBlank = dbs.question.define('fillintheblank', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    index: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

// foreign keys
FillInTheBlank.belongsTo(Sentence, { foreignKey: 'id' })
Sentence.hasMany(FillInTheBlank, { foreignKey: 'id' })

FillInTheBlank.belongsTo(Particle, { foreignKey: 'id' })
Particle.hasMany(FillInTheBlank, { foreignKey: 'id' })

// sync
FillInTheBlank.sync().then(() => console.log('FillInTheBlank table synced'))

// functions
