import { User } from "../../../DB/models/user.model.js";
import { Area } from "../../../DB/models/area.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";

export const signUp = async (req, res, next) => {
  const emailExits = await User.findOne({ email: req.body.email });
  if (emailExits) {
    return next(new Error("Email Already Exists"));
  }
  const phoneExits = await User.findOne({ phone: req.body.phone });
  if (phoneExits) {
    return next(new Error("Phone Already Exists"));
  }
  const isArea = await Area.findById(req.body.area);
  if (!isArea) {
    return next(new Error("Area Not Found"));
  }

  const hashedPass = await bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );

  await User.create({ ...req.body, password: hashedPass });
  return res.json({ success: true, message: "User Registered Successfully" });
};

export const login = async (req, res, next) => {
  const isUser = await User.findOne({ email: req.body.email });
  if (!isUser) {
    return next(new Error("User Not Found"));
  }
  const isMatch = await bcrypt.compareSync(req.body.password, isUser.password);
  if (!isMatch) {
    return next(new Error("Password Is Invaild"));
  }

  const token = jwt.sign(
    { id: isUser._id, email: isUser.email },
    process.env.TOKEN_SECRET_KEY
  );

  await Token.create({
    token,
    user: isUser._id,
    isValid: true,
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
    agent: req.headers["user-agent"],
  });

  return res.json({ success: true, message: "Logged In Successfully", token });
};

export const adminLogin = async (req, res, next) => {
  const isAdmin = await User.findOne({ phone: req.body.phone, role: "admin" });
  if (!isAdmin) {
    return next(new Error("Admin Not Found"));
  }
  const isMatch = await bcrypt.compareSync(req.body.password, isAdmin.password);
  if (!isMatch) {
    return next(new Error("Password Is Invaild"));
  }

  const token = jwt.sign(
    { id: isAdmin._id, email: isAdmin.email, role: "customer" },
    process.env.TOKEN_SECRET_KEY
  );

  await Token.create({
    token,
    admin: isAdmin._id,
    role: "customer",
    isValid: true,
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
    agent: req.headers["user-agent"],
  });

  return res.json({
    success: true,
    message: "Admin Logged In Successfully",
    token,
  });
};
