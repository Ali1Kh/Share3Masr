import { Token } from "../../DB/models/token.model.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (token) => {
  try {
    if (!token) return new Error("Token Is Required");
    const tokenDB = await Token.findOne({
      token,
      isValid: true,
    });
    if (!tokenDB) return;
    return jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  } catch (error) {
    console.log(error);
  }
};
