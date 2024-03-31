import express from "express";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
import userRoute from "./routes/user.route.js";
import dbConnection from "./db/db.config.js";

// Middlewares
app.use(express.json());
app.use("/api/users", userRoute);

async function start() {
  try {
    await dbConnection.execute('select "database connected"');
    app.listen(process.env.PORT);
    console.log("database connection established");
    console.log(`listening on http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log(err);
  }
}

start();
