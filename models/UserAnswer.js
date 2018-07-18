const _ = require('lodash')
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
    },
    timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
})

// foreign keys
UserAnswer.belongsTo(User, { onDelete: 'CASCADE', hooks: true })
UserAnswer.belongsTo(FillInTheBlank, { foreignKey: { allowNull: false }})
UserAnswer.belongsTo(Particle, { foreignKey: {allowNull: false }})

// sync
UserAnswer.sync().then(() => console.log('UserAnswers table synced'))

// functions

exports.getStats = function(userId) {
    return Promise.all([
        getTotalBlanksAnsweredForUser(userId),
        getTotalBlanksCorrectForUser(userId)
    ])
    .then(stats => {
        return _(stats)
            .keyBy(stat => stat.name)
            .mapValues(stat => stat.value)
            .value()
    })
}

function getTotalBlanksAnsweredForUser(userId) {
    return UserAnswer.findAndCountAll({
        where: { userId: userId },
    }, {
        raw: true
    })
    .then(value => {
        return { name: 'totalBlanksAnsweredForUser', value: value.count }
    })
}

function getTotalBlanksCorrectForUser(userId) {
    return UserAnswer.findAndCountAll({
        where: { userId: userId, correct: 1 }
    }, {
        raw: true
    })
    .then(value => {
        return { name: 'totalBlanksCorrectForUser', value: value.count }
    })
}
