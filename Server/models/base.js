let Lib = {}

// VARIABLES

const mysql = require("mysql2/promise")
let connection

// FUNCTIONS

Lib.GetConnection = () => {
    if (!connection) {
        mysql.createConnection({
            host     : process.env.DATABASE_HOST,
            user     : process.env.DATABASE_USER,
            password : process.env.DATABASE_PWD,
            database : process.env.DATABASE_TABLE
        }).then((con) => {
            connection = con
        });
    }
    
    return connection
}

Lib.GetConnection()
module.exports = Lib