module.exports = function(app) {
    // set views directory
    app.set('views', 'public/views')

    // favicon
    app.get('/favicon.ico', (req, res) => res.status(204))

    // routes
    app.get('/', function (req, res) {
        res.render('home.ejs')
    })
}

