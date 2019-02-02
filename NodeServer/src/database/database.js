let TediousConnection = require('tedious').Connection;
let TediousRequest = require('tedious').Request;
let TediousTypes = require('tedious').TYPES;

class Database {
    constructor(config) {
        this.config = config ? config : {
            userName: process.env.AzureDatabaseUsername,
            password: process.env.AzureDatabasePassword,
            server: process.env.AzureServer,
            options:
            {
                database: process.env.AzureDatabaseName,
                rowCollectionOnRequestCompletion: true,
                encrypt: true
            }
        };
        this.connection = new TediousConnection(this.config);
        this.connection.on('connect', (error) => {
            if (error)
                console.error('Cannot connect to the database:', error);
            else
                console.log('\tDatabase connected.');
        })
    };

    getData(request, response) {
        let sqlQuery = 'select name, data from form';
        let sqlRequest = new TediousRequest(sqlQuery, (error, rowCount, rows) => {
            if (!error) {
                response.status(200);
                response.json(this.formatSqlResponse(rows));
            } else {
                response.status(500);
                response.json(error.message);
            }
        });

        this.connection.execSql(sqlRequest);
    }

    postData(request, response) {
        let sqlQuery = 'insert into form (name, data) values (@name, @data)';
        let sqlRequest = new TediousRequest(sqlQuery, (error, rowCount, rows) => {
            if (!error) {
                response.status(201).send();
            } else {
                response.status(500);
                response.json(error.message);
            }
        });
        sqlRequest.addParameter('name', TediousTypes.VarChar, request.body.name)
        sqlRequest.addParameter('data', TediousTypes.VarChar, request.body.data)
        
        this.connection.execSql(sqlRequest);
    }

    formatSqlResponse(data) {
        let response = [];
        data.forEach(row => {
            let object = {};
            object[row[0].value] = row[1].value;
            response.push(object);
        });
        return response;
    }
}

module.exports = Database;