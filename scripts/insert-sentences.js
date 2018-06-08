const fs = require('fs')
const readline = require('readline')
const stream = require('stream')

const Sentence = require('../models/Sentence').Sentence
const instream = fs.createReadStream (process.argv[2])
const outstream = new stream()
const rl = readline.createInterface(instream, outstream)

rl.on('line', function (line) {
    Sentence.create({ sentence: line })
})

rl.on('close', function (line) {
    console.log('done')
})

