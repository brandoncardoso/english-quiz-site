const _ = require('lodash')
const Sequelize = require('sequelize')
const dbs = require('../app/dbs')
const bcrypt = require('bcrypt')
const async = require('async')

const saltRounds = 10

const User = exports.User = dbs.language.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: Sequelize.CHAR(50),
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 20],
            isAlphanumeric: true
        }
    },
    email: {
        type: Sequelize.CHAR(100),
        unique: true,
        allowNull: true,
        defaultValue: null,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.TEXT('tiny'),
        allowNull: false,
        validate: {
            len: [8, 256]
        }
    },
    created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    modified: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
})

// hooks
User.beforeCreate(encryptPasswordIfChanged)
User.beforeUpdate(encryptPasswordIfChanged)

// foreign keys

// sync
User.sync().then(() => console.log('User table synced'))

// functions

exports.authenticate = function(username, password, next) {
    User.findOne({ username: username })
    .exec((err, user) => {
        if (err) {
            return next(err)
        } else if (!user) {
            let err = new Error('User not found.')
            err.status = 401
            return next(err)
        }

        bcrypt.compare(password, user.password, (err, samePassword) => {
            if (samePassword) {
                return next(null, user)
            } else {
                return callback()
            }
        })
    })
}

function encryptPasswordIfChanged(user, options) {
    if (_.get(user, '_options.isNewRecord') || user.changed('password')) {
        return encryptPassword(_.get(user, 'password'))
            .then(success => {
                user.password = success
            })
            .then(err => {
                if (err) {
                    console.log(err)
                }
            })
    }
}

function encryptPassword(password) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) {
                return reject(err)
            }

            return resolve(hash)
        })
    })
}
