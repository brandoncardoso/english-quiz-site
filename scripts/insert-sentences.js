var fs = require('fs')
var readline = require('readline')
var stream = require('stream')
var Client = require('mariasql')

var client = new Client({
    host: '127.0.0.1',
    user: 'root',
    password: ''
})

var instream = fs.createReadStream (process.argv[2])
var outstream = new stream()
var rl = readline.createInterface(instream, outstream)

var prep = client.prepare('INSERT INTO language.sentences (sentence) VALUES (:sentence)')

rl.on('line', function (line) {
    client.query(prep({sentence: line}), function (err, rows) {
        if (err) {
            throw err
        }
    })
})

rl.on('close', function (line) {
    client.end()
    console.log('done')
})

