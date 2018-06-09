const express = require('express')
const router = express.Router()

const quizzesController = require('../controllers/quizzes')

router.get('/', quizzesController.index)

module.exports = router
