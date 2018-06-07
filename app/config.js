const config = module.exports

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

config.express = {
    port: process.env.EXPRESS_PORT || 3000,
    ip: '127.0.0.1'
}

config.db = {
    host: process.env.DB_HOST || 'localhost',
    user: 'root',
    pw:   ''
}
