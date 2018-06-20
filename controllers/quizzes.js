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
        name: 'In, At, & On',
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

    // there needs to be at least two particles for a quiz/fillintheblank to be worth doing
    if (particles.constructor !== Array || particles.length < 2) {
        res.render('quizzes', {
            quizList: quizList,
            notEnoughParticles: true
        })
    }

    FillInTheBlank.getRandomByParticles(particles).then(fillintheblank => {
        if (fillintheblank) {
            res.redirect(req.baseUrl  + '/fillintheblank/' + fillintheblank.sentenceId + '?' + qs.stringify({ p: particles }))
        } else {
            res.render('quizzes', {
                quizList: quizList,
                invalidQuiz: true,
                invalidParticles: particles
            })
        }
    })
}

exports.fillintheblank = function (req, res, next) {
    const sentenceId = _.get(req, 'params.sentenceId')
    const particles = _.get(req, 'query.p')

    const userAnswers = _.get(res, 'locals.userAnswers', {})

    FillInTheBlank.getFillInTheBlankQuestion(sentenceId, particles).then(question => {
        res.render('fillintheblank', {
            particles: particles,
            question: question,
            userAnswers: userAnswers,
            answered: _.size(userAnswers) > 0,
            nextQuestionUrl: req.baseUrl + '/fillintheblank?' + qs.stringify({ p: particles })
        })
    })
}

exports.checkFillInTheBlankAnswer = function (req, res, next) {
    _.set(res.locals, 'userAnswers', req.body)
    next()
}
