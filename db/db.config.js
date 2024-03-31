// Import the required modules
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// Create a connection pool
const dbConnection = mysql.createPool({
  host: "localhost",
  user: "forum-admin",
  database: "evangadi-forum-db",
  password: process.env.DB_PASSWORD,
});

// Execute a test query
// dbConnection.execute("SELECT 'db connection'", (error, results) => {
//   if (error) {
//     console.error("Error occurred while executing query:", error.message);
//   } else {
//     console.log("Connection to the database successful!");
//     console.log("Result:", results);
//   }
// });
export default dbConnection.promise();
