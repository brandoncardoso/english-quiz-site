exports.index = function (req, res) {
    res.render('quizzes', { quizList: ['The, A, & An', 'In, At, &, On', 'And, & But'] })
}
