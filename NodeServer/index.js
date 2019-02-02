require('dotenv').config()

let express = require('express')
let bodyParser = require('body-parser')
let app = express()

let databaseRoute = require('./src/routes/database/databaseRoutes')

app.use(bodyParser.json())
app.use('/database', databaseRoute)

let server = app.listen(process.env.port || 3000, () => {
    console.log('\n\nServer started:')
})