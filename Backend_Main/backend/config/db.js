const mysql = require("mysql2/promise");
const path = require("path");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        ca: require("fs").readFileSync(
            path.join(__dirname, "../cert/isrgrootx1.pem")
        ),
        rejectUnauthorized: true
    },

    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;