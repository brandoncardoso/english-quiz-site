const Sentence = require('../models/Sentence')
const FillInTheBlank = require('../models/FillInTheBlank')

module.exports = function(app) {
    app.get('/:id', function (req, res) {
        Sentence.findById(req.params.id || 1)
        .then((sentence, err) => res.send(sentence))
    })
}

