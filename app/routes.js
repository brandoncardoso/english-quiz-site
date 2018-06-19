module.exports = function(app) {
    // routes
    app.get('/', require('../routes/index'))
    app.use('/user', require('../routes/user'))
    app.use('/quizzes', require('../routes/quizzes'))
}

