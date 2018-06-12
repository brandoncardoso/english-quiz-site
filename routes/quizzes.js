const express = require('express')
const router = express.Router()

const quizzesController = require('../controllers/quizzes')

router.get('/', quizzesController.index)
router.get('/fillintheblank', quizzesController.getFillInTheBlank)
router.get('/fillintheblank/:sentenceId', quizzesController.fillintheblank)

module.exports = router
