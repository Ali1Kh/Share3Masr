import { model, Schema } from "mongoose";

const deliverySchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ["waiting", "on the way", "not available"],
    default: "not available",
  },
});

export const Delivery = model("Delivery", deliverySchema);
