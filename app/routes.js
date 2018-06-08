const Sentence = require('../models/Sentence')
const FillInTheBlank = require('../models/FillInTheBlank')

module.exports = function(app) {
    app.get('/favicon.ico', (req, res) => res.status(204))

    app.get('/:id', function (req, res) {
        Sentence.findById(req.params.id)
        .then((sentence, err) => res.send(sentence))
    })
}

