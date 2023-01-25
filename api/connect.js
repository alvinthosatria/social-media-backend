import mysql from "mysql"

export const db = mysql.createConnection({
    host: "us-cdbr-east-06.cleardb.net",
    user: "b267ba3d8a7037",
    password: "0e3cbcab",
    database: "social"
})