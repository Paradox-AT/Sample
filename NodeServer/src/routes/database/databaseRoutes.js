let express = require('express')
let databaseRoutes = express.Router()
let database = new (require("../../database/database"))()

databaseRoutes.get('/status', (request, response) => {
    response.send("Database is working..!")
})

databaseRoutes.get('/formDetails', (request, response) => { database.getData(request, response) })
databaseRoutes.post('/formDetails', (request, response) => { database.postData(request, response) })


module.exports = databaseRoutes;