import { Delivery } from "../../../DB/models/delivery.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";

export const createDelivery = async (req, res, next) => {
  let isDelivery = await Delivery.findOne({ phone: req.body.phone });
  if (isDelivery) {
    return next(new Error("Delivery Already Exists"));
  }
  const hashedPass = await bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );
  await Delivery.create({ ...req.body, password: hashedPass });
  return res.json({ success: true, message: "Delivery Created Successfully" });
};

export const deliveryLogin = async (req, res, next) => {
  const isDelivery = await Delivery.findOne({ phone: req.body.phone });
  if (!isDelivery) {
    return next(new Error("Delivery Not Found"));
  }
  const isMatch = await bcrypt.compareSync(
    req.body.password,
    isDelivery.password
  );
  if (!isMatch) {
    return next(new Error("Password Is Invaild"));
  }

  const token = jwt.sign(
    {
      id: isDelivery._id,
      phone: req.body.phone,
      role: "delivery",
    },
    process.env.TOKEN_SECRET_KEY
  );
  await Token.create({
    token,
    delivery: isDelivery._id,
    role: "delivery",
    isValid: true,
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
    agent: req.headers["user-agent"],
  });

  isDelivery.status = "waiting";
  await isDelivery.save();

  return res.json({
    success: true,
    token,
    message: "Delivery Logged In Successfully",
  });
};

export const logout = async (req, res, next) => {
  if (req.delivery.status == "not available") {
    return next(new Error("Delivery Is Already Logged Out"));
  }
  req.delivery.status = "not available";
  await req.delivery.save();
  return res.json({ success: true, message: "Delivery Logged Out" });
};

export const getAllDeliveries = async (req, res, next) => {
  let deliveries = await Delivery.find().sort({ createdAt: -1 });
  return res.json({ success: true, deliveries });
};

export const updateDelivery = async (req, res, next) => {
  let isDelivery = await Delivery.findById(req.params.id);
  if (!isDelivery) return next(new Error("Delivery Not Found"));

  if (req.body.password)
    req.body.password = await bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.SALT_ROUND)
    );

  await Delivery.findByIdAndUpdate(req.params.id, req.body);
  return res.json({ success: true, message: "Delivery Updated Successfully" });
};

export const deleteDelivery = async (req, res, next) => {
  let isDelivery = await Delivery.findById(req.params.id);
  if (!isDelivery) return next(new Error("Delivery Not Found"));
  await isDelivery.deleteOne();
  return res.json({ success: true, message: "Delivery Deleted Successfully" });
};
