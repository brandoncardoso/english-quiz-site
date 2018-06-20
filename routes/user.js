const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')

router.get('/register', userController.register)
router.post('/register', userController.registerUser, userController.register)
router.get('/login', userController.login)
router.post('/login', userController.authenticate, userController.login)
router.get('/logout', userController.logout)

module.exports = router
