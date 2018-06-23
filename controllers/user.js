const _ = require('lodash')
const Sequelize = require('sequelize')

const User = require('../models/User')

exports.login = function (req, res) {
    res.render('login')
}

exports.logout = function (req, res) {
    if (req.session) {
        // delete session object
        req.session.destroy(err => {
            res.redirect('/')
        })
    }
}

exports.profile = function (req, res) {
    User.User.findOne({
        where: { username: _.get(req, 'params.username' ) },
    }, {
        raw: true
    })
    .then(user => {
        res.render('profile', {
            user
        })
    })
}

exports.authenticate = function (req, res, next) {
    User.authenticate(_.get(req, 'body.username'), _.get(req, 'body.userpassword'))
        .then(userId => {
            _.set(req.session, 'userId', userId)
            res.redirect('/')
        })
        .catch(err => {
            console.error(err)
            if (err.code === 'USER_NOT_FOUND') {
                _.set(res.locals, 'userNotFound', true)
            } else if (err.code === 'WRONG_PW') {
                _.set(res.locals, 'wrongPassword', true)
            }
            next()
        })
}

exports.register = function (req, res) {
    res.render('signup')
}

exports.registerUser = function (req, res, next) {
    const email =  _.get(req, 'body.useremail')

    User.User.create({
        username: _.get(req, 'body.username'),
        email: _.size(email) > 0 ? email : null,
        password: _.get(req, 'body.userpassword')
    }, {
        raw: true
    })
        .then(user => {
            _.set(req.session, 'userId', user.id)
            res.redirect('/')
        })
        .catch(Sequelize.ValidationError, err => {
            _.forEach(err.errors, error => {
                if (error.path === 'username' && error.validatorKey === 'not_unique') {
                    _.set(res.locals, 'usernameTaken', true)
                } else if (error.path === 'email' && error.validatorKey === 'not_unique') {
                    _.set(res.locals, 'emailInUse', true)
                } else if (error.path === 'email' && error.validatorKey == 'isEmail') {
                    _.set(res.locals, 'invalidEmail', true)
                } else if (error.path === 'password' && error.validatorKey === 'len') {
                    _.set(res.locals, 'passwordCheckLength', true)
                }
            })
            next()
        })
}
