const _ = require('lodash')

const User = require('../models/User').User

exports.user = function (req, res, next) {
    const userId = _.get(req, 'session.userId')
    if (userId) {
        const user = User.findOne({ where: { id: userId }}, { raw: true })
        .then(user => {
            _.set(res.locals, 'user', user)
            next()
        })
    } else {
        next()
    }
}
