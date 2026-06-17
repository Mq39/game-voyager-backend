import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

export const db = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "game_voyager",
    waitForConnections: true,
    connectionLimit: 10,

    ssl: {
        rejectUnauthorized: false
    }
})

db.getConnection()
    .then((connection) => {
        console.log("DATABASE CONNECTED")
        connection.release()
    })
    .catch((error) => {
        console.error("DATABASE ERROR:", error)
    })