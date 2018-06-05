var Client = require('mariasql')
var express = require('express')
var app = express()

var client = new Client({
    host: '127.0.0.1',
    user: 'root',
    password: ''
})

app.get('/', function (req, res) {
    //res.sendFile('home.html', {'root': __dirname + '/views'})
    client.query('SHOW DATABASES', function (err, rows) {
        if (err) {
            throw err
        }
    })
})

app.listen(3000, function() {
    console.log('Listening on port 3000.')
})
