import dbConnection from "../db/db.config.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "../middlewares/auth.middleware.js";
dotenv.config();

async function register(req, res) {
  const { userName, firstName, lastName, email, password_hash } = req.body;
  if (!userName || !firstName || !lastName || !email || !password_hash) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "All Fields are required",
    });
  }
  try {
    const data = await dbConnection.query(
      "SELECT userName,userid FROM users WHERE username=? or email=?",
      [userName, email]
    );
    const user = data[0];
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already exists" });
    }

    if (password_hash.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must have atlest 8 characters" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_hash, salt);
    await dbConnection.query(
      "INSERT INTO users (userName, firstName, lastName, email, password_hash) VALUES (?, ?, ?, ?,?)",
      [userName, firstName, lastName, email, hashedPassword]
    );
    return res.status(StatusCodes.CREATED).json({
      msg: "user succesfully created",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "user creation faild",
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "All Fields are required",
    });
  }
  try {
    const data = await dbConnection.query(
      "SELECT userName,userId,email,password_hash FROM users WHERE email =?",
      [email]
    );
    const user = data[0];
    // console.log(user);
    const { userName } = user[0];
    const { userId } = user[0];
    // console.log(userName, userId);
    if (user.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "User does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user[0].password_hash);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "User does not exist",
      });
    }

    //  sign jwt
    const payload = { userName, userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token: token });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Internal error occured",
    });
  }
}

async function checkuser(req, res) {
  // console.log("req.user:", req.user);
  const { userId, userName } = req.user;
  return res
    .status(StatusCodes.OK)
    .json({ msg: "valid user", userName, userId });
}

export { login, register, checkuser };
