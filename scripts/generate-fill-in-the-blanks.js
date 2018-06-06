const Sequelize = require('sequelize')
const Op = Sequelize.Op
const _ = require('lodash')

const sequelizeOpts = {
    host: '127.0.0.1',
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
}

const languageDb = new Sequelize('language', 'root', '', sequelizeOpts)
const questionDb = new Sequelize('question', 'root', '', sequelizeOpts)

const Sentence = languageDb.define('sentence', { 
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    sentence: Sequelize.TEXT(500) })
const Particle = languageDb.define('particle', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    particle: Sequelize.TEXT('tiny') })
const Question = questionDb.define('fillintheblank', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    sentenceId: { type: Sequelize.INTEGER, references: 'language.sentence', referencesKey: 'id' },
    answerId: { type: Sequelize.INTEGER, references: 'language.particle', referencesKey: 'id' },
    index: Sequelize.INTEGER })

var targetWord = process.argv[2].toLowerCase()

if (!targetWord) {
    throw new Error('Invalid target word')
}

languageDb
    .authenticate()
    .then(() => {
        console.log('Connection to language database has been established successfully.')
        return questionDb.authenticate()
    })
    .then(() => {
        console.log('Connection to question database has been established successfully.')
        return Particle.findOrCreate({
            where: { particle: targetWord },
            raw: true,
        })
    })
    .spread((particle, created) => {
        return [particle, Sentence.findAll({
            where: { sentence: { [Op.like]: '%' + particle.particle + '%' } },
            raw: true,
        })]
    })
    .spread((particle, sentences) => {
        const promises = []
        _.each(sentences, function(sentence) {
            const words = _.split(sentence.sentence, ' ')
            _.each(words, function(word, i) {
                if (_.isEqual(words[i].toLowerCase(), particle.particle)) {
                    promises.push(Question.findOrCreate({
                        where: { sentenceId: sentence.id, answerId: particle.id, index: i },
                        raw: true,
                    }))
                }
            })
        })
        return Promise.all(promises)
    })
    .then(questions => {
        console.log('done.', questions.length)
        languageDb.close()
        questionDb.close()
    })
    .catch(err => {
        console.error(err)
    })

