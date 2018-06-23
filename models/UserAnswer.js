const Sequelize = require('sequelize')
const dbs = require('../app/dbs')

const User = require('./User').User
const FillInTheBlank = require('./FillInTheBlank').FillInTheBlank
const Particle = require('./Particle').Particle

const UserAnswer = exports.UserAnswer = dbs.language.define('user_answer', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

// foreign keys
UserAnswer.belongsTo(User, { onDelete: 'CASCADE', hooks: true })
UserAnswer.belongsTo(FillInTheBlank, { foreignKey: { allowNull: false }})
UserAnswer.belongsTo(Particle, { foreignKey: {allowNull: false }})

// sync
UserAnswer.sync().then(() => console.log('UserAnswers table synced'))

// functions

