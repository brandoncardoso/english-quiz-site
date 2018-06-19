const fs = require('fs')
const readline = require('readline')
const stream = require('stream')

const Sentence = require('../models/Sentence').Sentence
const instream = fs.createReadStream (process.argv[2])
const outstream = new stream()
const rl = readline.createInterface(instream, outstream)

const async = require('async')
const inserter = async.cargo(function(tasks, callback) {
    Sentence.bulkCreate(tasks).then(() => {
        callback()
    })
}, 1000)

rl.on('line', function (line) {
    inserter.push({ sentence: line })
})

rl.on('close', function (line) {
    console.log('done')
})

