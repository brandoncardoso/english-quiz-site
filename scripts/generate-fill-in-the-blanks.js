const Op = require('sequelize').Op
const _ = require('lodash')

const Particle = require('../models/Particle').Particle
const Sentence = require('../models/Sentence').Sentence
const FillInTheBlank = require('../models/FillInTheBlank').FillInTheBlank

var targetWord = process.argv[2].toLowerCase()

if (!targetWord) {
    throw new Error('Invalid target word')
}

Particle
    .findOrCreate({
        where: { particle: targetWord },
        raw: true,
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
                    promises.push(FillInTheBlank.findOrCreate({
                        where: { sentenceId: sentence.id, answerId: particle.id, index: i },
                        raw: true,
                    }))
                }
            })
        })
        return Promise.all(promises)
    })
    .then(fillInTheBlanks => {
        console.log('done.', fillInTheBlanks.length)
    })
    .catch(err => {
        console.error(err)
    })

