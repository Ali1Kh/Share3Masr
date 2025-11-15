import { Delivery } from "../../../DB/models/delivery.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { populate } from "dotenv";

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

  let { _id, name, phone, status } = isDelivery;

  return res.json({
    success: true,
    token,
    user: { _id, name, phone, status },
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

export const getReadyOrders = async (req, res, next) => {
  let orders = await Order.find({ status: "ready" })
    .populate([
      {
        path: "resturants",
        select: "-password",
      },

      { path: "products.productId", populate: "resturant" },  { path: "area" }
    ])
    .sort({ createdAt: -1 });
  return res.json({
    success: true,
    orders,
  });
};

export const getOnWayOrders = async (req, res, next) => {
  let orders = await Order.find({ status: "onWay" })
    .populate([
      {
        path: "resturants",
        select: "-password",
      },

      { path: "products.productId", populate: "resturant"  },  { path: "area" }
    ])
    .sort({ createdAt: -1 });
  return res.json({
    success: true,
    orders,
  });
};

export const receiveTheOrder = async (req, res, next) => {
  let isOrder = await Order.findById(req.params.id);
  if (!isOrder) return next(new Error("Order Not Found"));
  if (isOrder.status != "ready") {
    return next(new Error("Order Is Not Ready To Deliver"));
  }
  req.delivery.status = "onWay";
  isOrder.status = "onWay";
  isOrder.deliveryWorker = req.delivery._id;
  await isOrder.save();
  await req.delivery.save();
  return res.json({ success: true, message: "Order Received Successfully" });
};

export const orderDelivered = async (req, res, next) => {
  let isOrder = await Order.findById(req.params.id);
  if (!isOrder) return next(new Error("Order Not Found"));
  if (isOrder.status != "onWay") {
    return next(new Error("Order Is Not Recieved By You"));
  }
  isOrder.status = "delivered";
  req.delivery.status = "waiting";
  await req.delivery.save();
  await isOrder.save();
  return res.json({ success: true, message: "Order Delivered Successfully" });
};

export const getDelivereyOrders = async (req, res, next) => {
  let orders = await Order.find({
    deliveryWorker: req.delivery._id,
  })
    .sort({ status: -1 })
    .populate([
      {
        path: "resturants",
        select: "-password",
      },

      { path: "products.productId", populate: "resturant" },
    ])
    .sort({ createdAt: -1 });
  return res.json({
    success: true,
    orders,
  });
};
export const getDelivereyOrderDetails = async (req, res, next) => {
  let order = await Order.findOne({
    deliveryWorker: req.delivery._id,
    _id: req.params.id,
  })
    .populate([
      {
        path: "resturants",
        select: "-password",
      },
      {
        path: "area",
      },
      { path: "products.productId", populate: "resturant" },
    ])
    .sort({ createdAt: -1 });
  if (!order) {
    return next(new Error("Order Not Found"));
  }
  return res.json({
    success: true,
    orders: order,
  });
};
