const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')

router.get('/register', userController.register)
router.post('/register', userController.registerUser, userController.register)

module.exports = router
