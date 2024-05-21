import { model, Schema } from "mongoose";

const deliverySchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  socketId: { type: String },
  status: {
    type: String,
    enum: ["waiting", "onWay", "not available"],
    default: "not available",
  },
});

export const Delivery = model("Delivery", deliverySchema);
