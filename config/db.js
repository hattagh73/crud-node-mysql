require("dotenv").config();
const mysql = require("mysql2");

// Without asyn await
const pool = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0,
    multipleStatements: true
});

pool.connect((err) => {
    // Declare the variables which connected with the env file
    const db_host = process.env.DB_HOST;
    const db_port = process.env.DB_PORT;

    // If db connection is success will show this message along with the host values and port values
    if(!err) return console.log(`Database is connected. Host: ${db_host} & Port: ${db_port}`);

    // If db connection is failed will show error message regarding the host and port values
    if(err) return console.log(`Database not connected. ${err}`);
});

module.exports = pool;


// let sql = "SELECT * FROM user;";

// pool.execute(sql, function(err, result) {
//   if (err) throw err;

//   console.log(result);
// });

// module.exports = pool.promise();

// const connectDB = async () => {
//     try{
//         await mysql.createConnection({
//             user: process.env.DB_USER,
//             host: process.env.DB_HOST,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_DATABASE
//         });
//         console.log(`MySQL connection is success`);
//     } catch (error) {
//         console.log(`MySQL connection is fail`);
//         console.log(error);
//         process.exit(1);
//     }
// }

// module.exports = connectDB;