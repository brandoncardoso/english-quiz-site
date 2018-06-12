const _ = require('lodash')
const Sequelize = require('sequelize')
const dbs = require('../app/dbs')
const Op = Sequelize.Op

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
exports.getRandomByParticles = function (particles) {
    return FillInTheBlank.findOne({
        include: [{
            model: Particle,
            as: 'answer',
            where: { particle: { [Op.in]: particles } }
        }],
        order: [
            Sequelize.fn('RAND')
        ],
        raw: true
    })
}

exports.getBySentenceId = function (sentenceId) {
    return FillInTheBlank.findAll({
        where: { sentenceId: { [Op.eq]: sentenceId } },
        raw: true
    })
}

exports.getFillInTheBlankQuestion = function (sentenceId, particles) {
    return FillInTheBlank.findAll({
        include: [{
            attributes: ['sentence' ],
            model: Sentence,
            as: 'sentence',
            where: { id: sentenceId }
        }, {
            attributes: ['particle'],
            model: Particle,
            as: 'answer',
            where: { particle: { [Op.in]: particles } }
        }],
        attributes: [ 'index' ],
        raw: true
    }).then(fillintheblanks => {
        return formatFillInTheBlankQuestion(fillintheblanks)
    })
}

function formatFillInTheBlankQuestion(fillintheblanks) {
    return {
        sentence: _.get(fillintheblanks, [0, 'sentence.sentence']),
        blanks: _.map(fillintheblanks, fillintheblank => {
            delete fillintheblank['sentence.sentence']
            return fillintheblank
        })
    }
}
