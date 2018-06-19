const _ = require('lodash')
const Sequelize = require('sequelize')

const User = require('../models/User').User

exports.register = function (req, res) {
    res.render('signup')
}

exports.registerUser = function (req, res, next) {
    const email =  _.get(req, 'body.useremail')

    User.create({
        username: _.get(req, 'body.username'),
        email: _.size(email) > 0 ? email : null,
        password: _.get(req, 'body.userpassword')
    }, {
        raw: true
    })
        .then(user => {
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
