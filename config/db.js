require("dotenv").config();
const mysql = require("mysql2");

const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

/* START DB Conn. Without Asyn Await */
const pool = mysql.createConnection({
    host: db_host,
    port: db_port,
    user: db_user,
    password: db_password,
    database: db_name,
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0,
    multipleStatements: true
});

pool.connect((err) => {

    // If db connection success
    if(!err) return console.log(`Databse is connected. HOST::: ${db_host} • PORT::: ${db_port}`);

    // If failed shows error message
    if(err) return console.log(`Database not connected. ${err}`);
});
/* END DB Conn. */

module.exports = pool;