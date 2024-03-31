import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Invalid authorization",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is not provided in environment variables");
    }
    const { userName, userId } = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decodedPayload);
    req.user = { userName, userId };
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Internal error occured",
    });
  }
}
export default authMiddleware;
