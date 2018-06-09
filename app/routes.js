module.exports = function(app) {
    // routes
    app.get('/', require('../routes/index'))
    app.use('/quizzes', require('../routes/quizzes'))
}

