const _ = require('lodash')
const qs = require('querystring')

const Sentence = require('../models/Sentence')
const FillInTheBlank = require('../models/FillInTheBlank')

const numColumns = 3

let quizList = [
    {
        name: 'The, A, & An',
        particles: ['the', 'a', 'an']
    },
    {
        name: 'In, At, &, On',
        particles: ['in', 'at', 'on']
    },
    {
        name: 'And, & But',
        particles: ['and', 'but']
    }
]

quizList = _.map(quizList, function(quiz) {
    quiz.params = qs.stringify({ p: quiz.particles })
    return quiz
})
quizList = _.chunk(quizList, _.ceil(quizList.length / numColumns))

exports.index = function (req, res) {
    res.render('quizzes', {
        quizList: quizList
    })
}

exports.getFillInTheBlank = function (req, res) {
    const particles = _.get(req, 'query.p')
    FillInTheBlank.getSentenceWithParticles(particles).then(sentenceId => {
        res.redirect(req.baseUrl  + '/fillintheblank/' + sentenceId + '?' + qs.stringify({ p: particles }))
    })
}

exports.fillintheblank = function (req, res) {
    const sentenceId = _.get(req, 'params.sentenceId')

    Sentence.findById(sentenceId).then(sentence => {
        return [sentence,
            FillInTheBlank.getBySentenceId(sentenceId)]
    }).spread((sentence, fillintheblanks) => {
        res.render('fillintheblank', {
            sentence: sentence,
            fillintheblanks: fillintheblanks
        })
    })
}
